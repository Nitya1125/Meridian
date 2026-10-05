import { NextResponse } from "next/server";
import db from "@/Lib/db";
import bcrypt from "bcrypt";

export async function PATCH(request) {
    try {
        const { email, newPassword, confirmPassword } = await request.json();

        if (!email || !newPassword || !confirmPassword) {
            return NextResponse.json({
                message: "All fields are required",
                success: false
            }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({
                message: "Passwords do not match",
                success: false
            }, { status: 400 });
        }

        const [verifyUser] = await db.query(
            `SELECT id, reset_otp_verified
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

        if (!user.reset_otp_verified) {
            return NextResponse.json({
                message: "OTP verification required",
                success: false
            }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            `UPDATE users
             SET password = ?,
                 reset_otp = NULL,
                 reset_otp_expires_at = NULL,
                 reset_otp_verified = FALSE
             WHERE id = ?`,
            [hashedPassword, user.id]
        );

        return NextResponse.json({
            message: "Password updated successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("Reset password error:", error);

        return NextResponse.json({
            message: "Error while updating password",
            success: false
        }, { status: 500 });
    }
}