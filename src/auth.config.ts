import type { NextAuthConfig } from "next-auth";
import type {} from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "USER" | "ADMIN";
      status: "PENDING" | "APPROVED" | "REJECTED";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
  }
}

// Edge-safe config (no Prisma/bcrypt imports) shared by middleware and the full auth config.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "ADMIN";
      const path = nextUrl.pathname;
      if (path.startsWith("/admin")) return isAdmin;
      if (path.startsWith("/profile")) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: "USER" | "ADMIN" }).role;
        token.status = (user as { status: "PENDING" | "APPROVED" | "REJECTED" }).status;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.status = token.status;
      return session;
    },
  },
} satisfies NextAuthConfig;
