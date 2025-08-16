import { getAllQuests } from "@/lib/external-apis/notion/quests";
import { CharacterById, cn } from "@/lib/utils";
import { groupBy, prop } from "remeda";
import { QuestStatus } from "@/types/schemas";
import {
  CircleAlert,
  CircleCheckBig,
  CircleFadingArrowUp,
  CircleSlash,
} from "lucide-react";
import SheetCard from "@/components/ui/SheetCard";
import QuestCategoryClientWrapper from "./(quests)/QuestCategoryWrapper";

export default async function Quests({
  character,
}: {
  character: CharacterById;
}) {
  const fetchedQuests = await getAllQuests(character.campaign.party.name);
  const groupedQuests = groupBy(fetchedQuests, prop("status"));

  const onGoingQuests = groupedQuests[QuestStatus.IN_PROGRESS];
  const completedQuests = groupedQuests[QuestStatus.DONE];
  const interestedQuests = groupedQuests[QuestStatus.INTERESTED];
  const noInterestQuests = groupedQuests[QuestStatus.NO_INTEREST];

  return (
    <div className={cn("flex w-full flex-col gap-4 p-0", "md:p-4 2xl:w-[50%]")}>
      {!fetchedQuests || fetchedQuests.length === 0 ? (
        <SheetCard className="relative flex flex-col gap-2">
          {"Il n'y a aucune quête active dans ce groupe."}
        </SheetCard>
      ) : (
        <>
          {onGoingQuests && (
            <QuestCategoryClientWrapper
              quests={onGoingQuests}
              status={QuestStatus.IN_PROGRESS}
              icon={
                <CircleFadingArrowUp className="size-6 animate-pulse text-indigo-500" />
              }
            />
          )}
          {interestedQuests && (
            <QuestCategoryClientWrapper
              quests={interestedQuests}
              status={QuestStatus.INTERESTED}
              icon={<CircleAlert className="size-6 text-amber-500" />}
            />
          )}
          {noInterestQuests && (
            <QuestCategoryClientWrapper
              quests={noInterestQuests}
              status={QuestStatus.NO_INTEREST}
              icon={<CircleSlash className="size-6 text-red-500" />}
            />
          )}
          {completedQuests && (
            <QuestCategoryClientWrapper
              quests={completedQuests}
              status={QuestStatus.DONE}
              icon={<CircleCheckBig className="size-6 text-green-500" />}
            />
          )}
        </>
      )}
    </div>
  );
}
