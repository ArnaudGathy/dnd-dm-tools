"use client";

import { useDeathTracker } from "@/hooks/useDeathTracker";
import Card from "@/app/(plain)/tracker/initiative/(initiative)/Card";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeathTracker() {
  const { deaths } = useDeathTracker();

  if (!deaths?.length) {
    return null;
  }

  return (
    <div className="flex gap-4">
      {deaths.map(({ characterName, success, failure }) => (
        <Card key={characterName}>
          <div className="flex flex-col p-1">
            <div className="mb-2 truncate text-center text-3xl font-bold">{characterName}</div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, index) => (
                <Heart
                  key={index}
                  className={cn("size-10 stroke-cyan-700 stroke-[2.5px]", {
                    "stroke-stone-600/20": index >= success,
                  })}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, index) => (
                <Skull
                  key={index}
                  className={cn("size-10 stroke-red-700 stroke-[2.5px]", {
                    "stroke-stone-600/20": index >= failure,
                  })}
                />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
