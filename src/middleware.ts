import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRateLimiter, getClientIP } from "@/lib/rate-limit";

/**
 * Next.js Middleware for rate limiting and security
 * Applies rate limiting to auth endpoints
 */
export async function middleware(request: NextRequest) {
  // Apply rate limiting to auth endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const ip = getClientIP(request.headers);

    try {
      const rateLimiterRes = await authRateLimiter.consume(ip);

      // Add rate limit headers
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Limit", "5");
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimiterRes.remainingPoints.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString()
      );

      return response;
    } catch (rejRes) {
      // Rate limit exceeded
      const msBeforeNext =
        typeof rejRes === "object" && rejRes !== null && "msBeforeNext" in rejRes
          ? (rejRes.msBeforeNext as number)
          : 900000; // 15 minutes default

      return new NextResponse(
        JSON.stringify({
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil(msBeforeNext / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "Retry-After": Math.ceil(msBeforeNext / 1000).toString(),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
