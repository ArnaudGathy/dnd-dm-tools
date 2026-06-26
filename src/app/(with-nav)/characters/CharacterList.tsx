import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CAMPAIGN_MAP,
  CHARACTER_STATUS_MAP,
  CLASS_MAP,
  PARTY_MAP,
  RACE_MAP,
} from "@/constants/maps";
import { CharacterByOwner, cn } from "@/lib/utils";
import {
  BookOpenIcon,
  ChevronRight,
  Edit,
  Heart,
  type LucideIcon,
  MapPin,
  PawPrint,
  RotateCcw,
  Skull,
  TreePalm,
  Users,
} from "lucide-react";
import { CharacterStatus } from "@prisma/client";
import { classColors } from "@/constants/colors";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { hasCreatures } from "@/utils/utils";
import { getHasSpells } from "@/utils/stats/spells";
import { ReactNode } from "react";

const STATUS_CONFIG: Record<CharacterStatus, { icon: LucideIcon; className: string }> = {
  [CharacterStatus.ACTIVE]: {
    icon: Heart,
    className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  },
  [CharacterStatus.DEAD]: {
    icon: Skull,
    className: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  },
  [CharacterStatus.RETIRED]: {
    icon: TreePalm,
    className: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  },
  [CharacterStatus.BACKUP]: {
    icon: RotateCcw,
    className: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  },
};

function InfoChip({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">
      {Icon && <Icon className="size-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default function CharacterList({
  character,
  numberOfCharacters,
}: {
  character: CharacterByOwner;
  numberOfCharacters: number;
}) {
  const hasSpells = getHasSpells(character);
  const hasCreatureList = hasCreatures(character);
  const classColor = classColors[character.className].background;
  const status = STATUS_CONFIG[character.status];
  const StatusIcon = status.icon;
  const showCampaignInfo = numberOfCharacters > 1;
  const isActive = character.status === CharacterStatus.ACTIVE;

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden transition-all",
        // The whole card is clickable (stretched link below) → lift slightly on hover.
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40",
        // Focus & recede: active cards lift and stay vivid, inactive recede.
        isActive
          ? "shadow-lg shadow-black/40"
          : "opacity-70 saturate-[0.8] hover:opacity-100 hover:saturate-100",
      )}
    >
      {/* Class-color accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: classColor }}
        aria-hidden
      />
      {/* Subtle class-color glow from the top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.12]"
        style={{ background: `linear-gradient(to bottom, ${classColor}, transparent)` }}
        aria-hidden
      />

      <CardHeader className="relative pl-6">
        <div className="flex items-start justify-between gap-3">
          <span className="text-2xl font-semibold leading-tight tracking-tight">
            {character.name}
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
              status.className,
            )}
          >
            {/* Living status pill: the active heart gently pulses. */}
            <StatusIcon className={cn("size-3.5", isActive && "animate-pulse")} />
            {CHARACTER_STATUS_MAP[character.status]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span
            className="inline-flex items-center gap-1.5 font-medium"
            style={{ color: classColor }}
          >
            <span
              className="size-2 rotate-45"
              style={{ backgroundColor: classColor }}
              aria-hidden
            />
            {CLASS_MAP[character.className]}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{RACE_MAP[character.race]}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Niveau <span className="font-semibold text-foreground">{character.level}</span>
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-col gap-4 pl-6">
        {showCampaignInfo && (
          <div className="flex flex-wrap gap-2">
            <InfoChip icon={Users}>{PARTY_MAP[character.campaign.party.name]}</InfoChip>
            <InfoChip icon={MapPin}>{CAMPAIGN_MAP[character.campaign.name]}</InfoChip>
          </div>
        )}

        <div className="h-px bg-border" />

        {/* The whole card is the primary "open fiche" action (stretched link
            below). The left hint is the affordance for that card-wide click;
            the right cluster are quiet monochrome shortcuts to sections inside
            the fiche (z-10 keeps them clickable above the card-wide link). */}
        <div className="flex items-center justify-between gap-2">
          <span className="pointer-events-none inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            Ouvrir la fiche
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>

          <div className="relative z-10 flex items-center gap-1">
            {hasSpells && (
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="size-9 text-muted-foreground hover:text-foreground"
                aria-label="Sorts"
                title="Sorts"
              >
                <Link href={`/characters/${character.id}/spells`}>
                  <BookOpenIcon />
                </Link>
              </Button>
            )}
            {hasCreatureList && (
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="size-9 text-muted-foreground hover:text-foreground"
                aria-label="Créatures"
                title="Créatures"
              >
                <Link href={`/characters/${character.id}/creatures`}>
                  <PawPrint />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="size-9 text-muted-foreground hover:text-foreground"
              aria-label="Éditer"
              title="Éditer"
            >
              <Link href={`/characters/${character.id}/update`}>
                <Edit />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Stretched link: makes the entire card open the character's fiche while
          keeping it a Server Component. Sits above decorative layers but below
          the z-10 shortcut buttons. */}
      <Link
        href={`/characters/${character.id}`}
        aria-label={`Ouvrir la fiche de ${character.name}`}
        className="absolute inset-0 z-[1]"
      />
    </Card>
  );
}
