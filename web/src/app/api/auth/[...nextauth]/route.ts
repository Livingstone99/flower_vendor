import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/lib/api/admin";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authApi.login(credentials.email, credentials.password);
          
          // Decode JWT token to get the role from backend
          // JWT format: header.payload.signature
          // We only need the payload (middle part)
          let role = "admin"; // default fallback
          try {
            const tokenParts = response.access_token.split(".");
            if (tokenParts.length === 3) {
              // Decode base64url encoded payload
              // base64url uses - and _ instead of + and /
              let base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
              // Add padding if needed
              while (base64.length % 4) {
                base64 += "=";
              }
              const payload = JSON.parse(
                Buffer.from(base64, "base64").toString("utf-8")
              );
              role = payload.role || "admin";
              console.log("Decoded role from JWT:", role);
            }
          } catch (decodeError) {
            console.warn("Failed to decode JWT token, using default role:", decodeError);
          }
          
          return {
            id: "admin",
            email: credentials.email,
            accessToken: response.access_token,
            role: role,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev_change_me",
  debug: process.env.NODE_ENV === "development",
};

const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export const { GET, POST } = handlers;

