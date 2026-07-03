"use client";

import { ReactNode } from "react";
import { CharacterById } from "@/lib/utils";
import { ChevronsUp, Dice6, Footprints, Hand, Shield } from "lucide-react";
import { getTotalAC } from "@/utils/stats/ac";
import { getMovementSpeed } from "@/utils/stats/speed";
import { getInitiativeModifier } from "@/utils/stats/initiative";
import {
  getClassDice,
  getMartialClassDC,
  getSubClassDice,
  getSubMartialClassDC,
} from "@/utils/stats/classSpecific";
import HPForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/HPForm";
import HudTile from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/HudTile";
import StatBreakdown from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import { Accent } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import { addSignToNumber } from "@/utils/utils";

function MartialDCDefinition({
  accent,
  details,
}: {
  accent: Accent;
  details: NonNullable<ReturnType<typeof getMartialClassDC>>;
}) {
  return (
    <StatBreakdown
      accent={accent}
      icon={Hand}
      title={`DD martial (${details.modifierName})`}
      rows={[
        { label: "Base", value: details.base },
        details.modifier !== 0 && {
          label: details.modifierName,
          value: addSignToNumber(details.modifier),
        },
        details.proficiencyBonus > 0 && {
          label: "Maîtrise",
          value: addSignToNumber(details.proficiencyBonus),
        },
      ]}
      total={details.total}
    />
  );
}

/** A tile label that refuses to wrap: it sets the tile's minimum width so the
 *  whole tile wraps to the next flex line instead of squeezing its text. */
function NowrapLabel({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/**
 * The always-visible vitals band: HP module on the left, then one tile per
 * combat constant — the universal trio (CA, initiative, vitesse) plus the
 * class-conditional martial DCs / special dice, all sharing one wrapping row.
 */
export default function CombatHud({ character }: { character: CharacterById }) {
  const ACDetails = getTotalAC(character);
  const initiativeDetails = getInitiativeModifier(character);
  const movementSpeedDetails = getMovementSpeed(character);
  const martialClassDC = getMartialClassDC(character);
  const subMartialClassDC = getSubMartialClassDC(character);
  const classDice = getClassDice(character);
  const subClassDice = getSubClassDice(character);

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 md:flex-row md:items-stretch md:gap-3">
      <HPForm character={character} />

      <div className="flex flex-1 flex-wrap gap-2">
        <HudTile
          className="min-w-[4.75rem] flex-auto"
          icon={Shield}
          iconColor="text-stone-400"
          value={ACDetails.total}
          label="CA"
          definition={
            <StatBreakdown
              icon={Shield}
              title="Classe d'armure"
              rows={[
                ACDetails.armorAC > 0 && { label: ACDetails.armorName, value: ACDetails.armorAC },
                ACDetails.abilityACModifier !== 0 && {
                  label: ACDetails.modifierName,
                  value: addSignToNumber(ACDetails.abilityACModifier),
                },
                ACDetails.shieldAc > 0 && {
                  label: "Bouclier",
                  value: addSignToNumber(ACDetails.shieldAc),
                },
                ACDetails.featAc.modifier > 0 && {
                  label: ACDetails.featAc.modifierName,
                  value: addSignToNumber(ACDetails.featAc.modifier),
                },
                ACDetails.ACBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(ACDetails.ACBonus),
                },
                ACDetails.protectionRingModifier > 0 && {
                  label: "Anneau de protection",
                  value: addSignToNumber(ACDetails.protectionRingModifier),
                },
              ]}
              total={ACDetails.total}
            />
          }
        />
        <HudTile
          className="min-w-[4.75rem] flex-auto"
          icon={ChevronsUp}
          iconColor="text-green-500"
          value={initiativeDetails.total}
          label="Initiative"
          definition={
            <StatBreakdown
              accent="emerald"
              icon={ChevronsUp}
              title="Initiative"
              rows={[
                {
                  label: "Dextérité",
                  value: addSignToNumber(initiativeDetails.dexterityModifier),
                },
                initiativeDetails.alertModifier > 0 && {
                  label: "Don Vigilant (maîtrise)",
                  value: addSignToNumber(initiativeDetails.alertModifier),
                },
                initiativeDetails.initiativeBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(initiativeDetails.initiativeBonus),
                },
              ]}
              total={initiativeDetails.total}
            />
          }
        />
        <HudTile
          className="min-w-[4.75rem] flex-auto"
          icon={Footprints}
          iconColor="text-amber-600"
          value={movementSpeedDetails.total}
          label="Vitesse"
          definition={
            <StatBreakdown
              accent="amber"
              icon={Footprints}
              title="Vitesse (cases)"
              rows={[
                { label: "Racial", value: movementSpeedDetails.raceSpeed },
                movementSpeedDetails.classSpeed > 0 && {
                  label: "Classe",
                  value: addSignToNumber(movementSpeedDetails.classSpeed),
                },
                movementSpeedDetails.movementSpeedBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(movementSpeedDetails.movementSpeedBonus),
                },
              ]}
              total={movementSpeedDetails.total}
            />
          }
        />
        {martialClassDC && (
          <HudTile
            className="flex-auto px-3"
            icon={Hand}
            iconColor="text-slate-400"
            value={martialClassDC.total}
            label={<NowrapLabel>{`DD ${martialClassDC.modifierName}`}</NowrapLabel>}
            definition={<MartialDCDefinition accent="slate" details={martialClassDC} />}
          />
        )}
        {subMartialClassDC && (
          <HudTile
            className="flex-auto px-3"
            icon={Hand}
            iconColor="text-teal-500"
            value={subMartialClassDC.total}
            label={<NowrapLabel>{`DD ${subMartialClassDC.modifierName}`}</NowrapLabel>}
            definition={<MartialDCDefinition accent="teal" details={subMartialClassDC} />}
          />
        )}
        {classDice?.value && (
          <HudTile
            className="flex-auto px-3"
            icon={Dice6}
            iconColor="text-rose-400"
            value={classDice.value}
            label={<NowrapLabel>{classDice.name}</NowrapLabel>}
            definition={
              <StatBreakdown
                accent="pink"
                icon={Dice6}
                title={classDice.name}
                rows={[{ label: "Dé", value: classDice.value }]}
              />
            }
          />
        )}
        {subClassDice?.value && (
          <HudTile
            className="flex-auto px-3"
            icon={Dice6}
            iconColor="text-blue-400"
            value={subClassDice.value}
            label={<NowrapLabel>{subClassDice.name}</NowrapLabel>}
            definition={
              <StatBreakdown
                accent="sky"
                icon={Dice6}
                title={subClassDice.name}
                rows={[{ label: "Dé", value: subClassDice.value }]}
              />
            }
          />
        )}
      </div>
    </section>
  );
}
