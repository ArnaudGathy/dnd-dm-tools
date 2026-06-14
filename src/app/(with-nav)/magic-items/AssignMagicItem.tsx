"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { assignMagicItemToCharacter } from "@/lib/actions/MagicItems";
import { Group } from "@/hooks/useGroupFromCampaign";

export default function AssignMagicItem({
  itemId,
  characters,
}: {
  itemId: number;
  characters: Group;
}) {
  const [characterId, setCharacterId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    if (!characterId) {
      return;
    }
    setIsLoading(true);
    await assignMagicItemToCharacter({ itemId, characterId: Number(characterId) });
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={characterId} onValueChange={setCharacterId}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Assigner à..." />
        </SelectTrigger>
        <SelectContent>
          {characters.map((character) => (
            <SelectItem key={character.id} value={String(character.id)}>
              {character.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={handleAssign} disabled={!characterId || isLoading}>
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
      </Button>
    </div>
  );
}
