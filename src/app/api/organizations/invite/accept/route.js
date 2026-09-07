import { NextResponse } from "next/server";
import jwt, { decode } from "jsonwebtoken";
import db from "@/Lib/db";

export async function GET(request){
    try {
        const{token: invitationToken} = await request.json()

        if(!invitationToken){
            return NextResponse.json({
                success:false,
                message:"Invitation token is required",
            },{status:400})
        }

        const token = request.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({
                success:false,
                message:"Token is not valid"
            },{status:401})
        }

        const decoded = jwt.verify(token, process.env.INVITATION_SECRET);

        const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.id])
        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        const invitation = jwt.verify(invitationToken,process.env.INVITATION_SECRET);
        
        const {joinRequestId, organizationId, invitedUserId} = invitation;

        if(invitedUserId !== decoded.id){
            return NextResponse.json({
                message:"You are not authorized to accept this invitation",
                success:false
            },{status:403})
        }

        const [request_id] =  await db.query(`select * from join_requests where id = ? And organzation_id = ? And user_id = ?`[joinRequestId,organizationId,invitedUserId])
        if(request_id.length === 0){
            return NextResponse.json({
                message: "Invitation not Found",
                success:false
            },{status:404})
        }
        
        const [organization] = await db.query(
            `SELECT * FROM organizations WHERE id = ?`,
            [organizationId]
        );

        if (organization.length === 0) {
            return NextResponse.json({
                message: "Organization not found",
                success: false
            }, { status: 404 });
        }

        if (request_id[0].status === "ACCEPTED") {
            return NextResponse.json({
                message: "Invitation already accepted",
                success: false
            }, { status: 400 });
        }

        if (request_id[0].status === "REJECTED") {
            return NextResponse.json({
                message: "Invitation already rejected",
                success: false
            }, { status: 400 });
        }

        const [existingMember] = await db.query(
            `SELECT * FROM organization_members
             WHERE organization_id = ?
             AND user_id = ?`,
            [organizationId, invitedUserId]
        );
        if (existingMember.length > 0) {
            return NextResponse.json({
                message: "You are already a member of this organization",
                success: false
            }, { status: 400 });
        }

        const [member] = await db.query(`INSERT into organization_members(organization_id, user_id, role) VALUES (?,?,?)`[organizationId,invitedUserId,"MEMBER"])

        await db.query(`UPDATE join_requests SET status = "ACCEPTED", updated_at = NOW() WHERE id = ?`[joinRequestId])

        await db.query(
            `INSERT INTO notifications
             (user_id, message, organization_id, join_request_id)
             VALUES (?, ?, ?, ?)`,
            [
                organization[0].created_by,
                "Invitation has been accepted",
                organizationId,
                joinRequestId
            ]
        );

        return NextResponse.json({
            success: true,
            message: "Invitation accepted successfully"
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message:"Server Error"
        },{status:500})
    }
}