import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function PATCH(request) {
    try {
        // Get data from request body
        const {
            task_id,
            title,
            description,
            status,
            priority,
            due_date,
            estimate_time_value,
            estimate_time_unit,
            assign_to
        } = await request.json();

        // 1. Task ID is required
        if (!task_id) {
            return NextResponse.json(
                {
                    message: "Task ID is required",
                    success: false
                },
                { status: 400 }
            );
        }

        // 2. Get JWT token
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    message: "Token is required",
                    success: false
                },
                { status: 401 }
            );
        }

        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Check logged-in user
        const [user] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (user.length === 0) {
            return NextResponse.json(
                {
                    message: "User not found",
                    success: false
                },
                { status: 404 }
            );
        }

        // 5. Get task
        const [task] = await db.query(
            `SELECT * FROM tasks WHERE task_id = ?`,
            [task_id]
        );

        if (task.length === 0) {
            return NextResponse.json(
                {
                    message: "Task not found",
                    success: false
                },
                { status: 404 }
            );
        }

        // Get organization from the task
        const organization_id = task[0].organization_id;

        // 6. Check whether logged-in user belongs to task's organization
        const [member] = await db.query(
            `SELECT * 
             FROM organization_members 
             WHERE user_id = ? 
             AND organization_id = ?`,
            [decoded.id, organization_id]
        );

        if (member.length === 0) {
            return NextResponse.json(
                {
                    message: "User is not a member of this organization",
                    success: false
                },
                { status: 403 }
            );
        }

        // 7. If assign_to is provided, check assigned user
        if (assign_to !== undefined && assign_to !== null) {

            const [assignedUser] = await db.query(
                `SELECT * 
                 FROM organization_members
                 WHERE user_id = ?
                 AND organization_id = ?`,
                [assign_to, organization_id]
            );

            if (assignedUser.length === 0) {
                return NextResponse.json(
                    {
                        message: "Assigned user is not a member of this organization",
                        success: false
                    },
                    { status: 400 }
                );
            }
        }

        // 8. Build PATCH query dynamically
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

        if (estimate_time_value !== undefined) {
            fields.push("estimate_time_value = ?");
            values.push(estimate_time_value);
        }

        if (estimate_time_unit !== undefined) {
            fields.push("estimate_time_unit = ?");
            values.push(estimate_time_unit);
        }

        if (assign_to !== undefined) {
            fields.push("assigned_to = ?");
            values.push(assign_to);
        }

        // 9. Check whether there is anything to update
        if (fields.length === 0) {
            return NextResponse.json(
                {
                    message: "No fields provided for update",
                    success: false
                },
                { status: 400 }
            );
        }

        // 10. Add updated_at
        fields.push("updated_at = CURRENT_TIMESTAMP");

        // 11. Add task_id for WHERE condition
        values.push(task_id);

        // 12. Update task
        const [update] = await db.query(
            `UPDATE tasks
             SET ${fields.join(", ")}
             WHERE task_id = ?`,
            values
        );

        if (update.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: "Task update failed",
                    success: false
                },
                { status: 400 }
            );
        }

        // 13. Success response
        return NextResponse.json(
            {
                message: "Task updated successfully",
                success: true
            },
            { status: 200 }
        );

    } catch (error) {

        console.log("Update Task Error:", error);

        return NextResponse.json(
            {
                message: "Server error",
                success: false
            },
            { status: 500 }
        );
    }
}