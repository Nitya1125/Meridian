import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"
import {cookies} from "next/headers"


export async function POST(request){
    try{

        const {organizationId, name, memberIds} = await request.json()

        if(!organizationId || !name?.trim() || !Array.isArray(memberIds) || memberIds.length === 0){
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400})
        }

        const cookieStore = await cookies();

        const token = cookieStore.get('token')?.value

        if(!token){
            return NextResponse.json({
                success:false,
                message: "Unathorized access"
            },  {status:401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const  [user] = await db.query(`SELECT * FROM users WHERE id = ?`,[decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User is not present",
                success: false
            },{status:404})
        }

        const [organizationRows] = await db.query(`Select id From organization_members Where organization_id =? and user_id = ?`, [organizationId,decoded.id])

        if(organizationRows.length === 0 ){
            return NextResponse.json({
                success: false,
                message: 'You are not a member of this organization'
            },{status: 403})
        }

        const uniqueMemberIds = [...new Set(memberIds.map(String))];
        const placeholder = uniqueMemberIds.map(() => "?").join(",")

        const [member] = await db.query(`SELECT user_id FROM organization_members WHERE organization_id = ? AND user_id IN (${placeholder})`, [organizationId, ...uniqueMemberIds])


        if(member.length !== uniqueMemberIds.length){
            return NextResponse.json({
                success: false,
                message: "one or more selected member do not belong to this organization"
            }, {status:403})
        }

        const  connection =  await db.getConnection();
        try{
            await connection.beginTransaction()
            const [result] = await connection.query(`INSERT INTO conversations (organization_id,type,name,created_by) VALUES(?, 'group',?,?) `, [organizationId,name.trim(),decoded.id])
            const conversationId = result.insertId

            const memberRows = [[conversationId,decoded.id, 'owner'], 
            ...uniqueMemberIds.filter(id => id !== String(decoded.id))
            .map(id => [conversationId,id,'member'])
        ]

        const placeholders = memberRows.map(() => '(?, ?, ?)').join(', ');
        
        const values = memberRows.flat();

        await connection.query(`Insert INTO conversation_members (conversation_id, user_id, role) VALUES ${placeholders}`, values)

        await connection.commit();
        return NextResponse.json({
            success: true,
            message: "Group created successfully",
            data:{
                conversationId
            }
        },{status:201})

        }catch(error){
            await connection.rollback()
            throw error
        }finally{
            connection.release()
        }

    }catch(error){
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}