import db from "@/Lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {verifyOtpRateLimit} from "@/Lib/rateLimit";


export async function POST(request){
    try{

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

        const {success} = await verifyOtpRateLimit.limit(ip)

        if(!success){
            return NextResponse.json({
                success:false,
                message:"Too many requests, please try again later"
            },{status:429})
        }

        const  {email,otp} = await request.json();

        if(!email || !otp){
            return NextResponse.json({
                success: false,
                message: "Please fill all the fields"
            } ,{status:400})
        }

        const [rows] = await db.query(`Select * from otp_codes Where email = ? AND purpose = ? And is_used = false ORDER BY created_at DESC LIMIT 1`,[email,"EMAIL_VERIFICATION"]);

        if(rows.length === 0){
            return NextResponse.json({
                success: false,
                message: "Invalid OTP"
            } ,{status:400})
        }

        if(new Date() > new Date(rows[0].expires_at)){
            return NextResponse.json({
                success: false,
                message: "OTP expired"
            } ,{status:400})
        }

        const isValid = await bcrypt.compare(otp,rows[0].otp_hash);
        
        if(!isValid){
            return NextResponse.json({
                success: false,
                message: "Invalid OTP"
            } ,{status:400})
        }

        await db.query(`UPDATE otp_codes SET is_used = true, verified_at = NOW() WHERE id = ?`, [rows[0].id]);
        return NextResponse.json({
            success: true,
            message: "OTP verified successfully"
        })

    }catch(error){
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        } ,{status:500})
    }
}