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

export const resetPasswordRateLimit = createLimiter(5, "15m");

export const googleLoginRateLimit = createLimiter(10, "1d");

export const githubLoginRateLimit = createLimiter(10, "1d");

/**
 * Determine client identifier for rate limiting.
 * Handles x-forwarded-for, x-real-ip, and avoids sharing a single static key
 * across unrelated local development requests.
 */
export function getClientIp(request, context = "") {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // In development, differentiate requests by context (e.g. email) so test requests don't collide
  if (process.env.NODE_ENV !== "production") {
    return context ? `127.0.0.1_${context.trim().toLowerCase()}` : "127.0.0.1";
  }

  return context ? `unknown_${context.trim().toLowerCase()}` : "unknown";
}
