"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Campaign, Party } from "@prisma/client";
import { PARTY_MAP } from "@/constants/maps";

const CampaignsList = ({ campaigns }: { campaigns: Array<Campaign & { party: Party }> }) => {
  return (
    <Select
      defaultValue={localStorage.getItem("campaignId") ?? "0"}
      onValueChange={(value) => {
        localStorage.setItem("campaignId", value);
        window.location.reload();
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Campaign" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"0"}>Tout</SelectItem>
        {campaigns.map(({ id, party }) => {
          const partyId = id.toString();

          return (
            <SelectItem key={partyId} value={partyId}>
              {PARTY_MAP[party.name]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default dynamic(() => Promise.resolve(CampaignsList), { ssr: false });
