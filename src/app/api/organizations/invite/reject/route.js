import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { token: invitationToken } = await request.json();

        if (!invitationToken) {
            return NextResponse.json({
                message: "Invitation token is required",
                success: false
            }, { status: 400 });
        }

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({
                message: "Authorization token is missing",
                success: false
            }, { status: 401 });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [user] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (user.length === 0) {
            return NextResponse.json({
                message: "User Not Found",
                success: false
            }, { status: 404 });
        }

        const invitation = jwt.verify(
            invitationToken,
            process.env.INVITATION_SECRET
        );

        const {
            joinRequestId,
            organizationId,
            invitedUserId
        } = invitation;

        // Make sure the logged-in user is the invited user
        if (invitedUserId !== decoded.id) {
            return NextResponse.json({
                message: "You are not authorized to decline this invitation",
                success: false
            }, { status: 403 });
        }

        const [request_id] = await db.query(
            `SELECT * FROM join_requests
             WHERE id = ?
             AND organization_id = ?
             AND user_id = ?`,
            [joinRequestId, organizationId, invitedUserId]
        );

        if (request_id.length === 0) {
            return NextResponse.json({
                message: "Invitation not found",
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

        await db.query(
            `UPDATE join_requests
             SET status = 'REJECTED'
             WHERE id = ?`,
            [joinRequestId]
        );

        await db.query(
            `INSERT INTO notifications
             (user_id, message, organization_id, join_request_id)
             VALUES (?, ?, ?, ?)`,
            [
                organization[0].created_by,
                "Invitation has been declined",
                organizationId,
                joinRequestId
            ]
        );

        await db.query(
            `UPDATE notifications
             SET message = 'Invitation declined'
             WHERE join_request_id = ?
             AND organization_id = ?
             AND user_id = ?`,
            [
                joinRequestId,
                organizationId,
                invitedUserId
            ]
        );

        return NextResponse.json({
            message: "Invitation declined successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: "Server Error",
            success: false
        }, { status: 500 });
    }
}