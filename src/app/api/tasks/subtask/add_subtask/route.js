import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import db from "@/Lib/db"

export async function POST(request){
    try{

        const {task_id,title} = await request.json()

        if(!task_id || !title){
            return NextResponse.json({
                success:false,
                message:"All fields are required"
            }, { status: 400 })
        }

        const token = request.cookies.get("token")?.value

        if(!token){
            return NextResponse.json({
                success:false,
                message:"Unauthorized"
            }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`Select * from users where id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message:"Unauthorized",
                success:false
            },{status: 404})
        }
        const [task] =  await db.query(`Select * from tasks where task_id =?`,[task_id])

        if(task.length === 0){
            return NextResponse.json({
                message:"Task not found",
                success:false
            },{status: 404})
        }

        const [member] = await db.query(`Select * from organization_members where user_id =? AND organization_id =?`,[decoded.id,task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message:"User is not a member of organization",
                success:false
            },{status: 403})
        }

        await db.query(`Insert into task_subtasks (task_id, title,created_by) values (?,?,?)`,[task_id,title,decoded.id])

        return NextResponse.json({
            success:true,
            message:"Subtask added successfully",
        },{status: 201})
        
    }catch(error){
        console.log(error);
        
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        }, { status: 500 })
    }
}