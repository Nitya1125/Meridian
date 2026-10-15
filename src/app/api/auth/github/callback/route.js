import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";


export async function GET(request){
    try{
        const url = new URL(request.url)
        const code = url.searchParams.get("code");

        if(!code){
            return NextResponse.json({
                success:false,
                message:"Code not found"
            },{status:400})
        }

        const tokenResponse = await fetch(`https://github.com/login/oauth/access_token`,{
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:new URLSearchParams({
                code: code,
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                redirect_uri: process.env.GITHUB_REDIRECT_URI,
                grant_type:"authorization_code"
            })
        })

        const tokenData = await tokenResponse.json();

        if(!tokenResponse.ok || !tokenData.access_token){
            return NextResponse.json({
                success:false,
                message:"GitHub token error",
                error:tokenData
            },{status:400})
        }


        const userResponse = await fetch(`https://api.github.com/user`,{
            headers:{
                "Authorization": `Bearer ${tokenData.access_token}`
            }
        })

        const userInfo = await userResponse.json();

        if(!userResponse.ok){
            return NextResponse.json({
                success:false,
                message:"Something went wrong"
            },{status:400})
        }

        const githubId = userInfo.id;
        const emailResponse = await fetch(`https://api.github.com/user/emails`,{
            headers:{
                "Authorization": `Bearer ${tokenData.access_token}`,
                "Accept": "application/vnd.github.v+json"
            }
        });

        const emails = await emailResponse.json();
        const  primaryEmail = emails.find((email)=> email.primary && email.verified);

        if(!primaryEmail){
            return NextResponse.json({
                success:false,
                message:"Email not found"
            },{status:400})
        }

        const email = primaryEmail.email;


        const fullName = userInfo.name || userInfo.login;
        const nameParts = fullName.split(" ");
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ");

        const [users] = await db.query(`select * from users where email =?`,[email]);

        if(users.length > 0){
            await db.query(`update users set github_id = ? where email = ?`,[githubId,email]);
        }else{
            await db.query(`insert into users (email,first_name,last_name,github_id) values (?,?,?,?)`,[email,first_name,last_name,githubId]);
        }

        const token = jwt.sign({id:users[0].id, email:email}, process.env.JWT_SECRET,{expiresIn: "7d"})

        const response = NextResponse.redirect(new URL("/dashboard",request.url));

        response.cookies.set("token" ,token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60,
            path:"/",
        })

        return response;

        // return NextResponse.redirect(
        //     new URL(`/dashboard?token=${token}`, request.url)
        // )
    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        },{status:500})

        console.log(error)
    }
}