import axios from "axios";
import {
  getBaseSpellData,
  parseSpellFromAideDD,
} from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";

const getEnSpell = "https://www.aidedd.org/dnd/sorts.php?vo=";
const getFrSpell = "https://www.aidedd.org/dnd/sorts.php?vf=";

export const getEnSpellPageFromAideDD = async (spellName: string) => {
  const response = await axios.get(`${getEnSpell}${spellName}`);
  return parseSpellFromAideDD({ html: response.data, spellName });
};

export const getSpellDataFromENName = async (spellName: string) => {
  const response = await axios.get(`${getEnSpell}${spellName}`);

  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  const frenchSpellId = linkHref?.split("=")[1] ?? "";

  return getSpellDataFromFRName(frenchSpellId);
};

export const getSpellDataFromFRName = async (spellName: string) => {
  const response = await axios.get(`${getFrSpell}${spellName}`);
  return getBaseSpellData(response.data);
};
