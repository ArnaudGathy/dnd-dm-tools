import axios from "axios";
import {
  getBaseSpellData,
  getBaseSpellData2024,
  parseSpellFromAideDD,
  parseSpellFromAideDD2024,
} from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";

const getEnSpell = "https://www.aidedd.org/dnd/sorts.php?vo=";
const getFrSpell = "https://www.aidedd.org/dnd/sorts.php?vf=";
const getEn2024Spell = "https://www.aidedd.org/spell/";

const getFrSpellIdFromEnName = async (spellName: string) => {
  const response = await axios.get(`${getEnSpell}${spellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  return linkHref?.split("=")[1] ?? "";
};

export const getFrSpellPageFromAideDD = async (spellNameEn: string) => {
  const frenchSpellId = await getFrSpellIdFromEnName(spellNameEn);
  const frSpell = await axios.get(`${getFrSpell}${frenchSpellId}`);
  return parseSpellFromAideDD({ html: frSpell.data, spellName: spellNameEn });
};

export const getSpellDataFromENName = async (spellName: string) => {
  const frenchSpellId = await getFrSpellIdFromEnName(spellName);
  return getSpellDataFromFRName(frenchSpellId);
};

export const getSpellDataFromFRName = async (spellName: string) => {
  const response = await axios.get(`${getFrSpell}${spellName}`);
  return getBaseSpellData(response.data);
};

export const getSpellDataFromENName2024 = async (spellName: string) => {
  const response = await axios.get(`${getEn2024Spell}${spellName}`);
  return getBaseSpellData2024(response.data, spellName);
};

export const getSpellPageFromAideDD2024 = async (spellName: string) => {
  const response = await axios.get(`${getEn2024Spell}${spellName}`);
  return parseSpellFromAideDD2024({ html: response.data, spellName });
};
