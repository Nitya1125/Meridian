
import db from "@/Lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [profile] = await db.query(
            `SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.is_active,
                p.profile_picture,
                p.job_title,
                p.location,
                p.bio,
                p.skills
            FROM users u
            LEFT JOIN user_profile p
                ON p.user_id = u.id
            WHERE u.id = ?`,
            [decoded.id]
        );

        if (profile.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const data = profile[0];
        let skills = [];

        if (data.skills) {
            skills =
                typeof data.skills === "string"
                    ? JSON.parse(data.skills)
                    : data.skills;
        }
        return NextResponse.json(
            {
                success: true,
                message: "Profile fetched successfully",
                profile: {
                    ...data,
                    is_active: Boolean(data.is_active),
                    profile_picture:
                        data.profile_picture ?? null,
                    job_title: data.job_title ?? null,
                    location: data.location ?? null,
                    bio: data.bio ?? null,
                    skills,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET /api/profile error:", error);
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired token",
                },
                { status: 401 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch profile",
            },
            { status: 500 }
        );
    }
}
