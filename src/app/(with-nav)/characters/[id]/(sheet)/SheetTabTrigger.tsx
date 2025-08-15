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
    <TabsList className="h-auto w-full flex-wrap">
      {entries(tabs).map(([key, { label, icon: Icon }]) => (
        <TabsTrigger
          value={key}
          key={key}
          onClick={() => {
            params.set("tab", key);
            updateParams();
          }}
        >
          <div className="flex items-center gap-1">
            <Icon className="size-5" />
            <span className="hidden md:block">{label}</span>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
