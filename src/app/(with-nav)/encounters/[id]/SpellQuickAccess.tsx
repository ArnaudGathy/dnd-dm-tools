"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpenIcon, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { APISpell } from "@/types/schemas";
import { CombatSpell, getCharacterUsableSpells, getSpellDetailsAction } from "@/lib/actions/spells";
import SpellQuickView from "@/components/spells/SpellQuickView";
import { normalizeForSearch } from "@/utils/utils";
import { ACTION_TAGS, FACT_ICONS } from "@/app/(with-nav)/characters/[id]/spells/spellStatus";

const getLevelLabel = (level: number) => (level === 0 ? "Sorts mineurs" : `Niveau ${level}`);

const SpellRow = ({
  spell,
  isHighlighted,
  onSelect,
}: {
  spell: CombatSpell;
  isHighlighted: boolean;
  onSelect: () => void;
}) => {
  const actionTag = spell.actionType ? ACTION_TAGS[spell.actionType] : undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
        isHighlighted && "bg-muted",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{spell.name}</span>
        {spell.isFree && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-emerald-500"
            title="Toujours disponible"
          />
        )}
      </span>

      <span className="flex shrink-0 items-center gap-1.5">
        {spell.concentration && (
          <FACT_ICONS.concentration.Icon
            className={cn("size-3.5", FACT_ICONS.concentration.className)}
          />
        )}
        {spell.isRitual && (
          <FACT_ICONS.ritual.Icon className={cn("size-3.5", FACT_ICONS.ritual.className)} />
        )}
        {actionTag && (
          <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", actionTag.className)}>
            {actionTag.label}
          </span>
        )}
      </span>
    </button>
  );
};

export const SpellQuickAccess = ({
  characterId,
  characterName,
}: {
  characterId: number;
  characterName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [spells, setSpells] = useState<CombatSpell[] | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [search, setSearch] = useState("");
  const [openedSpell, setOpenedSpell] = useState<CombatSpell | null>(null);
  const [details, setDetails] = useState<APISpell | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Details are re-read all fight long (a caster recasts the same spells) — keep every payload
  // already fetched so reopening one is instant, even though the server side is cached too.
  const detailsCache = useRef(new Map<string, APISpell>());

  // The list only changes when the player edits their sheet, so fetch it once per mount, on
  // the first open — most participants never get their book opened at all.
  useEffect(() => {
    if (!isOpen || spells || isLoadingList) {
      return;
    }
    setIsLoadingList(true);
    getCharacterUsableSpells({ characterId })
      .then(setSpells)
      .catch(() => setError("Impossible de charger les sorts."))
      .finally(() => setIsLoadingList(false));
  }, [isOpen, spells, isLoadingList, characterId]);

  const filteredSpells = useMemo(() => {
    const term = normalizeForSearch(search.trim());
    const matching = term
      ? (spells ?? []).filter((spell) => normalizeForSearch(spell.name).includes(term))
      : (spells ?? []);
    return matching.toSorted((a, b) => a.level - b.level || a.name.localeCompare(b.name, "fr"));
  }, [spells, search]);

  const openSpell = async (spell: CombatSpell) => {
    setOpenedSpell(spell);
    setError(null);

    const cached = detailsCache.current.get(spell.id);
    if (cached) {
      setDetails(cached);
      return;
    }

    setDetails(null);
    setIsLoadingDetails(true);
    const result = await getSpellDetailsAction({ spellId: spell.id });
    setIsLoadingDetails(false);

    if (!result) {
      setError("Impossible de charger ce sort.");
      return;
    }
    detailsCache.current.set(spell.id, result);
    setDetails(result);
  };

  const backToList = () => {
    setOpenedSpell(null);
    setDetails(null);
    setError(null);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        if (!nextOpen) {
          backToList();
          setSearch("");
        }
      }}
    >
      <PopoverTrigger
        aria-label={`Sorts de ${characterName}`}
        title={`Sorts de ${characterName}`}
        className="flex size-7 items-center justify-center rounded-md text-sky-400 transition-colors hover:bg-sky-500/10"
      >
        <BookOpenIcon className="size-5" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="flex max-h-[75vh] w-[min(92vw,36rem)] flex-col gap-3 p-0"
      >
        <header className="flex items-center justify-between gap-2 border-l-4 border-l-sky-500 bg-sky-500/[0.07] px-3 py-2">
          {openedSpell ? (
            <button
              type="button"
              onClick={backToList}
              className="flex min-w-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-foreground/80 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 shrink-0" />
              <span className="truncate">{`Sorts · ${characterName}`}</span>
            </button>
          ) : (
            <span className="flex min-w-0 items-center gap-2">
              <BookOpenIcon className="size-3.5 shrink-0 text-sky-400" />
              <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
                {`Sorts · ${characterName}`}
              </span>
            </span>
          )}

          <Link
            href={openedSpell ? `/spells/${openedSpell.id}` : `/characters/${characterId}/spells`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Page complète
            <ExternalLink className="size-3" />
          </Link>
        </header>

        {!openedSpell && (
          <div className="px-3">
            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                // Enter casts the search straight into the first hit: type "boul", Enter, read.
                if (event.key === "Enter" && filteredSpells[0]) {
                  event.preventDefault();
                  openSpell(filteredSpells[0]);
                }
              }}
              placeholder="Rechercher un sort…"
              className="h-8"
            />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          {error && <div className="px-2 py-4 text-sm text-red-500">{error}</div>}

          {!openedSpell &&
            !error &&
            (isLoadingList ? (
              <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Chargement des sorts…
              </div>
            ) : filteredSpells.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground">
                {spells?.length ? "Aucun sort ne correspond." : "Aucun sort disponible."}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredSpells.map((spell, index) => {
                  const isNewLevel = index === 0 || filteredSpells[index - 1].level !== spell.level;

                  return (
                    <div key={spell.id} className="flex flex-col">
                      {isNewLevel && (
                        <span className="flex items-center gap-2 px-2 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400/80">
                          {getLevelLabel(spell.level)}
                          <span className="h-px flex-1 bg-white/10" />
                        </span>
                      )}
                      <SpellRow
                        spell={spell}
                        isHighlighted={!!search && index === 0}
                        onSelect={() => openSpell(spell)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}

          {openedSpell &&
            !error &&
            (isLoadingDetails || !details ? (
              <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {`Chargement de ${openedSpell.name}…`}
              </div>
            ) : (
              <SpellQuickView spell={details} />
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
