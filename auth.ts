import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authorizedUsers = [
  // Admin
  "arno.firefox@gmail.com",
  // Mifa
  "antcoe1993@gmail.com",
  "arcady.picardi@gmail.com",
  "logan.bourez@gmail.com",
  "lo.desmet91@gmail.com",
  "mathias.merdjan@gmail.com",
  // Phancreux
  "kraft.alfred4@gmail.com",
  "lara.bluekami@gmail.com",
  "maximevanvelsen@gmail.com",
  // Anthony
  "fernandezgarciamagaly@gmail.com",
  "arnaud.gathy@gmail.com",
];

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
      return !!profile?.email && authorizedUsers.includes(profile.email);
    },
  },
});
