import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import {
  ABILITY_NAME_MAP_TO_FR,
  AMMUNITION_TYPE_MAP,
  WEAPON_TYPE_MAP,
} from "@/constants/maps";
import {
  Abilities,
  WeaponDamageDices,
  WeaponDamageType,
  WeaponType,
} from "@prisma/client";
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
import WeaponDamagesArray from "@/app/(with-nav)/characters/add/(items)/WeaponDamagesArray";

export default function WeaponsArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "weapons";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const weapons = form.watch("weapons");

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Armes</FormLabel>
      </div>

      {fields.length > 0 && (
        <div className="flex flex-col gap-4 pb-2">
          {fields.map((field, index) => {
            const currentWeaponType = weapons[index].type;
            const hasReach = currentWeaponType !== WeaponType.RANGED;
            const hasRange = currentWeaponType !== WeaponType.MELEE;
            const hasAmmunition = currentWeaponType === WeaponType.RANGED;

            return (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="grid grid-cols-[auto_1fr_20%_15%_15%] gap-1">
                  <ArrayDeleteButton onClick={() => remove(index)} />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.name`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="Nom"
                          />
                        </FormControl>
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
                                {entries(WEAPON_TYPE_MAP).map(
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
                    name={`${fieldName}.${index}.abilityModifier`}
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
                                {entries(ABILITY_NAME_MAP_TO_FR).map(
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
                  {hasReach && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.reach`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...inputField}
                              value={inputField.value?.toString() ?? ""}
                              placeholder="Allonge"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-[20%_20%_25%_25%] items-center gap-1">
                  {hasRange && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.range`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...inputField}
                              value={inputField.value?.toString() ?? ""}
                              placeholder="Portée min"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {hasRange && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.longRange`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...inputField}
                              value={inputField.value?.toString() ?? ""}
                              placeholder="Portée max"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {hasAmmunition && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.ammunitionType`}
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
                                    <SelectValue placeholder="Munitions" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {entries(AMMUNITION_TYPE_MAP).map(
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
                  )}
                  {hasAmmunition && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.ammunitionCount`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...inputField}
                              value={inputField.value?.toString() ?? ""}
                              placeholder="Qté. Munitions"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-[1fr_18%_auto] items-center gap-1">
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.extraEffects`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="Autres effets"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.attackBonus`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="Bonus att."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.isProficient`}
                    render={({ field }) => {
                      return (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`isProficient${index}`}
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor={`isProficient${index}`}>
                            Maîtrisé
                          </Label>
                        </div>
                      );
                    }}
                  />
                </div>

                <div className="ml-8 mt-2">
                  <WeaponDamagesArray form={form} index={index} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ArrayAddButton
        label="Ajouter une arme"
        onClick={() =>
          append({
            name: "",
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
          })
        }
      />
    </FormItem>
  );
}
