import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { auth } from "@/../auth";
import { privateRoutes } from "@/constants/privateRoutes";

export const NavBarItem = async ({
  to,
  label,
}: {
  to: string;
  label: string;
}) => {
  const session = await auth();
  const isPrivateRoute = privateRoutes.includes(to);

  if (isPrivateRoute && !session) {
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
