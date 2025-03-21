import axios, { isAxiosError } from "axios";
import {
  APISpell,
  apiSpellSchema,
  SubClass,
  subClassSchema,
} from "@/types/schemas";
import { typedLocalSpells } from "@/utils/utils";

const baseURL = "https://www.dnd5eapi.co/api/2014";
const API = axios.create({ baseURL });

export const getSpell = async (spellName: string) => {
  try {
    const response = await API.get<APISpell>(`/spells/${spellName}`);
    const { data } = response;

    /* eslint-disable-next-line no-console */
    console.info("Spell before parsing :", data);
    apiSpellSchema.parse(data);

    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      // Find spell in local spell list
      const spell = typedLocalSpells.find((spell) => spell.index === spellName);
      if (!!spell) {
        return spell;
      }
    }
    console.error(e);
    return null;
  }
};

export const getSubClass = async (subclassIndex: string) => {
  try {
    const response = await API.get<SubClass>(`/subclasses/${subclassIndex}`);
    const { data } = response;

    subClassSchema.parse(data);

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
