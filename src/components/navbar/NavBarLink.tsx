"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const NavBarLink = ({ to, label, icon }: { to: string; label: string; icon: ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link href={to} legacyBehavior passHref>
      <NavigationMenuLink
        active={isActive}
        className={cn(
          navigationMenuTriggerStyle(),
          "flex items-center gap-2",
          isActive && "bg-accent text-accent-foreground",
        )}
      >
        {icon}
        {label}
      </NavigationMenuLink>
    </Link>
  );
};
