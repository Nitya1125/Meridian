import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function PATCH(request) {
    try {
        const {
            task_id,
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to,
            assign_to,
            estimated_time_value,
            estimated_time_unit
        } = await request.json();

        if (!task_id) {
            return NextResponse.json({
                message: "Task ID is required",
                success: false
            }, { status: 400 });
        }

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({
                message: "Token not found",
                success: false
            }, { status: 401 });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.id) {
            return NextResponse.json({
                message: "Invalid token",
                success: false
            }, { status: 401 });
        }

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

        const [task] = await db.query(
            `SELECT * FROM tasks WHERE task_id = ?`,
            [task_id]
        );

        if (task.length === 0) {
            return NextResponse.json({
                message: "Task not found",
                success: false
            }, { status: 404 });
        }

        const organization_id = task[0].organization_id;

        const [member] = await db.query(
            `SELECT *
             FROM organization_members
             WHERE user_id = ?
             AND organization_id = ?`,
            [decoded.id, organization_id]
        );

        if (member.length === 0) {
            return NextResponse.json({
                message: "User is not a member of organization",
                success: false
            }, { status: 403 });
        }

        const fields = [];
        const values = [];

        if (title !== undefined) {
            fields.push("title = ?");
            values.push(title);
        }

        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }

        if (status !== undefined) {
            fields.push("status = ?");
            values.push(status);
        }

        if (priority !== undefined) {
            fields.push("priority = ?");
            values.push(priority);
        }

        if (due_date !== undefined) {
            fields.push("due_date = ?");
            values.push(due_date);
        }

        const assignee = assign_to !==  undefined ?assign_to : assigned_to

        if (assignee !== undefined) {
            const [assignedUser] = await db.query(
                `SELECT *
                 FROM organization_members
                 WHERE user_id = ?
                 AND organization_id = ?`,
                [assignee, organization_id]
            );

            if (assignedUser.length === 0) {
                return NextResponse.json({
                    message: "Assigned user is not a member of organization",
                    success: false
                }, { status: 400 });
            }

            fields.push("assigned_to = ?");
            values.push(assignee);
        }

        if (estimated_time_value !== undefined) {
            fields.push("estimated_time_value = ?");
            values.push(estimated_time_value);
        }

        if (estimated_time_unit !== undefined) {
            fields.push("estimated_time_unit = ?");
            values.push(estimated_time_unit);
        }

        if (fields.length === 0) {
            return NextResponse.json({
                message: "No fields provided for update",
                success: false
            }, { status: 400 });
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");

        values.push(task_id);

        const [update] = await db.query(
            `UPDATE tasks
             SET ${fields.join(", ")}
             WHERE task_id = ?`,
            values
        );

        if (update.affectedRows === 0) {
            return NextResponse.json({
                message: "Task update failed",
                success: false
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Task updated successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.log("Error while updating task:", error);

        return NextResponse.json({
            message: "Error while updating task",
            success: false
        }, { status: 500 });
    }
}