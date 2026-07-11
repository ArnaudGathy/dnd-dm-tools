import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { ARMOR_TYPE_MAP } from "@/constants/maps";
import { ArmorType } from "@prisma/client";
import { Asterisk, Check, ChevronRight, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import FormFieldToggle from "@/components/ui/inputs/FormFieldToggle";
import { QuickAddCombobox } from "@/app/(with-nav)/characters/add/(items)/itemUI";
import {
  ARMOR_PRESETS,
  ARMOR_PRESETS_BY_TYPE,
} from "@/app/(with-nav)/characters/add/(items)/armorPresets";

const ARMOR_PRESET_GROUPS = ARMOR_PRESETS_BY_TYPE.map(({ type, keys }) => ({
  label: ARMOR_TYPE_MAP[type],
  items: keys.map((key) => {
    const preset = ARMOR_PRESETS[key];
    return {
      value: key,
      label: preset.name,
      hint: `CA ${preset.type === ArmorType.SHIELD ? "+" : ""}${preset.AC}`,
    };
  }),
}));

/**
 * Armors as a quick-add search plus one compact line per armor, like the
 * inventory. A base armor from the 2024 table lands fully filled and stays
 * collapsed; a custom armor opens its row for editing right away. Rows expand
 * to edit any field, and rows with validation errors are forced open so the
 * error summary can reach their inputs. The first armor added is equipped.
 */
export default function ArmorsArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "armors";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const armors = form.watch(fieldName);
  const itemErrors = form.formState.errors.armors;
  // Rows opened by the user — keyed by field id so deletions don't shift the
  // state onto another entry.
  const [openRows, setOpenRows] = useState<string[]>([]);
  const openedRows = new Set(openRows);
  // Set when appending a custom armor: the row id only exists after re-render.
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
    const preset = ARMOR_PRESETS[presetKey];
    if (!preset) {
      return;
    }
    append({
      name: preset.name,
      type: preset.type,
      AC: String(preset.AC),
      strengthRequirement: preset.strengthRequirement ? String(preset.strengthRequirement) : "",
      stealthDisadvantage: preset.type !== ArmorType.SHIELD ? preset.stealthDisadvantage : false,
      isProficient: true,
      // A shield is worn alongside an armor, so it starts equipped; otherwise
      // only the first armor of the list does.
      isEquipped: preset.type === ArmorType.SHIELD || fields.length === 0,
    });
  };

  const addCustom = (name: string) => {
    shouldExpandLastRow.current = true;
    append({
      name,
      type: ArmorType.LIGHT,
      isProficient: true,
      AC: "",
      stealthDisadvantage: false,
      isEquipped: fields.length === 0,
    });
  };

  const toggleRow = (id: string) => {
    setOpenRows((open) => (open.includes(id) ? open.filter((row) => row !== id) : [...open, id]));
  };

  return (
    <div className="flex flex-col gap-3" data-anchor={fieldName}>
      <QuickAddCombobox
        placeholder="Ajouter : cotte de mailles, bouclier…"
        ariaLabel="Ajouter une armure"
        groups={ARMOR_PRESET_GROUPS}
        customBrowseLabel="Créer une armure personnalisée"
        onAddPreset={addPreset}
        onAddCustom={addCustom}
        closeOnAdd
      />

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          Aucune armure pour l&apos;instant — un personnage sans armure utilise sa CA de base.
          Cherchez une armure ci-dessus, ou créez une armure personnalisée.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {fields.map((field, index) => {
            const armor = armors[index];
            const currentArmorType = armor?.type;
            const isHeavy = currentArmorType === ArmorType.HEAVY;
            const isShield = currentArmorType === ArmorType.SHIELD;
            const hasError = !!itemErrors?.[index];
            const isOpen = openedRows.has(field.id) || hasError;

            return (
              <div key={field.id} data-anchor={`${fieldName}.${index}`}>
                <div className="flex items-center gap-1 py-1 pl-1 pr-2">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-1.5 text-left hover:bg-muted/60"
                    onClick={() => toggleRow(field.id)}
                    aria-expanded={isOpen}
                    aria-label={`Modifier : ${armor?.name || `armure ${index + 1}`}`}
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
                        !armor?.name && "font-normal italic text-muted-foreground",
                        hasError && "text-destructive",
                      )}
                    >
                      {armor?.name || "Armure sans nom"}
                    </span>
                  </button>

                  {armor?.isEquipped && (
                    <Check
                      className="size-3.5 shrink-0 text-emerald-400"
                      aria-label={isShield ? "Équipé" : "Équipée"}
                    />
                  )}
                  {!!armor?.AC && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      CA {isShield ? "+" : ""}
                      {armor.AC}
                    </span>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={`Supprimer : ${armor?.name || `armure ${index + 1}`}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {isOpen && (
                  <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
                    <div className="grid gap-3 md:grid-cols-[1fr_10rem_5rem]">
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
                        items={ARMOR_TYPE_MAP}
                      />
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.AC`}
                        label="CA"
                        labelClassName="text-sm"
                        inputMode="numeric"
                        required
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.extraEffects`}
                        label="Effets supplémentaires"
                        description="Armures magiques"
                        labelClassName="text-sm"
                      />
                      {isHeavy && (
                        <FormFieldInput
                          formInstance={form}
                          formFieldName={`${fieldName}.${index}.strengthRequirement`}
                          label="Force minimum"
                          labelClassName="text-sm"
                          inputMode="numeric"
                          required
                        />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <FormFieldToggle
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.isEquipped`}
                        label={isShield ? "Équipé" : "Équipée"}
                        icon={Check}
                        accent="emerald"
                      />
                      {!isShield && (
                        <FormFieldToggle
                          formInstance={form}
                          formFieldName={`${fieldName}.${index}.isProficient`}
                          label="Maîtrisée"
                          icon={Asterisk}
                          accent="indigo"
                        />
                      )}
                      {!isShield && (
                        <FormFieldToggle
                          formInstance={form}
                          formFieldName={`${fieldName}.${index}.stealthDisadvantage`}
                          label="Désavantage à la discrétion"
                          icon={EyeOff}
                          accent="red"
                        />
                      )}
                    </div>
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
