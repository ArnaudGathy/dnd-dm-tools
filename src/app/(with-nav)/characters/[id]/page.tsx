import { getValidCharacter } from "@/lib/utils";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Summary from "@/app/(with-nav)/characters/[id]/(sheet)/Summary";
import Combat from "@/app/(with-nav)/characters/[id]/(sheet)/Combat";
import Skills from "@/app/(with-nav)/characters/[id]/(sheet)/Skills";
import Inventory from "@/app/(with-nav)/characters/[id]/(sheet)/Inventory";
import Bio from "@/app/(with-nav)/characters/[id]/(sheet)/Bio";
import { LoaderCircle } from "lucide-react";
import Settings from "@/app/(with-nav)/characters/[id]/(sheet)/Settings";
import { Suspense } from "react";
import Quests from "@/app/(with-nav)/characters/[id]/(sheet)/Quests";
import SheetTabTrigger from "./(sheet)/SheetTabTrigger";
import { SHEETS_TABS } from "@/types/types";

export default async function Character({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: SHEETS_TABS }>;
}) {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const currentTab = awaitedSearchParams.tab;

  const character = await getValidCharacter(id);

  const tabContentClassName = "mt-0 flex justify-center";

  return (
    <Tabs defaultValue={currentTab ?? SHEETS_TABS.GENERAL}>
      <SheetTabTrigger />

      <Card
        className={`mt-4 border-background bg-background md:mb-0 md:ml-0 md:mr-0 md:border-border md:bg-card`}
      >
        <TabsContent value={SHEETS_TABS.GENERAL} className={tabContentClassName}>
          <Summary character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.SKILLS} className={tabContentClassName}>
          <Skills character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.COMBAT} className={tabContentClassName}>
          <Combat character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.INVENTORY} className={tabContentClassName}>
          <Inventory character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.BIO} className={tabContentClassName}>
          <Bio character={character} />
        </TabsContent>

        <TabsContent value={SHEETS_TABS.QUESTS} className={tabContentClassName}>
          <Suspense
            fallback={
              <div className="flex min-h-[500px] items-center justify-center">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
            }
          >
            <Quests character={character} />
          </Suspense>
        </TabsContent>

        <TabsContent value={SHEETS_TABS.SETTINGS} className={tabContentClassName}>
          <Settings character={character} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
