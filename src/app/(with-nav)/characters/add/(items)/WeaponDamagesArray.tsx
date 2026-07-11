import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { WEAPON_DAMAGE_TYPE_MAP, WEAPON_DICE_MAP } from "@/constants/maps";
import { WeaponDamageDices, WeaponDamageType } from "@prisma/client";
import { Star } from "lucide-react";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/(with-nav)/characters/add/(items)/ArrayDeleteButton";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import FormFieldToggle from "@/components/ui/inputs/FormFieldToggle";

import { getDamageTypeIconAndColor } from "@/utils/stats/weapons";

export default function WeaponDamagesArray({
  form,
  index,
}: {
  form: UseFormReturn<CharacterCreationForm>;
  index: number;
}) {
  const fieldName = `weapons.${index}.damages` as `weapons.${number}.damages`;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const weapons = form.watch("weapons");
  const currentWeaponDamages = weapons[index]?.damages ?? [];
  const hasBaseDamages = currentWeaponDamages.some(({ isBaseDamage }) => isBaseDamage);

  const damageTypeItems = Object.fromEntries(
    Object.entries(WEAPON_DAMAGE_TYPE_MAP).map(([value, label]) => {
      const { icon: Icon, color } = getDamageTypeIconAndColor(value as WeaponDamageType);
      return [
        value,
        <div key={value} className="flex items-center gap-2">
          <Icon className="size-4" />
          <span style={{ color }}>{label}</span>
        </div>,
      ];
    }),
  );

  return (
    <div className="flex flex-col gap-2" data-anchor={fieldName}>
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        Dégâts
      </span>

      {fields.map((field, damageIndex) => {
        const isCurrentBaseDamage = currentWeaponDamages[damageIndex]?.isBaseDamage;
        return (
          <div key={field.id} className="rounded-md border border-border/70 bg-background/40 p-2.5">
            <div className="grid grid-cols-2 items-start gap-2 md:grid-cols-[4.5rem_5.5rem_5.5rem_1fr_auto]">
              <FormFieldInput
                formInstance={form}
                formFieldName={`${fieldName}.${damageIndex}.numberOfDices`}
                label="Dés"
                labelClassName="text-sm"
                inputMode="numeric"
              />
              <FormFieldSelect
                formInstance={form}
                formFieldName={`${fieldName}.${damageIndex}.dice`}
                label="Type de dé"
                labelClassName="text-sm"
                items={WEAPON_DICE_MAP}
              />
              <FormFieldInput
                formInstance={form}
                formFieldName={`${fieldName}.${damageIndex}.flatBonus`}
                label="Bonus fixe"
                labelClassName="text-sm"
                inputMode="numeric"
              />
              <FormFieldSelect
                formInstance={form}
                formFieldName={`${fieldName}.${damageIndex}.type`}
                label="Type de dégâts"
                labelClassName="text-sm"
                items={damageTypeItems}
              />
              <div className="col-span-2 flex items-end justify-end gap-1.5 md:col-span-1 md:h-full">
                <FormFieldToggle
                  formInstance={form}
                  formFieldName={`${fieldName}.${damageIndex}.isBaseDamage`}
                  label="Dégâts de base"
                  icon={Star}
                  accent="amber"
                  disabled={hasBaseDamages && !isCurrentBaseDamage}
                />
                <ArrayDeleteButton
                  onClick={() => remove(damageIndex)}
                  disabled={fields.length === 1}
                  label={`Supprimer les dégâts ${damageIndex + 1}`}
                />
              </div>
            </div>
          </div>
        );
      })}

      <ArrayAddButton
        label="Ajouter un type de dégâts"
        onClick={() =>
          append({
            isBaseDamage: false,
            dice: WeaponDamageDices.D4,
            numberOfDices: "1",
            flatBonus: "0",
            type: WeaponDamageType.SLASHING,
          })
        }
      />
    </div>
  );
}
