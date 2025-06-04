"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const settings = async(values:z.infer<typeof SettingSchema>) => {
    const user = await currentUser();

    if(!user) {
        return {error :"Unauthorized"};
    }

    const dbUser = await getUserById(user.id);
    if(!dbUser) {
        return {error :"Unauthorized"};
    }

    if(user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.IsTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if(existingUser && existingUser.id !== user.id){
            return { error : "Email already in use!"}
        }
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email,verificationToken.token,);

        return {success : "Verification email sent"}
    }

    if(values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(values.password,dbUser.password);

        if(!passwordMatch) {
            return { error : "Incorrect password"};
        }

        const hashedPassword = await bcrypt.hash(values.newPassword,10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }
    
    await prisma.user.update({
        where:{id:user.id},
        data:{
            ...values,
        }
    })

    return { success :"Settings Updated"}
}