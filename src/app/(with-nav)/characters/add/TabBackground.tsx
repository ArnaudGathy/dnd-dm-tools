import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { BookOpenText, Drama, Eye } from "lucide-react";

export default function TabBackground({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  return (
    // Desktop: Apparence and Histoire stack in the left column, Personnalité
    // fills the right one. Mobile keeps the DOM order (Apparence, Personnalité,
    // Histoire) as a single column.
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
      <SectionPanel
        accent="pink"
        icon={Eye}
        title="Apparence"
        className="md:col-start-1 md:row-start-1"
        contentClassName="gap-4"
      >
        <div className="grid grid-cols-3 gap-3">
          <FormFieldInput
            formInstance={form}
            formFieldName="age"
            label="Âge"
            labelClassName="text-sm"
            inputMode="numeric"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="height"
            label="Taille"
            labelClassName="text-sm"
            inputMode="numeric"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="weight"
            label="Poids"
            labelClassName="text-sm"
            inputMode="numeric"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="eyeColor"
            label="Yeux"
            labelClassName="text-sm"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="hair"
            label="Cheveux"
            labelClassName="text-sm"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="skin"
            label="Peau"
            labelClassName="text-sm"
          />
        </div>
        <FormFieldInput
          formInstance={form}
          formFieldName="physicalTraits"
          label="Traits physiques"
          description="Pour décrire plus en détail le personnage"
          textarea
        />
      </SectionPanel>

      <SectionPanel
        accent="violet"
        icon={Drama}
        title="Personnalité"
        className="md:col-start-2 md:row-span-2 md:row-start-1"
        contentClassName="gap-4"
      >
        <FormFieldInput
          formInstance={form}
          formFieldName="personalityTraits"
          label="Traits de personnalité"
          textarea
        />
        <FormFieldInput formInstance={form} formFieldName="ideals" label="Idéaux" textarea />
        <FormFieldInput formInstance={form} formFieldName="bonds" label="Liens" textarea />
        <FormFieldInput formInstance={form} formFieldName="flaws" label="Défauts" textarea />
      </SectionPanel>

      <SectionPanel
        accent="slate"
        icon={BookOpenText}
        title="Histoire & notes"
        className="md:col-start-1 md:row-start-2"
        contentClassName="gap-4"
      >
        <FormFieldInput
          formInstance={form}
          formFieldName="lore"
          label="Lore"
          description="L'histoire du personnage"
          textarea
          inputClassName="h-40"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldInput
            formInstance={form}
            formFieldName="allies"
            label="Alliés et organisations"
            textarea
          />
          <FormFieldInput formInstance={form} formFieldName="notes" label="Notes" textarea />
        </div>
      </SectionPanel>
    </div>
  );
}
