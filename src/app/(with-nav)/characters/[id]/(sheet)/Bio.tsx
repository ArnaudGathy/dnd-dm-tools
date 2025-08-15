import { CharacterById, cn } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import { StatCell } from "@/components/statblocks/StatCell";
import { ALIGNMENT_MAP, BACKGROUND_MAP } from "@/constants/maps";
import NotesForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/NotesForm";

export default function Bio({ character }: { character: CharacterById }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-4 md:p-4",
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
              src={`/characters/${character.imageUrl ?? "avatar_warrior.png"}`}
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
            <StatCell name="Cheveux" stat={character.hair} isInline />
          </div>

          {!!character.physicalTraits && (
            <StatCell name="Traits" stat={character.physicalTraits} isInline />
          )}
        </SheetCard>
        <SheetCard className="relative flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Notes</span>
          <NotesForm character={character} />
          <div className="mt-2 flex flex-col gap-1 whitespace-pre-line">
            {character.notes || "Aucune notes"}
          </div>
        </SheetCard>
      </div>

      <div className="flex flex-col gap-4">
        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">
            Traits de personnalité
          </span>
          <div className="flex flex-col gap-1 whitespace-pre-line">
            {character.personalityTraits}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Idéaux</span>
          <div className="flex flex-col gap-1 whitespace-pre-line">
            {character.ideals}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Liens</span>
          <div className="flex flex-col gap-1 whitespace-pre-line">
            {character.bonds}
          </div>
        </SheetCard>

        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">Défauts</span>
          <div className="flex flex-col gap-1 whitespace-pre-line">
            {character.flaws}
          </div>
        </SheetCard>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
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
          <div className="mt-2 flex flex-col gap-1 whitespace-pre-line">
            {character.lore || "Pas de lore."}
          </div>
        </SheetCard>
        <SheetCard className="flex flex-col gap-4">
          <span className="mb-2 self-center text-2xl font-bold">
            Alliés et organisations
          </span>
          <span className="whitespace-pre-line">
            {character.allies || "Pas d'alliés."}
          </span>
        </SheetCard>
      </div>
    </div>
  );
}
