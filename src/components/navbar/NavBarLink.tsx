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
          "h-9 w-full justify-start gap-2 bg-transparent px-3 text-muted-foreground md:w-max md:justify-center",
          "hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-[active]:bg-transparent",
          isActive &&
            "text-foreground underline decoration-primary decoration-2 underline-offset-[6px]",
        )}
      >
        {icon}
        {label}
      </NavigationMenuLink>
    </Link>
  );
};
