import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * Rate limiter for authentication endpoints
 * Limits: 5 attempts per 15 minutes per IP
 */
export const authRateLimiter = new RateLimiterMemory({
  keyPrefix: "auth_limit",
  points: 5, // 5 attempts
  duration: 15 * 60, // per 15 minutes
});

/**
 * Rate limiter for general API endpoints
 * Limits: 100 requests per minute per IP
 */
export const apiRateLimiter = new RateLimiterMemory({
  keyPrefix: "api_limit",
  points: 100, // 100 requests
  duration: 60, // per minute
});

/**
 * Check if request is rate limited
 * @param key - Usually IP address
 * @param limiter - Rate limiter instance
 * @returns Object with allowed boolean and remaining points
 */
export async function checkRateLimit(
  key: string,
  limiter: RateLimiterMemory = apiRateLimiter
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  try {
    const rateLimiterRes = await limiter.consume(key);
    return {
      allowed: true,
      remaining: rateLimiterRes.remainingPoints,
    };
  } catch (rejRes) {
    // Rate limit exceeded
    if (typeof rejRes === "object" && rejRes !== null && "msBeforeNext" in rejRes) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((rejRes.msBeforeNext as number) / 1000),
      };
    }
    return {
      allowed: false,
      remaining: 0,
      retryAfter: 60,
    };
  }
}

/**
 * Get client IP from request headers
 * Works with Next.js headers()
 */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}
