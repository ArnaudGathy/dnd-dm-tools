import Card from "@/app/(plain)/tracker/initiative/(initiative)/Card";
import Hexagon from "@/app/(plain)/tracker/initiative/(initiative)/Hexagon";
import { Participant } from "@/types/types";
import { Turns } from "@/hooks/useParticipantsListTracker";
import { cn } from "@/lib/utils";
import styles from "../page.module.css";
import { useState } from "react";

const removeInitFloating = (init: string) => {
  return init.replace(/\.\d+$/, "");
};

export default function PlayersList({
  list,
  turnsTracker,
}: {
  list: Participant[];
  turnsTracker: Turns;
}) {
  const [lastActivePlayerIndex, setLastActivePlayerIndex] =
    useState<number>(-1);

  const allPlayersIndices = list.reduce((acc: number[], next, index) => {
    if (!next.isNPC) {
      return [...acc, index];
    }
    return acc;
  }, []);
  const isNPCTurn = !allPlayersIndices.includes(
    turnsTracker.activeParticipantIndex,
  );

  return (
    <div className="h-[1048px] w-[335px] bg-blue">
      <div className="flex max-w-[300px] flex-col gap-4">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              styles.antiqua,
              "mt-8 text-center text-4xl uppercase text-orange-100 transition",
            )}
          >
            {`Tour n°${turnsTracker.numberOfTurns}`}
          </div>
        </div>

        <div
          className={cn(
            styles.antiqua,
            "flex items-center justify-center text-3xl font-bold text-orange-100 opacity-0 transition duration-500",
            { "opacity-100": isNPCTurn },
          )}
        >
          {`Tour de l'ennemi`}
        </div>
        <div className="flex flex-col gap-4">
          {list.map((participant, index) => {
            const isCurrentlyActive =
              turnsTracker.activeParticipantIndex === index;
            const previousActive = lastActivePlayerIndex === index;
            const isActive = isCurrentlyActive || previousActive;

            if (participant.isNPC) {
              return null;
            }

            if (isActive && lastActivePlayerIndex !== index) {
              setLastActivePlayerIndex(index);
            }

            return (
              <Card
                key={participant.uuid}
                isActive={isActive}
                className={cn({
                  ["opacity-20"]: isNPCTurn,
                })}
              >
                <Hexagon isActive={isActive}>
                  {removeInitFloating(
                    participant.isNPC ? "?" : participant.init,
                  )}
                </Hexagon>
                <span className="truncate text-3xl font-bold">
                  {participant.name}
                </span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
