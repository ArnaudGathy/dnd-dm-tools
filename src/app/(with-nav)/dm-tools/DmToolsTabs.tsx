"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skull, Sparkles } from "lucide-react";
import { MagicItem } from "@prisma/client";
import MagicItemsPool from "@/app/(with-nav)/magic-items/MagicItemsPool";
import DeathList from "@/app/(with-nav)/death/DeathList";

export default function DmToolsTabs({ magicItems }: { magicItems: MagicItem[] }) {
  return (
    <Tabs defaultValue="death" className="flex flex-col">
      <TabsList className="h-auto w-fit flex-wrap self-center">
        <TabsTrigger value="death" className="flex items-center gap-2">
          <Skull className="size-4" />
          Death Tracker
        </TabsTrigger>
        <TabsTrigger value="magic-items" className="flex items-center gap-2">
          <Sparkles className="size-4" />
          Objets magiques
        </TabsTrigger>
      </TabsList>

      <TabsContent value="magic-items" className="mt-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col">
          <MagicItemsPool items={magicItems} />
        </div>
      </TabsContent>

      <TabsContent value="death" className="mt-6">
        <DeathList />
      </TabsContent>
    </Tabs>
  );
}
