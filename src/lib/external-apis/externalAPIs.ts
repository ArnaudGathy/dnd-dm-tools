import axios, { AxiosResponse, isAxiosError } from "axios";
import {
  APISpell,
  SpellSource,
  SubClass,
  subClassSchema,
} from "@/types/schemas";
import {
  getFrSpellPageFromAideDD,
  getSpellPageFromAideDD2024,
} from "@/lib/external-apis/aidedd";
import { SpellVersion } from "@prisma/client";

const baseURL = "https://www.dnd5eapi.co/api/2014";
const ExternalAPIs = axios.create({ baseURL });

const get2014Spell = async (spellName: string) => {
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

const get2024Spell = async (spellName: string) => {
  const frSpellData = await getSpellPageFromAideDD2024(spellName);

  return {
    ...frSpellData,
    source: SpellSource.AIDE_DD_2024,
    version: SpellVersion.V2024,
  };
};

export const getSpell = async (
  spellName: string,
  version: SpellVersion,
): Promise<APISpell | null> => {
  if (version === SpellVersion.V2024) {
    return get2024Spell(spellName);
  }
  return get2014Spell(spellName);
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
