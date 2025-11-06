"use client";

import { Quest, QuestStatus } from "@/types/schemas";
import { ReactNode } from "react";
import { useLocalStorage } from "react-use";
import { ChevronDown, ChevronUp } from "lucide-react";
import QuestDetails from "@/app/(with-nav)/characters/[id]/(sheet)/(quests)/QuestDetails";
import dynamic from "next/dynamic";

function QuestCategory({
  quests,
  status,
  icon,
}: {
  quests: Array<Quest>;
  status: QuestStatus;
  icon: ReactNode;
}) {
  const [isOpen, setIsOpen] = useLocalStorage(`quest.${status}`, true);

  return (
    <div key={status} className="mb-4 flex flex-col gap-4">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xl font-bold md:text-2xl">{status}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="size-4 md:size-6" />
        ) : (
          <ChevronUp className="size-4 md:size-6" />
        )}
      </div>
      {isOpen && quests.map((quest) => <QuestDetails key={quest.id} quest={quest} />)}
    </div>
  );
}

export default dynamic(() => Promise.resolve(QuestCategory), { ssr: false });
