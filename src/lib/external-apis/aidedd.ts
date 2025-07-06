import axios from "axios";
import {
  getBaseSpellData,
  getBaseSpellData2024,
  parseSpellFromAideDD2024,
} from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";
import { parse2024CreaturesFromAideDD } from "@/lib/aideDDParse2024Creature";
import { Creature } from "@/types/types";
import { APISpell } from "@/types/schemas";

const getEnSpellURL = "https://www.aidedd.org/dnd/sorts.php?vo=";
const getFrSpellURL = "https://www.aidedd.org/dnd/sorts.php?vf=";
const getEn2024SpellURL = "https://www.aidedd.org/public/spell";
const get2024CreatureURL = "https://www.aidedd.org/public/monster";

const getFrSpellIdFromEnName = async (spellName: string) => {
  const response = await axios.get(`${getEnSpellURL}${spellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  return linkHref?.split("=")[1] ?? "";
};

export const getSpellDataFromENName = async (spellName: string) => {
  const frenchSpellId = await getFrSpellIdFromEnName(spellName);
  return getSpellDataFromFRName(frenchSpellId);
};

export const getSpellDataFromFRName = async (spellName: string) => {
  const response = await axios.get(`${getFrSpellURL}${spellName}`);
  return getBaseSpellData(response.data);
};

export const getSpellDataFromENName2024 = async (spellName: string) => {
  const response = await axios.get(`${getEn2024SpellURL}/${spellName}`);
  return getBaseSpellData2024(response.data, spellName);
};

export const getSpellPageFromAideDD2024 = async (
  spellName: string,
): Promise<APISpell> => {
  const response = await axios.get(`${getEn2024SpellURL}/${spellName}`);
  return parseSpellFromAideDD2024({ html: response.data, spellName });
};

export const get2024Creature = async (
  creatureName: string,
): Promise<Creature> => {
  const response = await axios.get(`${get2024CreatureURL}/${creatureName}`);
  return parse2024CreaturesFromAideDD(response.data, creatureName);
};
