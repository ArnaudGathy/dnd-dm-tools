import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";

export default function FormBioBehaviour({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comportement</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormFieldInput
          formInstance={form}
          formFieldName="personalityTraits"
          label="Traits de personalité"
          textarea
          required
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="ideals"
          label="Idéaux"
          textarea
          required
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="bonds"
          label="Liens"
          textarea
          required
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="flaws"
          label="Défauts"
          textarea
          required
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="lore"
          label="Lore"
          textarea
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="allies"
          label="Alliés et organisations"
          textarea
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="notes"
          label="Notes"
          textarea
          description="Notes de tous genres à stocker dans la fiche de personnage"
        />
      </CardContent>
    </Card>
  );
}
