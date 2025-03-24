import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getSessionData } from "@/lib/utils";

export const NavBarItem = async ({
  to,
  label,
  shouldBeLoggedIn,
  isPrivate,
}: {
  to: string;
  label: string;
  shouldBeLoggedIn?: boolean;
  isPrivate?: boolean;
}) => {
  const { isAdmin, isLoggedIn } = await getSessionData();

  if ((isPrivate && !isAdmin) || (shouldBeLoggedIn && !isLoggedIn)) {
    return null;
  }

  return (
    <NavigationMenuItem>
      <Link href={to} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};
