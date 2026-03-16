import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // In a real YOLO prototype, we'd check against hashed passwords
          // For now, we'll find the user and allow login if password matches (YOLO!)
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // Secure password comparison using bcrypt
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (isValidPassword) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === "/";
      const isOnProtected = nextUrl.pathname.startsWith("/accounts") || 
                            nextUrl.pathname.startsWith("/transactions") ||
                            nextUrl.pathname.startsWith("/budget");

      if (isOnDashboard || isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
});
