import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/Lib/db";

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

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [users] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (users.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const [member] = await db.query(
            `SELECT role 
             FROM organization_members 
             WHERE organization_id = ? 
             AND user_id = ?`,
            [organization_id, decoded.id]
        );

        if (member.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User is not a member of this organization"
            }, { status: 403 });
        }

        const [taskCount] = await db.query(`Select count(*) As totalTasks from tasks where organization_id = ?`,[organization_id])
        const [doneTask] = await db.query(`Select count(*) As doneTask from tasks where organization_id = ? AND status = 'DONE'`,[organization_id])
        const [todoTask] = await db.query(`Select count(*) As todoTask from tasks where organization_id = ? AND status = 'TODO'`,[organization_id])
        const [in_progressTask] = await db.query(`Select  count(*) As in_progressTask from tasks where organization_id = ? AND status = 'IN_PROGRESS'`,[organization_id])
        const [reviewTask] = await db.query(`Select  count(*) As reviewTask from tasks where organization_id = ? AND status = 'REVIEW'`,[organization_id])

        const[overdueTask] = await db.query(`Select Count(*) AS overdueTasks from tasks WHERE organization_id = ? AND due_date < CURDATE() AND status != 'DONE'`,[organization_id])

        const totaltask = taskCount[0].totalTasks 
        const completeTask = doneTask[0].doneTask 
        const TodoTask = todoTask[0].todoTask 
        const inProgressTask = in_progressTask[0].in_progressTask
        const reviewTasks = reviewTask[0].reviewTask
        const dueTasks = overdueTask[0].overdueTasks
        const sprintCompletion = totaltask > 0 ?Number(((completeTask / totaltask)*100).toFixed(2)) : 0;
        const efficiencyScore =(completeTask + dueTasks) > 0 ? Number(((completeTask / (completeTask + dueTasks)) * 10).toFixed(2)): 10;


        const [activeMemberCount] = await db.query(`SELECT COUNT(*) AS activeMembers FROM organization_members WHERE organization_id = ?`,[organization_id])
        const activeMembers = activeMemberCount[0].activeMembers

        const [workloadResult] = await db.query(`SELECT COALESCE(SUM(CASE WHEN estimated_time_unit = 'MINUTES' THEN estimated_time_value / 60 WHEN estimated_time_unit = 'HOURS' THEN estimated_time_value WHEN estimated_time_unit = 'DAYS' THEN estimated_time_value * 8 ELSE 0 END ), 0) AS estimatedWorkload FROM tasks WHERE organization_id = ? AND status != 'DONE'`,[organization_id]);
        const estimatedWorkload = workloadResult[0].estimatedWorkload;

        const totalTeamCapacity = activeMembers * 8;

        const workloadAllocation = totalTeamCapacity > 0 ? Number(((estimatedWorkload / totalTeamCapacity) * 100).toFixed(2)) : 0;
        
        const [weeklyTrend] = await db.query(`SELECT DATE(updated_at) AS date, COUNT(*) AS completedTasks FROM tasks WHERE organization_id = ? AND status = 'DONE' AND updated_at >= CURDATE() - INTERVAL 6 DAY GROUP BY DATE(updated_at) ORDER BY DATE(updated_at) ASC`, [organization_id]);
    
        return NextResponse.json({
            success: true,
            message: "User is a member",
            role: member[0].role,
            totaltask,
            completeTask,
            TodoTask,
            inProgressTask,
            reviewTasks,
            dueTasks,
            sprintCompletion,
            efficiencyScore,
            activeMembers,
            estimatedWorkload,
            workloadAllocation,
            weeklyTrend
        }, { status: 200 });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}