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

  return (
    <div className="flex justify-center gap-8">
      {isAuthorized && (
        <Card className="max-w-[30%] flex-1 border-primary/25">
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

      <Card className="max-w-[30%] flex-1 border-primary/25">
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
          <Link href="/spells" className="w-full">
            <Button className="w-full" size="sm">
              Tous les sorts
            </Button>
          </Link>
          <Link href="/spells?sortBy=player" className="w-full">
            <Button className="w-full" variant="secondary" size="sm">
              Sorts par personnage
            </Button>
          </Link>
        </CardContent>
      </Card>

      {isAuthorized && (
        <Card className="max-w-[30%] flex-1 border-primary/25">
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
            <Link href="/creatures" className="w-full">
              <Button className="w-full" size="sm">
                Toutes les créatures
              </Button>
            </Link>
            <Link href="/creatures?sortBy=player" className="w-full">
              <Button className="w-full" variant="secondary" size="sm">
                Créatures par personnage
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
