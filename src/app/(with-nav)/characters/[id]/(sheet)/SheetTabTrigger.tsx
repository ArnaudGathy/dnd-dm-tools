"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Backpack,
  ChartNoAxesColumn,
  FileQuestionMark,
  FileText,
  Swords,
  User,
  Wrench,
} from "lucide-react";
import { entries } from "remeda";
import { SHEETS_TABS } from "@/types/types";

const tabs = {
  [SHEETS_TABS.GENERAL]: { label: "Général", icon: FileText },
  [SHEETS_TABS.SKILLS]: { label: "Compétences", icon: ChartNoAxesColumn },
  [SHEETS_TABS.COMBAT]: { label: "Combat", icon: Swords },
  [SHEETS_TABS.INVENTORY]: { label: "Inventaire", icon: Backpack },
  [SHEETS_TABS.BIO]: { label: "Bio", icon: User },
  [SHEETS_TABS.QUESTS]: { label: "Quêtes", icon: FileQuestionMark },
  [SHEETS_TABS.SETTINGS]: { label: "Config", icon: Wrench },
};

export default function SheetTabTrigger() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathName = usePathname();

  const updateParams = () => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <TabsList className="grid h-auto w-full grid-cols-7 gap-1 rounded-xl border border-border bg-card p-1">
      {entries(tabs).map(([key, { label, icon: Icon }]) => (
        <TabsTrigger
          value={key}
          key={key}
          onClick={() => {
            params.set("tab", key);
            updateParams();
          }}
          className="flex-col gap-1 rounded-lg py-2 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:flex-row md:gap-1.5"
        >
          <Icon className="size-5 shrink-0" />
          <span className="hidden text-sm md:block">{label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
