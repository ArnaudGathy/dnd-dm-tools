import { CharacterById, cn } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import { StatCell } from "@/app/creatures/StatCell";
import { ALIGNMENT_MAP, BACKGROUND_MAP } from "@/constants/maps";

export default function Bio({ character }: { character: CharacterById }) {
  const hasLore = character.lore.length > 0;
  const hasAllies = character.allies.length > 0;
  const hasLoreOrAllies = hasLore || hasAllies;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 p-0 md:grid md:w-[50%] md:grid-cols-2 md:p-4",
        {
          "md:w-full md:grid-cols-4": hasLoreOrAllies,
        },
      )}
    >
      <div className="flex flex-col gap-4">
        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
            {character.name}
          </span>
          <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${character.imageUrl ?? "avatar_warrior.png"}`}
              alt="Avatar"
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-between">
            <StatCell name="Age" stat={`${character.age} ans`} isInline />
            <StatCell name="Peau" stat={character.skin} isInline />
          </div>

          <div className="flex justify-between">
            <StatCell name="Poids" stat={`${character.weight} kg`} isInline />
            <StatCell name="Taille" stat={`${character.height} cm`} isInline />
          </div>

          <div className="flex justify-between">
            <StatCell name="Yeux" stat={character.eyeColor} isInline />
            <StatCell name="Cheveux" stat={character.eyeColor} isInline />
          </div>

          {character.physicalTraits.length > 0 && (
            <StatCell
              name="Traits"
              stat={character.physicalTraits.join(", ")}
              isInline
            />
          )}
        </SheetCard>
        {character.notes.length > 0 && (
          <SheetCard className="flex flex-col">
            <span className="mb-2 self-center text-2xl font-bold">Notes</span>
            <div className="mt-2 flex flex-col gap-1">
              {character.notes.map((note) => (
                <div key={note}>{note}</div>
              ))}
            </div>
          </SheetCard>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">
            Traits de personnalité
          </span>
          <div className="flex flex-col gap-1">
            {character.personalityTraits.map((personality) => (
              <div key={personality}>{personality}</div>
            ))}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Idéaux</span>
          <div className="flex flex-col gap-1">
            {character.ideals.map((ideal) => (
              <div key={ideal}>{ideal}</div>
            ))}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Liens</span>
          <div className="flex flex-col gap-1">
            {character.bonds.map((bond) => (
              <div key={bond}>{bond}</div>
            ))}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Défauts</span>
          <div className="flex flex-col gap-1">
            {character.flaws.map((flaw) => (
              <div key={flaw}>{flaw}</div>
            ))}
          </div>
        </SheetCard>
      </div>

      {hasLoreOrAllies && (
        <div className="col-span-2 flex flex-col gap-4">
          {hasLore && (
            <SheetCard className="flex flex-col">
              <span className="mb-2 self-center text-2xl font-bold">
                Background
              </span>
              <div className="flex gap-4">
                <StatCell
                  name="Alignement"
                  stat={ALIGNMENT_MAP[character.alignment]}
                  isInline
                />
                <StatCell
                  name="Historique"
                  stat={BACKGROUND_MAP[character.background]}
                  isInline
                />
              </div>
              <div className="mt-2 flex flex-col gap-1">
                {character.lore.map((lore) => (
                  <div key={lore}>{lore}</div>
                ))}
              </div>
            </SheetCard>
          )}
          {hasAllies && (
            <SheetCard className="flex flex-col gap-4">
              <span className="mb-2 self-center text-2xl font-bold">
                Alliés et organisations
              </span>
              {character.allies.map((ally) => (
                <div key={ally}>{ally}</div>
              ))}
            </SheetCard>
          )}
        </div>
      )}
    </div>
  );
}
