import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

async function processRejectInvitation(invitationToken, sessionToken) {
    if (!invitationToken) {
        return { status: 400, body: { message: "Invitation token is required", success: false } };
    }

    if (!sessionToken) {
        return { status: 401, body: { message: "Authorization token is missing. Please sign in.", success: false } };
    }

    let decoded;
    try {
        decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    } catch {
        return { status: 401, body: { message: "Session is invalid or expired", success: false } };
    }

    const currentUserId = decoded.id || decoded.userId;

    const [user] = await db.query(
        `SELECT id FROM users WHERE id = ?`,
        [currentUserId]
    );

    if (user.length === 0) {
        return { status: 404, body: { message: "User not found", success: false } };
    }

    let invitation;
    const secret = process.env.INVITATION_SECRET || process.env.JWT_SECRET;
    try {
        invitation = jwt.verify(invitationToken, secret);
    } catch {
        return { status: 400, body: { message: "Invitation token is invalid or expired", success: false } };
    }

    const {
        joinRequestId,
        organizationId,
        invitedUserId
    } = invitation;

    if (String(invitedUserId) !== String(currentUserId)) {
        return {
            status: 403,
            body: { message: "You are not authorized to decline this invitation", success: false }
        };
    }

    const [joinRequest] = await db.query(
        `SELECT * FROM join_requests
         WHERE id = ?
         AND organization_id = ?
         AND user_id = ?`,
        [joinRequestId, organizationId, invitedUserId]
    );

    if (joinRequest.length === 0) {
        return { status: 404, body: { message: "Invitation record not found", success: false } };
    }

    if (joinRequest[0].status === "ACCEPTED") {
        return { status: 400, body: { message: "Invitation has already been accepted", success: false } };
    }

    if (joinRequest[0].status === "REJECTED") {
        return { status: 200, body: { message: "Invitation has already been declined", success: true } };
    }

    const [organization] = await db.query(
        `SELECT * FROM organizations WHERE id = ?`,
        [organizationId]
    );

    await db.query(
        `UPDATE join_requests
         SET status = 'REJECTED', updated_at = NOW()
         WHERE id = ?`,
        [joinRequestId]
    );

    if (organization.length > 0) {
        await db.query(
            `INSERT INTO notifications
             (user_id, message, organization_id, join_request_id)
             VALUES (?, ?, ?, ?)`,
            [
                organization[0].created_by,
                "An organization invitation was declined",
                organizationId,
                joinRequestId
            ]
        );
    }

    return {
        status: 200,
        body: { message: "Invitation declined successfully", success: true }
    };
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const invitationToken = body.token;
        const sessionToken = request.cookies.get("token")?.value;

        const result = await processRejectInvitation(invitationToken, sessionToken);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        console.error("REJECT INVITATION ERROR:", error);
        return NextResponse.json({ message: "Server Error", success: false }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const invitationToken = searchParams.get("token");
        const sessionToken = request.cookies.get("token")?.value;

        const result = await processRejectInvitation(invitationToken, sessionToken);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        console.error("REJECT INVITATION GET ERROR:", error);
        return NextResponse.json({ message: "Server Error", success: false }, { status: 500 });
    }
}
