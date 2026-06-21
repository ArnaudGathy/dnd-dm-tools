"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { UserRound } from "lucide-react";

export const AccountMenu = ({
  userMail,
  userName,
  signOutAction,
}: {
  userMail?: string | null;
  userName?: string | null;
  signOutAction: () => Promise<void>;
}) => {
  const initial = (userName ?? userMail ?? "?").trim().charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Compte"
          className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {initial !== "?" ? initial : <UserRound className="size-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          {userName && <span className="text-sm font-medium leading-none">{userName}</span>}
          {userMail && (
            <span className="text-xs font-normal text-muted-foreground">{userMail}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full cursor-pointer">
              <ArrowLeftStartOnRectangleIcon className="size-4" />
              Déconnexion
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
