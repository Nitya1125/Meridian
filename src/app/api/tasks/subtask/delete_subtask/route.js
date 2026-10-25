import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function DELETE(request){
    try{

        const {subtaskId} = await request.json()

        if(!subtaskId){
            return NextResponse.json({
                message:"Subtask ID is required",
                success:false
            },{status:400})
        }

        const token = request.cookies.get("token")?.value

        if(!token){
            return NextResponse.json({
                message: "Unauthorized",
                success: false
            }, {status:401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message:"Unauthorized",
                success:false
            },{status: 404})
        }

        const [subtask] = await db.query(`Select * from task_subtasks where subtask_id = ?`, [subtaskId])

        if(subtask.length === 0){
            return NextResponse.json({
                message: "Subtask not found",
                success: false
            }, {status: 404})
        }

        const [task] = await db.query(`Select * from tasks where task_id = ?`,[subtask[0].task_id])

        if(task.length === 0){
            return NextResponse.json({
                message:"Task not found",
                success:false
            }, {status:404})
        }

        const [member] = await db.query(`Select * from organization_members where user_id = ? AND organization_id = ?`,[decoded.id,task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message:"You are not a member of this organization",
                success:false
            }, {status:403})
        }

        const [result] = await db.query(
            `DELETE FROM task_subtasks WHERE subtask_id = ?`,
            [subtaskId]
        );

        if(result.affectedRows === 0){
            return NextResponse.json({
                message: "Subtask deletion failed",
                success: false
            }, { status: 400 });
        }

        return NextResponse.json({
            message:"Subtask deleted successfully",
            success:true
        }, {status:200})

    }catch(error){
        return NextResponse.json({
            message: "Server Error",
            success: false
        },{status: 500})
    }
}