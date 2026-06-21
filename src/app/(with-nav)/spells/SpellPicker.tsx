"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/components/ui/Link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CLASS_MAP } from "@/constants/maps";
import { SPELLS_GROUP_BY } from "@/lib/api/spells";
import { Classes, SpellAction } from "@prisma/client";
import {
  CheckCheck,
  ListPlus,
  Loader2,
  MessageCircleMore,
  Sparkle,
  SquareMousePointer,
  X,
} from "lucide-react";
import { addSpellsToCharacter } from "@/lib/actions/spells";
import { toast } from "sonner";

const ACTION_TAG: Partial<Record<SpellAction, { label: string; className: string }>> = {
  [SpellAction.BONUS_ACTION]: {
    label: "Bonus",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  [SpellAction.REACTION]: {
    label: "Réaction",
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
};

export type SpellRowData = {
  id: string;
  name: string;
  level: number;
  isRitual: boolean;
  concentration: boolean;
  actionType: SpellAction | null;
};

export type PickerCharacter = {
  id: number;
  name: string;
  className: Classes;
};

// One spell row, shared by both modes. Outside selection mode it's a link to the
// spell page; in selection mode it toggles the spell's selection.
function SpellItem({
  spell,
  selectionMode,
  selected,
  onToggle,
}: {
  spell: SpellRowData;
  selectionMode: boolean;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const actionTag = spell.actionType ? ACTION_TAG[spell.actionType] : undefined;
  const icons = [
    spell.concentration
      ? { Icon: MessageCircleMore, className: "text-yellow-500", title: "Concentration" }
      : undefined,
    spell.isRitual ? { Icon: Sparkle, className: "text-emerald-500", title: "Rituel" } : undefined,
  ].filter((icon) => icon !== undefined);

  const innerContent = (
    <>
      {selectionMode && (
        <Checkbox checked={selected} className="pointer-events-none shrink-0" tabIndex={-1} />
      )}
      <span className="min-w-[1.75rem] shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-xs text-muted-foreground transition-colors group-hover:bg-background group-hover:text-foreground">
        {spell.level}
      </span>
      <span
        className={cn(
          "flex-1 truncate text-muted-foreground transition-colors group-hover:text-foreground",
          selected && "text-foreground",
        )}
      >
        {spell.name}
      </span>
      {icons.map(({ Icon, className, title }) => (
        <span key={title} title={title} className="flex shrink-0">
          <Icon className={cn("size-4", className)} />
        </span>
      ))}
      {actionTag && (
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
            actionTag.className,
          )}
        >
          {actionTag.label}
        </span>
      )}
    </>
  );

  return (
    <li className="break-inside-avoid">
      {selectionMode ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(spell.id)}
          className={cn(
            "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
            selected && "bg-muted",
          )}
        >
          {innerContent}
        </button>
      ) : (
        <Link
          href={`/spells/${spell.id}`}
          className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline transition-colors hover:bg-muted"
        >
          {innerContent}
        </Link>
      )}
    </li>
  );
}

export default function SpellPicker({
  groups,
  groupBy,
  isGrouped,
  characters,
}: {
  groups: [string, SpellRowData[]][];
  groupBy: SPELLS_GROUP_BY;
  isGrouped: boolean;
  characters: PickerCharacter[];
}) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [characterId, setCharacterId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const canPick = characters.length > 0;
  const visibleIds = useMemo(
    () => groups.flatMap(([, spells]) => spells.map((spell) => spell.id)),
    [groups],
  );
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggle = (id: string) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });

  const exitSelection = () => {
    setSelectionMode(false);
    setSelected(new Set());
  };

  const handleAdd = () => {
    const targetId = Number(characterId);
    const spellIds = [...selected];
    if (!targetId || spellIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await addSpellsToCharacter({ characterId: targetId, spellIds });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      const { added, alreadyPresent, autoListed, characterName } = result;
      const segments = [`${added} sort${added > 1 ? "s" : ""} ajouté${added > 1 ? "s" : ""}`];
      if (alreadyPresent > 0) {
        segments.push(`${alreadyPresent} déjà présent${alreadyPresent > 1 ? "s" : ""}`);
      }
      if (autoListed > 0) {
        segments.push(`${autoListed} déjà dans la liste de classe`);
      }
      toast.success(`${characterName} — ${segments.join(" · ")}`);
      setSelected(new Set());
    });
  };

  const renderList = () => {
    if (groups.length === 0) {
      return <div className="text-muted-foreground">Aucun sort à afficher.</div>;
    }

    if (!isGrouped) {
      return (
        <Card>
          <CardContent className="px-2 pb-2 pt-6">
            <ul className="sm:columns-2 lg:columns-3 [column-gap:0.5rem] 2xl:columns-4">
              {groups[0][1].map((spell) => (
                <SpellItem
                  key={spell.id}
                  spell={spell}
                  selectionMode={selectionMode}
                  selected={selected.has(spell.id)}
                  onToggle={toggle}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem] 2xl:columns-4">
        {groups.map(([groupingValue, values]) => (
          <Card key={groupingValue} className="mb-4 break-inside-avoid">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">
                {groupBy === SPELLS_GROUP_BY.LEVEL
                  ? `Niveau ${groupingValue}`
                  : groupingValue.toUpperCase()}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 font-normal tabular-nums">
                {values.length}
              </Badge>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <ul className="flex flex-col">
                {values.map((spell) => (
                  <SpellItem
                    key={spell.id}
                    spell={spell}
                    selectionMode={selectionMode}
                    selected={selected.has(spell.id)}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-4", selectionMode && "pb-24")}>
      {canPick && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {selectionMode
              ? "Sélectionnez des sorts, puis choisissez un personnage pour les ajouter."
              : null}
          </p>
          {selectionMode ? (
            <Button variant="ghost" size="sm" onClick={exitSelection}>
              <X className="size-4" /> Annuler
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)}>
              <SquareMousePointer className="size-4" /> Sélectionner des sorts
            </Button>
          )}
        </div>
      )}

      {renderList()}

      {selectionMode && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-2 px-4 py-3">
            <Badge variant="secondary" className="tabular-nums">
              {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleAllVisible}>
              <CheckCheck className="size-4" />
              {allVisibleSelected ? "Tout désélectionner" : "Tout sélectionner"}
            </Button>
            {selected.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setSelected(new Set())}
              >
                <X className="size-4" /> Effacer
              </Button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <Select value={characterId} onValueChange={setCharacterId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choisir un personnage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {characters.map((character) => (
                      <SelectItem key={character.id} value={String(character.id)}>
                        {character.name} · {CLASS_MAP[character.className]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAdd}
                disabled={!characterId || selected.size === 0 || isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ListPlus className="size-4" />
                )}
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
