import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";


export async function GET(request){
    try{

        const token = request.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const  [user] = await db.query(`SELECT * FROM users WHERE id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, {status: 403})
        }


        const {searchParams} = new URL(request.url);

        const organization_id= searchParams.get("organization_id");
        if(!organization_id){
            return NextResponse.json({
                message: "Organization ID is required",
                success: false
            }, {status: 400})
        }

        const [organizationMember] = await db.query(`SELECT id FROM organization_members WHERE organization_id = ? AND user_id = ?`,[organization_id, decoded.id])

        if(organizationMember.length === 0){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, {status: 403})
        }

        

        const [members] = await db.query(`SELECT u.id,u.first_name,u.last_name,u.email,o.role,o.joined_at FROM organization_members o INNER JOIN users u ON o.user_id = u.id WHERE o.organization_id = ?`,[organization_id])

        return NextResponse.json({
            message: "Members fetched successfully",
            success: true,
            members
        })
        

    }catch(error){
        console.log(error)

        return NextResponse.json({
            message: "Server Error",
            success: false
        }, {status: 500})
    }
}