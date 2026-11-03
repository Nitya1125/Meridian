
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


export async function PATCH(request){
    try{

        const cookieStore = await  cookies()
        const token = cookieStore.get('token')?.value

        if(!token){
            return NextResponse.json({
                message: "Unauthorized Access",
                success: false
            }, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`SELECT id from users WHERE id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }

        const body = await request.json()

        const {first_name,last_name, job_title, location, bio, skills} = body

        if(!first_name || !last_name){
            return NextResponse.json({
                message: "First name and last name are required",
                success: false
            }, {status: 400})
        }

        const [updateUser] = await db.query(`UPDATE users SET first_name = ?, last_name =? Where id = ?`, [first_name,last_name,decoded.id])

        const [updateProfile] = await db.query(`INSERT INTO user_profile (user_id,job_title,location,bio,skills) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE job_title = VALUES(job_title), location = VALUES(location), bio = VALUES(bio), skills = VALUES(skills)`, [decoded.id, job_title,location,bio,JSON.stringify(skills || [])])

        return NextResponse.json({
            message: 'Profile Update Successfully',
            success : true
        },{status: 200})
        

    }catch(error){
        console.log(error)

        return NextResponse.json({
            message: "Profile update failed",
            success: false
        },{status: 500})
    }
}