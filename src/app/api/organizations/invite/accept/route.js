import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/Lib/db";

async function processAcceptInvitation(invitationToken, sessionToken) {
    if (!invitationToken) {
        return { status: 400, body: { success: false, message: "Invitation token is required" } };
    }

    if (!sessionToken) {
        return { status: 401, body: { success: false, message: "Please sign in to accept this invitation" } };
    }

    let userDecoded;
    try {
        userDecoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    } catch {
        return { status: 401, body: { success: false, message: "Session is invalid or expired. Please sign in again." } };
    }

    const currentUserId = userDecoded.id || userDecoded.userId;

    const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [currentUserId]);
    if (user.length === 0) {
        return { status: 404, body: { success: false, message: "User not found" } };
    }

    let invitation;
    const secret = process.env.INVITATION_SECRET || process.env.JWT_SECRET;
    try {
        invitation = jwt.verify(invitationToken, secret);
    } catch (err) {
        return { status: 400, body: { success: false, message: "Invitation token is invalid or has expired" } };
    }

    const { joinRequestId, organizationId, invitedUserId } = invitation;

    if (String(invitedUserId) !== String(currentUserId)) {
        return {
            status: 403,
            body: { success: false, message: "This invitation was sent to a different Meridian account." }
        };
    }

    const [joinRequest] = await db.query(
        `SELECT * FROM join_requests WHERE id = ? AND organization_id = ? AND user_id = ?`,
        [joinRequestId, organizationId, invitedUserId]
    );

    if (joinRequest.length === 0) {
        return { status: 404, body: { success: false, message: "Invitation record not found" } };
    }

    if (joinRequest[0].status === "ACCEPTED") {
        return { status: 400, body: { success: false, message: "Invitation has already been accepted" } };
    }

    if (joinRequest[0].status === "REJECTED") {
        return { status: 400, body: { success: false, message: "Invitation has been declined" } };
    }

    const [organization] = await db.query(
        `SELECT * FROM organizations WHERE id = ?`,
        [organizationId]
    );

    if (organization.length === 0) {
        return { status: 404, body: { success: false, message: "Organization workspace not found" } };
    }

    const [existingMember] = await db.query(
        `SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ?`,
        [organizationId, invitedUserId]
    );

    if (existingMember.length > 0) {
        await db.query(
            `UPDATE join_requests SET status = 'ACCEPTED', updated_at = NOW() WHERE id = ?`,
            [joinRequestId]
        );
        return {
            status: 200,
            body: { success: true, message: "You are already a member of this workspace" }
        };
    }

    await db.query(
        `INSERT INTO organization_members (organization_id, user_id, role) VALUES (?, ?, 'MEMBER')`,
        [organizationId, invitedUserId]
    );

    await db.query(
        `UPDATE join_requests SET status = 'ACCEPTED', updated_at = NOW() WHERE id = ?`,
        [joinRequestId]
    );

    await db.query(
        `INSERT INTO notifications (user_id, message, organization_id, join_request_id) VALUES (?, ?, ?, ?)`,
        [
            organization[0].created_by,
            `${user[0].first_name || 'A teammate'} accepted the invitation to join ${organization[0].name}`,
            organizationId,
            joinRequestId
        ]
    );

    return {
        status: 200,
        body: { success: true, message: `Successfully joined ${organization[0].name}!` }
    };
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const invitationToken = body.token;
        const sessionToken = request.cookies.get("token")?.value;

        const result = await processAcceptInvitation(invitationToken, sessionToken);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        console.error("ACCEPT INVITATION ERROR:", error);
        return NextResponse.json({ success: false, message: "Server Error processing invitation" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const invitationToken = searchParams.get("token");
        const sessionToken = request.cookies.get("token")?.value;

        const result = await processAcceptInvitation(invitationToken, sessionToken);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        console.error("ACCEPT INVITATION GET ERROR:", error);
        return NextResponse.json({ success: false, message: "Server Error processing invitation" }, { status: 500 });
    }
}
