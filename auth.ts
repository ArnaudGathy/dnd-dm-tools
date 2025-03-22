import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    error: "/unauthorized",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async signIn({ profile }) {
      return profile?.email === "arno.firefox@gmail.com";
    },
  },
});
