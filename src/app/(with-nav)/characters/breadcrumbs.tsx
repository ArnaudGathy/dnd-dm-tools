import { Home } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getValidCharacter } from "@/lib/utils";

export const CharacterBreadcrumbs = async ({ id }: { id: string }) => {
  const character = await getValidCharacter(id);

  const crumbs = [
    { name: <Home className="size-4" />, path: "" },
    { name: "Personnages", path: "/characters" },
    { name: character.name, path: `/${character.id}` },
    [
      { name: "Sorts", path: `/spells` },
      { name: "Édition", path: "/update" },
      { name: "Creatures", path: "/creatures" },
    ],
  ];

  return <Breadcrumbs crumbs={crumbs} />;
};
