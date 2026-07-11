import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import SavingThrowsArray from "@/app/(with-nav)/characters/add/(items)/SavingThrowsArray";
import SkillsArray from "@/app/(with-nav)/characters/add/(items)/SkillsArray";
import ProficienciesArray from "@/app/(with-nav)/characters/add/(items)/ProficienciesArray";
import CapacitiesArray from "@/app/(with-nav)/characters/add/(items)/CapacitiesArray";
import { ChartNoAxesColumn, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export default function TabProficiencies({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-4">
        <SectionPanel accent="teal" icon={ShieldCheck} title="Jets de sauvegarde">
          <SavingThrowsArray form={form} />
        </SectionPanel>

        <SectionPanel accent="indigo" icon={ChartNoAxesColumn} title="Compétences">
          <SkillsArray form={form} />
        </SectionPanel>

        <SectionPanel accent="indigo" icon={Wrench} title="Maîtrises générales">
          <ProficienciesArray form={form} />
        </SectionPanel>
      </div>

      <SectionPanel accent="emerald" icon={Sparkles} title="Capacités">
        <CapacitiesArray form={form} />
      </SectionPanel>
    </div>
  );
}
