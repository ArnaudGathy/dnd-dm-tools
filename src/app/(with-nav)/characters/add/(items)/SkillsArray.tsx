import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SKILL_NAME_MAP } from "@/constants/maps";
import { Skills } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entries } from "remeda";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/(with-nav)/characters/add/(items)/ArrayDeleteButton";

export default function SkillsArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "skills";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const skills = form.watch(fieldName);
  const rootError = form.formState.errors.skills?.root?.message;

  const existingSkills = new Set(skills.map((entry) => entry.skill));
  const availableSkills = Object.values(Skills).filter((skill) => !existingSkills.has(skill));

  return (
    <div className="flex flex-col gap-2" data-anchor={fieldName}>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`${fieldName}.${index}`}
            render={({ field: itemField }) => {
              const isExpert = itemField.value?.isExpert;
              return (
                <FormItem data-anchor={`${fieldName}.${index}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={itemField.value?.skill}
                      onValueChange={(val) =>
                        itemField.onChange({ ...itemField.value, skill: val as Skills })
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full min-w-36 flex-1 md:max-w-52">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entries(SKILL_NAME_MAP).map(([value, label]) => (
                          <SelectItem
                            key={value}
                            value={value}
                            disabled={existingSkills.has(value)}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div
                      className="flex shrink-0 rounded-md border border-border bg-muted/40 p-0.5"
                      role="group"
                      aria-label="Niveau de maîtrise"
                    >
                      {[
                        { key: "proficient", label: "Maîtrise", active: !isExpert },
                        { key: "expert", label: "Expertise", active: !!isExpert },
                      ].map(({ key, label, active }) => (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            itemField.onChange({
                              ...itemField.value,
                              isProficient: key === "proficient",
                              isExpert: key === "expert",
                            })
                          }
                          className={cn(
                            "rounded px-2.5 py-1 text-sm transition-colors",
                            active &&
                              key === "expert" &&
                              "bg-amber-400/20 font-semibold text-amber-400",
                            active &&
                              key === "proficient" &&
                              "bg-indigo-500/20 font-semibold text-indigo-300",
                            !active && "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <ArrayDeleteButton
                      onClick={() => remove(index)}
                      disabled={fields.length < 2}
                      label={`Supprimer la compétence ${SKILL_NAME_MAP[itemField.value?.skill]}`}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
      </div>

      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}

      <ArrayAddButton
        label="Ajouter une compétence"
        disabled={skills.length === 18}
        onClick={() =>
          append({
            skill: availableSkills[0],
            isProficient: true,
            isExpert: false,
          })
        }
      />
    </div>
  );
}
