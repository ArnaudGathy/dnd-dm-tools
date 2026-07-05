import { CharacterById, cn } from "@/lib/utils";
import { ArmorType } from "@prisma/client";
import { Asterisk, BicepsFlexed, Check, EyeOff, Shield, Sparkles } from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { ARMOR_TYPE_MAP } from "@/constants/maps";
import { addSignToNumber } from "@/utils/utils";
import StatBreakdown, {
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import { weaponChipClassName } from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/WeaponCard";

/**
 * One armor as a card mirroring WeaponCard: the number needed at a glance (CA)
 * front and center, wearing conditions (équipée, discrétion, force requise) as
 * quiet chips.
 */
export default function ArmorCard({
  character,
  armor,
}: {
  character: CharacterById;
  armor: CharacterById["armors"][number];
}) {
  const isShield = armor.type === ArmorType.SHIELD;
  const lacksStrength =
    !!armor.strengthRequirement && character.strength < armor.strengthRequirement;
  const displayedAC = isShield ? addSignToNumber(armor.AC) : armor.AC;

  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-muted p-3">
      <div className="flex items-stretch justify-between gap-2">
        <div className="flex min-w-0 flex-col justify-center gap-0.5">
          <span className="flex items-center gap-1 text-base font-bold leading-tight">
            {armor.name}
            {armor.isProficient && (
              <PopoverComponent
                contentClassName={breakdownContentClassName}
                definition={
                  <StatBreakdown
                    accent="indigo"
                    icon={Asterisk}
                    title="Armure maîtrisée"
                    note="Le personnage sait porter cette armure sans malus."
                  />
                }
              >
                <Asterisk className="size-4 shrink-0 text-indigo-400" />
              </PopoverComponent>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{ARMOR_TYPE_MAP[armor.type]}</span>
        </div>

        <PopoverComponent
          className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-background/50 py-1.5 transition-colors hover:bg-background/70"
          contentClassName={breakdownContentClassName}
          definition={
            <StatBreakdown
              accent="slate"
              icon={Shield}
              title="Classe d'armure"
              note={
                isShield
                  ? "Bonus ajouté à la CA tant que le bouclier est équipé."
                  : "CA de base tant que cette armure est portée."
              }
              total={displayedAC}
              totalLabel="CA"
            />
          }
        >
          <span className="text-2xl font-bold tabular-nums leading-none">{displayedAC}</span>
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            CA
          </span>
        </PopoverComponent>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 empty:hidden">
        {armor.isEquipped && (
          <span className={weaponChipClassName}>
            <Check className="size-3.5 text-emerald-400" />
            <span className="text-emerald-400">{isShield ? "Équipé" : "Équipée"}</span>
          </span>
        )}
        {armor.stealthDisadvantage && (
          <PopoverComponent
            className={weaponChipClassName}
            contentClassName={breakdownContentClassName}
            definition={
              <StatBreakdown
                accent="red"
                icon={EyeOff}
                title="Discrétion"
                note="Désavantage aux jets de Dextérité (Discrétion) tant que cette armure est portée."
              />
            }
          >
            <EyeOff className="size-3.5 text-red-400" />
            <span className="text-red-400">Discrétion</span>
          </PopoverComponent>
        )}
        {!!armor.strengthRequirement && (
          <PopoverComponent
            className={weaponChipClassName}
            contentClassName={breakdownContentClassName}
            definition={
              <StatBreakdown
                accent={lacksStrength ? "red" : "slate"}
                icon={BicepsFlexed}
                title="Force requise"
                rows={[
                  { label: "Requis", value: armor.strengthRequirement },
                  { label: "Force actuelle", value: character.strength },
                ]}
                note={
                  lacksStrength
                    ? "Force du personnage trop faible pour équiper cette armure."
                    : undefined
                }
              />
            }
          >
            <BicepsFlexed
              className={cn("size-3.5", lacksStrength ? "text-red-400" : "text-muted-foreground")}
            />
            <span className={cn({ "text-red-400": lacksStrength })}>
              FOR {armor.strengthRequirement}
            </span>
          </PopoverComponent>
        )}
      </div>

      {armor.extraEffects && (
        <div className="flex items-start gap-1.5 text-sm leading-snug text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
          {armor.extraEffects}
        </div>
      )}
    </div>
  );
}
