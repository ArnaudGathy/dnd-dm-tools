import axios from "axios";
import { getBaseSpellData, parseSpellFromAideDD } from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";
import { parseCreaturesFromAideDD } from "@/lib/aideDDParseCreature";
import { Creature, SummaryCreature } from "@/types/types";
import { APISpell, creatureSchema } from "@/types/schemas";
import { creatureOverrides } from "@/data/creatureOverrides";
import { mergeDeep } from "remeda";
import { localCreatures } from "@/data/localCreatures";
import prisma from "@/lib/prisma";

const getFrSpellURL = "https://www.aidedd.org/public/spell/fr";
const getEnSpellURL = "https://www.aidedd.org/public/spell";
const getEnCreatureURL = "https://www.aidedd.org/public/monster";

const inFlightCreatureRequests = new Map<string, Promise<Creature | null>>();

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

const getSpellDataFromFRName = async (frSpellName: string, enSpellName: string) => {
  const response = await axios.get(`${getFrSpellURL}/${frSpellName}`);
  return parseSpellFromAideDD({ html: response.data, spellName: enSpellName });
};

export const getSummarySpellFromFR = async (spellName: string) => {
  const response = await axios.get(`${getFrSpellURL}/${spellName}`);
  return getBaseSpellData(response.data, spellName);
};

export const getSpellDetails = async (enSpellName: string): Promise<APISpell> => {
  const { frId } = await getSpellDataFromFrName(enSpellName);
  return getSpellDataFromFRName(frId, enSpellName);
};

/**
 * Look up a creature in the DB cache, or fetch from AideDD and cache it.
 * Returns the full parsed Creature, or null if the creature wasn't found on AideDD.
 */
const getOrFetchCreature = async (creatureName: string): Promise<Creature | null> => {
  // 1. Check if there's already an in-flight request for this creature
  const inFlight = inFlightCreatureRequests.get(creatureName);
  if (inFlight) {
    return inFlight;
  }

  // 2. Wrap the fetch logic in a promise and cache it
  const fetchPromise = (async () => {
    try {
      // 1. Check the DB cache
      const cached = await prisma.cachedCreature.findUnique({
        where: { id: creatureName },
      });

      if (cached) {
        return creatureSchema.parse(cached.data);
      }

      // 2. Fetch from AideDD
      const response = await axios.get(`${getEnCreatureURL}/${creatureName}`);
      const creature = parseCreaturesFromAideDD(response.data, creatureName);

      if (!creature) {
        return null;
      }

      // 3. Save to DB cache (upsert to handle concurrent requests)
      await prisma.cachedCreature.upsert({
        where: { id: creatureName },
        update: { data: creature },
        create: {
          id: creatureName,
          data: creature,
        },
      });

      return creature;
    } finally {
      // 3. Remove from in-flight requests once done
      inFlightCreatureRequests.delete(creatureName);
    }
  })();

  inFlightCreatureRequests.set(creatureName, fetchPromise);
  return fetchPromise;
};

export const getSummaryCreatureFromEN = async (creatureName: string) => {
  const localCreature = localCreatures[creatureName];
  if (localCreature) {
    return {
      id: localCreature.id,
      name: localCreature.name,
      challengeRating: localCreature.challengeRating,
    } satisfies SummaryCreature;
  }

  const creature = await getOrFetchCreature(creatureName);
  if (!creature) {
    return null;
  }

  return {
    id: creature.id,
    name: creature.name,
    challengeRating: creature.challengeRating,
  } satisfies SummaryCreature;
};

// const getFRCreatureNameFromEN = async (html: string) => {
//   const $ = cheerio.load(html);
//   const mainDataBlock = $(".col1");
//   const frLink = mainDataBlock.find(".trad > a").attr("href");
//   return axios.get(`${getEnCreatureURL}/${frLink}`);
// };

export const getCreature = async (creatureName: string): Promise<Creature> => {
  if (creatureName.substring(0, 1) === "_") {
    const generalName = creatureName.substring(1);
    return localCreatures[generalName];
  }

  const APICreature = await getOrFetchCreature(creatureName);
  // eslint-disable-next-line no-console
  console.info("Creature : ", APICreature);
  if (!APICreature) {
    throw new Error("No creature found locally nor on aidedd.");
  }

  const localCreature = creatureOverrides[creatureName];
  if (localCreature) {
    return mergeDeep(APICreature, localCreature) as Creature;
  }

  return APICreature;
};
