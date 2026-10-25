import { NextResponse } from "next/server";
import db from "@/Lib/db"
import jwt from "jsonwebtoken"

export async function PATCH(request) {
    try {

        const { comment_id, content } = await request.json();

        if (!comment_id || !content) {
            return NextResponse.json({
                message: "Comment ID and content are required",
                success: false
            }, { status: 400 });
        }

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({
                message: "Unauthorized",
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
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const [comment] = await db.query(
            `SELECT * FROM task_comments WHERE comment_id = ?`,
            [comment_id]
        );

        if (comment.length === 0) {
            return NextResponse.json({
                message: "Comment not found",
                success: false
            }, { status: 404 });
        }

        const [task] = await db.query(
            `SELECT * FROM tasks WHERE task_id = ?`,
            [comment[0].task_id]
        );

        if (task.length === 0) {
            return NextResponse.json({
                message: "Task not found",
                success: false
            }, { status: 404 });
        }

        const [member] = await db.query(
            `SELECT *
             FROM organization_members
             WHERE user_id = ?
             AND organization_id = ?`,
            [
                decoded.id,
                task[0].organization_id
            ]
        );

        if (member.length === 0) {
            return NextResponse.json({
                message: "You are not a member of this organization",
                success: false
            }, { status: 403 });
        }

        if (comment[0].user_id !== decoded.id) {
            return NextResponse.json({
                message: "You can only update your own comment",
                success: false
            }, { status: 403 });
        }

        const [result] = await db.query(
            `UPDATE task_comments
             SET content = ?
             WHERE comment_id = ?`,
            [content, comment_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                message: "Failed to update comment",
                success: false
            }, { status: 400 });
        }

        const [updatedComment] = await db.query(
            `SELECT *
             FROM task_comments
             WHERE comment_id = ?`,
            [comment_id]
        );

        return NextResponse.json({
            message: "Comment updated successfully",
            success: true,
            data: updatedComment[0]
        }, { status: 200 });

    } catch (error) {

        console.log("Error while updating comment:", error);

        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, { status: 500 });
    }
}