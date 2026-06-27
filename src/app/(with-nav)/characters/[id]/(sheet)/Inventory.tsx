"use client";

import { CharacterById, cn } from "@/lib/utils";
import { ARMOR_TYPE_MAP } from "@/constants/maps";
import Name from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/Name";
import Damages from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/Damages";
import InfoCell from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/InfoCell";
import { convertFeetDistanceIntoSquares } from "@/utils/utils";
import ExtraEffects from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/ExtraEffects";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Asterisk, CircleAlert, Coins, EyeOff, Shield, ShieldHalf, Swords } from "lucide-react";
import AmmunitionForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AmmunitionForm";
import MoneyForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/MoneyForm";
import InventoryItems from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/InventoryItems";
import MagicItems from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/MagicItems";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function Inventory({ character }: { character: CharacterById }) {
  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:w-full md:grid-cols-[1fr_30%_30%] md:items-start md:p-4">
      <div className="flex flex-col gap-4">
        <SectionPanel
          accent="amber"
          icon={Coins}
          title="Bourse"
          contentClassName="grid grid-cols-3 gap-3"
        >
          {character.wealth.map((money) => (
            <MoneyForm key={money.id} money={money} />
          ))}
        </SectionPanel>
        <InventoryItems character={character} />
        <MagicItems character={character} />
      </div>

      {character.weapons.length > 0 && (
        <SectionPanel accent="red" icon={Swords} title="Armes" contentClassName="gap-3">
          {character.weapons.map((weapon) => (
            <div key={weapon.id} className="flex flex-col gap-1 rounded-lg bg-muted p-3">
              <Name weapon={weapon} />
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
          ))}
        </SectionPanel>
      )}

      {character.armors.length > 0 && (
        <SectionPanel accent="slate" icon={ShieldHalf} title="Armures" contentClassName="gap-3">
          {character.armors.map((armor) => {
            const hasNoStrRequirement =
              !!armor.strengthRequirement && character.strength < armor.strengthRequirement;
            return (
              <div key={armor.id} className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                <div className="flex justify-between">
                  <div>
                    <span
                      className={cn("flex items-center gap-1 text-lg font-bold", {
                        "text-primary": hasNoStrRequirement,
                      })}
                    >
                      {hasNoStrRequirement && (
                        <PopoverComponent
                          definition={`Force du personnage trop faible pour équiper cette armure. Requis : ${armor.strengthRequirement}. Actuel : ${character.strength}`}
                        >
                          <CircleAlert className="size-5" />
                        </PopoverComponent>
                      )}
                      {armor.name}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">
                        {ARMOR_TYPE_MAP[armor.type]}
                      </span>
                      {armor.isProficient && (
                        <PopoverComponent definition="Armure maîtrisée">
                          <Asterisk className="size-4 text-indigo-400" />
                        </PopoverComponent>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <PopoverComponent definition="Classe d'armure (CA)">
                        <Shield className="size-5 text-muted-foreground" />
                      </PopoverComponent>
                      <span className="text-2xl font-bold tabular-nums">{armor.AC}</span>
                    </div>
                    {armor.stealthDisadvantage && (
                      <PopoverComponent definition="Désavantage à la discrétion">
                        <EyeOff className="text-red-400" />
                      </PopoverComponent>
                    )}
                  </div>
                </div>

                {!!armor.extraEffects && <InfoCell name="Effets" value={armor.extraEffects} />}
                {armor.strengthRequirement && (
                  <InfoCell name="FOR min." value={armor.strengthRequirement} />
                )}
              </div>
            );
          })}
        </SectionPanel>
      )}
    </div>
  );
}
