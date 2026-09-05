import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15m"),
    analytics: true,
});

export const signupRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5,"15m"),
    analytics:true,
})

export const sendOtpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3,"10m"),
    analytics: true,
})

export const verifyOtpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5,"10m"),
    analytics: true,
})

export const googleLoginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10,"1d"),
    analytics: true,
})

export const githubLoginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10,"1d"),
    analytics: true,
})