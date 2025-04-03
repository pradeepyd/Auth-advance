
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  weight:["600"],
  subsets:["latin"]
})

export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center min-h-screen bg-radial from-sky-400 to-blue-800 '>
      <div className='space-y-6 text-center'>
            <h1 className={cn("font-semibold text-6xl drop-shadow-md text-white",font.className,)}>🔐Auth</h1>
            <p className="text-white text-lg">A simple authenication service</p>
            <div>
              <LoginButton>
                <Button variant={'secondary'} size={'lg'} className="text-lg">Sign in</Button>
              </LoginButton>
            </div>
      </div>
    </main>
  );
}
