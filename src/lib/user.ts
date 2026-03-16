import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user
 * Redirects to login if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Get the current authenticated user or null
 * Does not redirect - use for optional auth
 */
export async function getCurrentUserOrNull() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

/**
 * Require authentication for a page
 * Returns user data or redirects to login
 */
export async function requireAuth() {
  return getCurrentUser();
}

/**
 * Check if user is authenticated
 * Returns boolean without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user?.email;
}
