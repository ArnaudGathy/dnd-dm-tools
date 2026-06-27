"use client";

import { CharacterById, cn } from "@/lib/utils";
import {
  ChevronsUp,
  CopyCheck,
  Dice6,
  Footprints,
  Hand,
  HeartPulse,
  Shield,
  ShieldOff,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { convertFeetDistanceIntoSquares, shortenAbilityName } from "@/utils/utils";
import { ABILITY_NAME_MAP_TO_FR, SPELLCASTING_MODIFIER_MAP } from "@/constants/maps";
import SavingThrows from "@/app/(with-nav)/characters/[id]/(sheet)/(skills)/SavingThrows";
import Name from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/Name";
import Damages from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/Damages";
import InfoCell from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/InfoCell";
import ExtraEffects from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/ExtraEffects";
import SpellSlots from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/SpellSlots";
import HPForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/HPForm";
import AmmunitionForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AmmunitionForm";
import { getMovementSpeed } from "@/utils/stats/speed";
import { getTotalAC } from "@/utils/stats/ac";
import {
  getSpellCastingModifier,
  getSpellSaveDC,
  getSpellsToPreparePerDay,
} from "@/utils/stats/spells";
import { getInitiativeModifier } from "@/utils/stats/initiative";
import {
  getClassDice,
  getMartialClassDC,
  getSubClassDice,
  getSubMartialClassDC,
} from "@/utils/stats/classSpecific";

import { getWeaponAttackBonus } from "@/utils/stats/weapons";
import RessourcesWrapper from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesWrapper";
import StatCard from "./StatCard";
import useRessourceData from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function Combat({ character }: { character: CharacterById }) {
  const ACDetails = getTotalAC(character);
  const spellCastingDetails = getSpellCastingModifier(character);
  const spellSaveDCDetails = getSpellSaveDC(character);
  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);
  const initiativeDetails = getInitiativeModifier(character);
  const movementSpeedDetails = getMovementSpeed(character);
  const martialClassDC = getMartialClassDC(character);
  const subMartialClassDC = getSubMartialClassDC(character);
  const classDice = getClassDice(character);
  const subClassDice = getSubClassDice(character);
  const hasMartialData = martialClassDC?.total || classDice?.value || subClassDice?.value;
  const hasSpells = SPELLCASTING_MODIFIER_MAP[character.className];

  const { ressources, spellsSlots } = useRessourceData({ character });

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-3 md:items-start md:p-4">
      <div className="flex flex-col gap-4">
        <SectionPanel
          accent="red"
          icon={HeartPulse}
          title="Vitalité"
          contentClassName="grid grid-cols-2 gap-3"
        >
          <HPForm character={character} />

          <StatCard
            icon={Shield}
            iconColor="text-stone-400"
            value={ACDetails.total}
            label="Classe d'armure"
            definition={
              <div>
                <span className="font-bold">Classe d&#39;armure (CA)</span>
                {ACDetails.armorAC > 0 && (
                  <div>
                    <span>{`${ACDetails.armorName} : `}</span>
                    <span>{ACDetails.armorAC}</span>
                  </div>
                )}
                {ACDetails.shieldAc > 0 && (
                  <div>
                    <span>Bouclier : </span>
                    <span>{ACDetails.shieldAc}</span>
                  </div>
                )}
                {ACDetails.abilityACModifier > 0 && (
                  <div>
                    <span>{`Modificateurs (${ACDetails.modifierName}) : `}</span>
                    <span>{ACDetails.abilityACModifier}</span>
                  </div>
                )}
                {ACDetails.featAc.modifier > 0 && (
                  <div>
                    <span>{ACDetails.featAc.modifierName} : </span>
                    <span>{ACDetails.featAc.modifier}</span>
                  </div>
                )}
                {ACDetails.ACBonus > 0 && (
                  <div>
                    <span>Bonus : </span>
                    <span>{ACDetails.ACBonus}</span>
                  </div>
                )}
                {ACDetails.protectionRingModifier > 0 && (
                  <div>
                    <span>Anneau de protection : </span>
                    <span>{ACDetails.protectionRingModifier}</span>
                  </div>
                )}
              </div>
            }
          />
          <StatCard
            icon={Footprints}
            iconColor="text-amber-600"
            value={movementSpeedDetails.total}
            label="Vitesse"
            definition={
              <div>
                <span className="font-bold">Vitesse de déplacement (en cases)</span>
                <div>
                  <span>Racial : </span>
                  <span>{movementSpeedDetails.raceSpeed}</span>
                </div>
                {movementSpeedDetails.classSpeed > 0 && (
                  <div>
                    <span>Classe : </span>
                    <span>{movementSpeedDetails.classSpeed}</span>
                  </div>
                )}
                {movementSpeedDetails.movementSpeedBonus > 0 && (
                  <div>
                    <span>Bonus : </span>
                    <span>{movementSpeedDetails.movementSpeedBonus}</span>
                  </div>
                )}
              </div>
            }
          />
          <StatCard
            icon={ChevronsUp}
            iconColor="text-green-500"
            value={initiativeDetails.total}
            label="Initiative"
            definition={
              <div>
                <span className="font-bold">Bonus au jet d&apos;initiative</span>
                <div>
                  <span>DEX : </span>
                  <span>{initiativeDetails.dexterityModifier}</span>
                </div>
                {initiativeDetails.alertModifier > 0 && (
                  <div>
                    <span>{"Don Vigilant (bonus de maîtrise) : "}</span>
                    <span>{initiativeDetails.alertModifier}</span>
                  </div>
                )}
                {initiativeDetails.initiativeBonus > 0 && (
                  <div>
                    <span>Bonus : </span>
                    <span>{initiativeDetails.initiativeBonus}</span>
                  </div>
                )}
              </div>
            }
          />
        </SectionPanel>
        <SavingThrows character={character} />
        <RessourcesWrapper character={character} ressources={ressources} />
      </div>

      <div className="flex flex-col gap-4">
        {hasMartialData && (
          <SectionPanel
            accent="violet"
            icon={Hand}
            title="Capacités martiales"
            contentClassName="grid grid-cols-2 gap-3"
          >
            {martialClassDC && (
              <StatCard
                icon={Hand}
                iconColor="text-[#90a1b9]"
                value={martialClassDC.total}
                label={`DD ${martialClassDC.modifierName}`}
                definition={
                  <div>
                    <span className="font-bold">DD martial ({martialClassDC.modifierName})</span>
                    <div>
                      <span>Base : </span>
                      <span>{martialClassDC.base}</span>
                    </div>
                    {martialClassDC.modifier > 0 && (
                      <div>
                        <span>{`Modificateur (${martialClassDC.modifierName}) :`} </span>
                        <span>{martialClassDC.modifier}</span>
                      </div>
                    )}
                    {martialClassDC.proficiencyBonus > 0 && (
                      <div>
                        <span>Maîtrise : </span>
                        <span>{martialClassDC.proficiencyBonus}</span>
                      </div>
                    )}
                  </div>
                }
              />
            )}
            {subMartialClassDC && (
              <StatCard
                icon={Hand}
                iconColor="text-teal-500"
                value={subMartialClassDC.total}
                label={`DD ${subMartialClassDC.modifierName}`}
                definition={
                  <div>
                    <span className="font-bold">DD martial ({subMartialClassDC.modifierName})</span>
                    <div>
                      <span>Base : </span>
                      <span>{subMartialClassDC.base}</span>
                    </div>
                    {subMartialClassDC.modifier > 0 && (
                      <div>
                        <span>{`Modificateur (${subMartialClassDC.modifierName}) :`} </span>
                        <span>{subMartialClassDC.modifier}</span>
                      </div>
                    )}
                    {subMartialClassDC.proficiencyBonus > 0 && (
                      <div>
                        <span>Maîtrise : </span>
                        <span>{subMartialClassDC.proficiencyBonus}</span>
                      </div>
                    )}
                  </div>
                }
              />
            )}
            {classDice?.value && (
              <StatCard
                icon={Dice6}
                iconColor="text-rose-400"
                value={classDice.value}
                label={classDice.name}
                definition={<span className="font-bold">{classDice.name}</span>}
              />
            )}
            {subClassDice?.value && (
              <StatCard
                icon={Dice6}
                iconColor="text-blue-400"
                value={subClassDice.value}
                label={subClassDice.name}
                definition={<span className="font-bold">{subClassDice.name}</span>}
              />
            )}
          </SectionPanel>
        )}

        {hasSpells && (
          <SectionPanel accent="sky" icon={WandSparkles} title="Sorts">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={WandSparkles}
                iconColor="text-sky-400"
                value={spellCastingDetails.total}
                label="Attaque"
                definition={
                  <div>
                    <span className="font-bold">Bonus de jet d&apos;attaque des sorts</span>
                    <div>
                      <span>{`${shortenAbilityName(spellCastingDetails.spellCastingStat)} : `}</span>
                      <span>{spellCastingDetails.spellCastingAbilityModifier}</span>
                    </div>
                    <div>
                      <span>Maîtrise : </span>
                      <span>{spellCastingDetails.proficiencyBonus}</span>
                    </div>
                    {spellCastingDetails.magicAttackBonus > 0 && (
                      <div>
                        <span>Bonus : </span>
                        <span>{spellCastingDetails.magicAttackBonus}</span>
                      </div>
                    )}
                  </div>
                }
              />
              <StatCard
                icon={ShieldOff}
                iconColor="text-sky-400"
                value={spellSaveDCDetails.total}
                label="DD sauv."
                definition={
                  <div>
                    <span className="font-bold">DD de sauvegarde des sorts</span>
                    <div>
                      <span>Base : </span>
                      <span>{spellSaveDCDetails.baseValue}</span>
                    </div>
                    <div>
                      <span>{`${shortenAbilityName(spellSaveDCDetails.spellCastingStat)} : `}</span>
                      <span>{spellSaveDCDetails.spellCastingAbilityModifier}</span>
                    </div>
                    <div>
                      <span>Maîtrise : </span>
                      <span>{spellSaveDCDetails.proficiencyBonus}</span>
                    </div>
                    {spellSaveDCDetails.magicDCBonus > 0 && (
                      <div>
                        <span>Bonus : </span>
                        <span>{spellSaveDCDetails.magicDCBonus}</span>
                      </div>
                    )}
                  </div>
                }
              />
              {!!spellsToPreparePerDay && (
                <StatCard
                  icon={CopyCheck}
                  iconColor="text-sky-400"
                  value={spellsToPreparePerDay.total}
                  label="Préparés"
                  definition={
                    <div>
                      <span className="font-bold">Sorts à préparer par jour</span>
                      <div>
                        <span>Quand : </span>
                        <span>{spellsToPreparePerDay.when}</span>
                      </div>
                      <div>
                        <span>Combien : </span>
                        <span>{`${spellsToPreparePerDay.dailyAmount} par jour.`}</span>
                      </div>
                    </div>
                  }
                />
              )}
            </div>

            <SpellSlots character={character} spellsSlotsData={spellsSlots} />
          </SectionPanel>
        )}

        <SectionPanel accent="red" icon={Swords} title="Armes" contentClassName="gap-3">
          {character.weapons.map((weapon) => {
            const weaponAttackBonusDetails = getWeaponAttackBonus(character, weapon);
            return (
              <div key={weapon.id} className="flex flex-col gap-2 rounded-lg bg-muted p-3">
                <Name weapon={weapon} />
                <InfoCell
                  name="Attaque"
                  value={
                    <PopoverComponent
                      definition={
                        <div>
                          <span className="font-bold">Bonus d&apos;attaque : </span>
                          <div>
                            <span>{`${ABILITY_NAME_MAP_TO_FR[weaponAttackBonusDetails.modifierName]} : `}</span>
                            <span>{weaponAttackBonusDetails.abilityModifier}</span>
                          </div>
                          <div>
                            <span>Maitrise : </span>
                            <span>
                              {weaponAttackBonusDetails.proficiencyBonus > 0
                                ? weaponAttackBonusDetails.proficiencyBonus
                                : "non"}
                            </span>
                            {weaponAttackBonusDetails.attackBonus > 0 && (
                              <div>
                                <span>Bonus : </span>
                                <span>{weaponAttackBonusDetails.attackBonus}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    >
                      <span className="font-bold">{weaponAttackBonusDetails.total}</span>
                    </PopoverComponent>
                  }
                />
                <Damages weapon={weapon} character={character} />
                {weapon.reach && (
                  <InfoCell
                    name="Melee"
                    value={
                      <div
                        className={cn({
                          "text-indigo-400": weapon.reach > 5,
                        })}
                      >{`${convertFeetDistanceIntoSquares(weapon.reach)} ${weapon.reach > 5 ? "cases" : "case"}`}</div>
                    }
                  />
                )}
                {weapon.range && weapon.longRange && (
                  <InfoCell
                    name="Distance"
                    value={
                      <div>{`${convertFeetDistanceIntoSquares(weapon.range)} - ${convertFeetDistanceIntoSquares(weapon.longRange)} cases`}</div>
                    }
                  />
                )}
                <AmmunitionForm weapon={weapon} />
                <ExtraEffects weapon={weapon} />
              </div>
            );
          })}
        </SectionPanel>
      </div>

      <SectionPanel
        accent="emerald"
        icon={Sparkles}
        title="Traits & capacités"
        contentClassName="gap-2"
      >
        {character.capacities.map((capacity) => (
          <div key={capacity.id} className="rounded-lg bg-muted p-3">
            <div className="font-bold leading-tight">{capacity.name}</div>
            {capacity.description && (
              <div className="mt-1 whitespace-pre-line text-sm leading-snug text-muted-foreground">
                {capacity.description}
              </div>
            )}
          </div>
        ))}
      </SectionPanel>
    </div>
  );
}
