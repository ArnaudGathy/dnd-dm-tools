import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, getSessionData } from "@/lib/utils";
import { ElementType } from "react";

export const NavBarItem = async ({
  to,
  label,
  shouldBeLoggedIn,
  isPrivate,
  icon: Icon,
}: {
  to: string;
  label: string;
  shouldBeLoggedIn?: boolean;
  isPrivate?: boolean;
  icon: ElementType;
}) => {
  const { isAdmin, isLoggedIn } = await getSessionData();

  if ((isPrivate && !isAdmin) || (shouldBeLoggedIn && !isLoggedIn)) {
    return null;
  }

  return (
    <NavigationMenuItem>
      <Link href={to} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            "flex items-center gap-2",
          )}
        >
          <Icon className="size-5 text-primary" />
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};
