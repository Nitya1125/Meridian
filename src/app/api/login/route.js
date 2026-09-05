import {NextResponse} from "next/server";
import db from "@/Lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginRateLimit } from "@/Lib/rateLimit";

export async function POST(request){
    try{

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        
        const {success} = await loginRateLimit.limit(ip);

        if(!success){
            return NextResponse.json({
                success:false,
                message:"Too many requests, please try again later"
            },{status:429})
        }

        const {email,password} = await request.json();

        if(!email || !password){
            return NextResponse.json({
                success:false,
                message:"Please fill all the fields"
            },{status:400})
        }

        const [user] = await db.query(`Select id, first_name,last_name,email,password from users where email = ?`,[email]);


        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:400})
        }

        const passwordMatch = await bcrypt.compare(password,user[0].password);

        if(!passwordMatch){
            return NextResponse.json({
                success:false,
                message:"Invalid credentials"
            },{status:400})
        }

        const token = jwt.sign({userId:user[0].id,email:user[0].email},process.env.JWT_SECRET,{expiresIn:"7d"});

        const response = NextResponse.json({
            success:true,
            message:"Login successful",
            user:{
                firstName:user[0].first_name,
                lastName:user[0].last_name,
                email:user[0].email,
            },
            token
        },{status:200});

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    }catch(error){
        console.log(error);
        return NextResponse.json({
            success:false,
            message:"Something went wrong",
            error
        },{status:500})
    }
}