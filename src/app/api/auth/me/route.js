import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/Lib/db";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized",   
            },{status:401});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        const [users] = await db.query(`Select * FROM users Where email = ?`,[decode.email]);

        if(users.length === 0){
            return NextResponse.json({
                success: false,
                message: "User not found",
            },{status:401});
        }

        return NextResponse.json({
            success: true,
            user : users[0]
        },{status:200});
        
    }catch(error){
        console.log("ME API ERROR:", error);
        return NextResponse.json({
            success:false,
            message: "Invalid or expired token"
        },{status:401});
    }
}