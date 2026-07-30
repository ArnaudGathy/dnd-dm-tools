"use client";

import { CharacterById } from "@/lib/utils";
import { Swords } from "lucide-react";
import { SPELLCASTING_MODIFIER_MAP } from "@/constants/maps";
import { getSpellCastingStat } from "@/utils/stats/spells";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import AbilityRolls from "@/app/(with-nav)/characters/[id]/(sheet)/(skills)/AbilityRolls";
import CombatHud from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/CombatHud";
import WeaponCard from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/WeaponCard";
import SpellcastingPanel from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/SpellcastingPanel";
import TraitsPanel from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/TraitsPanel";
import Ressources from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/Ressources";
import useRessourceData from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";

export default function Combat({ character }: { character: CharacterById }) {
  const hasSpells = !!getSpellCastingStat(character);
  // Class casters lead with their spells; species/feat casters get a folded
  // panel under their weapons — they fight with the weapon and cast rarely.
  const isClassCaster = !!SPELLCASTING_MODIFIER_MAP[character.className];
  const { ressources, spellsSlots } = useRessourceData({ character });

  const spellcastingPanel = hasSpells && (
    <SpellcastingPanel
      character={character}
      spellsSlotsData={spellsSlots}
      isCollapsible={!isClassCaster}
    />
  );

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:p-4">
      <CombatHud character={character} />

      {/* Mobile stacks in combat-priority order: act (armes, sorts), track
          (ressources), then reference (sauvegardes, traits). */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-start">
        <div className="flex flex-col gap-4">
          {/* Casters act with spells first — the spell panel leads when present. */}
          {isClassCaster && spellcastingPanel}

          <SectionPanel accent="red" icon={Swords} title="Armes" contentClassName="gap-3">
            {character.weapons.length === 0 && (
              <span className="text-sm text-muted-foreground">Aucune arme.</span>
            )}
            {character.weapons.map((weapon) => (
              <WeaponCard key={weapon.id} character={character} weapon={weapon} />
            ))}
          </SectionPanel>

          {!isClassCaster && spellcastingPanel}
        </div>

        <div className="flex flex-col gap-4">
          <Ressources character={character} ressources={ressources} />
          <AbilityRolls character={character} />
        </div>

        <TraitsPanel character={character} />
      </div>
    </div>
  );
}
