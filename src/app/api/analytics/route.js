import { NextResponse } from "next/server"
import db from "@/Lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"


export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const organization_id = searchParams.get("organization_id")

        if(!organization_id){
            return NextResponse.json({
                success:false,
                message:"Organization id is required"
            }, {status : 404})
        }

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if(!token){
            return NextResponse.json({
                success:false,
                message:"Token is required"
            }, {status: 404})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`Select id from users where id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            }, {status: 404})
        }

        const [member] = await db.query(`Select role from organization_members where organization_id = ? and user_id = ?`, [organization_id, decoded.id])

        if(member.length === 0){
            return NextResponse.json({
                success:false,
                message:"Member not found"
            }, {status: 403})
        }

        const [kpiMetrics] = await db.query(`SELECT COUNT(*) AS totalTasks, SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) AS completedTasks, SUM(CASE WHEN priority = 'CRITICAL' AND status != 'DONE' THEN 1 ELSE 0 END) AS criticalTasks, AVG(CASE WHEN status = 'DONE' THEN DATEDIFF(updated_at, created_at) END) AS cycleTime FROM tasks WHERE organization_id = ?`, [organization_id])
        
        const totalTasks = Number(kpiMetrics[0].totalTasks) || 0
        const completedTasks = Number(kpiMetrics[0].completedTasks) || 0
        const completionRate = totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(2)): 0
        const sprintVelocity = completedTasks
        const cycleTime = Number(Number(kpiMetrics[0].cycleTime || 0).toFixed(2))
        const criticalTasks = Number(kpiMetrics[0].criticalTasks) || 0

        const [priorityDistribution] = await db.query(`Select priority, COUNT(*) AS count FROM tasks where organization_id = ? GROUP BY priority `, [organization_id])

        const  [burndownDate] = await db.query(`SELECT Date(due_date) AS date, COUNT(*) AS reminingTask FROM tasks WHERE organization_id = ? AND due_date IS NOT NULL GROUP BY DATE(due_date) ORDER BY date ASC`, [organization_id])

        const [weeklyVelocity] = await db.query(`SELECT YEARWEEK(updated_at, 1) AS week, COUNT(*) AS completedTasks FROM tasks WHERE organization_id = ? AND status = 'DONE' AND updated_at IS NOT NULL GROUP BY week ORDER BY week ASC LIMIT 12`, [organization_id])

        const [heatMapData] = await db.query(`SELECT DATE(updated_at) AS day, COUNT(*) AS count FROM tasks WHERE organization_id = ? AND updated_at >= DATE_SUB(NOW(),INTERVAL 35 DAY) GROUP BY DATE(updated_at) ORDER BY day ASC`, [organization_id])

        return NextResponse.json({
            success: true,
            message: "Data fetched successfully",
            data :{
                kpiMetrics: {   
                    totalTasks,
                    completedTasks,
                    completionRate,
                    sprintVelocity,
                    cycleTime,
                    criticalTasks
                },
            priorityDistribution,
            burndownDate,
            weeklyVelocity,
            heatMapData
            }
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}