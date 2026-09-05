import { NextResponse } from "next/server";
import db from "@/Lib/db";
import bcrypt from "bcrypt";
import {loginRateLimit} from "@/Lib/rateLimit";

export async function POST(request){
    try{

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

        const {success} = await loginRateLimit.limit(ip)

        if(!success){
            return NextResponse.json({
                success:false,
                message:"Too many requests, please try again later"
            },{status:429})
        }
        
        const {firstName,lastName,email,password} = await request.json();

        if(!firstName || !lastName || !email || !password){
            return NextResponse.json({
                success: false,
                message: "Please fill all the fields"}, 
                {status: 400})
        }

        const [user] = await db.query(`SELECT * FROM users WHERE email = ?`,[email]);

        if(user.length > 0){
            return NextResponse.json({
                success: false,
                message: "Email already exists"}, 
                {status: 400})
        }


        const [verifiedOtp] = await db.query(`SELECT id FROM otp_codes WHERE email = ? AND purpose = ? AND is_used = true AND verified_at IS NOT NULL ORDER BY verified_at DESC LIMIT 1`,[email,"EMAIL_VERIFICATION"]);

        if(verifiedOtp.length === 0){
            return NextResponse.json({
                success: false,
                message: "Invalid OTP"}, 
                {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await db.query(`INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?)`,[firstName,lastName,email,hashedPassword]);

        return NextResponse.json({
            success: true,
            message: "User created successfully"}, 
            {status: 200})

    }catch(error){
    console.error("SIGNUP ERROR:", error);

    return NextResponse.json({
        success: false,
        message: "Something went wrong"
    }, { status: 500 });
}
}