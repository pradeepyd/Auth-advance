import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
// import { auth } from "@/auth"

const ServerPage = async() => {
    const user = await currentUser();
    // const session = await auth();
    return (
       <UserInfo user={user} label="Server component"/>
    )
}

export default ServerPage;