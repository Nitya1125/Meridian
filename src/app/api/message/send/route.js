import { NextResponse } from "next/server";
import db from '@/Lib/db'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function POST(request){
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

        const [user] = await db.query(`Select * from users where id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                success: false,
                message: 'user not found'
            },{status: 404})
        }

        const {conversationId,content} = await request.json()

        if(!conversationId || !content){
            return NextResponse.json({
                success: false,
                message:'No message found'
            }, {status:400})
        }

        const [conversation] = await db.query(`SELECT id from conversations where id = ?`, [conversationId])

        if(conversation.length === 0){
            return NextResponse.json({
                success: false,
                message: 'No conversation found'
            },{status: 404})
        }

        const [conversationMember] = await db.query(`SELECT conversation_id FROM conversation_members WHERE conversation_id = ? AND user_id = ? AND left_at IS NULL`, [conversationId, decoded.id]);


        if(conversationMember.length === 0){
            return NextResponse.json({
                success: false,
                message: 'No Memeber of this conversation'
            },{status: 403})
        }

        const [result] = await db.query(`INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)`, [conversationId, decoded.id, content.trim()]);

        await db.query(`UPDATE conversations SET last_message_id = ?, last_message_at = CURRENT_TIMESTAMP(3) WHERE id = ?`,[result.insertId, conversationId]);

        const [newMessage] = await db.query(`SELECT m.id, m.conversation_id, m.sender_id, CONCAT(u.first_name, ' ', u.last_name) AS sender_name, m.content, m.created_at FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?`,[result.insertId]);
        
        return NextResponse.json({        
            success: true,        
            message: "Message sent successfully",
            data: newMessage[0]
        }, { status: 201 });

    }catch(error){
        return NextResponse.json({
            success: false,
            error
        }, {status:500})
    }
}