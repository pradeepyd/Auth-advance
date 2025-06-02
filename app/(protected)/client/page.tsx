"use client"
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

// import { auth } from "@/auth"

const ServerPage = () => {
    const user = useCurrentUser();
    // const session = await auth();
    return (
       <UserInfo user={user} label="Client component"/>
    )
}

export default ServerPage;