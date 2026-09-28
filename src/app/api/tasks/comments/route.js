import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function GET(request){
    try{
        const {searchParams} = new URL(request.url)

        const task_id = searchParams.get('task_id')

        if(!task_id){
            return NextResponse.json({
                message: "task_id is required",
                success:false
            }, {status:400})
        }

        const token = request.cookies.get("token")?.value

        if(!token){
            return NextResponse.json({
                message: "Token is not there",
                success:false
            }, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User is not found",
                success:false
            }, {status: 404})
        }

        const [task] = await db.query(`select * from tasks Where task_id = ?`, [task_id])

        if(task.length === 0){
            return NextResponse.json({
                message: "Task is not found",
                success:false
            }, {status: 404})
        }

        const [member] = await db.query(`select * from organization_members where user_id =? AND organization_id =?`, [decoded.id, task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message: "User is not a member of this organization",
                success: false
            }, {status: 403})
        }

        const [comments] = await db.query(`SELECT tc.comment_id, tc.task_id, tc.user_id,tc.content, tc.created_at, tc.updated_at, u.first_name, u.last_name, u.email FROM task_comments tc INNER JOIN users u ON tc.user_id = u.id WHERE tc.task_id = ? ORDER BY tc.created_at ASC`,[task_id])
        
        return NextResponse.json({
            success: true,
            message:"Comments fetched successfully",
            data: comments
        }, {status: 200})

    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}