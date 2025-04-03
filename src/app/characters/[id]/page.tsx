import { getValidCharacter } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { entries } from "remeda";
import { Card } from "@/components/ui/card";
import Summary from "@/app/characters/[id]/(sheet)/Summary";
import Combat from "@/app/characters/[id]/(sheet)/Combat";
import Skills from "@/app/characters/[id]/(sheet)/Skills";
import Inventory from "@/app/characters/[id]/(sheet)/Inventory";
import Bio from "@/app/characters/[id]/(sheet)/Bio";
import {
  Backpack,
  ChartNoAxesColumn,
  FileText,
  Swords,
  User,
  Wrench,
} from "lucide-react";
import Settings from "@/app/characters/[id]/(sheet)/Settings";

enum SHEETS_TABS {
  SUMMARY = "summary",
  COMBAT = "combat",
  SKILLS = "skills",
  INVENTORY = "inventory",
  BIO = "bio",
  SETTINGS = "settings",
}

const tabs = {
  [SHEETS_TABS.SUMMARY]: { label: "Résumé", icon: FileText },
  [SHEETS_TABS.SKILLS]: { label: "Compétences", icon: ChartNoAxesColumn },
  [SHEETS_TABS.COMBAT]: { label: "Combat", icon: Swords },
  [SHEETS_TABS.INVENTORY]: { label: "Inventaire", icon: Backpack },
  [SHEETS_TABS.BIO]: { label: "Bio", icon: User },
  [SHEETS_TABS.SETTINGS]: { label: "Config", icon: Wrench },
};

export default async function Character({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getValidCharacter(id);

  const tabContentClassName = "mt-0 flex justify-center";

  return (
    <Tabs defaultValue={SHEETS_TABS.SUMMARY}>
      <TabsList className="h-auto w-full flex-wrap">
        {entries(tabs).map(([key, { label, icon: Icon }]) => (
          <TabsTrigger key={key} value={key}>
            <div className="flex items-center gap-1">
              <Icon className="size-5" />
              <span className="hidden md:block">{label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <Card
        className={`mt-4 border-background bg-background md:mb-0 md:ml-0 md:mr-0 md:border-border md:bg-card`}
      >
        <TabsContent
          value={SHEETS_TABS.SUMMARY}
          className={tabContentClassName}
        >
          <Summary character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.SKILLS} className={tabContentClassName}>
          <Skills character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.COMBAT} className={tabContentClassName}>
          <Combat character={character} />
        </TabsContent>

        <TabsContent
          value={SHEETS_TABS.INVENTORY}
          className={tabContentClassName}
        >
          <Inventory character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.BIO} className={tabContentClassName}>
          <Bio character={character} />
        </TabsContent>

        <TabsContent
          value={SHEETS_TABS.SETTINGS}
          className={tabContentClassName}
        >
          <Settings character={character} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
