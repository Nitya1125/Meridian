import { NextResponse } from "next/server";
import db from "@/Lib/db";


export async function POST(request){
    try{
        const  {email} = await request.json();

        if(!email){
            return NextResponse.json({
                message: "Email is required",
                success: false
            }, {status: 404})
        }

        const [verifyUser] = await db.query(`Select id,email from users where email =?`,[email])

        if(verifyUser.length === 0){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }

        const userId = verifyUser[0].id

        const GenerateOTP = Math.floor(100000 + Math.random() * 900000).toString();

    
        const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email",{
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "api-key":process.env.BREVO_API_KEY
            },
            body:JSON.stringify({
                sender:{
                    name: process.env.BREVO_SENDER_NAME,
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to:[{
                    email :email
                }],
                subject : "Your Meridian Password Reset OTP",
                htmlContent: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset</h2>
                <p>Your OTP for resetting your Meridian password is:</p>

                <h1>${GenerateOTP}</h1>

                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        `
            })
        })


        if(!brevoResponse.ok){
            return NextResponse.json({
                message: "Failed to send email",
                success: false
            }, {status: 500})
        }

        await db.query (`Update users set reset_otp = ?, reset_otp_expires_at = adddate(now(), interval 10 minute), reset_otp_verified = FALSE WHERE id = ?`, [GenerateOTP,userId])

        return NextResponse.json({
            message: "OTP sent successfully",
            success: true
        }, {status: 200})
        
    }catch(error){
        return NextResponse.json({
            message: "Something went wrong",
            success: false,
        },{status: 500})
    }
}