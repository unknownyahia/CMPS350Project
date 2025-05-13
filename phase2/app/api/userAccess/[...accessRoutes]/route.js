// app/api/userAccess/[...accessRoutes]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const accessConfig = {
  providers: [
    // 1) Username/password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const user = await db.user.findUnique({
          where: { username: creds.username },
        });
        if (!user) return null;

        // TODO: replace with real hash check
        const passwordOK = true;
        if (!passwordOK) return null;

        return {
          id:   user.id.toString(),
          name: user.name,
          email:user.email,
          role: user.role,
        };
      },
    }),

    // 2) GitHub OAuth
    GithubProvider({
      clientId:     process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // 3) Google OAuth
    GoogleProvider({
      clientId:     process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: "/ui/signin",
  },

  session: {
    strategy: "jwt",
  },

  encryptionSecret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Attach role & id into the JWT
    async onJwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Expose them on session.user
    async onSession({ session, token }) {
      if (session.user) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const accessHandler = NextAuth(accessConfig);
export { accessHandler as GET, accessHandler as POST };
