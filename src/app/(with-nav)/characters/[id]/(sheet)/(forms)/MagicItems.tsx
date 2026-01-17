"use client";

import SheetCard from "@/components/ui/SheetCard";
import { CharacterById, cn } from "@/lib/utils";
import AddMagicItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddMagicItem";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Sparkle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MAGIC_ITEM_DICE_MAP, MAGIC_ITEM_RARITY_COLOR_MAP } from "@/constants/maps";
import { Progress } from "@/components/ui/progress";

export default function MagicItems({ character }: { character: CharacterById }) {
  const hasMagicItems = character.magicItems.length > 0;
  const numberOfAttunedItems = character.magicItems.filter((item) => item.isAttuned).length;
  const hasAtLeastOneAttunedItem = numberOfAttunedItems >= 1;
  const hasTooManyAttunedItems = numberOfAttunedItems > 3;

  return (
    <>
      <SheetCard className={cn("relative flex flex-col gap-4")}>
        <AddMagicItem
          character={character}
          className="absolute right-4"
          title="Ajouter un objet magique"
        >
          <Button size="sm">
            <Plus />
          </Button>
        </AddMagicItem>
        <span className="mb-2 flex self-center text-2xl font-bold">Objets Magiques</span>
        {hasTooManyAttunedItems && (
          <Alert className="bg-red-900">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle>Trop d&apos;objets magique harmonisés</AlertTitle>
            <AlertDescription>
              Il y en a {numberOfAttunedItems} sur un maximum de 3
            </AlertDescription>
          </Alert>
        )}
        <ul className="flex flex-col">
          {!hasMagicItems && (
            <li className="flex self-center p-2 leading-none">
              <span className="text-sm text-muted-foreground">Aucun objet magique</span>
            </li>
          )}
          {hasMagicItems &&
            character.magicItems.map((magicItem) => (
              <AddMagicItem
                key={magicItem.id}
                character={character}
                item={magicItem}
                title="Modifier un objet magique"
              >
                <li className="flex cursor-pointer p-2 leading-none hover:bg-white/5">
                  <div className="space-x-2">
                    <span
                      className={cn("leading-5", MAGIC_ITEM_RARITY_COLOR_MAP[magicItem.rarity])}
                    >{`${magicItem.name}`}</span>
                    {magicItem.isAttuned && (
                      <span className="inline-block">
                        <Sparkle className="size-3 text-sky-400" />
                      </span>
                    )}
                    {magicItem.charges && (
                      <span className="text-sm text-indigo-400">{magicItem.charges} charges</span>
                    )}
                    {magicItem.dice !== null && (
                      <span className="text-sm text-amber-400">
                        {`1${MAGIC_ITEM_DICE_MAP[magicItem.dice]}`}
                      </span>
                    )}

                    {magicItem.description && (
                      <span className="mt-1 block text-sm leading-4 text-muted-foreground">
                        {magicItem.description}
                      </span>
                    )}
                  </div>
                </li>
              </AddMagicItem>
            ))}
        </ul>
        {hasMagicItems && hasAtLeastOneAttunedItem && (
          <div className="flex w-full flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Harmonisation</span>
            <div className="relative my-2 flex w-2/3 items-center gap-2">
              <Progress value={numberOfAttunedItems >= 1 ? 100 : 0} className="bg-stone-700" />
              <Progress value={numberOfAttunedItems >= 2 ? 100 : 0} className="bg-stone-700" />
              <Progress value={numberOfAttunedItems >= 3 ? 100 : 0} className="bg-stone-700" />
              <span className="absolute left-1/2 mt-0.5 -translate-x-1/2 text-base">
                {numberOfAttunedItems}/3
              </span>
            </div>
          </div>
        )}
      </SheetCard>
    </>
  );
}
