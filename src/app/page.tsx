import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSessionData } from "@/lib/utils";
import {
  BookOpenIcon,
  PawPrintIcon,
  SquareUserIcon,
  SwordsIcon,
} from "lucide-react";

export default async function Home() {
  const { isAdmin, isLoggedIn } = await getSessionData();
  const cardClassName = "w-full flex-1 md:min-w-[31%] md:max-w-[31%]";

  return (
    <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row md:gap-8">
      {isAdmin && (
        <Card className={cardClassName}>
          <CardHeader className="border-muted-background border-b">
            <CardTitle className="flex items-center gap-2">
              <SwordsIcon className="size-6 text-primary" />
              Rencontres
            </CardTitle>
            <CardDescription>Liste des rencontres</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-4">
            Parcourir la liste des rencontres classés par campagnes.
            <Link href="/encounters" className="w-full">
              <Button className="w-full" size="sm">
                Toutes les rencontres
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card className={cardClassName}>
          <CardHeader className="border-muted-background border-b">
            <CardTitle className="flex items-center gap-2">
              <PawPrintIcon className="size-6 text-primary" />
              Créatures
            </CardTitle>
            <CardDescription>Liste des créatures</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-4">
            Parcourir la liste des créatures par nom ou par personnage selon le
            groupe.
            <Link href="/creatures" className="w-full">
              <Button className="w-full" size="sm">
                Toutes les créatures
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {isLoggedIn && (
        <Card className={cardClassName}>
          <CardHeader className="border-muted-background border-b">
            <CardTitle className="flex items-center gap-2">
              <SquareUserIcon className="size-6 text-primary" />
              Personnages
            </CardTitle>
            <CardDescription>Liste des personnages</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-4">
            Parcourir la liste des personnages et visualiser les stats et sorts.
            {isAdmin ? (
              <Link href="/characters" className="w-full">
                <Button className="w-full" size="sm">
                  Tous les personnages
                </Button>
              </Link>
            ) : (
              <Link href="/characters" className="w-full">
                <Button className="w-full" size="sm">
                  Mes personnages
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <Card className={cardClassName}>
        <CardHeader className="border-muted-background border-b">
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="size-6 text-primary" />
            Sorts
          </CardTitle>
          <CardDescription>Liste des sorts</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-4">
          Parcourir et rechercher dans la liste des sorts encodés dans
          l&apos;app.
          <Link href="/spells" className="w-full">
            <Button className="w-full" size="sm">
              Tous les sorts
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
