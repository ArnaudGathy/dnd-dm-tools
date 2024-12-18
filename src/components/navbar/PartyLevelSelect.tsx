"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

const PartyLevelSelect = () => {
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
        {["1", "2"].map((level) => (
          <SelectItem key={level} value={level}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default dynamic(() => Promise.resolve(PartyLevelSelect), { ssr: false });
