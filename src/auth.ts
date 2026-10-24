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
          user.password as string
        );

        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          image: user.image,
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      
      if (isOnLogin || isOnRegister) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      return isLoggedIn; // Redirects to signIn page if false
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });
          if (existingUser) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                image: user.image || existingUser.image,
                name: user.name || existingUser.name,
              }
            });
          } else {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                image: user.image,
              }
            });
          }
        } catch (e) {
          console.error("Error saving google user:", e);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email as string }
          });
          if (dbUser) {
            token.sub = dbUser.id;
            token.gender = dbUser.gender;
            token.dateOfBirth = dbUser.dateOfBirth;
            if (dbUser.image) token.picture = dbUser.image;
          }
        } else {
          const u = user as any;
          token.gender = u.gender;
          token.dateOfBirth = u.dateOfBirth;
          if (user.image) token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).gender = token.gender;
        (session.user as any).dateOfBirth = token.dateOfBirth;
        if (token.picture) session.user.image = token.picture;
      if (!session.user.image) {
        const gender = (token as any).gender || "";
        const name = session.user.name || session.user.email || "";
        if (gender?.toLowerCase().includes("female") || gender?.toLowerCase().includes("girl")) session.user.image = "https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name) + "&backgroundColor=ffdfbf";
        else if (gender?.toLowerCase().includes("male") || gender?.toLowerCase().includes("boy")) session.user.image = "https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name) + "&backgroundColor=b6e3f4";
        else session.user.image = "https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name) + "&backgroundColor=c0aede";
      }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
