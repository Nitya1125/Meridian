import { NextResponse } from "next/server";
import db from "@/Lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const organization_id = searchParams.get("organization_id");
        if (!organization_id) {
            return NextResponse.json({
                success: false,
                message: "Organization ID is required"
            }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Token is required"
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.query(`SELECT id FROM users WHERE id = ?`, [decoded.id]);

        if (user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const [member] = await db.query(`SELECT role FROM organization_members WHERE organization_id = ? AND user_id = ?`, [organization_id, decoded.id]);

        if (member.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Member not found"
            }, { status: 403 });
        }

        const [activeTask] = await db.query(
            `SELECT task_id, title, description, status, priority, due_date, estimated_time_value, estimated_time_unit, assigned_to 
             FROM tasks 
             WHERE organization_id = ? AND UPPER(status) IN ('TODO','IN_PROGRESS','INPROGRESS','REVIEW') 
             ORDER BY updated_at DESC LIMIT 2`,
            [organization_id]
        );

        const items = await Promise.all(activeTask.map(async (task) => {
            const taskId = task.task_id;
            const [subtaskCounts] = await db.query(
                `SELECT COUNT(*) AS totalSubtasks, SUM(CASE WHEN is_completed = 1 OR is_completed = true THEN 1 ELSE 0 END) AS completedSubtasks FROM task_subtasks WHERE task_id = ?`,
                [taskId]
            );
            const total = Number(subtaskCounts[0]?.totalSubtasks) || 0;
            const completed = Number(subtaskCounts[0]?.completedSubtasks) || 0;
            const progress = total > 0 ? Math.round((completed / total) * 100) : (task.status === 'IN_PROGRESS' || task.status === 'INPROGRESS' ? 68 : (task.status === 'REVIEW' ? 92 : 30));

            return {
                id: taskId,
                task_id: taskId,
                title: task.title,
                category: 'Deliverable',
                status: task.status,
                priority: task.priority,
                due_date: task.due_date,
                progress: progress,
                estimatedTimeValue: task.estimated_time_value || 0,
                estimatedTimeUnit: task.estimated_time_unit || 'HOURS',
                assigned_to: task.assigned_to
            };
        }));

        const [inFlightResult] = await db.query(
            `SELECT COUNT(*) AS inFlightCount FROM tasks WHERE organization_id = ? AND UPPER(status) IN ('IN_PROGRESS','INPROGRESS')`,
            [organization_id]
        );

        const activeCount = (inFlightResult[0]?.inFlightCount && inFlightResult[0].inFlightCount > 0) ? inFlightResult[0].inFlightCount : activeTask.length;

        return NextResponse.json({
            success: true,
            message: "Tasks fetched successfully",
            activeCount: activeCount,
            activeTask: items,
            data: {
                activeCount: activeCount,
                items: items
            }
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}