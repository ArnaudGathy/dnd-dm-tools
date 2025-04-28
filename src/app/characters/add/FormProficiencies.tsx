import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SavingThrowsArray from "@/app/characters/add/(items)/SavingThrowsArray";
import SkillsArray from "@/app/characters/add/(items)/SkillsArray";
import ProficienciesArray from "@/app/characters/add/(items)/ProficienciesArray";
import CapacitiesArray from "@/app/characters/add/(items)/CapacitiesArray";

export default function FormProficiencies({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maîtrises & capacités</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <SavingThrowsArray form={form} />
        <SkillsArray form={form} />
        <ProficienciesArray form={form} />
        <CapacitiesArray form={form} />
      </CardContent>
    </Card>
  );
}
