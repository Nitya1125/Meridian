import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";
import { verifyOtpRateLimit, getClientIp } from "@/Lib/rateLimit";

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { email, otp } = body;

        if (!email || otp === undefined || otp === null || String(otp).trim() === "") {
            return NextResponse.json({
                message: "Email and OTP are required",
                success: false
            }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Rate limit check using client IP and email context
        const clientKey = getClientIp(request, normalizedEmail);
        const { success } = await verifyOtpRateLimit.limit(clientKey);

        if (!success) {
            return NextResponse.json({
                message: "Too many requests, please try again later",
                success: false
            }, { status: 429 });
        }

        const [verifyUser] = await db.query(
            `SELECT id, email, reset_otp, reset_otp_expires_at, reset_otp_verified
             FROM users
             WHERE LOWER(email) = ?`,
            [normalizedEmail]
        );

        if (verifyUser.length === 0) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const user = verifyUser[0];

        // Ensure an OTP was actually requested
        if (!user.reset_otp || !user.reset_otp_expires_at) {
            return NextResponse.json({
                message: "No OTP requested. Please request a new code.",
                success: false
            }, { status: 400 });
        }

        // Check expiration before checking OTP correctness
        if (new Date(user.reset_otp_expires_at) < new Date()) {
            return NextResponse.json({
                message: "OTP expired. Please request a new code.",
                success: false
            }, { status: 400 });
        }

        // Handle duplicate submission: if already verified and not expired, return token without error
        if (Boolean(user.reset_otp_verified)) {
            if (String(user.reset_otp).trim() === String(otp).trim()) {
                const resetToken = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email,
                        purpose: "password-reset"
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "10m" }
                );

                return NextResponse.json({
                    message: "OTP verified successfully",
                    success: true,
                    resetToken
                }, { status: 200 });
            }
        }

        // Safe OTP comparison (handles strings, numbers, whitespace)
        if (String(user.reset_otp).trim() !== String(otp).trim()) {
            return NextResponse.json({
                message: "OTP incorrect",
                success: false
            }, { status: 400 });
        }

        // Mark OTP as verified
        await db.query(
            `UPDATE users
             SET reset_otp_verified = TRUE
             WHERE id = ?`,
            [user.id]
        );

        // Issue a signed reset token valid for 10 minutes
        const resetToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        return NextResponse.json({
            message: "OTP verified successfully",
            success: true,
            resetToken
        }, { status: 200 });

    } catch (error) {
        console.error("OTP verification error:", error);

        return NextResponse.json({
            message: "Error while verifying OTP",
            success: false
        }, { status: 500 });
    }
}

