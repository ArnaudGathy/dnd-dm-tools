import { CharacterById, cn } from "@/lib/utils";
import { ALIGNMENT_MAP, BACKGROUND_MAP } from "@/constants/maps";
import { classColors } from "@/constants/colors";
import NotesForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/NotesForm";
import {
  Briefcase,
  Compass,
  HeartCrack,
  Link2,
  ScrollText,
  Sparkles,
  StickyNote,
  Users,
} from "lucide-react";
import { ElementType, ReactNode } from "react";
import AvatarPortrait from "@/app/(with-nav)/characters/[id]/(sheet)/AvatarPortrait";

/**
 * A small, fixed semantic palette. Each hue carries one consistent meaning so the
 * page reads as colorful-but-deliberate, never a rainbow:
 *   sky → self / identity   ·   amber → aspiration / record
 *   emerald → connection    ·   red → core lore / flaw
 * Colour only ever touches accents (marker, icon, tiny label, a faint header wash);
 * surfaces and body text stay neutral.
 */
type Accent = "red" | "amber" | "emerald" | "sky";

const ACCENTS: Record<Accent, { marker: string; icon: string; label: string; tint: string }> = {
  red: {
    marker: "bg-red-500",
    icon: "text-red-400",
    label: "text-red-300/90",
    tint: "bg-red-500/[0.06]",
  },
  amber: {
    marker: "bg-amber-500",
    icon: "text-amber-400",
    label: "text-amber-300/90",
    tint: "bg-amber-500/[0.06]",
  },
  emerald: {
    marker: "bg-emerald-500",
    icon: "text-emerald-400",
    label: "text-emerald-300/90",
    tint: "bg-emerald-500/[0.06]",
  },
  sky: {
    marker: "bg-sky-500",
    icon: "text-sky-400",
    label: "text-sky-300/90",
    tint: "bg-sky-500/[0.06]",
  },
};

/** A label-over-value block used for the physical-stat strip in the hero. */
function Stat({ label, value }: { label: string; value: ReactNode }) {
  const isEmpty = value == null || value === "";
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-tiny font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {/* Skin/eyes/hair can be full descriptive sentences — wrap, never truncate. */}
      <span
        className={cn(
          "break-words text-sm font-semibold leading-snug",
          isEmpty ? "italic text-muted-foreground" : "text-foreground",
        )}
      >
        {isEmpty ? "Non renseigné" : value}
      </span>
    </div>
  );
}

/** A rounded pill surfacing one piece of identity metadata. */
function MetaBadge({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ElementType;
  label: string;
  value: string;
  accent: Accent;
}) {
  const a = ACCENTS[accent];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border py-1 pl-2.5 pr-3.5 text-sm",
        a.tint,
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", a.icon)} />
      <span className="text-tiny font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

/** A bordered content panel with a clean, accent-tinted header. */
function Panel({
  title,
  icon: Icon,
  accent,
  action,
  className,
  children,
}: {
  title: string;
  icon: ElementType;
  accent: Accent;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <header
        className={cn(
          "flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border px-4",
          a.tint,
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("h-4 w-1 shrink-0 rounded-full", a.marker)} />
          <Icon className={cn("size-4 shrink-0", a.icon)} />
          <h3 className="truncate text-xs font-bold uppercase tracking-[0.14em] text-foreground/75">
            {title}
          </h3>
        </div>
        {action && <div className="-mr-1 flex shrink-0 items-center">{action}</div>}
      </header>
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}

/** One of the four D&D personality fields, rendered as a labeled entry. */
function PersonalityEntry({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ElementType;
  label: string;
  value: string | null;
  accent: Accent;
}) {
  const a = ACCENTS[accent];
  const hasValue = !!value && value.trim() !== "" && value.trim() !== "...";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon className={cn("size-3.5 shrink-0", a.icon)} />
        <span className={cn("text-tiny font-bold uppercase tracking-[0.12em]", a.label)}>
          {label}
        </span>
      </div>
      <p
        className={cn(
          "whitespace-pre-line pl-[1.375rem] text-sm leading-snug",
          hasValue ? "text-foreground/90" : "italic text-muted-foreground",
        )}
      >
        {hasValue ? value : "Non renseigné"}
      </p>
    </div>
  );
}

/** Long-form text body with a muted placeholder when empty. */
function Prose({ text, placeholder }: { text?: string | null; placeholder: string }) {
  const hasValue = !!text && text.trim() !== "";
  return (
    <p
      className={cn(
        "whitespace-pre-line text-sm leading-relaxed",
        hasValue ? "text-foreground/90" : "italic text-muted-foreground",
      )}
    >
      {hasValue ? text : placeholder}
    </p>
  );
}

export default function Bio({ character }: { character: CharacterById }) {
  const characterImageUrl = character.imageUrl ? `/characters/${character.imageUrl}` : null;
  const classColor = classColors[character.className].background;
  const initials =
    character.name
      .split(/\s+/)
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex w-full flex-col gap-4 md:p-4">
      {/* Identity hero */}
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-6">
          {characterImageUrl ? (
            <AvatarPortrait src={characterImageUrl} alt={character.name} />
          ) : (
            // No portrait on file — a class-colour-tinted gradient with the character's
            // ghost initials. (`${hex}26`/`${hex}33` append an 8-digit-hex alpha.)
            <div
              aria-hidden
              className="flex aspect-[3/4] w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border md:w-44"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${classColor}26, hsl(var(--muted)), hsl(var(--card)))`,
              }}
            >
              <span
                className="select-none text-6xl font-black tracking-tight"
                style={{ color: `${classColor}33` }}
              >
                {initials}
              </span>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-4 text-center md:text-left">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
                {character.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <MetaBadge
                  icon={Compass}
                  label="Alignement"
                  value={ALIGNMENT_MAP[character.alignment]}
                  accent="sky"
                />
                <MetaBadge
                  icon={Briefcase}
                  label="Historique"
                  value={BACKGROUND_MAP[character.background]}
                  accent="amber"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left md:grid-cols-3">
              <Stat label="Âge" value={character.age != null ? `${character.age} ans` : null} />
              <Stat
                label="Taille"
                value={character.height != null ? `${character.height} cm` : null}
              />
              <Stat
                label="Poids"
                value={character.weight != null ? `${character.weight} kg` : null}
              />
              <Stat label="Peau" value={character.skin} />
              <Stat label="Yeux" value={character.eyeColor} />
              <Stat label="Cheveux" value={character.hair} />
            </div>

            {!!character.physicalTraits && (
              <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-left">
                <span className="text-tiny font-semibold uppercase tracking-wider text-muted-foreground">
                  Traits physiques
                </span>
                <p className="mt-0.5 whitespace-pre-line text-sm leading-snug text-foreground/90">
                  {character.physicalTraits}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Personnalité sidebar (left) + lore (right) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Panel title="Personnalité" icon={Sparkles} accent="sky">
          <div className="flex flex-col gap-4 divide-y divide-border [&>*:not(:first-child)]:pt-4">
            <PersonalityEntry
              icon={Sparkles}
              label="Traits de personnalité"
              value={character.personalityTraits}
              accent="sky"
            />
            <PersonalityEntry
              icon={ScrollText}
              label="Idéaux"
              value={character.ideals}
              accent="amber"
            />
            <PersonalityEntry icon={Link2} label="Liens" value={character.bonds} accent="emerald" />
            <PersonalityEntry
              icon={HeartCrack}
              label="Défauts"
              value={character.flaws}
              accent="red"
            />
          </div>
        </Panel>

        <div className="flex flex-col gap-4 md:col-span-2">
          <Panel title="Background" icon={ScrollText} accent="red">
            <Prose text={character.lore} placeholder="Pas de lore." />
          </Panel>
          <Panel title="Alliés et organisations" icon={Users} accent="emerald">
            <Prose text={character.allies} placeholder="Pas d'alliés." />
          </Panel>
        </div>
      </div>

      {/* Notes — freeform and often long, so it spans the full width */}
      <Panel
        title="Notes"
        icon={StickyNote}
        accent="amber"
        action={<NotesForm character={character} />}
      >
        <Prose text={character.notes} placeholder="Aucune note" />
      </Panel>
    </div>
  );
}
