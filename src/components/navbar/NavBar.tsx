import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logoWordmark from "@/../public/DMT_logo.webp";
import Image from "next/image";
import { NavBarItem } from "@/components/navbar/NavBarItem";
import Link from "next/link";
import SignInButton from "@/components/navbar/SignInButton";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { getSessionData } from "@/lib/utils";
import {
  Book,
  FileText,
  LayoutDashboard,
  PawPrint,
  SquareUserIcon,
  SwordsIcon,
} from "lucide-react";
import { CampaignSelect } from "@/components/navbar/CampaignSelect";

const menuItems = [
  {
    label: "Rencontres",
    to: "/encounters",
    icon: SwordsIcon,
    isPrivate: true,
  },
  {
    label: "Outils DM",
    to: "/dm-tools",
    icon: LayoutDashboard,
    isPrivate: true,
  },
  {
    label: "Créatures",
    to: "/creatures",
    icon: PawPrint,
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
    icon: Book,
    shouldBeLoggedIn: true,
  },
  {
    label: "Règles",
    to: "/rules",
    icon: FileText,
    shouldBeLoggedIn: true,
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
    <header className="mb-6 border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-[1497px] items-center justify-between gap-4">
        <Link href="/" aria-label="Accueil" className="flex shrink-0 items-center">
          <Image
            className="h-8 w-auto md:hidden"
            src={logoWordmark}
            alt="Dungeons & Dragons"
            height={32}
            priority
          />
          <Image
            className="hidden h-14 w-auto md:block"
            src={logoWordmark}
            alt="Dungeons & Dragons"
            height={56}
            priority
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-0.5">{getMenuItems()}</NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 md:flex">{getEndMenu()}</div>

        <NavigationMenu className="md:hidden">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 px-2">
                <Bars3Icon className="size-6" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-56 gap-1 p-3">
                  {getMenuItems()}
                  <hr className="my-1 border-border" />
                  <div className="flex flex-col items-start gap-2 px-1 pt-1">{getEndMenu()}</div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
