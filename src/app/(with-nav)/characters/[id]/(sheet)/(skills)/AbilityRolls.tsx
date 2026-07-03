import { CharacterById, cn } from "@/lib/utils";
import { entries } from "remeda";
import { ABILITY_NAME_MAP, ABILITY_NAME_MAP_TO_FR } from "@/constants/maps";
import { ShieldCheck } from "lucide-react";
import { addSignToNumber, getModifier } from "@/utils/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { getSavingThrowModifier } from "@/utils/stats/skills";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import StatBreakdown, {
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";

/** A quiet proficiency marker: a small dot, never a loud fill. Always rendered
 *  (transparent when none) so every name/value column stays aligned. */
export function Dot({ active, className }: { active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0 rounded-full bg-transparent",
        active && "bg-teal-400",
        className,
      )}
    />
  );
}

/** Ability checks ("Test") and saving throws ("JdS") share one tight table — both
 *  are keyed by ability name, which is how the DM calls the roll. Save proficiency
 *  uses the same left-of-name dot + header legend as the skills list. */
export default function AbilityRolls({ character }: { character: CharacterById }) {
  // Ordered alphabetically by French ability name: cha, con, dex, for, int, sag.
  const abilities = {
    charisma: "Charisme",
    constitution: "Constitution",
    dexterity: "Dextérité",
    strength: "Force",
    intelligence: "Intelligence",
    wisdom: "Sagesse",
  } as const;

  return (
    <SectionPanel
      accent="teal"
      icon={ShieldCheck}
      title="Tests & Sauvegardes"
      contentClassName="gap-0"
      action={
        <div className="flex items-center gap-1.5 text-tiny font-medium text-muted-foreground">
          <Dot active />
          Maîtrise
        </div>
      }
    >
      <div className="flex items-center gap-2 pb-1">
        <span className="flex-1" />
        <span className="w-10 text-right text-tiny font-medium lowercase tracking-wide text-muted-foreground/60">
          test
        </span>
        <span className="w-10 text-right text-tiny font-semibold uppercase tracking-wide text-teal-300/90">
          JdS
        </span>
      </div>

      {entries(abilities).map(([ability, displayName]) => {
        const selectedSavingThrow = character.savingThrows.find(
          ({ ability: abilityName }) => abilityName === ABILITY_NAME_MAP[ability],
        );
        const isProficient = !!selectedSavingThrow?.isProficient;
        const save = getSavingThrowModifier(character, ability);
        const checkModifier = getModifier(character[ability]);

        return (
          <div key={ability} className="flex items-center gap-2 py-1">
            <span className="flex shrink-0 items-center gap-2">
              <Dot active={isProficient} />
              <span className="text-[15px]">{displayName}</span>
            </span>
            <span className="mx-1 h-3 flex-1 border-b border-dashed border-muted-foreground/30" />
            <span className="w-10 text-right text-base font-medium tabular-nums text-muted-foreground">
              {addSignToNumber(checkModifier)}
            </span>
            <PopoverComponent
              className="w-10 text-right text-lg font-bold tabular-nums"
              contentClassName={breakdownContentClassName}
              definition={
                <StatBreakdown
                  accent="teal"
                  icon={ShieldCheck}
                  title={`JdS de ${ABILITY_NAME_MAP_TO_FR[ABILITY_NAME_MAP[ability]]}`}
                  rows={[
                    { label: displayName, value: addSignToNumber(save.abilityModifier) },
                    save.proficiencyModifier > 0 && {
                      label: "Maîtrise",
                      value: addSignToNumber(save.proficiencyModifier),
                    },
                    save.protectionRingModifier > 0 && {
                      label: "Anneau de protection",
                      value: addSignToNumber(save.protectionRingModifier),
                    },
                    save.bonusModifier > 0 && {
                      label: "Bonus (autres)",
                      value: addSignToNumber(save.bonusModifier),
                    },
                  ]}
                  total={addSignToNumber(save.total)}
                />
              }
            >
              <span>{addSignToNumber(save.total)}</span>
            </PopoverComponent>
          </div>
        );
      })}
    </SectionPanel>
  );
}
