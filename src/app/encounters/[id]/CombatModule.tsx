"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Condition,
  Creature,
  Encounter,
  Participant,
  ParticipantToAdd,
} from "@/types/types";
import {
  getEncounterFromLocation,
  getParticipantFromCharacters,
  getParticipantFromEncounter,
  roll,
  typedConditions,
} from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { TooltipComponent } from "@/components/ui/tooltip";
import {
  EllipsisHorizontalIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ConditionImage } from "@/app/encounters/[id]/ConditionImage";
import { filter, isDefined, map, pipe, prop } from "remeda";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { BookOpenIcon, FastForwardIcon, PawPrintIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGroupFromCampaign, Group } from "@/hooks/useGroupFromCampaign";

const MAX_CONDITIONS_BEFORE_ELLIPSIS = 2;

const DEFAULT_STATE = {
  id: "",
  currentHp: "",
  name: "",
  init: "",
  hp: "",
  color: "#DD1D47",
};

const getNextTurn = (
  turnsCounter: number | null,
  listOfParticipants: Participant[],
  countTurn?: () => void,
) => {
  if (turnsCounter === null) {
    return 0;
  }

  const nextTurn = (turnsCounter + 1) % listOfParticipants.length;
  if (nextTurn === 0) {
    countTurn?.();
  }

  if (parseInt(listOfParticipants[nextTurn].currentHp, 10) <= 0) {
    return getNextTurn(nextTurn, listOfParticipants, countTurn);
  }

  return nextTurn;
};

const sortParticipant = (a: Participant, b: Participant) => {
  const aInit = b.init !== "" ? parseInt(b.init) : Infinity;
  const bInit = a.init !== "" ? parseInt(a.init) : Infinity;

  if (aInit === bInit) {
    return b.id ? -1 : 1;
  }

  return aInit - bInit;
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

export const CombatModule = ({
  encounter,
  creatures,
  otherZonesCreatures,
}: {
  encounter: Encounter;
  creatures: Creature[];
  otherZonesCreatures: Record<string, Creature[]>;
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const [anotherEncountersAdded, setAnotherEncountersAdded] = useState<
    Array<string>
  >([]);
  const [turnsCounter, setTurnsCounter] = useState(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number | null>(null);
  const hasCombatStarted = currentTurnIndex !== null;

  const [shouldShowAddParticipant, setShouldShowAddParticipant] =
    useState(false);
  const [listOfParticipants, setListOfParticipants] = useState<Participant[]>(
    filter(
      [
        ...getParticipantFromEncounter({
          creatures,
          encounter,
        }),
        encounter.environmentTurnInitiative
          ? {
              uuid: uuidv4(),
              isNPC: true,
              id: -99,
              name: "Environement",
              hp: "",
              currentHp: "",
              init: encounter.environmentTurnInitiative ?? "0",
            }
          : undefined,
      ],
      isDefined,
    ).toSorted(sortParticipant),
  );

  const group = useGroupFromCampaign({
    groupAction: (group: Group) => {
      const participants = getParticipantFromCharacters(group);
      setListOfParticipants((current) => {
        if (
          participants.every((participant) =>
            current.some((p) => p.name === participant.name),
          )
        ) {
          return current;
        }
        return [...participants, ...current].toSorted(sortParticipant);
      });
    },
  });

  const handleAddAnotherEncounterParticipants = (mapMarker: string) => {
    const anotherEncounter = getEncounterFromLocation({
      mapMarker,
      name: encounter?.location.name,
    });
    const anotherEncounterCreatures = otherZonesCreatures[mapMarker];

    if (!!anotherEncounterCreatures && !!anotherEncounter) {
      setAnotherEncountersAdded((current) => [...current, mapMarker]);
      setListOfParticipants((current) => {
        return [
          ...getParticipantFromEncounter({
            creatures: anotherEncounterCreatures,
            encounter: anotherEncounter,
          }),
          ...current,
        ].toSorted(sortParticipant);
      });
    }
  };

  const [participant, setParticipant] =
    useState<ParticipantToAdd>(DEFAULT_STATE);
  const [hpChangeMode, setHpChangeMode] = useState<"add" | "sub">("sub");

  const handleAddParticipant = useCallback(() => {
    if (participant.name && participant.color) {
      setListOfParticipants(
        [
          ...listOfParticipants,
          {
            ...participant,
            uuid: uuidv4(),
            isNPC: true,
            id: -1,
            currentHp: participant.hp,
            init: participant.init || roll(20).toString(),
          },
        ].toSorted(sortParticipant),
      );
      setParticipant(DEFAULT_STATE);
    }
  }, [listOfParticipants, participant]);

  const handleRemoveParticipant = (participant: Participant) => {
    setListOfParticipants((current) =>
      current.filter((p) => p.uuid !== participant.uuid),
    );
  };

  const handleNextTurn = useCallback(() => {
    const nexTurn = getNextTurn(currentTurnIndex, listOfParticipants, () =>
      setTurnsCounter((current) => current + 1),
    );
    const nextParticipantId = listOfParticipants[nexTurn].id;
    if (nextParticipantId) {
      router.replace(`${pathName}#${nextParticipantId}`);
    } else {
      router.replace(pathName);
    }

    setCurrentTurnIndex((current) => getNextTurn(current, listOfParticipants));
  }, [currentTurnIndex, listOfParticipants, pathName, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddParticipant();
      }
      if (e.key === " ") {
        e.preventDefault();
        handleNextTurn();
      }
    },
    [handleAddParticipant, handleNextTurn],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  const playersWithSpells = useMemo(
    () =>
      pipe(
        group,
        filter((character) => character.spellsOnCharacters.length > 0),
        map(prop("name")),
      ),
    [group],
  );

  const playersWithCreatures = useMemo(
    () =>
      pipe(
        group,
        filter(
          (character) =>
            !!character.creatures && character.creatures.length > 0,
        ),
        map(prop("name")),
      ),
    [group],
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

  const handleSetCondition = (
    participant: Participant,
    condition: Condition,
  ) => {
    setListOfParticipants((current) =>
      current.map((p) => {
        const newConditions = p.conditions?.includes(condition)
          ? p.conditions?.filter((c) => c.title !== condition.title)
          : [...(p.conditions || []), condition];
        return p.uuid === participant.uuid
          ? { ...p, conditions: newConditions }
          : p;
      }),
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>
                {hasCombatStarted ? `Tour n°${turnsCounter}` : "Combat"}
              </span>

              <div className="space-x-2">
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
                <Button size="sm" onClick={handleNextTurn}>
                  {hasCombatStarted ? (
                    <FastForwardIcon className="size-6" />
                  ) : (
                    <PlayIcon className="size-6" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!!encounter?.extraZonesEnnemies?.length &&
                encounter.extraZonesEnnemies.map((zone) => (
                  <Button
                    key={zone}
                    size="sm"
                    variant={
                      anotherEncountersAdded.includes(zone)
                        ? "secondary"
                        : "outline"
                    }
                    onClick={() => {
                      handleAddAnotherEncounterParticipants(zone);
                    }}
                  >
                    {zone}
                  </Button>
                ))}
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
            {listOfParticipants.map((participant, index) => {
              const isEnvironment = participant.id === -99;
              const isActiveTurn = currentTurnIndex === index;
              const hpPercent =
                (parseInt(participant.currentHp) / parseInt(participant.hp)) *
                100;
              return (
                <div
                  key={participant.uuid}
                  className={clsx(
                    "flex min-h-10 w-full items-center gap-4 space-x-2 px-4 py-1 transition duration-300",
                    {
                      "opacity-20": participant.currentHp === "0",
                      "scale-[105%] bg-red-900": isActiveTurn,
                      "bg-stone-950": isEnvironment && !isActiveTurn,
                    },
                  )}
                >
                  <div className="w-2">
                    {participant.isNPC && (
                      <div
                        style={{
                          backgroundColor: participant.color,
                        }}
                        className={clsx("h-5 w-5 rounded-full")}
                      />
                    )}
                  </div>
                  <div className="w-10 text-center text-sm">
                    <Input
                      className="w-10"
                      id="init"
                      defaultValue={participant.init}
                      onBlur={handleUpdateInit(participant)}
                      onFocus={(event) => event.target.select()}
                    />
                  </div>
                  <div className={clsx("w-[200px] truncate px-4 text-center")}>
                    <TooltipComponent definition={participant.name}>
                      {participant.isNPC ? (
                        <Link href={`#${participant.id}`}>
                          {participant.name}
                        </Link>
                      ) : (
                        <span>{participant.name}</span>
                      )}
                    </TooltipComponent>
                  </div>
                  <div className="flex-1 text-center">
                    {participant.hp !== "" ? (
                      <div className="flex items-center gap-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative w-full hover:cursor-pointer">
                              <Progress
                                classNameTop={clsx(getHPBarColor(hpPercent))}
                                value={hpPercent}
                              />
                              <span className="absolute left-[50%] top-[1px] -translate-x-1/2 transform font-bold leading-4">
                                {participant.currentHp} / {participant.hp}
                              </span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="flex h-[450px] w-[575px] flex-col gap-4 overflow-auto">
                            <h4 className="text-xl font-semibold tracking-tight">
                              Points de vie
                            </h4>
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
                              <div className="flex items-center gap-2">
                                <Button
                                  className="bg-green-900 font-mono text-xs"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setHpChangeMode("add")}
                                >
                                  +
                                </Button>
                                <Button
                                  className="bg-red-900 font-mono text-xs"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setHpChangeMode("sub")}
                                >
                                  -
                                </Button>
                                <span>
                                  {hpChangeMode === "sub"
                                    ? "Enlever"
                                    : "Ajouter"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 29 }).map((_, index) => {
                                  const value = (index + 1).toString();
                                  return (
                                    <Button
                                      key={index}
                                      className={clsx(
                                        "h-8 w-11 font-mono text-xs",
                                        {
                                          "bg-green-900":
                                            hpChangeMode === "add",
                                          "bg-red-900": hpChangeMode === "sub",
                                        },
                                      )}
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleChangeHp(participant, value)
                                      }
                                    >
                                      {`${hpChangeMode === "sub" ? "-" : "+"}${value}`}
                                    </Button>
                                  );
                                })}
                                <Input
                                  className="h-8 w-11"
                                  placeholder="PV"
                                  type="text"
                                  onBlur={(e) =>
                                    handleChangeHp(participant, e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <h4 className="text-xl font-semibold tracking-tight">
                              États et effets
                            </h4>
                            <div className="flex max-w-[500px] flex-wrap gap-2">
                              {typedConditions.map((condition) => (
                                <div
                                  key={condition.title}
                                  className={clsx("flex items-center gap-2")}
                                >
                                  <ConditionImage
                                    className={clsx("cursor-pointer", {
                                      "box-border rounded-lg border-2 border-blue-600":
                                        participant.conditions?.includes(
                                          condition,
                                        ),
                                    })}
                                    condition={condition}
                                    onClick={() =>
                                      handleSetCondition(participant, condition)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                className="w-full"
                                placeholder="Note"
                                type="text"
                                onBlur={(e) =>
                                  handleSetCondition(participant, {
                                    title: "Note",
                                    description: e.target.value,
                                    icon: "custom",
                                  })
                                }
                              />
                              <Button className="bg-red-900">+</Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {playersWithSpells.includes(participant.name) && (
                          <Link
                            href={`/characters/${participant.id}/spells`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <BookOpenIcon className="size-6" />
                          </Link>
                        )}
                        {playersWithCreatures.includes(participant.name) && (
                          <Link
                            href={`/characters/${participant.id}/creatures`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <PawPrintIcon className="size-6" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  {participant.conditions && (
                    <div className="flex gap-2">
                      {participant.conditions.map((condition, index) => {
                        const remainingElements =
                          (participant.conditions?.length || 0) - index - 1;

                        if (index > MAX_CONDITIONS_BEFORE_ELLIPSIS) {
                          return null;
                        }

                        if (
                          index === MAX_CONDITIONS_BEFORE_ELLIPSIS &&
                          remainingElements >= 1
                        ) {
                          return (
                            <Popover key={index}>
                              <PopoverTrigger asChild>
                                <EllipsisHorizontalIcon
                                  key={condition.icon}
                                  className="size-8"
                                />
                              </PopoverTrigger>
                              <PopoverContent className="w-full">
                                <div className="flex gap-2">
                                  {participant.conditions
                                    ?.toSpliced(0, index)
                                    .map((condition) => (
                                      <ConditionImage
                                        key={condition.title}
                                        className="size-8"
                                        condition={condition}
                                      />
                                    ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        }

                        return (
                          <Popover key={index}>
                            <PopoverTrigger asChild>
                              <div>
                                <ConditionImage
                                  className="size-8"
                                  condition={condition}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="min-w-[500px]">
                              <Card>
                                <CardHeader>
                                  <CardTitle>
                                    <div className="flex justify-between">
                                      {condition.title}{" "}
                                      <Button
                                        variant="secondary"
                                        size="xs"
                                        onClick={() =>
                                          handleSetCondition(
                                            participant,
                                            condition,
                                          )
                                        }
                                      >
                                        -
                                      </Button>
                                    </div>
                                  </CardTitle>
                                  {condition.description && (
                                    <CardDescription>
                                      {condition.description}
                                    </CardDescription>
                                  )}
                                </CardHeader>
                                {condition.bullets &&
                                  !!condition.bullets.length && (
                                    <CardContent>
                                      <ul className="list-inside list-disc space-y-2 leading-5">
                                        {condition.bullets.map(
                                          (bullet, index) => (
                                            <li key={index}>{bullet}</li>
                                          ),
                                        )}
                                      </ul>
                                    </CardContent>
                                  )}
                              </Card>
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                  )}
                  <ConfirmDialog
                    description="Supprimer cet élément est irréversible."
                    onConfirm={() => handleRemoveParticipant(participant)}
                  >
                    <Button variant="ghost" size="xs">
                      <XMarkIcon className="size-4" />
                    </Button>
                  </ConfirmDialog>
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
