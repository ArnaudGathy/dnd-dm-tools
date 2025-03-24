import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, BugAntIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { auth } from "@/../auth";

export default async function Home() {
  const session = await auth();
  const isAuthorized = !!session;

  const cardClassName = "w-full flex-1 border-primary/25 md:max-w-[30%]";

  return (
    <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-8">
      {isAuthorized && (
        <Card className={cardClassName}>
          <CardHeader className="border-muted-background border-b">
            <CardTitle className="flex items-center gap-2">
              <HomeIcon className="size-6 text-primary" />
              Rencontres
            </CardTitle>
            <CardDescription>
              Liste des rencontres encodés dans l&apos;application
            </CardDescription>
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

      <Card className={cardClassName}>
        <CardHeader className="border-muted-background border-b">
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="size-6 text-primary" />
            Sorts
          </CardTitle>
          <CardDescription>
            Liste des sorts encodés dans l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-4">
          Parcourir la liste des sorts par niveau ou par personnage selon le
          groupe.
          {isAuthorized ? (
            <Link href="/spells" className="w-full">
              <Button className="w-full" size="sm">
                Tous les sorts
              </Button>
            </Link>
          ) : (
            <Link href="/spells?sortBy=player" className="w-full">
              <Button className="w-full" size="sm">
                Sorts par personnage
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className="border-muted-background border-b">
          <CardTitle className="flex items-center gap-2">
            <BugAntIcon className="size-6 text-primary" />
            Créatures
          </CardTitle>
          <CardDescription>
            Liste des créatures encodés dans l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-4">
          Parcourir la liste des créatures par nom ou par personnage selon le
          groupe.
          {isAuthorized ? (
            <Link href="/creatures" className="w-full">
              <Button className="w-full" size="sm">
                Toutes les créatures
              </Button>
            </Link>
          ) : (
            <Link href="/creatures?sortBy=player" className="w-full">
              <Button className="w-full" size="sm">
                Créatures par personnage
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
