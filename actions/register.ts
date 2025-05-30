"use server";

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import * as z from "zod"
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async(values:z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid fields!"};
    }

    const {email,password,name} = validatedFields.data;
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password,salt);

    const existingUser = await getUserByEmail(email);

    if (existingUser){
        return {error:"Email already in use!"};
    }
    await prisma.user.create({
        data:{
            name,
            email,
            password:hassedPassword,
        },
    });
    
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );
    return { success : "Confirmation email sent"};
};