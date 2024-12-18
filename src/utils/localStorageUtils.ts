"use client";

import { typedParties } from "@/utils/utils";

export const getPartyLevel = () => {
  if (typeof window === "undefined") {
    return "1";
  }

  return localStorage.getItem("partyLevel") || "1";
};

export const getParty = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const partyId = parseInt(localStorage.getItem("party") || "1", 10);
  const party = typedParties.find((party) => party.id === partyId);
  if (!party) {
    throw new Error("party not found");
  }
  return party;
};
