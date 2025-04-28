import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { ALIGNMENT_MAP } from "@/constants/maps";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";

export default function FormBio({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-[50%] grid-cols-2 gap-4">
          <FormFieldInput
            formInstance={form}
            formFieldName="name"
            label="Nom du personnage"
            required
          />
          <FormFieldSelect
            formInstance={form}
            formFieldName="alignment"
            label="Alignement"
            items={ALIGNMENT_MAP}
            required
          />
        </div>

        <div className="grid grid-cols-[7%_7%_7%_15%_15%_15%_1fr] gap-4">
          <FormFieldInput
            formInstance={form}
            formFieldName="age"
            label="Age"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="weight"
            label="Poids"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="height"
            label="Taille"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="eyeColor"
            label="yeux"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="hair"
            label="Cheveux"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="skin"
            label="Peau"
            required
          />
        </div>

        <FormFieldInput
          formInstance={form}
          formFieldName="physicalTraits"
          label="Traits physiques"
          description="Pour décrire plus en détail le personnage"
          textarea
        />
      </CardContent>
    </Card>
  );
}
