// THIS can be use in server component ,api routes  server actions and any server side
import { auth } from "@/auth"


export const currentUser = async() => {
    const session = await auth();
   return session?.user;
}

export const currentRole = async() => {
    const session = await auth();
   return session?.user.role;
}