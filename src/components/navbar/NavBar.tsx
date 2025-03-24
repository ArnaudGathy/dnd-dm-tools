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

const menuItems = [
  { label: "Personnages", to: "/characters", shouldBeLoggedIn: true },
  {
    label: "Rencontres",
    to: "/encounters",
    isPrivate: true,
  },
  {
    label: "Créatures",
    to: "/creatures",
  },
  {
    label: "Sorts",
    to: "/spells",
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
                    {menuItems.map(
                      ({ to, label, shouldBeLoggedIn, isPrivate }) => (
                        <NavBarItem
                          key={to}
                          to={to}
                          label={label}
                          shouldBeLoggedIn={shouldBeLoggedIn}
                          isPrivate={isPrivate}
                        />
                      ),
                    )}
                    <hr className="border-muted-foreground" />
                    {getEndMenu()}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className="hidden md:flex">
              {menuItems.map(({ to, label, shouldBeLoggedIn, isPrivate }) => (
                <NavBarItem
                  key={to}
                  to={to}
                  label={label}
                  shouldBeLoggedIn={shouldBeLoggedIn}
                  isPrivate={isPrivate}
                />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-4 md:flex"> {getEndMenu()}</div>
      </div>
    </header>
  );
};
