
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "./lib/generated/prisma";
import { getTwoFactorConfirmationByUserId } from "./data/two-faactor-confirmation";
import { getAccountByUserId } from "./data/account";


export const { handlers, signIn, signOut, auth } = NextAuth({
  pages:{
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events:{
    async linkAccount({user}){
      await prisma.user.update({
        where : {id:user.id},
        data:{emailVerified:new Date()}
      })
    }
  },
  callbacks: {
    async signIn({ user , account }) {
      //allow OAuth without email verification
      if(account?.provider !== "credentials") return true;

      if(!user.id) return false;
      const existingUser = await getUserById(user.id);
      //prevent signin without email verification
      if(!existingUser || !existingUser.emailVerified) {
        return false;
      }

      //TODO :Add 2FA check
      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if(!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where:{
            id:twoFactorConfirmation.id
          }
        });
      }
      return true;
    },

    async session({ token, session }) {
      // console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // session.user.customField = "anything"
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnable as boolean;
        session.user.name = token.name;
        session.user.isOAuth = token.isOAuth as boolean;
    
      }
      if(session.user && token.email){
        session.user.email = token.email;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.email = existingUser.email;
      token.name = existingUser.name;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, //prisma don't work on edge so no db strategy
  ...authConfig,
});
