
import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "./lib/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      // customField : string,
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  events:{
    async linkAccount({user}){
      await prisma.user.update({
        where : {id:user.id},
        data:{emailVerified:new Date()}
      })
    }
  },
  callbacks: {
    // async signIn({ user }) {
    //   if(!user.id) return false;
    //   const existingUser = await getUserById(user.id);
    //   if(!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }
    //   return true;
    // },

    async session({ token, session }) {
      console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // session.user.customField = "anything"
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async jwt({ token }) {
      // console.log({token});
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, //prisma don't work on edge so no db strategy
  ...authConfig,
});
