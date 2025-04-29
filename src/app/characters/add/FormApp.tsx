import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import {
  CAMPAIGN_MAP,
  CHARACTER_STATUS_MAP,
  PARTY_MAP,
} from "@/constants/maps";
import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { CharacterStatus } from "@prisma/client";

export default function FormApp({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[20%_35%_15%_1fr] gap-4">
        <FormFieldSelect
          formInstance={form}
          formFieldName="party"
          label="Groupe"
          items={PARTY_MAP}
          required
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="campaign"
          label="Campagne"
          items={CAMPAIGN_MAP}
          required
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="status"
          label="Status"
          items={{
            [CharacterStatus.ACTIVE]:
              CHARACTER_STATUS_MAP[CharacterStatus.ACTIVE],
            [CharacterStatus.BACKUP]:
              CHARACTER_STATUS_MAP[CharacterStatus.BACKUP],
          }}
          required
        />
      </CardContent>
    </Card>
  );
}
