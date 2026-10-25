import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function PATCH(request){
    try{
        const {searchParams} = new URL(request.url)
        const subtaskId = searchParams.get("subtask_id")

        if(!subtaskId){
            return NextResponse.json({
                message: "subtask is required",
                success: false
            },{status: 400})
        }

        const token = request.cookies.get("token")?.value

        if(!token){
            return NextResponse.json({
                message: "Token Not found",
                success: false
            },{status:404})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id =?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User Not Found",
                success: false
            }, {status: 404})
        }

        const [subtask] = await db.query(`Select * from task_subtasks where subtask_id = ?`, [subtaskId])

        if(subtask.length === 0){
            return NextResponse.json({
                message: "Subtask not found",
                success: false
            }, {status: 404})
        }

        const [task] = await db.query(`Select * from tasks where task_id =?`, [subtask[0].task_id])

        if(task.length === 0){
            return NextResponse.json({
                message: "Task not found",
                success: false
            }, {status: 404})
        }

        const [member] = await db.query(`Select * from organization_members where user_id =? AND organization_id =?`,[decoded.id,task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message: "User is not a member of organization",
                success: false
            }, {status: 403})
        }

        await db.query(`UPDATE task_subtasks SET is_completed = NOT is_completed WHERE subtask_id = ?`, [subtaskId])

        return NextResponse.json({
            success: true,
            message: "Subtask updated successfully"
        })

    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status: 500})
    }
}