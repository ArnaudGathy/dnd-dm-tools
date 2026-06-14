"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, LoaderCircle } from "lucide-react";
import { transferMagicItem } from "@/lib/actions/MagicItems";
import { Group } from "@/hooks/useGroupFromCampaign";

export default function TransferMagicItem({
  itemId,
  campaignId,
  currentCharacterId,
  closeAction,
}: {
  itemId: number;
  campaignId: number;
  currentCharacterId: number;
  closeAction: () => void;
}) {
  const [characters, setCharacters] = useState<Group>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      const res = await axios.get<Group>(`/api/characters/${campaignId}`);
      setCharacters(res.data.filter((character) => character.id !== currentCharacterId));
      setIsFetching(false);
    };
    fetchCharacters();
  }, [campaignId, currentCharacterId]);

  const handleTransfer = async () => {
    if (!targetId) {
      return;
    }
    setIsLoading(true);
    await transferMagicItem({
      itemId,
      fromCharacterId: currentCharacterId,
      toCharacterId: Number(targetId),
    });
    setIsLoading(false);
    closeAction();
  };

  const hasCharacters = characters.length > 0;

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
      <span className="text-sm font-medium">Transférer à un autre personnage</span>
      {isFetching && (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Chargement...
        </span>
      )}
      {!isFetching && !hasCharacters && (
        <span className="text-sm text-muted-foreground">
          Aucun autre personnage actif dans cette campagne
        </span>
      )}
      {!isFetching && hasCharacters && (
        <div className="flex gap-2">
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un personnage" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((character) => (
                <SelectItem key={character.id} value={String(character.id)}>
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="secondary"
            onClick={handleTransfer}
            disabled={!targetId || isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ArrowRightLeft className="size-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
