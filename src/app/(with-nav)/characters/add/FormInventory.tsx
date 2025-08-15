import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryArray from "@/app/(with-nav)/characters/add/(items)/InventoryArray";
import WealthArray from "@/app/(with-nav)/characters/add/(items)/WealthArray";
import ArmorsArray from "@/app/(with-nav)/characters/add/(items)/ArmorsArray";
import WeaponsArray from "@/app/(with-nav)/characters/add/(items)/WeaponsArray";

export default function FormInventory({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventaire</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <WealthArray form={form} />
        <InventoryArray form={form} />
        <WeaponsArray form={form} />
        <ArmorsArray form={form} />
      </CardContent>
    </Card>
  );
}
