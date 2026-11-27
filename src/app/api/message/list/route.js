import {NextResponse} from 'next/server';
import db from '@/Lib/db';
import jwt from 'jsonwebtoken'
import {cookies } from 'next/headers'

export async function GET(request) {
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

        const [user] = await db.query(`SELECT * from users where id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: 'User not found',
                success: false,
            },{status:404})
        }

        const {searchParams} = new URL(request.url);
        const conversationId = searchParams.get('conversationId')


        if(!conversationId){
            return NextResponse.json({
                success: false,
                message: 'Conversation Id is not found'
            }, {status:400})
        }

        const [conversation] = await db.query(`SELECT * from conversations where  id =?`, [conversationId])

        if(conversation.length === 0){
            return NextResponse.json({
                success: false,
                message: 'Conversation Not found'
            },{status:404})
        }

        const [conversation_member] = await db.query(`SELECT conversation_id FROM conversation_members WHERE conversation_id = ? and user_id = ? AND left_at IS NULL`, [conversationId, decoded.id])

        if(conversation_member.length === 0){
            return NextResponse.json({
                success: false,
                message: 'User is not an member of this  conversation'
            }, {status:403}) 
        }

       const [message] =  await db.query(`SELECT  m.id, m.conversation_id, m.sender_id, CONCAT(u.first_name, ' ', u.last_name) AS sender_name, m.content, m.created_at FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? AND m.deleted_at IS NULL ORDER BY m.created_at ASC`, [conversationId])

       return NextResponse.json({
        success: true,
        message: 'Message fetch successfully',
        date: message
       },{status:200})

    }catch(error){
        return NextResponse.json({
            success: false,
            message: error.message 
        }, {status: 500})
    }
}