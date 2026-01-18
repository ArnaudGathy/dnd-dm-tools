"use client";

import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";
import { useCharacterTracker } from "@/hooks/useCharacterTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeathList() {
  const { charactersData, setCharactersData } = useCharacterTracker();

  const group = useGroupFromCampaign();

  if (!group.length) {
    return <div>Select a group</div>;
  }

  const hasCharacters = !!charactersData?.length;

  const handleSetCount = (
    characterName: string,
    type: "failure" | "success" | "both",
    total: number,
  ) => {
    if (hasCharacters) {
      setCharactersData(
        charactersData?.map((char) => {
          if (char.characterName !== characterName) {
            return char;
          }
          if (type === "both") {
            return {
              ...char,
              success: total,
              failure: total,
            };
          }
          return {
            ...char,
            [type]: total,
          };
        }),
      );
    }
  };

  return (
    <div className="mt-8 flex min-h-[264px] gap-8">
      <div className="flex w-full justify-center">
        {hasCharacters ? (
          <div className="flex gap-4">
            {(charactersData ?? []).map(({ characterName, success, failure }) => (
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
                    <div className="mt-2 grid w-full grid-cols-2 gap-2">
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
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() => {
                        handleSetCount(characterName, "both", 0);
                      }}
                    >
                      Reset
                    </Button>
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
