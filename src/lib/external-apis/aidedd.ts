import axios from "axios";
import {
  getBaseSpellData,
  parseSpellFromAideDD,
} from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";
import { parseCreaturesFromAideDD } from "@/lib/aideDDParseCreature";
import { Creature } from "@/types/types";
import { APISpell } from "@/types/schemas";
import { creatureOverrides } from "@/data/creatureOverrides";
import { mergeDeep } from "remeda";

const getFrSpellURL = "https://www.aidedd.org/public/spell/fr";
const getEnSpellURL = "https://www.aidedd.org/public/spell";
const getCreatureURL = "https://www.aidedd.org/public/monster";

export const getSpellDataFromFrName = async (enSpellName: string) => {
  const response = await axios.get(`${getEnSpellURL}/${enSpellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  const frId = linkHref?.split("fr/")[1] ?? "";
  const spellData = getBaseSpellData(response.data, enSpellName);
  return { enId: spellData?.id, frId };
};

export const getEnSpellIdFromFrName = async (frSpellName: string) => {
  const response = await axios.get(`${getFrSpellURL}/${frSpellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  return linkHref?.split("/")[1] ?? "";
};

const getSpellDataFromFRName = async (
  frSpellName: string,
  enSpellName: string,
) => {
  const response = await axios.get(`${getFrSpellURL}/${frSpellName}`);
  return parseSpellFromAideDD({ html: response.data, spellName: enSpellName });
};

export const getSummarySpellFromFR = async (spellName: string) => {
  const response = await axios.get(`${getFrSpellURL}/${spellName}`);
  return getBaseSpellData(response.data, spellName);
};

export const getSpellDetails = async (
  enSpellName: string,
): Promise<APISpell> => {
  const { frId } = await getSpellDataFromFrName(enSpellName);
  return getSpellDataFromFRName(frId, enSpellName);
};

export const getCreature = async (creatureName: string): Promise<Creature> => {
  const response = await axios.get(`${getCreatureURL}/${creatureName}`);
  const APICreature = parseCreaturesFromAideDD(response.data, creatureName);

  const localCreature = creatureOverrides[creatureName];
  if (localCreature) {
    return mergeDeep(APICreature, localCreature) as Promise<Creature>;
  }

  return APICreature;
};
