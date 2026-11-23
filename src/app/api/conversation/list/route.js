import {NextResponse} from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from "@/Lib/db"

export async function GET(request){
    try{

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if(!token){
            return NextResponse.json({
                success: false,
                message: 'Token is not valid'
            }, {status:401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`select * from users where id  = ? `, [decoded.id])

        if(user.length === 0){

            return NextResponse.json({
                message: 'User Not found',
                success: false
            },{status: 404})
        }

        const [organizationRow] = await db.query(`Select organization_id FROM organization_members WHERE user_id = ? `, [decoded.id])

        if(organizationRow.length === 0 ){
            return NextResponse.json({
                success: false,
                message: 'No organization Found'
            },{status: 404})
        }

        const [conversation] = await db.query('select c.id AS conversation_id,c.organization_id, c.type,c.name,c.created_by,c.last_message_id,c.last_message_at, cm.role AS user_role FROM conversations c JOIN conversation_members cm ON cm.conversation_id = c.id where cm.user_id = ? AND cm.left_at IS NULL AND c.organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = ?) ORDER BY c.last_message_at DESC', [decoded.id,decoded.id])

        return NextResponse.json({
            success :true,
            message: "Conversations fetched successfully",
            data: conversation
        }, {status: 200})

    }catch(error){
        return NextResponse.json({
            success: false,
            message: error.message
        }, {status:500})
    }
}