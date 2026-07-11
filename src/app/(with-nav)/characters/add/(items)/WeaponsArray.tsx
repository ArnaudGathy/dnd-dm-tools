import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import {
  ABILITY_NAME_MAP_TO_FR,
  AMMUNITION_TYPE_MAP,
  WEAPON_DAMAGE_TYPE_MAP,
  WEAPON_DICE_MAP,
  WEAPON_TYPE_MAP,
} from "@/constants/maps";
import { Abilities, WeaponDamageDices, WeaponDamageType, WeaponType } from "@prisma/client";
import { Asterisk, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import FormFieldToggle from "@/components/ui/inputs/FormFieldToggle";
import WeaponDamagesArray from "@/app/(with-nav)/characters/add/(items)/WeaponDamagesArray";
import { QuickAddCombobox } from "@/app/(with-nav)/characters/add/(items)/itemUI";
import {
  WEAPON_PRESET_GROUPS,
  WEAPON_PRESETS,
} from "@/app/(with-nav)/characters/add/(items)/weaponPresets";

const WEAPON_PICKER_GROUPS = WEAPON_PRESET_GROUPS.map(({ label, keys }) => ({
  label,
  items: keys.map((key) => {
    const preset = WEAPON_PRESETS[key];
    const { numberOfDices, dice, type } = preset.damage;
    return {
      value: key,
      label: preset.name,
      hint: `${numberOfDices}${WEAPON_DICE_MAP[dice]} ${WEAPON_DAMAGE_TYPE_MAP[type].toLowerCase()}`,
    };
  }),
}));

/**
 * Weapons as a quick-add search plus one compact line per weapon, like the
 * inventory. A base weapon from the 2024 table lands fully filled (properties
 * without a dedicated field go to extraEffects) and stays collapsed; a custom
 * weapon opens its row for editing right away. Rows expand to edit any field,
 * and rows with validation errors are forced open so the error summary can
 * reach their inputs.
 */
export default function WeaponsArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "weapons";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const weapons = form.watch(fieldName);
  const itemErrors = form.formState.errors.weapons;
  // Rows opened by the user — keyed by field id so deletions don't shift the
  // state onto another entry.
  const [openRows, setOpenRows] = useState<string[]>([]);
  const openedRows = new Set(openRows);
  // Set when appending a custom weapon: the row id only exists after re-render.
  const shouldExpandLastRow = useRef(false);

  useEffect(() => {
    if (shouldExpandLastRow.current && fields.length > 0) {
      shouldExpandLastRow.current = false;
      const lastIndex = fields.length - 1;
      setOpenRows((open) => [...open, fields[lastIndex].id]);
      requestAnimationFrame(() => form.setFocus(`${fieldName}.${lastIndex}.name`));
    }
  }, [fields, form]);

  const addPreset = (presetKey: string) => {
    const preset = WEAPON_PRESETS[presetKey];
    if (!preset) {
      return;
    }
    append({
      name: preset.name,
      type: preset.type,
      isProficient: true,
      abilityModifier: preset.abilityModifier,
      reach: preset.reach ? String(preset.reach) : "",
      range: preset.range ? String(preset.range) : "",
      longRange: preset.longRange ? String(preset.longRange) : "",
      ammunitionType: preset.ammunitionType,
      ammunitionCount: preset.ammunitionType ? "20" : "",
      extraEffects: preset.extraEffects ?? "",
      damages: [
        {
          isBaseDamage: true,
          numberOfDices: preset.damage.numberOfDices,
          dice: preset.damage.dice,
          type: preset.damage.type,
          flatBonus: "",
        },
      ],
    });
  };

  const addCustom = (name: string) => {
    shouldExpandLastRow.current = true;
    append({
      name,
      type: WeaponType.MELEE,
      isProficient: true,
      abilityModifier: Abilities.STRENGTH,
      damages: [
        {
          isBaseDamage: true,
          dice: WeaponDamageDices.D4,
          numberOfDices: "1",
          type: WeaponDamageType.SLASHING,
        },
      ],
    });
  };

  const toggleRow = (id: string) => {
    setOpenRows((open) => (open.includes(id) ? open.filter((row) => row !== id) : [...open, id]));
  };

  return (
    <div className="flex flex-col gap-3" data-anchor={fieldName}>
      <QuickAddCombobox
        placeholder="Ajouter : épée longue, arc court…"
        ariaLabel="Ajouter une arme"
        groups={WEAPON_PICKER_GROUPS}
        customBrowseLabel="Créer une arme personnalisée"
        onAddPreset={addPreset}
        onAddCustom={addCustom}
        closeOnAdd
      />

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          Aucune arme pour l&apos;instant. Cherchez une arme de base ci-dessus, ou créez une arme
          personnalisée.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {fields.map((field, index) => {
            const weapon = weapons[index];
            const currentWeaponType = weapon?.type;
            const hasReach = currentWeaponType !== WeaponType.RANGED;
            const hasRange = currentWeaponType !== WeaponType.MELEE;
            const hasAmmunition = currentWeaponType === WeaponType.RANGED;
            const hasError = !!itemErrors?.[index];
            const isOpen = openedRows.has(field.id) || hasError;
            const baseDamage = weapon?.damages?.[0];

            return (
              <div key={field.id} data-anchor={`${fieldName}.${index}`}>
                <div className="flex items-center gap-1 py-1 pl-1 pr-2">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-1.5 text-left hover:bg-muted/60"
                    onClick={() => toggleRow(field.id)}
                    aria-expanded={isOpen}
                    aria-label={`Modifier : ${weapon?.name || `arme ${index + 1}`}`}
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-90",
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        !weapon?.name && "font-normal italic text-muted-foreground",
                        hasError && "text-destructive",
                      )}
                    >
                      {weapon?.name || "Arme sans nom"}
                    </span>
                  </button>

                  {baseDamage && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {baseDamage.numberOfDices}
                      {WEAPON_DICE_MAP[baseDamage.dice]}{" "}
                      {WEAPON_DAMAGE_TYPE_MAP[baseDamage.type].toLowerCase()}
                    </span>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={`Supprimer : ${weapon?.name || `arme ${index + 1}`}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {isOpen && (
                  <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.name`}
                        label="Nom"
                        labelClassName="text-sm"
                        required
                      />
                      <FormFieldSelect
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.type`}
                        label="Type"
                        labelClassName="text-sm"
                        items={WEAPON_TYPE_MAP}
                      />
                      <FormFieldSelect
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.abilityModifier`}
                        label="Caractéristique"
                        labelClassName="text-sm"
                        items={ABILITY_NAME_MAP_TO_FR}
                      />
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.attackBonus`}
                        label="Bonus d'attaque"
                        description="Armes magique uniquement"
                        labelClassName="text-sm"
                        inputMode="numeric"
                      />
                    </div>

                    {(hasReach || hasRange || hasAmmunition) && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {hasReach && (
                          <FormFieldInput
                            formInstance={form}
                            formFieldName={`${fieldName}.${index}.reach`}
                            label="Allonge"
                            description="En cases"
                            labelClassName="text-sm"
                            inputMode="numeric"
                            required
                          />
                        )}
                        {hasRange && (
                          <FormFieldInput
                            formInstance={form}
                            formFieldName={`${fieldName}.${index}.range`}
                            label="Portée"
                            description="En cases"
                            labelClassName="text-sm"
                            inputMode="numeric"
                            required
                          />
                        )}
                        {hasRange && (
                          <FormFieldInput
                            formInstance={form}
                            formFieldName={`${fieldName}.${index}.longRange`}
                            label="Portée longue"
                            description="En cases"
                            labelClassName="text-sm"
                            inputMode="numeric"
                            required
                          />
                        )}
                        {hasAmmunition && (
                          <FormFieldSelect
                            formInstance={form}
                            formFieldName={`${fieldName}.${index}.ammunitionType`}
                            label="Munitions"
                            labelClassName="text-sm"
                            placeholder="Type de munitions"
                            items={AMMUNITION_TYPE_MAP}
                            required
                          />
                        )}
                        {hasAmmunition && (
                          <FormFieldInput
                            formInstance={form}
                            formFieldName={`${fieldName}.${index}.ammunitionCount`}
                            label="Quantité de munitions"
                            labelClassName="text-sm"
                            inputMode="numeric"
                            required
                          />
                        )}
                      </div>
                    )}

                    <div className="grid items-end gap-3 md:grid-cols-[1fr_auto]">
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.extraEffects`}
                        label="Effets supplémentaires"
                        description="Armes magiques, bottes d'armes"
                        labelClassName="text-sm"
                      />
                      <FormFieldToggle
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.isProficient`}
                        label="Maîtrisée"
                        icon={Asterisk}
                        accent="indigo"
                      />
                    </div>

                    <WeaponDamagesArray form={form} index={index} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
