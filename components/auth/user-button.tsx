"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { FaUser } from "react-icons/fa6";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { LogOutIcon } from "lucide-react";

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || undefined}/>
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <LogoutButton>
                   <DropdownMenuItem>
                    <LogOutIcon  className="h-4 w-4 mr-2" />
                    Logout
                    </DropdownMenuItem> 
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}