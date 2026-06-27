import { CharacterById, cn } from "@/lib/utils";
import { entries } from "remeda";
import {
  ABILITY_NAME_MAP,
  ABILITY_NAME_MAP_TO_FR,
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILL_ABILITY_MAP,
  SKILL_NAME_MAP,
} from "@/constants/maps";
import { Award, Eye, ListChecks, ShieldCheck } from "lucide-react";
import { Skills as SkillsEnum } from "@prisma/client";
import { ElementType } from "react";
import { addSignToNumber, getModifier, shortenAbilityName } from "@/utils/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import {
  getPassivePerception,
  getSavingThrowModifier,
  getSkillModifier,
} from "@/utils/stats/skills";
import { SectionPanel, StatLine } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import CollapsibleProficiencies from "@/app/(with-nav)/characters/[id]/(sheet)/(skills)/CollapsibleProficiencies";

type Proficiency = "expert" | "proficient" | "none";

/** A quiet proficiency marker: a small dot, never a loud fill. Always rendered
 *  (transparent when none) so every name/value column stays aligned. */
function Dot({ level, className }: { level: Proficiency; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        {
          "bg-amber-400": level === "expert",
          "bg-indigo-400": level === "proficient",
          "bg-transparent": level === "none",
        },
        className,
      )}
    />
  );
}

/** One skill = one scannable row: dot · name · ability tag … value. Name is the
 *  anchor (left-aligned down the column); the number is the answer on the right. */
function SkillRow({
  character,
  skill,
  skillName,
}: {
  character: CharacterById;
  skill: SkillsEnum;
  skillName: string;
}) {
  const abilityTag = shortenAbilityName(SKILL_ABILITY_MAP[skill]);
  const details = getSkillModifier(character, skill);
  const level: Proficiency = details.isExpert
    ? "expert"
    : details.isProficient
      ? "proficient"
      : "none";

  return (
    <StatLine
      valueClassName="text-xl"
      label={
        <span className="flex min-w-0 items-center gap-2">
          <Dot level={level} />
          <span className="truncate text-[15px] text-foreground">{skillName}</span>
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            {abilityTag}
          </span>
        </span>
      }
      value={
        <PopoverComponent
          definition={
            <div>
              <span className="font-bold">Bonus de {skillName}</span>
              <div>
                <span>Caractéristique ({abilityTag}) : </span>
                <span>{details.abilityModifier}</span>
              </div>
              {details.proficiencyModifier > 0 && (
                <div>
                  <span>{details.isExpert ? "Expertise : " : "Maîtrise : "}</span>
                  <span>{details.proficiencyModifier}</span>
                </div>
              )}
              {details.skillSpecial > 0 && details.skillSpecialName && (
                <div>
                  <span>{`${details.skillSpecialName} : `}</span>
                  <span>{details.skillSpecial}</span>
                </div>
              )}
              {details.bonusModifier > 0 && (
                <div>
                  <span>{"Bonus (autres) : "}</span>
                  <span>{details.bonusModifier}</span>
                </div>
              )}
            </div>
          }
        >
          <span className="tabular-nums">{addSignToNumber(details.total)}</span>
        </PopoverComponent>
      }
    />
  );
}

/** A compact derived-number chip — low footprint for stats consulted rarely. */
function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
      <Icon className="size-4 shrink-0 stroke-[2.5px] text-indigo-400" />
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-lg font-bold tabular-nums leading-none">{value}</span>
      </div>
    </div>
  );
}

/** Ability checks ("Test") and saving throws ("JdS") share one tight table — both
 *  are keyed by ability name, which is how the DM calls the roll. Save proficiency
 *  uses the same left-of-name dot + header legend as the skills list. */
function AbilityRolls({ character }: { character: CharacterById }) {
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
          <Dot level="none" className="bg-teal-400" />
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
              <Dot level="none" className={isProficient ? "bg-teal-400" : undefined} />
              <span className="text-[15px]">{displayName}</span>
            </span>
            <span className="mx-1 h-3 flex-1 border-b border-dashed border-muted-foreground/30" />
            <span className="w-10 text-right text-base font-medium tabular-nums text-muted-foreground">
              {addSignToNumber(checkModifier)}
            </span>
            <PopoverComponent
              className="w-10 text-right text-lg font-bold tabular-nums"
              definition={
                <div>
                  <span className="font-bold">
                    JdS de {ABILITY_NAME_MAP_TO_FR[ABILITY_NAME_MAP[ability]]}
                  </span>
                  <div>
                    <span>{`${displayName} : `}</span>
                    <span>{save.abilityModifier}</span>
                  </div>
                  {save.proficiencyModifier > 0 && (
                    <div>
                      <span>Bonus de maîtrise : </span>
                      <span>{save.proficiencyModifier}</span>
                    </div>
                  )}
                  {save.protectionRingModifier > 0 && (
                    <div>
                      <span>Anneau de protection : </span>
                      <span>{save.protectionRingModifier}</span>
                    </div>
                  )}
                  {save.bonusModifier > 0 && (
                    <div>
                      <span>Bonus (autres) : </span>
                      <span>{save.bonusModifier}</span>
                    </div>
                  )}
                </div>
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

export default function Skills({ character }: { character: CharacterById }) {
  const hasExpertise = character.skills.some((skill) => skill.isExpert);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-0 md:p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        {/* Compétences — the star: one scannable, name-first column. */}
        <SectionPanel
          accent="indigo"
          icon={ListChecks}
          title="Compétences"
          action={
            <div className="flex items-center gap-3 text-tiny font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Dot level="proficient" />
                Maîtrise
              </span>
              {hasExpertise && (
                <span className="flex items-center gap-1.5">
                  <Dot level="expert" />
                  Expertise
                </span>
              )}
            </div>
          }
        >
          {entries(SKILL_NAME_MAP).map(([skill, skillName]) => (
            <SkillRow key={skill} character={character} skill={skill} skillName={skillName} />
          ))}
        </SectionPanel>

        {/* Reference sidebar — saving throws lead (often called for), then the
            rarely-consulted derived numbers and the quiet, collapsible proficiencies. */}
        <div className="flex flex-col gap-4">
          <AbilityRolls character={character} />

          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              icon={Award}
              label="Bonus de maîtrise"
              value={`+${PROFICIENCY_BONUS_BY_LEVEL[character.level]}`}
            />
            <MiniStat
              icon={Eye}
              label="Perception passive"
              value={getPassivePerception(character)}
            />
          </div>

          <CollapsibleProficiencies proficiencies={character.proficiencies} />
        </div>
      </div>
    </div>
  );
}
