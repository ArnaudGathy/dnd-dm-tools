"use client";

import dynamic from "next/dynamic";
import { QuestStatus, Quest } from "@/types/schemas";
import { ReactNode } from "react";

const QuestCategory = dynamic(() => import("./QuestCategory"), {
  ssr: false,
  loading: () => null,
});

export default function QuestCategoryClientWrapper({
  quests,
  status,
  icon,
}: {
  quests: Quest[];
  status: QuestStatus;
  icon: ReactNode;
}) {
  return <QuestCategory quests={quests} status={status} icon={icon} />;
}
