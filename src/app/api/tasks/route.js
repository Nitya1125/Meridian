import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function GET(request){
    try{

        const {searchParams} = new URL(request.url)

        const organization_id = searchParams.get("organization_id")

        if(!organization_id){
            return NextResponse.json({
                message: "Organization id is required",
                success: false
            },{status:400})
        }

        const token = request.cookies.get('token')?.value

        if(!token){
            return NextResponse.json({
                message: "Unauthorized ",
                success: false
            },{status:401})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message:"User not found",
                success: false
            },{status:404})
        }

        const  [member] = await db.query(`Select * from organization_members where organization_id = ? AND user_id = ?`,[organization_id,decoded.id])

        if(member.length === 0){
            return NextResponse.json({
                message: "user is not a member of organization",
                success: false 
            },{status:403})
        }

        const [rows] = await db.query(
    `SELECT *
     FROM tasks
     WHERE organization_id = ?
     ORDER BY
         CASE priority
             WHEN 'CRITICAL' THEN 1
             WHEN 'HIGH' THEN 2
             WHEN 'MEDIUM' THEN 3
             WHEN 'LOW' THEN 4
         END ASC,
         due_date ASC,
         created_at DESC`,
    [organization_id]
);

        return NextResponse.json({
            message: "Task fetched successfully",
            success: true,
            result: rows
        },{status:200})

    }catch(error){
        console.log(error)

        return NextResponse.json({
            message:"Server error",
            success: false
        },{status:500})
    }
}

