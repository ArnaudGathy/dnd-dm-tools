"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Character, SpellsOnCharacters } from "@prisma/client";

export type Group = Array<
  Character & { spellsOnCharacters: SpellsOnCharacters[] }
>;

export const useGroupFromCampaign = ({
  addGroupMembersToListAction,
}: {
  addGroupMembersToListAction: (group: Group) => void;
}) => {
  const [group, setGroup] = useState<Group>([]);
  const campaignId = parseInt(localStorage.getItem("campaignId") || "0", 10);

  useEffect(() => {
    const fetchParties = async () => {
      const res = await axios.get(`/api/characters/${campaignId}`);
      setGroup(res.data);
      addGroupMembersToListAction(res.data);
    };
    fetchParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return group;
};
