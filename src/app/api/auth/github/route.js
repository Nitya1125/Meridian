import { NextResponse } from "next/server";
import { githubLoginRateLimit } from "@/Lib/rateLimit";

export async function GET(request){
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const {success} = await githubLoginRateLimit.limit(ip);

    if(!success){
        return NextResponse.json({
            success:false,
            message:"Too many requests, please try again later"
        },{status:429});
    }

    const clientId =process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI

    const githubURL = `https://github.com/login/oauth/authorize`+`?client_id=${clientId}` + `&redirect_uri=${encodeURIComponent(redirectUri)}`+`&scope=${encodeURIComponent("read:user user:email")}`;


    return NextResponse.redirect(githubURL);
}
