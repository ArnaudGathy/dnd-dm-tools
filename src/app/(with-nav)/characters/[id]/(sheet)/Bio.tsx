import { CharacterById, cn } from "@/lib/utils";
import { StatCell } from "@/components/statblocks/StatCell";
import { ALIGNMENT_MAP, BACKGROUND_MAP } from "@/constants/maps";
import NotesForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/NotesForm";
import {
  BookText,
  HeartCrack,
  Link2,
  ScrollText,
  Sparkles,
  StickyNote,
  User,
  Users,
} from "lucide-react";
import { SectionPanel, StatLine } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function Bio({ character }: { character: CharacterById }) {
  const characterImageUrl = `/characters/${character.imageUrl ?? "avatar_warrior.png"}`;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-4 md:items-start md:p-4",
      )}
    >
      <div className="flex flex-col gap-4">
        <SectionPanel accent="pink" icon={User} title={character.name}>
          <div className="mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 p-0.5">
            <a href={character.imageUrl ? characterImageUrl : "#"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={characterImageUrl} alt="Avatar" className="w-full rounded-xl" />
            </a>
          </div>

          <StatLine label="Age" value={`${character.age} ans`} />
          <StatLine label="Taille" value={`${character.height} cm`} />
          <StatLine label="Poids" value={`${character.weight} kg`} />
          <StatLine label="Peau" value={character.skin} />
          <StatLine label="Yeux" value={character.eyeColor} />
          <StatLine label="Cheveux" value={character.hair} />
          {!!character.physicalTraits && (
            <StatLine label="Traits" value={character.physicalTraits} />
          )}
        </SectionPanel>

        <SectionPanel
          accent="slate"
          icon={StickyNote}
          title="Notes"
          action={<NotesForm character={character} />}
        >
          <div className="whitespace-pre-line text-sm leading-snug">
            {character.notes || "Aucune note"}
          </div>
        </SectionPanel>
      </div>

      <div className="flex flex-col gap-4">
        <SectionPanel accent="violet" icon={Sparkles} title="Traits de personnalité">
          <div className="whitespace-pre-line text-sm leading-snug">
            {character.personalityTraits}
          </div>
        </SectionPanel>

        <SectionPanel accent="amber" icon={ScrollText} title="Idéaux">
          <div className="whitespace-pre-line text-sm leading-snug">{character.ideals}</div>
        </SectionPanel>

        <SectionPanel accent="emerald" icon={Link2} title="Liens">
          <div className="whitespace-pre-line text-sm leading-snug">{character.bonds}</div>
        </SectionPanel>

        <SectionPanel accent="red" icon={HeartCrack} title="Défauts">
          <div className="whitespace-pre-line text-sm leading-snug">{character.flaws}</div>
        </SectionPanel>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <SectionPanel accent="pink" icon={BookText} title="Background">
          <div className="mb-2 flex flex-wrap gap-x-6 gap-y-1">
            <StatCell name="Alignement" stat={ALIGNMENT_MAP[character.alignment]} isInline />
            <StatCell name="Historique" stat={BACKGROUND_MAP[character.background]} isInline />
          </div>
          <div className="whitespace-pre-line text-sm leading-snug">
            {character.lore || "Pas de lore."}
          </div>
        </SectionPanel>
        <SectionPanel accent="sky" icon={Users} title="Alliés et organisations">
          <div className="whitespace-pre-line text-sm leading-snug">
            {character.allies || "Pas d'alliés."}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}
