import { CharacterById } from "@/lib/utils";
import {
  ABILITIES_MAP,
  ALIGNMENT_MAP,
  BACKGROUND_MAP,
  CLASS_MAP,
  HIT_DICE_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  RACE_MAP,
  SIZE_BY_RACE_MAP,
  SPEED_BY_RACE_MAP,
  SPELLCASTING_MODIFIER_MAP,
  SUBCLASS_MAP,
} from "@/constants/maps";
import { classColors } from "@/constants/colors";
import { StatCell } from "@/app/creatures/StatCell";
import { X } from "lucide-react";
import { entries } from "remeda";
import { convertFeetDistanceIntoSquares, getModifier } from "@/utils/utils";
import SheetCard from "@/components/ui/SheetCard";
import { Skills } from "@prisma/client";
import { getSkillModifier } from "@/utils/skills";
import SheetSingleData from "@/components/ui/SheetSingleData";

export default function Summary({ character }: { character: CharacterById }) {
  const abilities = {
    strength: character.strength,
    dexterity: character.dexterity,
    constitution: character.constitution,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
    charisma: character.charisma,
  };

  const spellCastingModifier = SPELLCASTING_MODIFIER_MAP[character.className];

  return (
    <div className="grid auto-rows-auto grid-cols-4 gap-2 p-2 md:grid-cols-6 md:gap-4 md:p-4">
      <SheetCard className="md:order-0 col-span-3 flex flex-col items-center md:col-span-5">
        <span className="text-3xl font-bold text-primary">
          {character.name}
        </span>
        <span className="text-base font-bold">{`Niveau 5`}</span>
      </SheetCard>

      <SheetSingleData
        className="md:order-1"
        label="Inspiration"
        value={character.inspiration}
      />

      <div className="order-3 col-span-4 grid grid-cols-2 gap-2 md:order-2 md:col-span-5 md:grid-cols-2 md:gap-4">
        <SheetCard className="flex justify-center">
          <div className="flex flex-col gap-2 md:gap-0">
            <span
              style={{
                color: classColors[character.className].background,
              }}
              className="mb-2 self-center text-2xl font-bold"
            >
              {CLASS_MAP[character.className]}
            </span>
            {character.subclassName && (
              <StatCell
                name="Sous-classe"
                stat={SUBCLASS_MAP[character.subclassName]}
              />
            )}
            <StatCell
              name="Lancement de sort"
              stat={
                spellCastingModifier
                  ? ABILITIES_MAP[spellCastingModifier]
                  : "Non"
              }
            />
            <StatCell
              name="Dés de vie"
              stat={
                <div className="flex items-center gap-2">
                  <span>{character.level}</span>
                  <X className="size-4" />
                  <div>
                    <span>{`1${HIT_DICE_MAP[character.className]}`}</span>
                    <span>{`+${getModifier(character.constitution)}`}</span>
                  </div>
                </div>
              }
            />
            <StatCell name="Points de vie" stat={character.maximumHP} />
          </div>
        </SheetCard>
        <SheetCard className="flex justify-center">
          <div className="flex flex-col gap-2 md:gap-0">
            <span className="mb-2 self-center text-2xl font-bold">
              {RACE_MAP[character.race]}
            </span>
            <StatCell
              name="Catégorie de taille"
              stat={SIZE_BY_RACE_MAP[character.race]}
            />
            <StatCell
              name="Mouvements"
              stat={`${convertFeetDistanceIntoSquares(
                SPEED_BY_RACE_MAP[character.race],
              )} cases par tour`}
            />
            <StatCell
              name="Historique"
              stat={BACKGROUND_MAP[character.background]}
            />
            <StatCell
              name="Alignement"
              stat={ALIGNMENT_MAP[character.alignment]}
            />
          </div>
        </SheetCard>
      </div>

      <div className="order-2 col-span-4 grid grid-cols-2 gap-2 md:order-3 md:col-span-1 md:grid-cols-1 md:grid-rows-2 md:gap-4">
        <SheetSingleData
          label="Perception passive"
          value={`+${PROFICIENCY_BONUS_BY_LEVEL[character.level]}`}
        />
        <SheetSingleData
          label="Bonus de maîtrise"
          value={10 + getSkillModifier(character, Skills.PERCEPTION)}
        />
      </div>

      {entries(abilities).map(([name, value]) => {
        const modifier = getModifier(value);
        return (
          <SheetSingleData
            key={name}
            className="order-4 col-span-2 md:col-span-1"
            label={ABILITIES_MAP[name]}
            value={
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xl text-indigo-500">
                  {Math.sign(modifier) === 1 ? `+${modifier}` : modifier}
                </span>
              </div>
            }
          />
        );
      })}
    </div>
  );
}
