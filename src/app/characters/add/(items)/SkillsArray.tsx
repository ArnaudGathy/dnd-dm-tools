import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ArrayAddButton from "@/app/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/characters/add/(items)/ArrayDeleteButton";

export default function SkillsArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "skills";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const skills = form.watch("skills");

  const existingSkills = skills.map(
    (skill: { skill: Skills; isProficient: boolean; isExpert: boolean }) =>
      skill.skill,
  );
  const availableSkills = Object.values(Skills).filter(
    (skill) => !existingSkills.includes(skill),
  );

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Maîtrise des compétences</FormLabel>
        <span className="text-primary">*</span>
      </div>

      <div className="flex flex-col gap-1">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-1">
            <ArrayDeleteButton
              onClick={() => remove(index)}
              disabled={fields.length < 2}
            />
            <FormField
              control={form.control}
              name={`${fieldName}.${index}`}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <div className="grid grid-cols-[35%_25%] items-center gap-2">
                      <Select
                        defaultValue={field.value?.skill}
                        onValueChange={(val) =>
                          field.onChange({
                            ...field.value,
                            skill: val as Skills,
                          })
                        }
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
                          {entries(SKILL_NAME_MAP).map(([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              disabled={
                                !!skills.find((item) => item.skill === value)
                              }
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <RadioGroup
                        className="flex h-full gap-4"
                        defaultValue={
                          field.value?.isProficient ? "proficient" : "expert"
                        }
                        onValueChange={(val) =>
                          field.onChange({
                            ...field.value,
                            isProficient: val === "proficient",
                            isExpert: val === "expert",
                          })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="proficient" id="r1" />
                          <Label htmlFor="r1">Maitrise</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expert" id="r2" />
                          <Label htmlFor="r2">Expertise</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        ))}
      </div>

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
    </FormItem>
  );
}
