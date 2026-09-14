import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/Lib/db"


export async function DELETE(request){
    try{
        const {task_id} = await request.json()

        if(!task_id){
            return NextResponse.json({
                message:"Task Id Is Required",
                success:false
            }, {status: 400})
        }

        const token = request.cookies.get('token')?.value

        if(!token){
            return NextResponse.json({
                message:"Token is required",
                success:false
            }, {status:401})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const [user] = await db.query(`SELECT id FROM users WHERE id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message:"User Not Found",
                success:false
            }, {status:404})
        }

        const [task] = await db.query(`SELECT * FROM tasks WHERE task_id = ?`,[task_id])

        if(task.length === 0){
            return NextResponse.json({
                message:"Task Not Found",
                success:false
            }, {status:404})
        }

        const [member] = await db.query(`SELECT * FROM organization_members where user_id = ? AND organization_id = ?`,[decoded.id,task[0].organization_id])

        if(member.length === 0){
            return NextResponse.json({
                message:"User Is Not Member Of Organization",
                success:false
            }, {status:403})
        }

        const [deleteResult] = await db.query(`DELETE FROM tasks WHERE task_id = ?`,[task_id])

        if(deleteResult.affectedRows === 0){
            return NextResponse.json({
                message:"Delete Failed",
                success:false
            }, {status:400})
        }

        return NextResponse.json({
            message:"Task Deleted Successfully",
            success:true
        }, {status:200})

    }catch(error){
        console.log("Error : ",error)
        return NextResponse.json({
            message: "Server Error",
            success: false
        },{status: 500})
    }
}