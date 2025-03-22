"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { typedParties } from "@/utils/utils";
import dynamic from "next/dynamic";

const PartySelect = () => {
  return (
    <Select
      defaultValue={localStorage.getItem("party") ?? "0"}
      onValueChange={(value) => {
        localStorage.setItem("party", value);
        window.location.reload();
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Party" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"0"}>Tout</SelectItem>
        {typedParties.map((party) => {
          const partyId = party.id.toString();

          return (
            <SelectItem key={partyId} value={partyId}>
              {party.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default dynamic(() => Promise.resolve(PartySelect), { ssr: false });
