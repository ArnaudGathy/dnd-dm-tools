import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import logo from "@/../public/DMT_logo.webp";
import Image from "next/image";
import { NavBarItem } from "@/components/navbar/NavBarItem";
import Link from "next/link";
import PartyLevelSelect from "@/components/navbar/PartyLevelSelect";
import PartySelect from "@/components/navbar/PartySelect";

export const NavBar = () => {
  return (
    <header className="py-2">
      <div className="mx-auto flex max-w-[1485px] items-center justify-between px-8">
        <div className="flex">
          <Link href="/">
            <Image
              className="mr-4"
              src={logo}
              alt="Dungeon Master Tools Logo"
              width="64"
              crossOrigin="anonymous"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavBarItem to="/encounters" label="Rencontres" />
              <NavBarItem to="/creatures" label="Créatures" />
              <NavBarItem to="/spells" label="Sorts" />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2">
          <PartySelect />
          <PartyLevelSelect />
        </div>
      </div>
    </header>
  );
};
