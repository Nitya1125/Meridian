import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

export async function POST(request){
    try{
        const {email,organizationId} = await request.json()

        if(!email || !organizationId){
            return NextResponse.json({
                message: "All fields are required",
                success: false
            },{status:400})
        } 


        const token = request.cookies.get("token")?.value;
        if(!token){
            return NextResponse.json({
                success:false,
                message:"Token is not valid"
            },{status:401})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const [user] = await db.query(`SELECT * FROM users WHERE id =?`,[decoded.id])
        
        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        const [organization] = await db.query(`SELECT * FROM organizations WHERE id =? AND created_by = ?`,[organizationId,decoded.id])
        
        if(organization.length === 0){
            return NextResponse.json({
                success:false,
                message:"Organization not found"
            },{status:404})
        }

        const [owner] = await db.query(`SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ? AND role = 'OWNER' `,[organizationId,decoded.id])

        if(owner.length === 0){
            return NextResponse.json({
                success:false,
                message:"User is not owner of this organization"
            },{status:401})
        }

        const [invitedUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [email])

        if(invitedUser.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        const [existingMember] = await db.query(`SELECT * FROM organization_members WHERE user_id = ? AND organization_id = ?`,[invitedUser[0].id,organizationId])

        if(existingMember.length > 0){
            return NextResponse.json({
                success:false,
                message:"User is already a member of this organization"
            },{status:400})
        }

        const [pendingRequest] = await db.query(`SELECT * FROM join_requests WHERE user_id = ? AND organization_id = ? AND status = 'PENDING'`, [invitedUser[0].id,organizationId])

        if(pendingRequest.length > 0){
            return NextResponse.json({
                success:false,
                message:"An invitation or join request is already pending for this user"
            },{status:400})
        }

        const [requestResult] = await db.query(`INSERT INTO join_requests (user_id, organization_id, status) VALUES (?,?, 'PENDING')`, [invitedUser[0].id,organizationId])

        await db.query(`INSERT INTO notifications(user_id, message, organization_id, join_request_id)VALUES (?, ?, ?, ?)`,[invitedUser[0].id,"Invitation to join organization",organizationId,requestResult.insertId])

        const invitationToken = jwt.sign({
            joinRequestId: requestResult.insertId,
            organizationId: organizationId,
            invitedUserId: invitedUser[0].id
        },
        process.env.INVITATION_SECRET,
        {expiresIn:"2d"})

        const invitationUrl = `${new URL(request.url).origin}/organization/invite?token=${invitationToken}`;
        const declineUrl = `${new URL(request.url).origin}/organization/invite/decline?token=${invitationToken}`;

    try{
        await  brevo.transactionalEmails.sendTransacEmail({
            sender:{
                name:process.env.BREVO_SENDER_NAME,
                email:process.env.BREVO_SENDER_EMAIL,
            },
            to:[{
                email: email,
            }],
            subject: "Invitation to join organization",
            htmlContent: `
                <h1>You're invited to join ${organization[0].name}</h1>
                <p>You have been invited to join this organization on Meridian.</p>
                <p>Please choose an option below:</p>

                <a href="${invitationUrl}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#000;
                    color:#fff;
                    text-decoration:none;
                    border-radius:6px;
                    margin-right:10px;
                ">
                    Accept Invitation
                </a>

                <a href="${declineUrl}"
                    style="
                        display:inline-block;
                        padding:12px 24px;
                        background:#fff;
                        color:#000;
                        text-decoration:none;
                        border:1px solid #000;
                        border-radius:6px;
                    ">
                    Decline Invitation
                </a>

            <p>This invitation is valid for 2 days.</p>
        `,
        })

        return NextResponse.json({
            success:true,
            message:"Invitation sent successfully"
        },{status:200})

    }catch(error){
        console.log(error)

        await db.query(
            `DELETE FROM join_requests WHERE id = ?`,
            [requestResult.insertId]
        );
        
        return NextResponse.json({
            success:false,
            message:"Failed to send invitation"
        },{status:500})
    }

    }catch(error){

        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server Error"
        },{status:500})
    }
}