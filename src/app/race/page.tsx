"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const rounds = [
  {
    id: 1,
    zone: "Trône doré",
  },
  {
    id: 2,
    zone: "Temple de Savras",
  },
  {
    id: 3,
    zone: "Temple de Gond",
  },
  {
    id: 4,
    zone: "Temple de Sune",
  },
  {
    id: 5,
    zone: "Quartier marchand",
  },
  {
    id: 6,
    zone: "La vieille ville",
  },
  {
    id: 7,
    zone: "Le grand Souk",
  },
  {
    id: 8,
    zone: "L’arène",
  },
];

type Participant = {
  id: number;
  name: string;
  currentDistance: number;
  newestDistance: number;
  isNPC?: boolean;
  AC?: number;
  maxHP?: number;
  currentHP?: number;
  turns?: { attack: number; damages: number; distance: number }[];
};

const NPCRacers = [
  {
    id: 14,
    name: "Coup de boule Bill",
    isNPC: true,
    currentDistance: 0,
    newestDistance: 0,
    maxHP: 30,
    currentHP: 30,
    AC: 13,
    turns: [
      { distance: 0, attack: 17, damages: 6 },
      { distance: 50, attack: 20, damages: 6 },
      { distance: 100, attack: 24, damages: 13 },
      { distance: 180, attack: 20, damages: 15 },
      { distance: 180, attack: 20, damages: 13 },
      { distance: 205, attack: 11, damages: 6 },
      { distance: 205, attack: 22, damages: 10 },
      { distance: 205, attack: 16, damages: 8 },
    ],
  },
  {
    id: 11,
    name: "Krul",
    isNPC: true,
    currentDistance: 0,
    newestDistance: 0,
    maxHP: 19,
    currentHP: 19,
    AC: 11,
    turns: [
      { distance: 0, attack: 19, damages: 7 },
      { distance: 40, attack: 0, damages: 0 },
      { distance: 40, attack: 22, damages: 11 },
      { distance: 40, attack: 0, damages: 0 },
      { distance: 40, attack: 18, damages: 4 },
      { distance: 80, attack: 20, damages: 13 },
      { distance: 80, attack: 19, damages: 5 },
      { distance: 120, attack: 13, damages: 9 },
    ],
  },
  {
    id: 12,
    name: "Faroul & Gondolo",
    isNPC: true,
    currentDistance: 0,
    newestDistance: 0,
    maxHP: 38,
    currentHP: 38,
    AC: 13,
    turns: [
      { distance: 0, attack: 14, damages: 3 },
      { distance: 0, attack: 13, damages: 6 },
      { distance: 75, attack: 11, damages: 7 },
      { distance: 75, attack: 20, damages: 6 },
      { distance: 75, attack: 11, damages: 2 },
      { distance: 75, attack: 20, damages: 8 },
      { distance: 125, attack: 19, damages: 8 },
      { distance: 125, attack: 20, damages: 19 },
    ],
  },
  {
    id: 13,
    name: "Rokah",
    isNPC: true,
    currentDistance: 0,
    newestDistance: 0,
    maxHP: 46,
    currentHP: 46,
    AC: 13,
    turns: [
      { distance: 0, attack: 15, damages: 9 },
      { distance: 50, attack: 24, damages: 5 },
      { distance: 50, attack: 25, damages: 9 },
      { distance: 50, attack: 0, damages: 0 },
      { distance: 100, attack: 16, damages: 11 },
      { distance: 100, attack: 20, damages: 19 },
      { distance: 100, attack: 11, damages: 13 },
      { distance: 150, attack: 0, damages: 11 },
    ],
  },
] satisfies Participant[];

export default function Race() {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentRound = rounds[currentRoundIndex];
  const [hasPlayedDistance, setHasPlayedDistance] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([
    ...NPCRacers,
  ]);
  useGroupFromCampaign({
    groupAction: (group) =>
      setParticipants((current) => [
        ...current,
        ...group.map((character, index) => ({
          id: index,
          name: character.name,
          currentDistance: 0,
          newestDistance: 0,
        })),
      ]),
  });

  const handleSetNewestDistance = (
    participantId: Participant["id"],
    newestDistance: string,
  ) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === participantId
          ? { ...participant, newestDistance: parseInt(newestDistance) }
          : participant,
      ),
    );
  };

  const handleSetCurrentDistance = (
    participantId: Participant["id"],
    distance: string,
  ) => {
    setParticipants((current) =>
      current
        .map((participant) =>
          participant.id === participantId
            ? { ...participant, currentDistance: parseInt(distance) }
            : participant,
        )
        .sort((a, b) => b.currentDistance - a.currentDistance),
    );
  };

  const handleLockInDistances = useCallback(() => {
    if (!hasPlayedDistance) {
      setHasPlayedDistance(true);
      setParticipants((current) =>
        current.map((participant) => ({
          ...participant,
          newestDistance: 0,
          currentDistance: participant.isNPC
            ? (participant.turns?.[currentRoundIndex].distance ?? 0)
            : participant.newestDistance,
        })),
      );
      setParticipants((current) =>
        [...current].sort((a, b) => b.currentDistance - a.currentDistance),
      );
    }
  }, [currentRoundIndex, hasPlayedDistance]);

  const handleNextTurn = useCallback(() => {
    if (hasPlayedDistance) {
      setHasPlayedDistance(false);
      setCurrentRoundIndex((current) => {
        const newRound = current + 1;
        if (newRound < rounds.length) {
          return newRound;
        }
        return current;
      });
    }
  }, [hasPlayedDistance]);

  const handleSetCurrentHP = (
    participantId: Participant["id"],
    currentHP: string,
  ) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === participantId
          ? { ...participant, currentHP: parseInt(currentHP) }
          : participant,
      ),
    );
  };

  const handleRemoveParticipant = (participantId: Participant["id"]) => {
    setParticipants((current) =>
      current.filter((participant) => participant.id !== participantId),
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (hasPlayedDistance) {
          handleNextTurn();
        } else {
          handleLockInDistances();
        }
      }
    },
    [handleNextTurn, handleLockInDistances, hasPlayedDistance],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div>
                {`Round ${currentRound.id} - ${currentRound.zone}`}
                <span className="ml-4 text-sm text-muted-foreground">
                  {hasPlayedDistance
                    ? "Jouer attaques"
                    : "Jouer actions + jet de dressage distances"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLockInDistances}
                  disabled={currentRoundIndex === rounds.length - 1}
                >
                  Valider distance
                </Button>
                <Button
                  type="button"
                  onClick={handleNextTurn}
                  size="sm"
                  disabled={currentRoundIndex === rounds.length - 1}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableCell>#</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Round</TableCell>
                <TableCell>Cibles</TableCell>
                <TableCell>Att - dmg</TableCell>
                <TableCell>CA</TableCell>
                <TableCell>PVs</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map(
                (
                  {
                    id,
                    name,
                    isNPC,
                    maxHP,
                    newestDistance,
                    currentHP,
                    AC,
                    currentDistance,
                    turns,
                  },
                  index,
                ) => {
                  const currentNPCTurn = turns?.[currentRoundIndex];
                  // Array of participant names who are within 50 of currentDistance to the current participant
                  const targetsList = participants
                    .filter(
                      (participant) =>
                        participant.id !== id &&
                        Math.abs(
                          participant.currentDistance - currentDistance,
                        ) <= 50,
                    )
                    .map((participant) => participant.name);

                  return (
                    <TableRow key={id}>
                      <TableCell className="w-[50px]">{index + 1}</TableCell>
                      <TableCell
                        className={cn("w-[175px] font-bold text-sky-500", {
                          "text-red-500": isNPC,
                        })}
                      >
                        {name}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <Input
                          className="h-8"
                          type="number"
                          value={currentDistance}
                          onChange={(e) =>
                            handleSetCurrentDistance(id, e.target.value)
                          }
                          onFocus={(event) => event.target.select()}
                        />
                      </TableCell>
                      <TableCell className="w-[100px]">
                        {hasPlayedDistance ? (
                          newestDistance
                        ) : isNPC ? (
                          currentNPCTurn?.distance
                        ) : (
                          <Input
                            className="h-8"
                            type="number"
                            value={newestDistance}
                            onChange={(e) =>
                              handleSetNewestDistance(id, e.target.value)
                            }
                            onFocus={(event) => event.target.select()}
                          />
                        )}
                      </TableCell>
                      <TableCell>{targetsList.join(", ")}</TableCell>
                      <TableCell className="w-[100px]">
                        {currentNPCTurn &&
                          `${currentNPCTurn.attack} - ${currentNPCTurn.damages}`}
                      </TableCell>
                      <TableCell className="w-[50px]">{AC}</TableCell>
                      <TableCell className="w-[150px]">
                        {maxHP && currentHP !== undefined && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <Progress value={(currentHP / maxHP) * 100} />
                                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                                  {currentHP}/{maxHP}
                                </div>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div>
                                <Input
                                  value={currentHP}
                                  onFocus={(event) => event.target.select()}
                                  onChange={(e) =>
                                    handleSetCurrentHP(id, e.target.value)
                                  }
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveParticipant(id)}
                        >
                          -
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
