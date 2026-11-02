import { NextResponse } from "next/server";
import db from "@/Lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { resetPasswordRateLimit, getClientIp } from "@/Lib/rateLimit";

export async function PATCH(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const authHeader = request.headers.get("authorization");
        const resetToken = body.resetToken || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null);
        const { email, newPassword, confirmPassword } = body;

        if (!email || !newPassword || !confirmPassword) {
            return NextResponse.json({
                message: "All fields are required",
                success: false
            }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Rate limit check
        const clientKey = getClientIp(request, normalizedEmail);
        const { success: rateLimitOk } = await resetPasswordRateLimit.limit(clientKey);

        if (!rateLimitOk) {
            return NextResponse.json({
                message: "Too many password reset attempts, please try again later",
                success: false
            }, { status: 429 });
        }

        // Backend password validation
        if (newPassword.length < 8) {
            return NextResponse.json({
                message: "Password must be at least 8 characters long",
                success: false
            }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({
                message: "Passwords do not match",
                success: false
            }, { status: 400 });
        }

        // Validate that reset token is present
        if (!resetToken) {
            return NextResponse.json({
                message: "Reset authorization token is missing. Please verify your OTP first.",
                success: false
            }, { status: 401 });
        }
        
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({
                message: "Invalid or expired reset token. Please request a new OTP.",
                success: false
            }, { status: 401 });
        }

        // Validate token purpose
        if (decoded.purpose !== "password-reset") {
            return NextResponse.json({
                message: "Invalid token purpose",
                success: false
            }, { status: 403 });
        }

        // Ensure token matches the provided email
        if (decoded.email?.toLowerCase() !== normalizedEmail) {
            return NextResponse.json({
                message: "Token does not match the provided email address",
                success: false
            }, { status: 403 });
        }

        // Query user and check server-side authorization state
        const [verifyUser] = await db.query(
            `SELECT id, email, reset_otp_verified, reset_otp_expires_at
             FROM users
             WHERE id = ? AND LOWER(email) = ?`,
            [decoded.userId, normalizedEmail]
        );

        if (verifyUser.length === 0) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const user = verifyUser[0];

        // Ensure reset authorization was granted, has not expired, and has not already been used
        if (!Boolean(user.reset_otp_verified) || !user.reset_otp_expires_at || new Date(user.reset_otp_expires_at) < new Date()) {
            return NextResponse.json({
                message: "Reset authorization has expired or has already been used. Please request a new OTP.",
                success: false
            }, { status: 400 });
        }

        // Hash new password using bcrypt cost factor 10
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atomically update password and revoke reset authorization (prevents token reuse)
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
