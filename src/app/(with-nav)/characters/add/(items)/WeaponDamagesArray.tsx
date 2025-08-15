import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { WEAPON_DAMAGE_TYPE_MAP, WEAPON_DICE_MAP } from "@/constants/maps";
import { WeaponDamageDices, WeaponDamageType } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entries } from "remeda";
import { Label } from "@/components/ui/label";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/(with-nav)/characters/add/(items)/ArrayDeleteButton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
  const currentWeaponDamages = weapons[index].damages;
  const hasBaseDamages = currentWeaponDamages.some(
    ({ isBaseDamage }) => isBaseDamage,
  );

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Dégâts</FormLabel>
        <span className="text-primary">*</span>
      </div>

      {fields.length > 0 && (
        <div className="flex flex-col gap-4 pb-2">
          {fields.map((field, index) => {
            const isCurrentBaseDamage =
              currentWeaponDamages[index].isBaseDamage;
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="grid grid-cols-[auto_10%_15%_10%_32%_1fr] gap-1">
                  <ArrayDeleteButton
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.numberOfDices`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="Dés"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.dice`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <div className="flex w-full items-center gap-2">
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={cn({
                                    "text-muted-foreground": !field.value,
                                  })}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {entries(WEAPON_DICE_MAP).map(
                                  ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.flatBonus`}
                    render={({ field: inputField }) => (
                      <FormItem className="relative flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="dgt"
                          />
                        </FormControl>
                        <span className="absolute left-1 top-0">+</span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.type`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <div className="flex w-full items-center gap-2">
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={cn({
                                    "text-muted-foreground": !field.value,
                                  })}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {entries(WEAPON_DAMAGE_TYPE_MAP).map(
                                  ([value, label]) => {
                                    const { icon: Icon, color } =
                                      getDamageTypeIconAndColor(value);
                                    return (
                                      <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                          <Icon className="size-4" />
                                          <span style={{ color }}>{label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  },
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.isBaseDamage`}
                    render={({ field }) => {
                      return (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`isBaseDamage${index}`}
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={hasBaseDamages && !isCurrentBaseDamage}
                          />
                          <Label htmlFor={`isBaseDamage${index}`}>
                            Dgt de base
                          </Label>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ArrayAddButton
        label="Ajouter un type de dégats"
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
    </FormItem>
  );
}
