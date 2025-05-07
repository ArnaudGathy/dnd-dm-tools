import { CharacterById } from "@/lib/utils";
import {
  ABILITIES_MAP,
  ALIGNMENT_MAP,
  BACKGROUND_MAP,
  CLASS_MAP,
  HIT_DICE_MAP,
  RACE_MAP,
  SIZE_BY_RACE_MAP,
  SPEED_BY_RACE_MAP,
  SPELLCASTING_MODIFIER_MAP,
  SUBCLASS_MAP,
} from "@/constants/maps";
import { classColors } from "@/constants/colors";
import { StatCell } from "@/app/creatures/StatCell";
import { BookOpenIcon, PawPrintIcon, X } from "lucide-react";
import { entries } from "remeda";
import {
  addSignToNumber,
  convertFeetDistanceIntoSquares,
  getModifier,
} from "@/utils/utils";
import SheetCard from "@/components/ui/SheetCard";
import AbilitySquare from "@/app/characters/[id]/(sheet)/AbilitySquare";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InspirationForm from "@/app/characters/[id]/(sheet)/(forms)/InspirationForm";

export default function Summary({ character }: { character: CharacterById }) {
  const abilities = {
    charisma: character.charisma,
    constitution: character.constitution,
    dexterity: character.dexterity,
    strength: character.strength,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
  };

  const spellCastingModifier = SPELLCASTING_MODIFIER_MAP[character.className];
  const conModifier = getModifier(character.constitution);

  return (
    <div className="grid w-full grid-cols-2 gap-4 p-0 md:w-[70%] md:grid-cols-6 md:grid-rows-[auto] md:p-4">
      <SheetCard className="relative col-span-2 flex flex-col items-center md:col-span-6">
        <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
          {character.name}
        </span>
        <span className="text-base font-bold">{`Niveau ${character.level}`}</span>
        <div className="absolute right-2 top-2 flex flex-col gap-1 md:right-4 md:top-4 md:flex-row md:gap-4">
          {!!spellCastingModifier && (
            <Link href={`/characters/${character.id}/spells`}>
              <Button
                variant="outline"
                className="bg-gradient-to-tr from-blue-500 to-pink-500 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-pink-600"
                size="sm"
              >
                <BookOpenIcon className="stroke-[2.5px]" />
              </Button>
            </Link>
          )}
          {character.creatures.length > 0 && (
            <Link href={`/characters/${character.id}/creatures`}>
              <Button
                variant="outline"
                className="bg-gradient-to-tr from-blue-500 to-pink-500"
                size="sm"
              >
                <PawPrintIcon className="stroke-[2.5px]" />
              </Button>
            </Link>
          )}
        </div>
      </SheetCard>

      <div className="col-span-2 grid grid-cols-1 gap-4 md:col-span-5 md:row-span-2 md:grid-cols-2">
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
                  <span className="text-primary">{character.level}</span>
                  <X className="size-4" />
                  <div className="text-primary">
                    <span>{`1${HIT_DICE_MAP[character.className]}`}</span>
                    {conModifier !== 0 && (
                      <span>{addSignToNumber(conModifier)}</span>
                    )}
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

      <InspirationForm
        character={character}
        className="col-span-2 md:col-span-1 md:row-span-2"
      />

      {entries(abilities).map(([name, value]) => (
        <AbilitySquare key={name} name={name} value={value} />
      ))}
    </div>
  );
}
