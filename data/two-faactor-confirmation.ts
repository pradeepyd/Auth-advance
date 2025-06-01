import { prisma } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async(userId : string) => {
    try{
        const getTwoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where:{
                userId
            }
        })
        return getTwoFactorConfirmation;
    }catch{
        return null
    }
}