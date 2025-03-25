"use client";

export const getPartyLevel = () => {
  if (typeof window === "undefined") {
    return "1";
  }

  return localStorage.getItem("partyLevel") || "1";
};
