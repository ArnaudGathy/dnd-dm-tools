import { CharacterById, cn } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import { ARMOR_TYPE_MAP } from "@/constants/maps";
import Name from "@/app/characters/[id]/(sheet)/(weapons)/Name";
import Damages from "@/app/characters/[id]/(sheet)/(weapons)/Damages";
import InfoCell from "@/app/characters/[id]/(sheet)/(weapons)/InfoCell";
import { convertFeetDistanceIntoSquares } from "@/utils/utils";
import ExtraEffects from "@/app/characters/[id]/(sheet)/(weapons)/ExtraEffects";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Asterisk, CircleAlert, EyeOff, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AmmunitionForm from "@/app/characters/[id]/(sheet)/(forms)/AmmunitionForm";
import MoneyForm from "@/app/characters/[id]/(sheet)/(forms)/MoneyForm";
import InventoryItems from "@/app/characters/[id]/(sheet)/(forms)/InventoryItems";

export default function Inventory({ character }: { character: CharacterById }) {
  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-[1fr_30%_30%] md:p-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {character.wealth.map((money) => (
            <MoneyForm key={money.id} money={money} />
          ))}
        </div>
        <InventoryItems character={character} />
      </div>

      {character.weapons.length > 0 && (
        <div className="flex flex-col gap-4">
          <SheetCard className="flex flex-col">
            <span className="mb-2 self-center text-2xl font-bold">Armes</span>
            <div className="flex flex-col gap-4">
              {character.weapons.map((weapon, index) => (
                <div key={weapon.id}>
                  <div className="flex flex-col">
                    <Name weapon={weapon} />
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
                    <AmmunitionForm weapon={weapon} />
                    <ExtraEffects weapon={weapon} />
                  </div>
                  {index < character.weapons.length - 1 && (
                    <Separator className="mt-4 bg-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </SheetCard>
        </div>
      )}

      {character.armors.length > 0 && (
        <div className="flex flex-col gap-4">
          <SheetCard className="flex flex-col justify-center">
            <span className="mb-2 self-center text-2xl font-bold">Armures</span>

            <div className="flex flex-col gap-4">
              {character.armors.map((armor, index) => {
                const hasNoStrRequirement =
                  !!armor.strengthRequirement &&
                  character.strength < armor.strengthRequirement;
                return (
                  <div key={armor.id}>
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <span
                              className={cn(
                                "flex items-center gap-1 text-lg font-bold",
                                {
                                  "text-primary": hasNoStrRequirement,
                                },
                              )}
                            >
                              {hasNoStrRequirement && (
                                <PopoverComponent
                                  definition={`Force du personnage trop faible pour équiper cette armure. Requis : ${armor.strengthRequirement}. Actuel : ${character.strength}`}
                                >
                                  <CircleAlert className="size-6" />
                                </PopoverComponent>
                              )}
                              {armor.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground">
                              {ARMOR_TYPE_MAP[armor.type]}
                            </span>
                            {armor.isProficient && (
                              <PopoverComponent definition="Armure maîtrisée">
                                <Asterisk className="size-4 text-indigo-500" />
                              </PopoverComponent>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-1">
                            <span className="mt-[3px]">
                              <PopoverComponent definition="Classe d'armure (CA)">
                                <Shield className="text-muted-foreground" />
                              </PopoverComponent>
                            </span>
                            <span className="text-2xl font-bold">
                              {armor.AC}
                            </span>
                          </div>
                          {armor.stealthDisadvantage && (
                            <PopoverComponent definition="Désavantage à la discrétion">
                              <EyeOff className="text-red-400" />
                            </PopoverComponent>
                          )}
                        </div>
                      </div>

                      {!!armor.extraEffects && (
                        <InfoCell name="Effets" value={armor.extraEffects} />
                      )}

                      <div className="flex gap-4">
                        {armor.strengthRequirement && (
                          <InfoCell
                            name="FOR min."
                            value={armor.strengthRequirement}
                          />
                        )}
                      </div>
                    </div>
                    {index < character.armors.length - 1 && (
                      <Separator className="mt-4 bg-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </SheetCard>
        </div>
      )}
    </div>
  );
}
