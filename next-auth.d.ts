import { UserRole } from "./lib/generated/prisma";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      // customField : string,
      id: string;
      role: UserRole;
      isTwoFactorEnabled:boolean;
      isOAuth : boolean;
    } & DefaultSession["user"];
  }
}