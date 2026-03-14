import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Apple,
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple email/password — accepts any valid email with 4+ char password
        // In production, connect this to a real database
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (email && password && password.length >= 4) {
          return {
            id: email,
            email,
            name: email.split("@")[0],
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = request.nextUrl.pathname.startsWith("/chat");
      if (isOnChat) return isLoggedIn;
      return true;
    },
  },
});
