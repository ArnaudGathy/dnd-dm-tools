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
    return undefined;
  }

  const partyId = parseInt(localStorage.getItem("party") || "0", 10);
  return typedParties.find((party) => party.id === partyId);
};
