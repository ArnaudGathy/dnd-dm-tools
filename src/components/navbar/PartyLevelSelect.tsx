"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { typedEncounters } from "@/utils/utils";
import { flat, unique } from "remeda";

const PartyLevelSelect = () => {
  const availableLevels = unique(
    flat(typedEncounters.map((encounter) => Object.keys(encounter.ennemies))),
  );

  return (
    <Select
      defaultValue={localStorage.getItem("partyLevel") || undefined}
      onValueChange={(value) => {
        localStorage.setItem("partyLevel", value);
        window.location.reload();
      }}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="Lvl" />
      </SelectTrigger>
      <SelectContent>
        {availableLevels.map((level) => (
          <SelectItem key={level} value={level}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default dynamic(() => Promise.resolve(PartyLevelSelect), { ssr: false });
