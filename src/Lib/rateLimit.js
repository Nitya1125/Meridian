import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const hasRedisCredentials = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = hasRedisCredentials
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper to create rate limiter with graceful fallback for local development
const createLimiter = (requests, windowStr) => {
  if (!redis) {
    return {
      limit: async () => ({
        success: true,
        limit: requests,
        remaining: requests,
        reset: 0,
      }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, windowStr),
    analytics: true,
  });
};

export const loginRateLimit = createLimiter(5, "15m");

export const signupRateLimit = createLimiter(5, "15m");

export const sendOtpRateLimit = createLimiter(3, "10m");

export const verifyOtpRateLimit = createLimiter(5, "10m");

export const googleLoginRateLimit = createLimiter(10, "1d");

export const githubLoginRateLimit = createLimiter(10, "1d");
