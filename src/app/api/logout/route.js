import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(request){
    try{

        const cookieStore = await cookies();
        cookieStore.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        });

        return NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 });
    }catch(error){
        console.log("Logout Error:", error)

        return NextResponse.json({
            success: false,
            message:"Something went wrong"
        },{status:500})
    }
}

