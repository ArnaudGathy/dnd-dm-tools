import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import FormFieldAlignmentChart from "@/components/ui/inputs/FormFieldAlignmentChart";
import {
  ABILITIES_MAP,
  BACKGROUND_MAP,
  CAMPAIGN_MAP,
  CHARACTER_STATUS_MAP,
  CLASS_MAP,
  PARTY_MAP,
  RACE_MAP,
  SUBCLASS_MAP,
  SUBCLASSES_BY_CLASS,
} from "@/constants/maps";
import { shortenAbilityName } from "@/utils/utils";
import { CampaignId, CharacterStatus } from "@prisma/client";
import { ChartNoAxesColumn, Lock, Settings2, User } from "lucide-react";
import PointBuyCounter, { ABILITY_FIELDS } from "@/app/(with-nav)/characters/add/PointBuyCounter";

// Odyssey of the Dragonlords (OotDL) enum values are prefixed with `OOTDL_`
// and must only be selectable when the character belongs to that campaign.
const OOTDL_PREFIX = "OOTDL_";

/** Small "these fields are locked" hint shown in panel headers in edit mode. */
function LockedHint({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 pr-2 text-xs text-muted-foreground">
      <Lock className="size-3" />
      {label}
    </span>
  );
}

export default function TabIdentity({
  form,
  isEditMode,
  hasSubclass,
  level,
}: {
  form: UseFormReturn<CharacterCreationForm>;
  isEditMode: boolean;
  hasSubclass: boolean;
  level?: number;
}) {
  const className = form.watch("className");
  const campaign = form.watch("campaign");
  const allowOotdl = campaign === CampaignId.DRAGONLORDS;

  const filterByCampaign = (map: Record<string, string>) =>
    allowOotdl
      ? map
      : Object.fromEntries(Object.entries(map).filter(([key]) => !key.startsWith(OOTDL_PREFIX)));

  const statusOptions = isEditMode
    ? CHARACTER_STATUS_MAP
    : {
        [CharacterStatus.ACTIVE]: CHARACTER_STATUS_MAP[CharacterStatus.ACTIVE],
        [CharacterStatus.BACKUP]: CHARACTER_STATUS_MAP[CharacterStatus.BACKUP],
      };

  const isSubclassLocked = isEditMode && hasSubclass && (level ?? 1) > 3;

  return (
    <div className="flex flex-col gap-4">
      <SectionPanel
        accent="slate"
        icon={Settings2}
        title="Application"
        action={
          isEditMode ? <LockedHint label="Groupe et campagne fixés à la création" /> : undefined
        }
        contentClassName="grid gap-4 md:grid-cols-3"
      >
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
          label="Statut"
          items={statusOptions}
          required
        />
      </SectionPanel>

      <SectionPanel
        accent="emerald"
        icon={User}
        title="Identité"
        action={isEditMode ? <LockedHint label="Identité fixée à la création" /> : undefined}
        contentClassName="grid gap-4 md:grid-cols-3"
      >
        <FormFieldInput
          formInstance={form}
          formFieldName="name"
          label="Nom du personnage"
          required
          disabled={isEditMode}
        />
        <FormFieldInput
          formInstance={form}
          formFieldName="level"
          label="Niveau"
          inputMode="numeric"
          description={isEditMode ? undefined : "Niveau 1 à la création, edit pour lvl up"}
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
          placeholder="Aucune pour le moment"
          description={
            isSubclassLocked
              ? "Définitive après le niveau 3"
              : isEditMode
                ? undefined
                : "Peut être indiqué plus tard"
          }
          items={
            className
              ? SUBCLASSES_BY_CLASS[className]
                  .filter((subclass) => allowOotdl || !subclass.startsWith(OOTDL_PREFIX))
                  .reduce((acc, next) => {
                    return { ...acc, [next]: SUBCLASS_MAP[next] };
                  }, {})
              : []
          }
          disabled={!className || isSubclassLocked}
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="race"
          label="Race"
          items={filterByCampaign(RACE_MAP)}
          required
          disabled={isEditMode}
        />
        <FormFieldSelect
          formInstance={form}
          formFieldName="background"
          label="Historique"
          items={filterByCampaign(BACKGROUND_MAP)}
          required
          disabled={isEditMode}
        />
        <FormFieldAlignmentChart
          formInstance={form}
          formFieldName="alignment"
          label="Alignement"
          required
        />
      </SectionPanel>

      <SectionPanel
        accent="teal"
        icon={ChartNoAxesColumn}
        title="Caractéristiques"
        contentClassName="gap-4"
      >
        {isEditMode ? (
          <>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              Les valeurs finales des caractéristiques, bonus compris (entre 8 et 20)
            </p>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {ABILITY_FIELDS.map((stat) => (
                <FormFieldInput
                  key={stat}
                  formInstance={form}
                  formFieldName={stat}
                  label={ABILITIES_MAP[stat]}
                  labelClassName="truncate text-sm"
                  title={`${ABILITIES_MAP[stat]} (${shortenAbilityName(stat)})`}
                  inputMode="numeric"
                  inputClassName="text-center font-semibold"
                  required
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              Achetez les scores de <span className="font-medium text-foreground">base</span> avec
              le système d&apos;acquisition par points (entre 8 et 15, budget de 27 points), puis
              ajoutez les <span className="font-medium text-foreground">bonus</span>{" "}
              d&apos;historique et de dons. Le total final est calculé automatiquement.
            </p>
            <PointBuyCounter form={form} />
          </>
        )}
      </SectionPanel>
    </div>
  );
}
