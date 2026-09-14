import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function POST(request){
    try{

        const {title,description,status,priority,due_date,estimate_time_value,estimate_time_unit,assign_to,organization_id} = await request.json()


        if(!title || !status ||!priority ||!due_date ||!estimate_time_value ||!estimate_time_unit ||!organization_id || !assign_to){
            return NextResponse.json({
                message: "All Fields are required",
                success: false
            },{status: 400})
        }

        const token = request.cookies.get('token')?.value

        if(!token){
            return NextResponse.json({
                message: "Unauthorize User",
                success: false
            }, {status:401})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const [users] = await db.query(`SELECT * FROM users where id =?`, [decoded.id])

        if(users.length === 0){
            return NextResponse.json({
                message: "User Does Not Exist",
                success: false
            }, {status:400})
        }

        const [organization] = await db.query(`SELECT * FROM organization_members where user_id =? AND organization_id =? `, [decoded.id,organization_id]) 
        
        if(organization.length === 0){
            return NextResponse.json({
                message: "User Is Not Member Of Organization",
                success: false
            }, {status:400})
        }

        const [assigneduser] = await db.query(`Select * FROM organization_members where user_id = ? AND organization_id = ?`,[assign_to,organization_id])

        if(assigneduser.length === 0){
            return NextResponse.json({
                message: "User Is Not Member Of Organization",
                success: false
            }, {status:400})
        }

        await db.query(`INSERT INTO tasks (title, description, status, priority, due_date, estimated_time_value, estimated_time_unit, assigned_to, organization_id,created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` , [title, description, status, priority, due_date, estimate_time_value, estimate_time_unit, assign_to, organization_id,decoded.id])

        return NextResponse.json({
            message: "Task Added Successfully",
            success: true
        }, {status:200})


    }catch(error){

        console.log("Error : ",error)
        return NextResponse.json({
            message: "Server Error",
            success: false
        },{status: 500})
    }
}