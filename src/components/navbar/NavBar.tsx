import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from "@/../public/DMT_logo.webp";
import Image from "next/image";
import { NavBarItem } from "@/components/navbar/NavBarItem";
import Link from "next/link";
import SignInButton from "@/components/navbar/SignInButton";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { getSessionData } from "@/lib/utils";
import { BookOpenIcon, SquareUserIcon, SwordsIcon } from "lucide-react";
import { CampaignSelect } from "@/components/navbar/CampaignSelect";

const menuItems = [
  {
    label: "Rencontres",
    to: "/encounters",
    icon: SwordsIcon,
    isPrivate: true,
  },
  {
    label: "Personnages",
    to: "/characters",
    icon: SquareUserIcon,
    shouldBeLoggedIn: true,
  },
  {
    label: "Sorts",
    to: "/spells",
    icon: BookOpenIcon,
  },
];

export const NavBar = async () => {
  const { isAdmin } = await getSessionData();

  const getEndMenu = () => {
    return (
      <>
        {isAdmin && <CampaignSelect />}
        <SignInButton />
      </>
    );
  };

  const getMenuItems = () => {
    return menuItems.map((props) => <NavBarItem key={props.to} {...props} />);
  };

  return (
    <header className="py-2">
      <div className="mx-auto flex max-w-[1497px] items-center justify-between px-4 md:px-8">
        <div className="flex w-full justify-between gap-4 md:justify-start">
          <Link href="/" className="w-16">
            <Image
              className="mr-4"
              src={logo}
              alt="Dungeon Master Tools Logo"
              width="64"
              crossOrigin="anonymous"
              priority
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="flex md:hidden">
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Bars3Icon className="size-6" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4">
                    {getMenuItems()}
                    <hr className="border-muted-foreground" />
                    {getEndMenu()}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="hidden md:flex">
              {getMenuItems()}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-4 md:flex"> {getEndMenu()}</div>
      </div>
    </header>
  );
};
