"use client";

import { CharacterById, cn } from "@/lib/utils";
import AddMagicItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddMagicItem";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Sparkle, Sparkles, Zap } from "lucide-react";
import { MAGIC_ITEM_RARITY_COLOR_MAP, MAGIC_ITEM_RARITY_MAP } from "@/constants/maps";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import PopoverComponent from "@/components/ui/PopoverComponent";
import StatBreakdown, {
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import { weaponChipClassName } from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/WeaponCard";

const MAX_ATTUNED_ITEMS = 3;

export default function MagicItems({ character }: { character: CharacterById }) {
  const hasMagicItems = character.magicItems.length > 0;
  const attunedItems = character.magicItems.filter((item) => item.isAttuned);
  const numberOfAttunedItems = attunedItems.length;
  const hasTooManyAttunedItems = numberOfAttunedItems > MAX_ATTUNED_ITEMS;

  return (
    <SectionPanel
      accent="sky"
      icon={Sparkles}
      title="Objets Magiques"
      contentClassName="gap-2"
      action={
        <div className="flex items-center gap-1.5">
          {numberOfAttunedItems > 0 && (
            <PopoverComponent
              className={cn(
                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums",
                hasTooManyAttunedItems ? "bg-red-500/15 text-red-400" : "text-sky-400",
              )}
              contentClassName={breakdownContentClassName}
              definition={
                <StatBreakdown
                  accent={hasTooManyAttunedItems ? "red" : "sky"}
                  icon={Sparkle}
                  title="Harmonisation"
                  rows={attunedItems.map((item) => ({ label: item.name, value: "✦" }))}
                  total={`${numberOfAttunedItems}/${MAX_ATTUNED_ITEMS}`}
                  totalLabel="Harmonisés"
                  note={`Un personnage ne peut être harmonisé qu'avec ${MAX_ATTUNED_ITEMS} objets magiques à la fois.`}
                />
              }
            >
              {Array.from({ length: MAX_ATTUNED_ITEMS }, (_, index) => (
                <Sparkle
                  key={index}
                  className={cn(
                    "size-3 fill-current",
                    index >= numberOfAttunedItems && "opacity-25",
                  )}
                />
              ))}
              {numberOfAttunedItems}/{MAX_ATTUNED_ITEMS}
            </PopoverComponent>
          )}
          <AddMagicItem characterId={character.id} title="Ajouter un objet magique">
            <Button size="icon">
              <Plus />
            </Button>
          </AddMagicItem>
        </div>
      }
    >
      {hasTooManyAttunedItems && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-2.5 text-sm leading-snug">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <span>
            <span className="font-bold text-red-400">Trop d&apos;objets harmonisés.</span> Il y en a{" "}
            {numberOfAttunedItems} sur un maximum de {MAX_ATTUNED_ITEMS}.
          </span>
        </div>
      )}

      {!hasMagicItems && (
        <span className="p-2 text-center text-sm text-muted-foreground">Aucun objet magique</span>
      )}

      {character.magicItems.map((magicItem) => (
        <AddMagicItem
          key={magicItem.id}
          characterId={character.id}
          campaignId={character.campaignId}
          item={magicItem}
          title="Modifier un objet magique"
        >
          <div className="flex cursor-pointer flex-col gap-2 rounded-lg bg-muted p-3 text-left transition-colors hover:bg-white/10">
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "text-base font-bold leading-tight",
                  MAGIC_ITEM_RARITY_COLOR_MAP[magicItem.rarity],
                )}
              >
                {magicItem.name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded border border-current px-1.5 py-0.5 text-tiny font-semibold uppercase tracking-wide opacity-80",
                  MAGIC_ITEM_RARITY_COLOR_MAP[magicItem.rarity],
                )}
              >
                {MAGIC_ITEM_RARITY_MAP[magicItem.rarity]}
              </span>
            </div>

            {(magicItem.isAttuned || magicItem.charges) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {magicItem.isAttuned && (
                  <span className={weaponChipClassName}>
                    <Sparkle className="size-3.5 fill-current text-sky-400" />
                    <span className="text-sky-400">Harmonisé</span>
                  </span>
                )}
                {magicItem.charges && (
                  <span className={weaponChipClassName}>
                    <Zap className="size-3.5 text-indigo-400" />
                    <span className="text-indigo-400">{magicItem.charges}</span>
                  </span>
                )}
              </div>
            )}

            {magicItem.description && (
              <span className="text-sm leading-snug text-muted-foreground">
                {magicItem.description}
              </span>
            )}
          </div>
        </AddMagicItem>
      ))}
    </SectionPanel>
  );
}
