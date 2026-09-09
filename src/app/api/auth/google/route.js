import { NextResponse } from "next/server";
import { googleLoginRateLimit } from "@/Lib/rateLimit";

export async function GET(request){
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const {success} = await googleLoginRateLimit.limit(ip);

    if(!success){
        return NextResponse.json({
            success:false,
            message:"Too many requests, please try again later"
        },{status:429});
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth`+ `?client_id=${clientId}`+`&redirect_uri=${encodeURIComponent(redirectUri)}`+`&response_type=code`+`&scope=${encodeURIComponent("openid email profile")}`;

    return NextResponse.redirect(googleUrl);
}