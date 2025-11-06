import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { ARMOR_TYPE_MAP } from "@/constants/maps";
import { ArmorType } from "@prisma/client";
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

export default function ArmorsArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "armors";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const armors = form.watch("armors");

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Armures</FormLabel>
      </div>

      {fields.length > 0 && (
        <div className="flex flex-col gap-4 pb-2">
          {fields.map((field, index) => {
            const currentArmorType = armors[index].type;
            const isHeavy = currentArmorType === ArmorType.HEAVY;
            const isShield = currentArmorType === ArmorType.SHIELD;
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="grid grid-cols-[auto_1fr_27%_11%_11%] gap-1">
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
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                                {entries(ARMOR_TYPE_MAP).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
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
                    name={`${fieldName}.${index}.AC`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...inputField}
                            value={inputField.value?.toString() ?? ""}
                            placeholder="CA"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isHeavy && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.strengthRequirement`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...inputField}
                              value={inputField.value?.toString() ?? ""}
                              placeholder="FOR"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

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

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.isEquipped`}
                    render={({ field }) => {
                      return (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`isEquipped${index}`}
                            defaultChecked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor={`isEquipped${index}`}>Équipé</Label>
                        </div>
                      );
                    }}
                  />
                  {!isShield && (
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
                            <Label htmlFor={`isProficient${index}`}>Maîtrisé</Label>
                          </div>
                        );
                      }}
                    />
                  )}
                  {!isShield && (
                    <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.stealthDisadvantage`}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`stealthDisadvantage${index}`}
                              defaultChecked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor={`stealthDisadvantage${index}`}>
                              Désavantage à la discrétion
                            </Label>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ArrayAddButton
        label="Ajouter une armure"
        onClick={() =>
          append({
            name: "",
            type: ArmorType.LIGHT,
            isProficient: true,
            AC: "",
            stealthDisadvantage: false,
            isEquipped: fields.length === 0,
          })
        }
      />
    </FormItem>
  );
}
