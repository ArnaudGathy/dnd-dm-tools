"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchField } from "@/components/SearchField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAMPAIGN_MAP, CHARACTER_STATUS_MAP, PARTY_MAP } from "@/constants/maps";
import { Campaign, CampaignId, CharacterStatus, Party, PartyId } from "@prisma/client";
import { entries } from "remeda";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function CharacterFilters({
  campaigns,
  parties,
  numberOfCharacters,
  isAdmin,
}: {
  campaigns: Campaign[];
  parties: Party[];
  numberOfCharacters: number;
  isAdmin: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hasMultipleCharacters = numberOfCharacters > 1;
  const hasMultipleCampaigns = campaigns.length > 1;
  const hasMultipleParties = parties.length > 1;

  const updateParams = () => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleSearchParams = useDebouncedCallback((search: string) => {
    if (search !== "") {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    updateParams();
  }, 300);

  const handleFilterByCampaign = (campaign: CampaignId | "all") => {
    if (campaign !== "all") {
      params.set("campaign", campaign);
    } else {
      params.delete("campaign");
    }
    updateParams();
  };

  const handleFilterByParty = (party: PartyId | "all") => {
    if (party !== "all") {
      params.set("party", party);
    } else {
      params.delete("party");
    }
    updateParams();
  };

  const handleFilterByStatus = (status: CharacterStatus | "all") => {
    if (status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    updateParams();
  };

  useEffect(() => {
    if (isAdmin) {
      handleFilterByStatus(CharacterStatus.ACTIVE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearParams = () => {
    params.delete("search");
    params.delete("status");
    params.delete("party");
    params.delete("campaign");
    updateParams();
  };

  if (!hasMultipleCharacters) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className="flex gap-2">
        <Toggle
          className="md:hidden"
          variant="outline"
          defaultPressed={!isCollapsed}
          onClick={() => setIsCollapsed((current) => !current)}
        >
          Filtres
          {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </Toggle>
        <SearchField search={params.get("search") ?? ""} setSearch={handleSearchParams} isDefault />
      </div>

      {!isCollapsed && (
        <>
          <Select
            onValueChange={(value) => handleFilterByStatus(value as CharacterStatus)}
            value={params.get("status") ?? ""}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tous</SelectItem>
                {entries(CHARACTER_STATUS_MAP).map(([status, name]) => (
                  <SelectItem key={status} value={status}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {hasMultipleParties && (
            <Select
              onValueChange={(value) => handleFilterByParty(value as PartyId)}
              value={params.get("party") ?? ""}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Groupe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tous</SelectItem>
                  {parties.map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {PARTY_MAP[name]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {hasMultipleCampaigns && (
            <Select
              onValueChange={(value) => handleFilterByCampaign(value as CampaignId)}
              value={params.get("campaign") ?? ""}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Campagne" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tous</SelectItem>
                  {campaigns.map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {CAMPAIGN_MAP[name]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Button onClick={clearParams} variant="secondary">
            Réinitialiser les filtres
          </Button>
        </>
      )}
    </div>
  );
}
