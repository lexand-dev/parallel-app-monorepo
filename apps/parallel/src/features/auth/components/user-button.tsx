"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader, LogOut } from "lucide-react";
import { useMutation, useQuery } from "@urql/next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-separator";

import { CURRENT_USER, LOGOUT_MUTATION } from "../graphql/mutations";

interface QueryResponse {
  current: {
    name: string;
    email: string;
  };
}

export const UserButton = () => {
  const router = useRouter();
  const [, logout] = useMutation(LOGOUT_MUTATION);
  const [{ data, fetching }] = useQuery<QueryResponse>({
    query: CURRENT_USER,
    requestPolicy: "cache-and-network"
  });

  const handleLogout = () => {
    logout().then(({ error }) => {
      if (error) {
        toast.error("Logout failed. Please try again.");
        return;
      }

      toast.success("Logged out successfully");
      router.refresh();
    });
  };

  if (fetching) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Avatar className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
          <Loader className="size-5 animate-spin text-neutral-500" />
        </Avatar>
      </div>
    );
  }

  const { name, email } = data?.current || {};

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email?.charAt(0).toUpperCase() ?? "U");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
