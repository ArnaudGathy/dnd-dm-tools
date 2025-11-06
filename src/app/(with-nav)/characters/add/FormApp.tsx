import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import { CAMPAIGN_MAP, CHARACTER_STATUS_MAP, PARTY_MAP } from "@/constants/maps";
import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { CharacterStatus } from "@prisma/client";

export default function FormApp({
  form,
  isEditMode,
}: {
  form: UseFormReturn<CharacterCreationForm>;
  isEditMode?: boolean;
}) {
  const statusOptions:
    | {
        ACTIVE: string;
        BACKUP: string;
        RETIRED: string;
        DEAD: string;
      }
    | {
        ACTIVE: string;
        BACKUP: string;
      } = isEditMode
    ? {
        [CharacterStatus.ACTIVE]: CHARACTER_STATUS_MAP[CharacterStatus.ACTIVE],
        [CharacterStatus.BACKUP]: CHARACTER_STATUS_MAP[CharacterStatus.BACKUP],
        [CharacterStatus.RETIRED]: CHARACTER_STATUS_MAP[CharacterStatus.RETIRED],
        [CharacterStatus.DEAD]: CHARACTER_STATUS_MAP[CharacterStatus.DEAD],
      }
    : {
        [CharacterStatus.ACTIVE]: CHARACTER_STATUS_MAP[CharacterStatus.ACTIVE],
        [CharacterStatus.BACKUP]: CHARACTER_STATUS_MAP[CharacterStatus.BACKUP],
      };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[25%_35%_15%_1fr] gap-4">
        <FormFieldSelect
          formInstance={form}
          formFieldName="party"
          label="Groupe"
          items={PARTY_MAP}
          required
          disabled={isEditMode}
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="campaign"
          label="Campagne"
          items={CAMPAIGN_MAP}
          required
          disabled={isEditMode}
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="status"
          label="Status"
          items={statusOptions}
          required
        />
      </CardContent>
    </Card>
  );
}
