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


        const tokenResponse = await fetch(`https://oauth2.googleapis.com/token`,{
            method:"POST",
            headers:{
                "content-Type" :"application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type:"authorization_code"
            })
        })

        const tokenData = await tokenResponse.json();

        const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`,
            {
                headers:{
                    Authorization:`Bearer ${tokenData.access_token}`
                }
            }
        )

        const userInfo = await userResponse.json();

        const googleId = userInfo.id;
        const email = userInfo.email;
        const firstName = userInfo.given_name;
        const lastName = userInfo.family_name;

        const [user] = await db.query(`Select * from users where email = ?`,[email]);

        let userId;

        if(user.length > 0){
            userId = user[0].id;
            await db.query(`UPDATE users SET google_id = ? WHERE email = ?`,[googleId, email]);
        }else{
            const [result] = await db.query(`INSERT INTO users (google_id,email,first_name,last_name) VALUES (?,?,?,?)`,
            [googleId,email,firstName,lastName]);
            userId = result.insertId;
        }

        const token = jwt.sign({id:userId,email:email},process.env.JWT_SECRET ,{expiresIn:"7d"});

        const response = NextResponse.redirect(new URL(`/dashboard?token=${token}`, request.url));

        //storing JWT in http-cookies
        response.cookies.set("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        });

        return response;


    }catch(error){
        return NextResponse.json({
            success:false,
            message:error.message},
            {status:500})
    }
}