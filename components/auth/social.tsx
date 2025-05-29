"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (providers:"google" | "github") => {
    signIn(providers,{
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className=" grid grid-cols-2 items-center w-full gap-x-3">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-6 w-6" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-6 w-6" />
      </Button>
    </div>
  );
};
