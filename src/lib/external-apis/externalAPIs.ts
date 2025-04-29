import axios, { isAxiosError } from "axios";
import {
  APISpell,
  apiSpellSchema,
  SpellSource,
  SubClass,
  subClassSchema,
} from "@/types/schemas";
import { typedLocalSpells } from "@/utils/utils";
import { getEnSpellPageFromAideDD } from "@/lib/external-apis/aidedd";

const baseURL = "https://www.dnd5eapi.co/api/2014";
const ExternalAPIs = axios.create({ baseURL });

export const getSpell = async (spellName: string): Promise<APISpell | null> => {
  try {
    const response = await ExternalAPIs.get<APISpell>(`/spells/${spellName}`);
    const { data } = response;

    apiSpellSchema.parse(data);
    return { ...data, source: SpellSource.API };
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      // Find spell in local spell list
      const spell = typedLocalSpells.find((spell) => spell.index === spellName);
      if (!!spell) {
        return { ...spell, source: SpellSource.LOCAL };
      } else {
        return getEnSpellPageFromAideDD(spellName);
      }
    }
    console.error(e);
    return null;
  }
};

export const getSubClass = async (subclassIndex: string) => {
  try {
    const response = await ExternalAPIs.get<SubClass>(
      `/subclasses/${subclassIndex}`,
    );
    const { data } = response;

    subClassSchema.parse(data);

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
