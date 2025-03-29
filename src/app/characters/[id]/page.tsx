import { getValidCharacter } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { entries } from "remeda";
import { Card } from "@/components/ui/card";
import Summary from "@/app/characters/[id]/(sheet)/Summary";

enum SHEETS_TABS {
  SUMMARY = "summary",
  COMBAT = "combat",
  SKILLS = "skills",
  CAPACITIES = "capacities",
  EQUIPMENT = "equipment",
  APPEARANCE = "appearance",
  INVENTORY = "inventory",
  PERSONALITY = "personality",
  BACKGROUND = "background",
  SPELLS = "spells",
}

const tabs = {
  [SHEETS_TABS.SUMMARY]: "Résumé",
  // Combat => Saves, Movement, Initiative, AC, HP total / actuel, Sort attaque, sorts DD, armes attaques
  [SHEETS_TABS.COMBAT]: "Combat",
  // Sorts => Mod des sorts, attaque sorts, DD sorts, A préparer, emplacements, liste
  [SHEETS_TABS.SPELLS]: "Sorts",
  // Compétences => compétences, maitrises
  [SHEETS_TABS.SKILLS]: "Compétences",
  // Capacités => capacities
  [SHEETS_TABS.CAPACITIES]: "Capacités",
  // Equipment => armes & armures
  [SHEETS_TABS.EQUIPMENT]: "Équipement",
  // Inventaire => Inventaire & argent
  [SHEETS_TABS.INVENTORY]: "Inventaire",
  // Apparence => Apparence
  [SHEETS_TABS.APPEARANCE]: "Apparence",
  // Personnalité => Alignement, comportement
  [SHEETS_TABS.PERSONALITY]: "Personnalité",
  // Background => Lore, alliés et notes
  [SHEETS_TABS.BACKGROUND]: "Background",
};

export default async function Character({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getValidCharacter(id);

  return (
    <Tabs defaultValue={SHEETS_TABS.SUMMARY}>
      <TabsList className="h-auto w-full grid-cols-10 flex-wrap md:grid">
        {entries(tabs).map(([key, label]) => (
          <TabsTrigger key={key} value={key}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <Card className="m-[-16px] mt-4 md:mb-0 md:ml-0 md:mr-0">
        <TabsContent value={SHEETS_TABS.SUMMARY} className="mt-0">
          <Summary character={character} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
