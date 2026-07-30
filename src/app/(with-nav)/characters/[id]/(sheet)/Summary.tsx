import { CharacterById, cn } from "@/lib/utils";
import {
  ABILITIES_MAP,
  ALIGNMENT_MAP,
  BACKGROUND_MAP,
  CLASS_MAP,
  HIT_DICE_MAP,
  RACE_MAP,
  SIZE_BY_RACE_MAP,
  SUBCLASS_MAP,
} from "@/constants/maps";
import { classColors } from "@/constants/colors";
import { BookOpenIcon, PawPrint } from "lucide-react";
import { entries } from "remeda";
import { addSignToNumber, getModifier, hasCreatures } from "@/utils/utils";
import { ElementType, ReactNode } from "react";
import Link from "next/link";
import { getMovementSpeed } from "@/utils/stats/speed";
import { getHasSpells, getSpellCastingStat } from "@/utils/stats/spells";

/** A circular ability medallion: score in a ring, sign-tinted modifier badge, label below. */
function AbilityMedallion({ name, value }: { name: keyof typeof ABILITIES_MAP; value: number }) {
  const modifier = getModifier(value);
  const sign = modifier > 0 ? "positive" : modifier < 0 ? "negative" : "zero";
  return (
    <div className="flex flex-col items-center gap-3.5">
      <div className="relative">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-border bg-gradient-to-b from-muted/70 to-card shadow-inner md:size-[5.5rem]">
          <span className="text-3xl font-bold tabular-nums leading-none md:text-4xl">{value}</span>
        </div>
        <span
          className={cn(
            "absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full border px-2 py-0.5 text-sm font-bold tabular-nums leading-none",
            {
              "border-emerald-500/30 bg-emerald-500/15 text-emerald-300": sign === "positive",
              "border-rose-500/30 bg-rose-500/15 text-rose-300": sign === "negative",
              "border-border bg-muted text-muted-foreground": sign === "zero",
            },
          )}
        >
          {addSignToNumber(modifier)}
        </span>
      </div>
      <span className="text-tiny font-medium uppercase tracking-wide text-muted-foreground">
        {ABILITIES_MAP[name]}
      </span>
    </div>
  );
}

/** A quiet, in-theme shortcut to a related sub-page (spells, bestiary). */
function ShortcutLink({
  href,
  icon: Icon,
  iconColor,
  label,
}: {
  href: string;
  icon: ElementType;
  iconColor: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2.5 py-1.5 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className={cn("size-4 shrink-0 stroke-[2.5px]", iconColor)} />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

/** A single character constant in the hero footer: centered label over value.
 *  `highlight` gives the value a soft amber tint (used for the page-exclusive Dés de vie). */
function Constant({
  label,
  value,
  highlight,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "text-xs font-bold uppercase tracking-wide",
          highlight ? "text-amber-300/70" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-base font-bold tabular-nums leading-none",
          highlight && "text-amber-300",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function Summary({ character }: { character: CharacterById }) {
  // Ordered alphabetically by French ability name: cha, con, dex, for, int, sag.
  const abilities = {
    charisma: character.charisma,
    constitution: character.constitution,
    dexterity: character.dexterity,
    strength: character.strength,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
  };

  const hasSpells = getHasSpells(character);
  const spellCastingModifier = getSpellCastingStat(character);
  const conModifier = getModifier(character.constitution);
  const movementSpeedDetails = getMovementSpeed(character);
  const hasCreatureList = hasCreatures(character);
  const classColor = classColors[character.className];

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:p-4 2xl:w-[70%]">
      {/* Spotlight hero — class-color tinted */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(125% 130% at 50% -25%, ${classColor.background}2e, transparent 62%)`,
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-24 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: classColor.background }}
        />

        <div className="absolute right-3 top-3 z-10 flex gap-2">
          {hasSpells && (
            <ShortcutLink
              href={`/characters/${character.id}/spells`}
              icon={BookOpenIcon}
              iconColor="text-sky-400"
              label="Sorts"
            />
          )}
          {hasCreatureList && (
            <ShortcutLink
              href={`/characters/${character.id}/creatures`}
              icon={PawPrint}
              iconColor="text-emerald-400"
              label="Bestiaire"
            />
          )}
        </div>

        <div className="relative flex flex-col items-center gap-2.5 px-6 pb-5 pt-6">
          <h1 className="text-center text-4xl font-extrabold tracking-tight md:text-5xl">
            {character.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
            <span
              className="rounded-md px-2.5 py-0.5"
              style={{ backgroundColor: classColor.background, color: classColor.foreground }}
            >
              {CLASS_MAP[character.className]}
            </span>
            {character.subclassName && (
              <span className="rounded-md bg-muted px-2.5 py-0.5">
                {SUBCLASS_MAP[character.subclassName]}
              </span>
            )}
            <span className="rounded-md bg-muted px-2.5 py-0.5">{RACE_MAP[character.race]}</span>
            <span className="rounded-md bg-primary px-2.5 py-0.5 text-primary-foreground">
              Niveau {character.level}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>Taille {SIZE_BY_RACE_MAP[character.race]}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{BACKGROUND_MAP[character.background]}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{ALIGNMENT_MAP[character.alignment]}</span>
          </div>
        </div>

        {/* Constants footer — uniform bar of class/race-derived stats */}
        <div className="relative border-t border-border/60 px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-x-9">
            <Constant
              highlight
              label="Dés de vie"
              value={
                <span className="flex items-baseline gap-1">
                  {character.level}
                  <span className="text-muted-foreground">×</span>
                  {`1${HIT_DICE_MAP[character.className]}`}
                  {conModifier !== 0 && (
                    <span className="text-muted-foreground">{addSignToNumber(conModifier)}</span>
                  )}
                </span>
              }
            />
            <div className="hidden h-8 w-px self-center bg-border/70 md:block" />
            <Constant label="Points de vie" value={character.maximumHP} />
            <div className="hidden h-8 w-px self-center bg-border/70 md:block" />
            <Constant label="Vitesse" value={`${movementSpeedDetails.total} cases`} />
            {spellCastingModifier && (
              <>
                <div className="hidden h-8 w-px self-center bg-border/70 md:block" />
                <Constant label="Incantation" value={ABILITIES_MAP[spellCastingModifier]} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ability medallions — the centerpiece */}
      <div className="rounded-xl border border-border bg-card px-2 py-7">
        <div className="grid grid-cols-3 justify-items-center gap-y-8 md:grid-cols-6">
          {entries(abilities).map(([name, value]) => (
            <AbilityMedallion key={name} name={name} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}
