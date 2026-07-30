"use client";

import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { entries } from "remeda";
import { CharacterById, cn } from "@/lib/utils";
import { BookOpenIcon, ChevronDown, Infinity, RotateCw, WandSparkles, Zap } from "lucide-react";
import { Classes } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PopoverComponent from "@/components/ui/PopoverComponent";
import SpellDetailsPopover from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/SpellDetailsPopover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import HudTile from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/HudTile";
import PipRow from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/PipRow";
import { RestConfirm } from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/RestButtons";
import StatBreakdown, {
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import { addSignToNumber, normalizeForSearch } from "@/utils/utils";
import { useRessourceStorage } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import {
  ACTION_TAGS,
  FACT_ICONS,
  PLANNING_MARKERS,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";
import { shortenAbilityName } from "@/utils/utils";
import {
  getSpellCastingModifier,
  getSpellSaveDC,
  getSpellsToPreparePerDay,
} from "@/utils/stats/spells";

type SpellsSlotsData = ReturnType<typeof useRessourceStorage>["spellsSlots"];

const longRestCastMarker = PLANNING_MARKERS.find(({ flag }) => flag === "hasLongRestCast");

const SPELL_LIST_OPEN_KEY = "combat:spells:open";
const SPELL_PANEL_OPEN_KEY = "combat:spells:panel:open";

/** Everything spell-related in one place: casting stats, slot pips (the same
 *  pip language as the resource tracker) and the prepared-spells quick list
 *  where casting a spell spends a slot of its level.
 *
 *  `isCollapsible` is for casters whose spells come from a species or a feat
 *  rather than their class: a handful of spells they rarely cast, so the whole
 *  panel folds down to its header and stays closed until they need it. */
function SpellcastingPanel({
  character,
  spellsSlotsData,
  isCollapsible = false,
}: {
  character: CharacterById;
  spellsSlotsData: SpellsSlotsData;
  isCollapsible?: boolean;
}) {
  const {
    addSlot,
    removeSlot,
    allSlots,
    baseSlots,
    spellSlots,
    resetSlots,
    usedFreeCasts,
    spendFreeCast,
    regainFreeCast,
  } = spellsSlotsData;

  // The component is client-only (dynamic ssr:false below), so both collapse
  // states are readable at first render — no flash of the wrong one.
  const [isSpellListOpen = false, setIsSpellListOpen] = useLocalStorage(SPELL_LIST_OPEN_KEY, false);
  // Open by default; folding it away is the player's call and it sticks.
  const [isPanelOpen = true, setIsPanelOpen] = useLocalStorage(SPELL_PANEL_OPEN_KEY, true);
  const [spellSearch, setSpellSearch] = useState("");

  const spellCastingDetails = getSpellCastingModifier(character);
  const spellSaveDCDetails = getSpellSaveDC(character);
  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);
  const isWizard = character.className === Classes.WIZARD;

  const hasSlots = spellSlots !== undefined && baseSlots.length > 0;
  const slotEntries = hasSlots ? entries(allSlots) : [];

  const preparedSpells = character.spellsOnCharacters
    .filter(
      ({ isPrepared, isAlwaysPrepared, hasLongRestCast, spell }) =>
        isPrepared || isAlwaysPrepared || hasLongRestCast || (isWizard && spell.isRitual),
    )
    .toSorted(
      (a, b) => a.spell.level - b.spell.level || a.spell.name.localeCompare(b.spell.name, "fr"),
    );
  const searchTerm = normalizeForSearch(spellSearch.trim());
  const visibleSpells = searchTerm
    ? preparedSpells.filter(({ spell }) => normalizeForSearch(spell.name).includes(searchTerm))
    : preparedSpells;
  // Only spells the player prepared themselves count toward the budget — exclude
  // always-prepared, free long-rest casts, wizard rituals and cantrips (level 0).
  // Same rule as the /characters/[id]/spells page so both counters agree.
  const preparedCount = character.spellsOnCharacters.filter(
    (soc) =>
      soc.isPrepared &&
      !soc.isAlwaysPrepared &&
      !soc.hasLongRestCast &&
      soc.spell.level > 0 &&
      !(isWizard && soc.spell.isRitual),
  ).length;
  const preparedDiff = spellsToPreparePerDay ? preparedCount - spellsToPreparePerDay.total : 0;
  const preparedTone =
    preparedDiff === 0 ? "text-emerald-500" : preparedDiff < 0 ? "text-amber-500" : "text-red-500";

  const body = (
    <>
      <div className={cn("grid gap-2", spellsToPreparePerDay ? "grid-cols-3" : "grid-cols-2")}>
        <HudTile
          value={spellCastingDetails.total}
          label="Attaque"
          definition={
            <StatBreakdown
              accent="sky"
              icon={WandSparkles}
              title="Attaque des sorts"
              rows={[
                {
                  label: shortenAbilityName(spellCastingDetails.spellCastingStat),
                  value: addSignToNumber(spellCastingDetails.spellCastingAbilityModifier),
                },
                {
                  label: "Maîtrise",
                  value: addSignToNumber(spellCastingDetails.proficiencyBonus),
                },
                spellCastingDetails.magicAttackBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(spellCastingDetails.magicAttackBonus),
                },
              ]}
              total={spellCastingDetails.total}
            />
          }
        />
        <HudTile
          value={spellSaveDCDetails.total}
          label="DD sauv."
          definition={
            <StatBreakdown
              accent="sky"
              icon={WandSparkles}
              title="DD de sauvegarde"
              rows={[
                { label: "Base", value: spellSaveDCDetails.baseValue },
                {
                  label: shortenAbilityName(spellSaveDCDetails.spellCastingStat),
                  value: addSignToNumber(spellSaveDCDetails.spellCastingAbilityModifier),
                },
                {
                  label: "Maîtrise",
                  value: addSignToNumber(spellSaveDCDetails.proficiencyBonus),
                },
                spellSaveDCDetails.magicDCBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(spellSaveDCDetails.magicDCBonus),
                },
              ]}
              total={spellSaveDCDetails.total}
            />
          }
        />
        {!!spellsToPreparePerDay && (
          <HudTile
            value={`${preparedCount}/${spellsToPreparePerDay.total}`}
            valueClassName={preparedTone}
            label="Préparés"
            definition={
              <StatBreakdown
                accent="sky"
                icon={WandSparkles}
                title="Sorts à préparer"
                rows={[
                  { label: "Quand", value: spellsToPreparePerDay.when },
                  { label: "Échanges", value: `${spellsToPreparePerDay.dailyAmount} / jour` },
                ]}
                total={spellsToPreparePerDay.total}
                totalLabel="Budget"
              />
            }
          />
        )}
      </div>

      {hasSlots && (
        <div className="flex flex-col gap-1.5">
          {slotEntries.map(([level, totalSlots]) => {
            const numberLevel = parseInt(level, 10);
            const availableSlots = spellSlots[numberLevel] ?? 0;
            return (
              <div key={level} className="flex items-center gap-2">
                <span className="w-11 shrink-0 text-xs font-semibold text-muted-foreground">
                  {`Niv. ${level}`}
                </span>
                <PipRow
                  theme="sky"
                  size="md"
                  total={totalSlots}
                  available={availableSlots}
                  onSpend={() => removeSlot(numberLevel)}
                  onRegain={() => addSlot(numberLevel)}
                />
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {`${availableSlots}/${totalSlots}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {preparedSpells.length > 0 && (
        <Collapsible open={isSpellListOpen} onOpenChange={setIsSpellListOpen}>
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted/70">
            <span className="flex items-center gap-2">
              Sorts disponibles
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-bold tabular-nums text-sky-400">
                {preparedSpells.length}
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Input
              value={spellSearch}
              onChange={(event) => setSpellSearch(event.target.value)}
              placeholder="Rechercher un sort…"
              className="mt-1.5 h-8"
            />
            {visibleSpells.length === 0 && (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                Aucun sort ne correspond.
              </div>
            )}
            <ul className="mt-1 flex flex-col">
              {visibleSpells.map(({ spell, hasLongRestCast }) => {
                const level = spell.level;
                const availableSlots = level > 0 ? (spellSlots?.[level] ?? 0) : 0;
                const canCast = level > 0 && hasSlots && availableSlots > 0;
                const isFreeCastAvailable = hasLongRestCast && !usedFreeCasts.includes(spell.id);

                return (
                  <li
                    key={spell.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-muted",
                      { "opacity-50": level > 0 && !canCast && !isFreeCastAvailable },
                    )}
                  >
                    {level === 0 ? (
                      <PopoverComponent
                        definition={
                          <StatBreakdown
                            accent="sky"
                            icon={Infinity}
                            title="Tour de magie"
                            note="À volonté, sans emplacement de sort."
                          />
                        }
                        contentClassName={breakdownContentClassName}
                        className="flex size-7 shrink-0 items-center justify-center"
                      >
                        <Infinity className="size-4 text-muted-foreground" />
                      </PopoverComponent>
                    ) : isFreeCastAvailable ? (
                      // The free long-rest cast is the obvious way to cast while it
                      // lasts — it takes over the cast button, then hands back to
                      // the slot-spending wand once used.
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-amber-400 hover:bg-amber-500/15 hover:text-amber-300"
                        title="Lancer gratuitement (1 / long repos)"
                        onClick={() => spendFreeCast(spell.id)}
                      >
                        <Zap />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-sky-400 hover:bg-sky-500/15 hover:text-sky-300"
                        title={`Lancer (dépense un emplacement niv. ${level})`}
                        disabled={!canCast}
                        onClick={() => removeSlot(level)}
                      >
                        <WandSparkles />
                      </Button>
                    )}

                    <span className="w-9 shrink-0 rounded bg-sky-500/10 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-sky-400/80">
                      {`Niv ${level}`}
                    </span>

                    <SpellDetailsPopover spellId={spell.id} spellName={spell.name} />

                    <span className="flex shrink-0 items-center gap-1.5">
                      {hasLongRestCast && longRestCastMarker && (
                        <PopoverComponent
                          className="flex items-center"
                          contentClassName={breakdownContentClassName}
                          definition={
                            <div className="flex flex-col">
                              <StatBreakdown
                                accent="sky"
                                icon={longRestCastMarker.Icon}
                                title={longRestCastMarker.label}
                                rows={[
                                  {
                                    label: "Lancement gratuit",
                                    value: isFreeCastAvailable ? "disponible" : "utilisé",
                                  },
                                ]}
                                note={`${longRestCastMarker.explanation} L'éclair de la ligne lance gratuitement ; une fois utilisé, le bouton redevient un lancement par emplacement.`}
                              />
                              {!isFreeCastAvailable && (
                                <div className="px-3 pb-2">
                                  <PopoverClose asChild>
                                    <Button
                                      size="xs"
                                      className="w-full"
                                      onClick={() => regainFreeCast(spell.id)}
                                    >
                                      Récupérer le lancement gratuit
                                    </Button>
                                  </PopoverClose>
                                </div>
                              )}
                            </div>
                          }
                        >
                          <longRestCastMarker.Icon className="size-4 text-muted-foreground" />
                        </PopoverComponent>
                      )}
                      {spell.concentration && (
                        <PopoverComponent
                          className="flex items-center"
                          contentClassName={breakdownContentClassName}
                          definition={
                            <StatBreakdown
                              accent="sky"
                              icon={FACT_ICONS.concentration.Icon}
                              title={FACT_ICONS.concentration.label}
                              note={FACT_ICONS.concentration.explanation}
                            />
                          }
                        >
                          <FACT_ICONS.concentration.Icon
                            className={cn("size-4", FACT_ICONS.concentration.className)}
                          />
                        </PopoverComponent>
                      )}
                      {spell.isRitual && (
                        <PopoverComponent
                          className="flex items-center"
                          contentClassName={breakdownContentClassName}
                          definition={
                            <StatBreakdown
                              accent="sky"
                              icon={FACT_ICONS.ritual.Icon}
                              title={FACT_ICONS.ritual.label}
                              note={FACT_ICONS.ritual.explanation}
                            />
                          }
                        >
                          <FACT_ICONS.ritual.Icon
                            className={cn("size-4", FACT_ICONS.ritual.className)}
                          />
                        </PopoverComponent>
                      )}
                      {spell.actionType && ACTION_TAGS[spell.actionType] && (
                        <PopoverComponent
                          className="flex items-center"
                          contentClassName={breakdownContentClassName}
                          definition={
                            <StatBreakdown
                              accent="sky"
                              title={ACTION_TAGS[spell.actionType]?.label}
                              note={ACTION_TAGS[spell.actionType]?.explanation}
                            />
                          }
                        >
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium",
                              ACTION_TAGS[spell.actionType]?.className,
                            )}
                          >
                            {ACTION_TAGS[spell.actionType]?.label}
                          </span>
                        </PopoverComponent>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );

  // When collapsed the content wrapper drops its padding, so the panel shrinks
  // down to its header instead of leaving an empty padded box.
  const panel = (
    <SectionPanel
      accent="sky"
      icon={WandSparkles}
      // The casting ability rides in the header rather than taking its own row —
      // it's a constant you check once, not a number you track.
      title={
        <span className="flex items-baseline gap-1.5">
          Sorts
          <span className="rounded bg-sky-500/15 px-1.5 py-px text-tiny font-bold text-sky-400">
            {shortenAbilityName(spellCastingDetails.spellCastingStat)}
          </span>
        </span>
      }
      action={
        <div className="flex items-center gap-1">
          <Button asChild theme="neutral" size="icon" title="Liste des sorts">
            <NextLink href={`/characters/${character.id}/spells`}>
              <BookOpenIcon />
            </NextLink>
          </Button>
          {hasSlots && (
            <RestConfirm
              title="Réinitialiser les emplacements"
              description="Restaure tous les emplacements de sorts et les lancements gratuits par long repos."
              icon={<RotateCw />}
              confirmAction={resetSlots}
            />
          )}
          {isCollapsible && (
            <CollapsibleTrigger asChild>
              <Button theme="neutral" size="icon" title={isPanelOpen ? "Replier" : "Déplier"}>
                <ChevronDown
                  className={cn("transition-transform", { "rotate-180": isPanelOpen })}
                />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
      }
      contentClassName={cn("gap-3", { "p-0": isCollapsible && !isPanelOpen })}
    >
      {isCollapsible ? (
        <CollapsibleContent className="flex flex-col gap-3">{body}</CollapsibleContent>
      ) : (
        body
      )}
    </SectionPanel>
  );

  return isCollapsible ? (
    <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen}>
      {panel}
    </Collapsible>
  ) : (
    panel
  );
}

export default dynamic(() => Promise.resolve(SpellcastingPanel), { ssr: false });
