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
import Link from "next/link";
import { TooltipComponent } from "@/components/ui/tooltip";

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

const getHPBarColor = (hpPercent: number) => {
  if (hpPercent <= 25) {
    return "bg-red-600";
  }

  if (hpPercent <= 50) {
    return "bg-orange-500";
  }

  return "bg-green-700";
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
  const [hpChangeMode, setHpChangeMode] = useState<"add" | "sub">("sub");

  const handleAddParticipant = useCallback(() => {
    if (participant.name && participant.color) {
      setListOfParticipants(
        [
          ...listOfParticipants,
          {
            ...participant,
            uuid: uuidv4(),
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

  const handleUpdateCurrentHP =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newHP = parseInt(e.target.value);
      if (participant.hp && newHP <= parseInt(participant.hp) && newHP >= 0) {
        setListOfParticipants((current) =>
          current.map((p) =>
            p.uuid === participant.uuid
              ? { ...p, currentHp: newHP.toString() }
              : p,
          ),
        );
      }
    };

  const handleUpdateMaxHP =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newHP = parseInt(e.target.value);
      if (participant.hp && newHP >= 0) {
        setListOfParticipants((current) =>
          current.map((p) =>
            p.uuid === participant.uuid ? { ...p, hp: newHP.toString() } : p,
          ),
        );
      }
    };

  const handleUpdateInit =
    (participant: Participant) => (e: ChangeEvent<HTMLInputElement>) => {
      const newInit = e.target.value;
      setListOfParticipants((current) =>
        current
          .map((p) =>
            p.uuid === participant.uuid ? { ...p, init: newInit } : p,
          )
          .toSorted(sortParticipant),
      );
    };

  const handleChangeHp = (participant: Participant, hp: string) => {
    if (hp === "") {
      return;
    }

    const newHp =
      hpChangeMode === "sub"
        ? Math.max(parseInt(participant.currentHp) - parseInt(hp), 0)
        : parseInt(participant.currentHp) + parseInt(hp);
    setListOfParticipants((current) =>
      current.map((p) =>
        p.uuid === participant.uuid ? { ...p, currentHp: newHp.toString() } : p,
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
              const hpPercent =
                (parseInt(participant.currentHp) / parseInt(participant.hp)) *
                100;
              return (
                <div
                  key={participant.uuid}
                  className={clsx(
                    "flex min-h-10 w-full items-center gap-4 space-x-2 transition-opacity",
                    {
                      "opacity-20": participant.currentHp === "0",
                    },
                  )}
                >
                  <div
                    style={{
                      backgroundColor: participant.id
                        ? participant.color
                        : "transparent",
                      borderColor: participant.color,
                    }}
                    className={clsx("rounded-full", {
                      "h-5 w-5 border-2": !participant.id,
                      "h-5 w-5": participant.id,
                    })}
                  />
                  <div className="w-10 text-center text-sm">
                    <Input
                      className="w-10"
                      id="init"
                      defaultValue={participant.init}
                      onBlur={handleUpdateInit(participant)}
                      onFocus={(event) => event.target.select()}
                    />
                  </div>
                  <div className={clsx("w-[175px] truncate px-4 text-center")}>
                    <TooltipComponent definition={participant.name}>
                      {participant.id ? (
                        <Link href={`#${participant.id}`}>
                          {participant.name}
                        </Link>
                      ) : (
                        <span>{participant.name}</span>
                      )}
                    </TooltipComponent>
                  </div>
                  <div className="flex-1 text-center">
                    {participant.hp !== "" && (
                      <div className="flex items-center gap-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative w-full">
                              <Progress
                                classNameTop={clsx(getHPBarColor(hpPercent))}
                                value={hpPercent}
                              />
                              <span className="absolute left-[50%] top-[1px] -translate-x-1/2 transform font-bold leading-4">
                                {participant.currentHp} / {participant.hp}
                              </span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-full flex-col gap-4">
                            <div className="flex items-center gap-1">
                              <Input
                                className="w-12"
                                id="hp"
                                value={participant.currentHp}
                                onChange={handleUpdateCurrentHP(participant)}
                                onFocus={(event) => event.target.select()}
                              />
                              <span>/</span>
                              <Input
                                className="w-12"
                                id="currentHp"
                                value={participant.hp}
                                onChange={handleUpdateMaxHP(participant)}
                                onFocus={(event) => event.target.select()}
                              />
                            </div>
                            <div>
                              <div className="mb-2 flex gap-2">
                                <Button
                                  className="bg-green-900 font-mono text-xs"
                                  size="xs"
                                  variant="outline"
                                  onClick={() => setHpChangeMode("add")}
                                >
                                  +
                                </Button>
                                <Button
                                  className="bg-red-900 font-mono text-xs"
                                  size="xs"
                                  variant="outline"
                                  onClick={() => setHpChangeMode("sub")}
                                >
                                  -
                                </Button>
                                <h4 className="text-xl font-semibold tracking-tight">
                                  {hpChangeMode === "sub"
                                    ? "Soustraire"
                                    : "Ajouter"}
                                </h4>
                              </div>
                              <div className="flex gap-2">
                                {hitValues.map((value) => (
                                  <Button
                                    key={value}
                                    className={clsx("font-mono text-xs", {
                                      "bg-green-900": hpChangeMode === "add",
                                      "bg-red-900": hpChangeMode === "sub",
                                    })}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      handleChangeHp(participant, value)
                                    }
                                  >
                                    {`${hpChangeMode === "sub" ? "-" : "+"}${value}`}
                                  </Button>
                                ))}
                                <Input
                                  className="w-12"
                                  placeholder="PV"
                                  type="text"
                                  onBlur={(e) =>
                                    handleChangeHp(participant, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div>test</div>
                          </PopoverContent>
                        </Popover>
                        <div className="size-6 scale-150"></div>
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
