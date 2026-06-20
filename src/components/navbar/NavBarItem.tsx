import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { getSessionData } from "@/lib/utils";
import { ElementType } from "react";
import { NavBarLink } from "@/components/navbar/NavBarLink";

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
      <NavBarLink to={to} label={label} icon={<Icon className="size-5 text-primary" />} />
    </NavigationMenuItem>
  );
};
