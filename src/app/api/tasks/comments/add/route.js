import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function POST(request){
    try{

        const{task_id,content} = await request.json()

        if(!task_id || !content){
            return NextResponse.json({
                message: "task id and content are required",
                success: false
            }, {status: 400})
        }

        const token = request.cookies.get('token')?.value

        if(!token){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            },{status:401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, {status: 404})
        }

        const [task] = await db.query(`Select * from tasks where task_id = ?`,[task_id])

        if(task.length === 0){
            return NextResponse.json({
                message: "Task not found",
                success: false
            }, {status: 404})
        }

        const [member] = await db.query(`Select * from organization_members where user_id = ? AND organization_id = ?`, [decoded.id, task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message: "You are not a member of this organization",
                success: false
            }, {status: 403})
        }

        const [result] = await db.query(`INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)`, [task_id, decoded.id, content])

        if(result.affectedRows === 0){
            return NextResponse.json({
                message: "Failed to add comment",
                success: false
            }, {status: 400})
        }

        return NextResponse.json({
            message: "Comment added successfully",
            success: true
        }, {status: 201})


    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: "Internal server error",
            success:false
        }, {status: 500})
    }
}
