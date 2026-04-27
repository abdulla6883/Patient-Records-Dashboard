import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          gender: user.gender,
          dateOfBirth: user.dateOfBirth
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.gender = u.gender;
        token.dateOfBirth = u.dateOfBirth;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).gender = token.gender;
        (session.user as any).dateOfBirth = token.dateOfBirth;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: "some-secret-key-for-now",
});
