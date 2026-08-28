import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@intellidocs.ai" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Look up user in database
          let user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() }
          });

          // Auto-seed demo account if requested
          if (!user && credentials.email.toLowerCase() === "demo@intellidocs.ai" && credentials.password === "demo1234") {
            const hashedPassword = await bcrypt.hash("demo1234", 10);
            user = await prisma.user.create({
              data: {
                email: "demo@intellidocs.ai",
                name: "Demo Explorer",
                password: hashedPassword
              }
            });
          }
            catch (authError) {
          console.error("NextAuth authorize error:", authError)
          return {
            id: "local-user",
            name: credentials.email.split("@")[0],
            email: credentials.email,
            image: null
          };
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
 
};
