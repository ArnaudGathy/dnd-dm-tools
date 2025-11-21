"use client";

import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";
import { useDeathTracker } from "@/hooks/useDeathTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeathList() {
  const { deaths, setDeaths } = useDeathTracker();

  const group = useGroupFromCampaign();

  if (!group.length) {
    return <div>Select a group</div>;
  }

  const hasDeaths = !!deaths?.length;

  const handleSetCount = (characterName: string, type: "failure" | "success", total: number) => {
    if (hasDeaths) {
      setDeaths(
        deaths?.map((death) => {
          if (death.characterName !== characterName) {
            return death;
          }
          return {
            ...death,
            [type]: total,
          };
        }),
      );
    }
  };

  return (
    <div className="mt-8 flex min-h-[264px] gap-8">
      <div className="flex min-w-[100px] flex-col gap-4">
        {group.map((character) => {
          const isEnabled =
            hasDeaths && deaths.some(({ characterName }) => characterName === character.name);
          return (
            <div key={character.id}>
              <Button
                variant={isEnabled ? "outline" : "secondary"}
                className="w-full hover:cursor-pointer"
                onClick={() => {
                  if (isEnabled) {
                    setDeaths(
                      deaths?.filter(({ characterName }) => characterName !== character.name),
                    );
                  } else {
                    setDeaths([
                      ...(deaths || []),
                      { characterName: character.name, success: 0, failure: 0 },
                    ]);
                  }
                }}
              >
                {character.name}
              </Button>
            </div>
          );
        })}
        <Button onClick={() => setDeaths([])}>Reset</Button>
      </div>

      <div className="flex w-full justify-center">
        {hasDeaths ? (
          <div className="flex gap-4">
            {(deaths ?? []).map(({ characterName, success, failure }) => (
              <Card key={characterName} className="h-fit text-center">
                <CardHeader>
                  <CardTitle>{characterName}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, index) => (
                        <Heart
                          key={index}
                          className={cn("size-10 stroke-green-500", {
                            "stroke-stone-500": index >= success,
                          })}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, index) => (
                        <Skull
                          key={index}
                          className={cn("size-10 stroke-red-500", {
                            "stroke-stone-500": index >= failure,
                          })}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex w-full flex-col gap-1">
                      <Button
                        theme="red"
                        onClick={() =>
                          handleSetCount(characterName, "failure", Math.min(3, failure + 2))
                        }
                      >
                        1
                      </Button>
                      <Button
                        theme="amber"
                        onClick={() =>
                          handleSetCount(characterName, "failure", Math.min(3, failure + 1))
                        }
                      >
                        2-9
                      </Button>
                      <Button
                        theme="green"
                        onClick={() =>
                          handleSetCount(characterName, "success", Math.min(3, success + 1))
                        }
                      >
                        10-19
                      </Button>
                      <Button
                        theme="indigo"
                        onClick={() => handleSetCount(characterName, "success", 3)}
                      >
                        20
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>Ajouter un personnage.</div>
        )}
      </div>
    </div>
  );
}
