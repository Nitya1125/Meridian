import { NextResponse } from "next/server";
import db from "@/Lib/db";

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({
                message: "Email and OTP are required",
                success: false
            }, { status: 400 });
        }

        const [verifyUser] = await db.query(
            `SELECT id, email, reset_otp, reset_otp_expires_at, reset_otp_verified
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (verifyUser.length === 0) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const user = verifyUser[0];

        if (user.reset_otp_verified) {
            return NextResponse.json({
                message: "OTP already verified",
                success: false
            }, { status: 400 });
        }

        if (user.reset_otp !== otp) {
            return NextResponse.json({
                message: "OTP incorrect",
                success: false
            }, { status: 400 });
        }

        if (new Date(user.reset_otp_expires_at) < new Date()) {
            return NextResponse.json({
                message: "OTP expired",
                success: false
            }, { status: 400 });
        }

        await db.query(
            `UPDATE users
             SET reset_otp_verified = TRUE
             WHERE id = ?`,
            [user.id]
        );

        return NextResponse.json({
            message: "OTP verified successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("OTP verification error:", error);

        return NextResponse.json({
            message: "Error while verifying OTP",
            success: false
        }, { status: 500 });
    }
}
