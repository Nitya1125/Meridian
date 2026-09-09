import { NextResponse } from "next/server";
import db from "@/Lib/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { BrevoClient } from "@getbrevo/brevo";
import { sendOtpRateLimit } from "@/Lib/rateLimit";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});


export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const {success} = await sendOtpRateLimit.limit(ip);

    if(!success){
      return NextResponse.json({
        success:false,
        message:"Too many requests, please try again later"
      },{status:429});
    }

    const { firstName, lastName, email } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all the fields",
        },
        { status: 400 },
      );
    }
    const [result] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (result.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 },
      );
    }
    const OTP = crypto.randomInt(100000, 1000000).toString();
    const hashOTP = await bcrypt.hash(OTP, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const [otpResult] = await db.query(
      `INSERT INTO otp_codes
    (email, otp_hash, purpose, expires_at, is_used, attempts)
    VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashOTP, "EMAIL_VERIFICATION", expiresAt, false, 0],
    );

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Meridian Email Verification",

      textContent: `Your Meridian verification code is ${OTP}. This code will expire in 5 minutes.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
