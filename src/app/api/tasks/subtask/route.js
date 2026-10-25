import {NextResponse} from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function GET(request){
    try{

        const {searchParams} = new URL(request.url)
        const taskId = searchParams.get("task_id")

        if(!taskId){
            return NextResponse.json({
                message:"Task ID is required",
                success: false
            }, {status: 400})
        }

        const token = request.cookies.get('token')?.value

        if(!token){

            return NextResponse.json({
                message: "Token is not there ",
                success: false
            },{status:404})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id = ?`,[decoded.id])
        if(user.length === 0){
            return NextResponse.json({
                message: "User is not found ",
                success: false
            },{status:404})
        }

        const [task] = await db.query(`Select * from tasks where task_id = ?`,[taskId])
        if(task.length === 0){
            return NextResponse.json({
                message: "Task is not found ",
                success: false
            },{status:404})
        }

        const [member] = await db.query(`Select * from organization_members where user_id =? AND organization_id =?`,[decoded.id,task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message: "User is not a member of organization ",
                success: false
            },{status:403})
        }

        const [subtasks] = await db.query(`Select * from task_subtasks where task_id = ?`,[taskId])
        return NextResponse.json({
            message: "Subtasks fetched successfully ",
            success: true,
            data: subtasks
        }, {status: 200})
        
    }catch(error){
        return NextResponse.json({
            message: "Server Error ",
            success: false,
        }, {status: 500})
    }
}