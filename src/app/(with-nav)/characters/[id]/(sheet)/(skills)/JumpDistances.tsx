import { ReactNode } from "react";
import { MoveUpRight } from "lucide-react";
import { CharacterById } from "@/lib/utils";
import { addSignToNumber } from "@/utils/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { SectionPanel, StatLine } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import StatBreakdown, {
  BreakdownRow,
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import {
  getJumpDistances,
  getJumpReachInMeters,
  HIGH_JUMP_BASE_IN_METERS,
  JUMP_RUN_UP_IN_SQUARES,
  JumpDistance,
} from "@/utils/stats/jumps";

/** One decimal, French separator. Formatted by hand rather than with
 *  toLocaleString so the server and the client render identical strings. */
const formatNumber = (value: number) => (Math.round(value * 10) / 10).toString().replace(".", ",");

const formatMeters = (meters: number) => `${formatNumber(meters)} m`;

const pluralizeSquares = (squares: number) => (squares >= 2 ? "cases" : "case");

/** Popover footer sentences, one per line. */
function Notes({ items }: { items: (string | null)[] }) {
  return (
    <span className="flex flex-col gap-1.5">
      {items
        .filter((item): item is string => !!item)
        .map((item) => (
          <span key={item}>{item}</span>
        ))}
    </span>
  );
}

/** One jump = one row: name … whole squares, with the metric arithmetic in the popover. */
function JumpRow({
  label,
  title,
  distance,
  rows,
  note,
}: {
  label: string;
  title: string;
  distance: JumpDistance;
  rows: (BreakdownRow | false | null | undefined)[];
  note: ReactNode;
}) {
  return (
    <StatLine
      valueClassName="text-xl"
      label={<span className="truncate text-[15px] text-foreground">{label}</span>}
      value={
        <PopoverComponent
          contentClassName={breakdownContentClassName}
          definition={
            <StatBreakdown
              accent="amber"
              icon={MoveUpRight}
              title={title}
              rows={[...rows, { label: "En cases", value: formatNumber(distance.squaresExact) }]}
              total={distance.squares}
              totalLabel="Arrondi"
              note={note}
            />
          }
        >
          <span className="tabular-nums">
            {distance.squares}
            <span className="ml-1 text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
              {pluralizeSquares(distance.squares)}
            </span>
          </span>
        </PopoverComponent>
      }
    />
  );
}

/**
 * Jump distances, expressed in squares like the rest of the sheet (Vitesse, portée
 * d'arme). Amber + Footprints-family iconography ties them to the movement budget
 * they are paid from — each square jumped costs a square of movement.
 */
export default function JumpDistances({ character }: { character: CharacterById }) {
  const jumps = getJumpDistances(character);

  const runUpNote = `Élan : au moins ${JUMP_RUN_UP_IN_SQUARES} cases de course juste avant le saut.`;
  const landingNote =
    "Arrivée en terrain difficile : DD 10 Dextérité (Acrobaties) ou vous tombez à terre.";
  const obstacleNote =
    "Règle optionnelle : DD 10 Force (Athlétisme) pour franchir un obstacle bas (au plus ¼ de la distance), sinon vous le percutez.";
  const clampNote = jumps.isHighJumpClamped ? "Minimum 0 m." : null;

  const reachNote = (distance: JumpDistance) => {
    const reach = getJumpReachInMeters(distance.meters, character.height);
    if (reach === null) {
      return null;
    }
    return `Portée bras tendus : ${formatMeters(reach)} (hauteur du saut + 1,5 × votre taille).`;
  };

  const strengthRow: BreakdownRow = { label: "Valeur de Force", value: jumps.strength };
  const highJumpRows: BreakdownRow[] = [
    { label: "Base", value: formatMeters(HIGH_JUMP_BASE_IN_METERS) },
    { label: "Mod. de Force", value: addSignToNumber(jumps.strengthModifier) },
  ];

  return (
    <SectionPanel accent="amber" icon={MoveUpRight} title="Sauts">
      <JumpRow
        label="Longueur (élan)"
        title="Saut en longueur"
        distance={jumps.longRunning}
        rows={[strengthRow, { label: "Distance", value: formatMeters(jumps.longRunning.meters) }]}
        note={<Notes items={[runUpNote, landingNote, obstacleNote]} />}
      />
      <JumpRow
        label="Longueur (arrêt)"
        title="Saut en longueur sans élan"
        distance={jumps.longStanding}
        rows={[strengthRow, { label: "Moitié", value: formatMeters(jumps.longStanding.meters) }]}
        note={<Notes items={[landingNote, obstacleNote]} />}
      />
      <JumpRow
        label="Hauteur (élan)"
        title="Saut en hauteur"
        distance={jumps.highRunning}
        rows={[
          ...highJumpRows,
          { label: "Distance", value: formatMeters(jumps.highRunning.meters) },
        ]}
        note={<Notes items={[runUpNote, clampNote, reachNote(jumps.highRunning)]} />}
      />
      <JumpRow
        label="Hauteur (arrêt)"
        title="Saut en hauteur sans élan"
        distance={jumps.highStanding}
        rows={[
          ...highJumpRows,
          { label: "Moitié", value: formatMeters(jumps.highStanding.meters) },
        ]}
        note={<Notes items={[clampNote, reachNote(jumps.highStanding)]} />}
      />

      <p className="mt-1 border-t border-border pt-2 text-tiny leading-snug text-muted-foreground">
        Chaque case franchie coûte une case de déplacement.
      </p>
    </SectionPanel>
  );
}
