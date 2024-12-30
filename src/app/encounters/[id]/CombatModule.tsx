"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Encounter, Participant, ParticipantToAdd } from "@/types/types";
import {
  getParticipantFromCharacters,
  getParticipantFromEncounter,
  roll,
} from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { getPartyLevel } from "@/utils/localStorageUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const hitValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const sortParticipant = (a: Participant, b: Participant) => {
  const aInit = b.init !== "" ? parseInt(b.init) : Infinity;
  const bInit = a.init !== "" ? parseInt(a.init) : Infinity;

  if (aInit === bInit) {
    return b.isPlayer ? 1 : -1;
  }

  return aInit - bInit;
};

const defaultState = {
  id: "",
  currentHp: "",
  name: "",
  init: "",
  hp: "",
  color: "#DD1D47",
};

export const CombatModule = ({ encounter }: { encounter: Encounter }) => {
  const partyLevel = getPartyLevel();

  const [shouldShowAddParticipant, setShouldShowAddParticipant] =
    useState(false);
  const [listOfParticipants, setListOfParticipants] = useState<Participant[]>(
    [
      ...getParticipantFromCharacters(),
      ...getParticipantFromEncounter({
        encounter,
        partyLevel,
      }),
    ].toSorted(sortParticipant),
  );
  const [participant, setParticipant] =
    useState<ParticipantToAdd>(defaultState);

  const handleAddParticipant = useCallback(() => {
    if (participant.name && participant.color) {
      setListOfParticipants(
        [
          ...listOfParticipants,
          {
            ...participant,
            id: uuidv4(),
            currentHp: participant.hp,
            init: participant.init || roll(20).toString(),
          },
        ].toSorted(sortParticipant),
      );
      setParticipant(defaultState);
    }
  }, [listOfParticipants, participant]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAddParticipant();
      }
    },
    [handleAddParticipant],
  );

  const handleUpdateHP =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newHP = parseInt(e.target.value);
      if (participant.hp && newHP <= parseInt(participant.hp) && newHP >= 0) {
        setListOfParticipants((current) =>
          current.map((p) =>
            p.id === participant.id ? { ...p, currentHp: newHP.toString() } : p,
          ),
        );
      }
    };

  const handleUpdateInit =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newInit = e.target.value;
      setListOfParticipants((current) =>
        current
          .map((p) => (p.id === participant.id ? { ...p, init: newInit } : p))
          .toSorted(sortParticipant),
      );
    };

  const handleUpdatePlayerHp =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newHp = e.target.value;
      setListOfParticipants((current) =>
        current.map((p) =>
          p.id === participant.id ? { ...p, hp: newHp, currentHp: newHp } : p,
        ),
      );
    };

  const handleSubtractHp = (participant: Participant, hp: string) => {
    const newHp = Math.max(parseInt(participant.currentHp) - parseInt(hp), 0);
    setListOfParticipants((current) =>
      current.map((p) =>
        p.id === participant.id ? { ...p, currentHp: newHp.toString() } : p,
      ),
    );
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              Combat
              <Button
                variant={shouldShowAddParticipant ? "secondary" : "outline"}
                size="default"
                onClick={() =>
                  setShouldShowAddParticipant((current) => !current)
                }
              >
                <UserPlusIcon className="size-6" />
                Participants
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {shouldShowAddParticipant && (
            <div className="mb-6 flex items-end space-x-4">
              <div className="w-full">
                <Label htmlFor="name">Nom</Label>
                <Input
                  type="text"
                  id="name"
                  value={participant.name}
                  onChange={(e) =>
                    setParticipant({ ...participant, name: e.target.value })
                  }
                />
              </div>
              <div className="w-20">
                <Label htmlFor="init">Init</Label>
                <Input
                  type="text"
                  id="init"
                  value={participant.init}
                  onChange={(e) =>
                    setParticipant({
                      ...participant,
                      init: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-28">
                <Label htmlFor="hp">PV</Label>
                <Input
                  type="text"
                  id="hp"
                  value={participant.hp}
                  onChange={(e) =>
                    setParticipant({ ...participant, hp: e.target.value })
                  }
                />
              </div>
              <div className="w-36">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  type="color"
                  id="color"
                  value={participant.color}
                  onChange={(e) =>
                    setParticipant({ ...participant, color: e.target.value })
                  }
                />
              </div>
              <div className="mb-1">
                <Button onClick={handleAddParticipant} size="sm">
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {listOfParticipants.map((participant) => {
              return (
                <div
                  key={participant.id}
                  className={clsx(
                    "flex min-h-10 w-full items-center gap-4 space-x-2 transition-opacity",
                    {
                      "opacity-20": participant.currentHp === "0",
                    },
                  )}
                >
                  <div
                    style={{ backgroundColor: participant.color }}
                    className="h-5 w-5 rounded-full"
                  />
                  <div className="w-10 text-center text-sm">
                    {participant.init === "" ? (
                      <Input
                        className="w-14"
                        id="init"
                        placeholder="INIT"
                        onBlur={handleUpdateInit(participant)}
                      />
                    ) : (
                      participant.init
                    )}
                  </div>
                  <div className="w-[300px] truncate px-4 text-center font-bold">
                    {participant.name}
                  </div>
                  <div className="flex-1 text-center">
                    {participant.hp === "" ? (
                      <Input
                        className="w-14"
                        id="hp"
                        placeholder="PV"
                        onBlur={handleUpdatePlayerHp(participant)}
                      />
                    ) : (
                      <div className="flex items-center gap-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Progress
                              value={
                                (parseInt(participant.currentHp) /
                                  parseInt(participant.hp)) *
                                100
                              }
                            />
                          </PopoverTrigger>
                          <PopoverContent className="flex w-full flex-col gap-4">
                            Soustraire des PVs
                            <div className="grid grid-cols-5 grid-rows-2 gap-2">
                              {hitValues.map((value) => (
                                <Button
                                  key={value}
                                  variant="secondary"
                                  onClick={() =>
                                    handleSubtractHp(participant, value)
                                  }
                                >
                                  {`-${value}`}
                                </Button>
                              ))}
                            </div>
                            <div>
                              <Input
                                placeholder="PV"
                                type="text"
                                onBlur={(e) =>
                                  handleSubtractHp(participant, e.target.value)
                                }
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Input
                          className="w-10"
                          id="test"
                          value={participant.currentHp}
                          onChange={handleUpdateHP(participant)}
                          onFocus={(event) => event.target.select()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CombatModule;
