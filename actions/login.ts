"use server";

import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { prisma } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-faactor-confirmation";

export const login = async(values:z.infer<typeof LoginSchema>,
    callbackUrl?:string | null,
) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid fields!"};
    }
    
    const { email , password, code} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return { error: "Email doesnot exist"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email,verificationToken.token);
        return {success :"Confirmation email sent!"};
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken){
                return {error :"Invalid code!"}
            }

            if(twoFactorToken.token !== code){
                return {error :"Invalid code!"};
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if(hasExpired){
                return {error : "Code Expired!"};
            }

            await prisma.twoFactorToken.delete({
                where:{
                    id:twoFactorToken.id,
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await prisma.twoFactorConfirmation.delete({
                    where:{
                        id:existingConfirmation.id
                    }
                })
            }

            await prisma.twoFactorConfirmation.create({
                data:{
                    userId:existingUser.id,
                }
            });

        } else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token);

            return {twoFactor : true }
        }
        
    }

    try{
        await signIn('credentials',{
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
        return {success:"email sent"}
    }catch(error) {
        if(error instanceof AuthError) {
            switch (error.type){
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong 234"}    
            }
        }
        throw error;
    }
};