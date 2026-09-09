import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

export async function POST(request){
    try{
        const {email, organizationId} = await request.json()

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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUserId = decoded.id || decoded.userId;

        const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [currentUserId])
        
        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        const [organization] = await db.query(
            `SELECT * FROM organizations WHERE id = ?`,
            [organizationId]
        )
        
        if(organization.length === 0){
            return NextResponse.json({
                success:false,
                message:"Organization not found"
            },{status:404})
        }

        const [owner] = await db.query(
            `SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ? AND (role = 'OWNER' OR role = 'owner')`,
            [organizationId, currentUserId]
        )

        const isCreator = String(organization[0].created_by) === String(currentUserId);

        if(owner.length === 0 && !isCreator){
            return NextResponse.json({
                success:false,
                message:"User is not an owner of this organization"
            },{status:401})
        }

        const [invitedUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [email])

        if(invitedUser.length === 0){
            return NextResponse.json({
                success:false,
                message:"No user account found with this email. Please ask them to sign up for Meridian first."
            },{status:404})
        }

        const [existingMember] = await db.query(
            `SELECT * FROM organization_members WHERE user_id = ? AND organization_id = ?`,
            [invitedUser[0].id, organizationId]
        )

        if(existingMember.length > 0){
            return NextResponse.json({
                success:false,
                message:"User is already a member of this organization"
            },{status:400})
        }

        const [pendingRequest] = await db.query(
            `SELECT * FROM join_requests WHERE user_id = ? AND organization_id = ? AND status = 'PENDING'`,
            [invitedUser[0].id, organizationId]
        )

        if(pendingRequest.length > 0){
            return NextResponse.json({
                success:false,
                message:"An invitation or join request is already pending for this user"
            },{status:400})
        }

        const [requestResult] = await db.query(
            `INSERT INTO join_requests (user_id, organization_id, status) VALUES (?, ?, 'PENDING')`,
            [invitedUser[0].id, organizationId]
        )

        await db.query(
            `INSERT INTO notifications(user_id, message, organization_id, join_request_id) VALUES (?, ?, ?, ?)`,
            [invitedUser[0].id, `Invitation to join ${organization[0].name}`, organizationId, requestResult.insertId]
        )

        const secret = process.env.INVITATION_SECRET || process.env.JWT_SECRET;
        const invitationToken = jwt.sign({
            joinRequestId: requestResult.insertId,
            organizationId: organizationId,
            invitedUserId: invitedUser[0].id
        },
        secret,
        {expiresIn:"2d"})

        const baseUrl = new URL(request.url).origin;
        const invitationUrl = `${baseUrl}/organization/invite?token=${invitationToken}`;
        const declineUrl = `${baseUrl}/organization/invite/decline?token=${invitationToken}`;

        try{
            await brevo.transactionalEmails.sendTransacEmail({
                sender:{
                    name: process.env.BREVO_SENDER_NAME || "Meridian Team",
                    email: process.env.BREVO_SENDER_EMAIL || "notifications@meridian.com",
                },
                to:[{
                    email: email,
                }],
                subject: `Invitation to join ${organization[0].name} on Meridian`,
                htmlContent: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #faf8f5;">
                        <h1 style="color: #1c1917; font-size: 24px; font-weight: 700; margin-bottom: 8px;">You're invited to join ${organization[0].name}</h1>
                        <p style="color: #57534e; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">You have been invited by ${user[0].first_name || 'a team lead'} to join the <strong>${organization[0].name}</strong> workspace on Meridian.</p>

                        <div style="margin-bottom: 24px;">
                            <a href="${invitationUrl}"
                            style="display: inline-block; padding: 12px 24px; background: #111318; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 13px; margin-right: 12px;">
                                Accept Invitation
                            </a>

                            <a href="${declineUrl}"
                            style="display: inline-block; padding: 12px 24px; background: #ffffff; color: #1c1917; text-decoration: none; border: 1px solid #d6d3d1; border-radius: 12px; font-weight: 600; font-size: 13px;">
                                Decline
                            </a>
                        </div>

                        <p style="color: #a8a29e; font-size: 12px; margin-top: 24px; border-top: 1px solid #e7e5e4; pt: 16px;">This invitation link will expire in 48 hours.</p>
                    </div>
                `,
            })

            return NextResponse.json({
                success: true,
                message: "Invitation sent successfully"
            },{status:200})

        }catch(emailError){
            console.error("BREVO EMAIL ERROR:", emailError);

            await db.query(
                `DELETE FROM join_requests WHERE id = ?`,
                [requestResult.insertId]
            );
            
            return NextResponse.json({
                success: false,
                message: "Failed to send invitation email. Please verify Brevo configuration."
            },{status:500})
        }

    }catch(error){
        console.error("INVITE ROUTE ERROR:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Server Error"
        },{status:500})
    }
}
