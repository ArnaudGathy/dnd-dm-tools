import { getAllQuests } from "@/lib/external-apis/notion/quests";
import { CharacterById } from "@/lib/utils";
import { groupBy, prop } from "remeda";
import { Quest, QuestStatus } from "@/types/schemas";
import { CircleAlert, CircleCheckBig, CircleFadingArrowUp, CircleSlash, Flag } from "lucide-react";
import { ElementType } from "react";
import { Accent, SectionPanel, StatTile } from "./sheetUI";
import QuestCard from "./(quests)/QuestCard";
import ArchiveQuestRow from "./(quests)/ArchiveQuestRow";

/** Display order + semantics per status. Active statuses get rich always-open
 *  cards; archived ones get condensed collapsible rows (closed by default). */
const STATUS_CONFIG: Array<{
  status: QuestStatus;
  accent: Accent;
  icon: ElementType;
  variant: "detailed" | "archive";
}> = [
  {
    status: QuestStatus.IN_PROGRESS,
    accent: "indigo",
    icon: CircleFadingArrowUp,
    variant: "detailed",
  },
  { status: QuestStatus.INTERESTED, accent: "amber", icon: CircleAlert, variant: "detailed" },
  { status: QuestStatus.NO_INTEREST, accent: "red", icon: CircleSlash, variant: "archive" },
  { status: QuestStatus.DONE, accent: "emerald", icon: CircleCheckBig, variant: "archive" },
];

export default async function Quests({ character }: { character: CharacterById }) {
  const fetchedQuests = await getAllQuests(character.campaign.party.name);
  const groupedQuests = groupBy(fetchedQuests, prop("status"));

  if (!fetchedQuests || fetchedQuests.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-0 md:p-4">
        <SectionPanel accent="slate" icon={Flag} title="Journal de quêtes">
          <span className="text-sm text-muted-foreground">
            {"Il n'y a aucune quête active dans ce groupe."}
          </span>
        </SectionPanel>
      </div>
    );
  }

  const sections = STATUS_CONFIG.map((config) => ({
    ...config,
    quests: groupedQuests[config.status] as Array<Quest> | undefined,
  }));

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-0 md:p-4">
      {/* Overview strip: the journal's state at a glance before the detail */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {sections.map(({ status, accent, icon }) => (
          <StatTile
            key={status}
            icon={icon}
            accent={accent}
            value={groupedQuests[status]?.length ?? 0}
            label={status}
            className="bg-card"
          />
        ))}
      </div>

      {sections.map(
        ({ status, accent, icon, variant, quests }) =>
          quests && (
            <SectionPanel
              key={status}
              accent={accent}
              icon={icon}
              title={status}
              contentClassName="gap-2"
              action={
                <span className="px-1 text-xs font-bold tabular-nums text-muted-foreground">
                  {quests.length}
                </span>
              }
            >
              {quests.map((quest) =>
                variant === "detailed" ? (
                  <QuestCard key={quest.id} quest={quest} />
                ) : (
                  <ArchiveQuestRow key={quest.id} quest={quest} />
                ),
              )}
            </SectionPanel>
          ),
      )}
    </div>
  );
}
