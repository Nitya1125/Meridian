import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function DELETE(request){
    try{
    
        const {organizationId} = await request.json()

        if(!organizationId){
            return NextResponse.json({
                message: "organizationId is required",
                success: false
            }, {status: 400})
        }

    const token = request.cookies.get("token")?.value

    if(!token){
        return NextResponse.json({
            message: "user is not authorized",
            success: false
        }, {status: 401})
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const [users] = await db.query(`select * FROM users where id =?`, [decoded.id]);

    if(users.length === 0){
        return NextResponse.json({
            message: "user is not authorized",
            success: false
        }, {status: 401})
    }

    const [owner] = await db.query(`select * from organization_members where organization_id = ? AND user_id = ? AND role="OWNER"`, [organizationId,decoded.id])

    if(owner.length === 0){
        return NextResponse.json({
            success: false,
            message: "You are not authorized to delete the organization"
        }, {status: 401})
    }

    const [organization] = await db.query(`select * from organizations where id = ? AND created_by = ?`, [organizationId, decoded.id])

    if(organization.length === 0){
        return NextResponse.json({
            success: false,
            message: "Organization not found"
        }, {status: 404})
    }

    await db.query(`DELETE FROM organizations where id  = ?`, [organizationId])

    return NextResponse.json({
        success: true,
        message: "Organization deleted successfully"
    },{status:200})

    }catch(error){
    return NextResponse.json({
        message: "Something went wrong",
        success: false
    }, {status: 500})
}
}
