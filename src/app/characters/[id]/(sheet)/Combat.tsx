import { CharacterById, cn } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import {
  BookOpenIcon,
  ChevronsUp,
  CopyCheck,
  Footprints,
  Hand,
  Heart,
  Shield,
  ShieldOff,
  WandSparkles,
} from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { ElementType, ReactNode } from "react";
import {
  convertFeetDistanceIntoSquares,
  shortenAbilityName,
} from "@/utils/utils";
import { ABILITY_NAME_MAP_TO_FR, AMMUNITION_TYPE_MAP } from "@/constants/maps";
import {
  getInitiativeModifier,
  getMovementSpeed,
  getSpellCastingModifier,
  getSpellSaveDC,
  getTotalAC,
  getWeaponAttackBonus,
  getSpellsToPreparePerDay,
  getMartialClassDC,
} from "@/utils/skills";
import SavingThrows from "@/app/characters/[id]/(sheet)/(skills)/SavingThrows";
import Name from "@/app/characters/[id]/(sheet)/(weapons)/Name";
import Damages from "@/app/characters/[id]/(sheet)/(weapons)/Damages";
import InfoCell from "@/app/characters/[id]/(sheet)/(weapons)/InfoCell";
import ExtraEffects from "@/app/characters/[id]/(sheet)/(weapons)/ExtraEffects";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SpellSlots from "@/app/characters/[id]/(sheet)/(spells)/SpellSlots";
import { Separator } from "@/components/ui/separator";

const StatCard = ({
  value,
  definition,
  icon: Icon,
  iconColor = "text-muted-foreground",
}: {
  icon: ElementType;
  value: ReactNode;
  definition: ReactNode;
  iconColor?: string;
}) => {
  return (
    <SheetCard className="flex items-center justify-center">
      <PopoverComponent definition={definition}>
        <div className="flex min-w-16 flex-col items-center gap-2">
          <Icon className={cn("stroke-[2.5px]", iconColor)} />
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </PopoverComponent>
    </SheetCard>
  );
};

export default function Combat({ character }: { character: CharacterById }) {
  const ACDetails = getTotalAC(character);
  const spellCastingDetails = getSpellCastingModifier(character);
  const spellSaveDCDetails = getSpellSaveDC(character);
  const initiativeDetails = getInitiativeModifier(character);
  const movementSpeedDetails = getMovementSpeed(character);
  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);
  const martialClassDC = getMartialClassDC(character);
  const hasSpells = character.spellsOnCharacters.length > 0;

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-4 md:p-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Heart}
            iconColor="text-primary"
            value={
              <>
                <span
                  className={cn({
                    "text-green-500": character.currentHP < character.maximumHP,
                    "text-orange-500":
                      character.currentHP <= character.maximumHP * 0.5,
                    "text-red-500":
                      character.currentHP <= character.maximumHP * 0.2,
                  })}
                >
                  {character.currentHP}
                </span>
                <span>/</span>
                <span>{character.maximumHP}</span>
              </>
            }
            definition="Points de vie (PV)"
          />

          <StatCard
            icon={Shield}
            iconColor="text-stone-400"
            value={ACDetails.total}
            definition={
              <div>
                <span className="font-bold">Classe d&#39;armure (CA)</span>
                {ACDetails.armorAC > 0 && (
                  <div>
                    <span>Armure / base : </span>
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
                    <span>Modificateurs : </span>
                    <span>{ACDetails.abilityACModifier}</span>
                  </div>
                )}
                {ACDetails.ACBonus > 0 && (
                  <div>
                    <span>Bonus : </span>
                    <span>{ACDetails.ACBonus}</span>
                  </div>
                )}
              </div>
            }
          />
          <StatCard
            icon={Footprints}
            iconColor="text-amber-700"
            value={movementSpeedDetails.total}
            definition={
              <div>
                <span className="font-bold">
                  Vitesse de déplacement (en cases)
                </span>
                <div>
                  <span>Racial : </span>
                  <span>{movementSpeedDetails.raceSpeed}</span>
                </div>
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
            iconColor="text-green-600"
            value={initiativeDetails.total}
            definition={
              <div>
                <span className="font-bold">
                  Bonus au jet d&apos;initiative
                </span>
                <div>
                  <span>DEX : </span>
                  <span>{initiativeDetails.dexterityModifier}</span>
                </div>
                {initiativeDetails.initiativeBonus > 0 && (
                  <div>
                    <span>Bonus : </span>
                    <span>{initiativeDetails.initiativeBonus}</span>
                  </div>
                )}
              </div>
            }
          />
        </div>
        <SavingThrows character={character} />
      </div>

      <div className="flex flex-col gap-4">
        {martialClassDC && (
          <StatCard
            icon={Hand}
            iconColor="text-[#90a1b9]"
            value={martialClassDC.total}
            definition={
              <div>
                <span className="font-bold">Modificateur martial</span>
                <div>
                  <span>Base : </span>
                  <span>{martialClassDC.base}</span>
                </div>
                {martialClassDC.modifier > 0 && (
                  <div>
                    <span>
                      {`Modificateur (${martialClassDC.modifierName}) :`}{" "}
                    </span>
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
        {hasSpells && (
          <>
            <SheetCard className="flex flex-col">
              <span className="mb-2 self-center text-2xl font-bold">Sorts</span>
              <div className="flex justify-between">
                <StatCard
                  icon={WandSparkles}
                  iconColor="text-sky-500"
                  value={spellCastingDetails.total}
                  definition={
                    <div>
                      <span className="font-bold">
                        Bonus de jet d&apos;attaque des sorts
                      </span>
                      <div>
                        <span>{`${shortenAbilityName(spellCastingDetails.spellCastingStat)} : `}</span>
                        <span>
                          {spellCastingDetails.spellCastingAbilityModifier}
                        </span>
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
                  iconColor="text-sky-500"
                  value={spellSaveDCDetails.total}
                  definition={
                    <div>
                      <span className="font-bold">
                        DD de sauvegarde des sorts
                      </span>
                      <div>
                        <span>Base : </span>
                        <span>{spellSaveDCDetails.baseValue}</span>
                      </div>
                      <div>
                        <span>{`${shortenAbilityName(spellSaveDCDetails.spellCastingStat)} : `}</span>
                        <span>
                          {spellSaveDCDetails.spellCastingAbilityModifier}
                        </span>
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
                {spellsToPreparePerDay && (
                  <StatCard
                    icon={CopyCheck}
                    iconColor="text-sky-500"
                    value={spellsToPreparePerDay}
                    definition="Sorts à préparer par jour"
                  />
                )}
              </div>

              <span className="self-center text-lg font-bold">
                Emplacements
              </span>
              <div>
                <SpellSlots character={character} />
              </div>

              <div className="flex justify-center">
                <Link
                  href={`/characters/${character.id}/spells`}
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    className="w-full border-2 border-sky-500 bg-sky-950 font-bold hover:bg-sky-900"
                  >
                    <BookOpenIcon className="text-sky-500" />
                    Liste des sorts
                  </Button>
                </Link>
              </div>
            </SheetCard>
          </>
        )}
        <div className="flex flex-col gap-4">
          <SheetCard className="flex flex-col">
            <span className="mb-2 self-center text-2xl font-bold">Armes</span>
            <div className="flex flex-col gap-4">
              {character.weapons.map((weapon, index) => {
                const weaponAttackBonusDetails = getWeaponAttackBonus(
                  character,
                  weapon,
                );
                return (
                  <div key={weapon.id}>
                    <div className="flex flex-col gap-2">
                      <Name weapon={weapon} />
                      <InfoCell
                        name="Attaque"
                        value={
                          <PopoverComponent
                            definition={
                              <div>
                                <span className="font-bold">
                                  Bonus d&apos;attaque :{" "}
                                </span>
                                <div>
                                  <span>{`${ABILITY_NAME_MAP_TO_FR[weaponAttackBonusDetails.modifierName]} : `}</span>
                                  <span>
                                    {weaponAttackBonusDetails.abilityModifier}
                                  </span>
                                </div>
                                <div>
                                  <span>Maitrise : </span>
                                  <span>
                                    {weaponAttackBonusDetails.proficiencyBonus >
                                    0
                                      ? weaponAttackBonusDetails.proficiencyBonus
                                      : "non"}
                                  </span>
                                  {weaponAttackBonusDetails.attackBonus > 0 && (
                                    <div>
                                      <span>Bonus : </span>
                                      <span>
                                        {weaponAttackBonusDetails.attackBonus}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                          >
                            {weaponAttackBonusDetails.total}
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
                                "text-indigo-500": weapon.reach > 5,
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
                      {weapon.ammunitionType &&
                        weapon.ammunitionCount !== null && (
                          <InfoCell
                            name="Munitions"
                            value={`${weapon.ammunitionCount} ${AMMUNITION_TYPE_MAP[weapon.ammunitionType]}`}
                          />
                        )}
                      <ExtraEffects weapon={weapon} />
                    </div>
                    {index < character.weapons.length - 1 && (
                      <Separator className="mt-4 bg-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </SheetCard>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <SheetCard className="flex flex-col">
          <span className="mb-2 self-center text-2xl font-bold">
            Traits & capacités
          </span>
          <ul className="flex flex-col gap-2">
            {character.capacities.map((capacity) => (
              <li key={capacity.id} className="leading-none">
                <span className="mr-2 text-base">{capacity.name}</span>
                {capacity.description && (
                  <span className="text-sm leading-4 text-muted-foreground">
                    {capacity.description}
                  </span>
                )}
                <span></span>
              </li>
            ))}
          </ul>
        </SheetCard>
      </div>
    </div>
  );
}
