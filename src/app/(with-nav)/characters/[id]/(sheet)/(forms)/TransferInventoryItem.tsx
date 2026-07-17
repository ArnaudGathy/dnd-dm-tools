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
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, LoaderCircle } from "lucide-react";
import { transferInventoryItem } from "@/lib/actions/InventoryItems";
import { Group } from "@/hooks/useGroupFromCampaign";

export default function TransferInventoryItem({
  itemId,
  itemQuantity,
  campaignId,
  currentCharacterId,
  closeAction,
}: {
  itemId: number;
  itemQuantity: number;
  campaignId: number;
  currentCharacterId: number;
  closeAction: () => void;
}) {
  const [characters, setCharacters] = useState<Group>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [quantity, setQuantity] = useState(String(itemQuantity));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      const res = await axios.get<Group>(`/api/characters/${campaignId}`);
      setCharacters(res.data.filter((character) => character.id !== currentCharacterId));
      setIsFetching(false);
    };
    fetchCharacters();
  }, [campaignId, currentCharacterId]);

  const amount = Number(quantity);
  const isAmountValid = Number.isInteger(amount) && amount >= 1 && amount <= itemQuantity;

  const handleTransfer = async () => {
    if (!targetId || !isAmountValid) {
      return;
    }
    setIsLoading(true);
    await transferInventoryItem({
      itemId,
      fromCharacterId: currentCharacterId,
      toCharacterId: Number(targetId),
      quantity: amount,
    });
    setIsLoading(false);
    closeAction();
  };

  const hasCharacters = characters.length > 0;
  const canSplit = itemQuantity > 1;

  return (
    <div className="mt-1 flex flex-col gap-2 border-t border-border pt-3">
      <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
        Transférer à un autre personnage
      </span>
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
          {canSplit && (
            <Input
              type="number"
              min={1}
              max={itemQuantity}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="h-9 w-16 shrink-0 tabular-nums"
              aria-label="Quantité à transférer"
            />
          )}
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
            disabled={!targetId || !isAmountValid || isLoading}
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
