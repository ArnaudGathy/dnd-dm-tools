import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import {
  ABILITIES_MAP,
  BACKGROUND_MAP,
  CLASS_MAP,
  RACE_MAP,
  SUBCLASS_MAP,
  SUBCLASSES_BY_CLASS,
} from "@/constants/maps";
import { keys } from "remeda";
import { shortenAbilityName } from "@/utils/utils";

export default function FormGeneral({
  form,
  isEditMode,
  hasSubclass,
}: {
  form: UseFormReturn<CharacterCreationForm>;
  isEditMode: boolean;
  hasSubclass: boolean;
}) {
  const className = form.watch("className");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Général</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-[35%_25%_25%] gap-4">
          <div className="flex flex-col gap-4">
            <FormFieldInput
              formFieldName="level"
              formInstance={form}
              label="Niveau"
              disabled={!isEditMode}
            />
            <FormFieldSelect
              formInstance={form}
              formFieldName="className"
              label="Classe"
              items={CLASS_MAP}
              required
              disabled={isEditMode}
            />
            <FormFieldSelect
              formInstance={form}
              formFieldName="subclassName"
              label="Sous-classe"
              description={
                isEditMode ? undefined : "Peut-être choisi plus tard"
              }
              items={
                className
                  ? SUBCLASSES_BY_CLASS[className].reduce((acc, next) => {
                      return { ...acc, [next]: SUBCLASS_MAP[next] };
                    }, {})
                  : []
              }
              disabled={!className || (isEditMode && hasSubclass)}
            />
          </div>

          <div className="flex flex-col justify-end gap-4">
            <FormFieldSelect
              formInstance={form}
              formFieldName="race"
              label="Race"
              items={RACE_MAP}
              required
              disabled={isEditMode}
            />
            <FormFieldSelect
              formInstance={form}
              formFieldName="background"
              label="Historique"
              items={BACKGROUND_MAP}
              required
              disabled={isEditMode}
            />
          </div>

          <div className="flex flex-col justify-end gap-4">
            <div className="grid grid-cols-3 gap-4">
              {keys(ABILITIES_MAP).map((stat) => {
                return (
                  <FormFieldInput
                    key={stat}
                    formInstance={form}
                    formFieldName={stat}
                    label={shortenAbilityName(stat)}
                    required
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
