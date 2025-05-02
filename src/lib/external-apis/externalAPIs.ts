import axios, { AxiosResponse, isAxiosError } from "axios";
import {
  APISpell,
  SpellSource,
  SubClass,
  subClassSchema,
} from "@/types/schemas";
import { getFrSpellPageFromAideDD } from "@/lib/external-apis/aidedd";
import { SpellVersion } from "@prisma/client";

const baseURL = "https://www.dnd5eapi.co/api/2014";
const ExternalAPIs = axios.create({ baseURL });

export const get2014Spell = async (
  spellName: string,
): Promise<APISpell | null> => {
  let enSpellData: AxiosResponse<APISpell> | null = null;
  try {
    enSpellData = await ExternalAPIs.get<APISpell>(`/spells/${spellName}`);
  } catch (e) {
    if (isAxiosError(e) && e.response?.status !== 404) {
      throw e;
    }
  }

  const frSpellData = await getFrSpellPageFromAideDD(spellName);

  // const spell = typedLocalSpells.find((spell) => spell.index === spellName);
  // if (!!spell) {
  //   return {
  //     ...spell,
  //     source: SpellSource.LOCAL,
  //     version: SpellVersion.V2014,
  //   };
  // }

  return {
    ...(enSpellData?.data ?? {}),
    ...frSpellData,
    source: enSpellData?.data ? SpellSource.MIXED : SpellSource.AIDE_DD,
    version: SpellVersion.V2014,
  };
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
