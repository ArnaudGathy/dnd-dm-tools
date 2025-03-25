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
import PartyLevelSelect from "@/components/navbar/PartyLevelSelect";
import PartySelect from "@/components/navbar/PartySelect";
import SignInButton from "@/components/navbar/SignInButton";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { getSessionData } from "@/lib/utils";
import {
  BookOpenIcon,
  PawPrintIcon,
  SquareUserIcon,
  SwordsIcon,
} from "lucide-react";

const menuItems = [
  {
    label: "Personnages",
    to: "/characters",
    icon: SwordsIcon,
    shouldBeLoggedIn: true,
  },
  {
    label: "Rencontres",
    to: "/encounters",
    icon: SquareUserIcon,
    isPrivate: true,
  },
  {
    label: "Créatures",
    to: "/creatures",
    icon: PawPrintIcon,
  },
  {
    label: "Sorts",
    to: "/spells",
    icon: BookOpenIcon,
  },
];

export const NavBar = async () => {
  const { isLoggedIn } = await getSessionData();

  const getEndMenu = () => {
    return (
      <>
        <PartySelect />
        {isLoggedIn && <PartyLevelSelect />}
        <SignInButton />
      </>
    );
  };

  const getMenuItems = () => {
    return menuItems.map((props) => <NavBarItem key={props.to} {...props} />);
  };

  return (
    <header className="py-2">
      <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 md:px-8">
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
