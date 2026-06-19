import axios from "axios";
import { getBaseSpellData, parseSpellFromAideDD } from "@/lib/aideDDParseSpellPageContent";
import * as cheerio from "cheerio";
import { parseCreaturesFromAideDD } from "@/lib/aideDDParseCreature";
import { Creature, SummaryCreature } from "@/types/types";
import { APISpell, apiSpellSchema, creatureSchema } from "@/types/schemas";
import { creatureOverrides } from "@/data/creatureOverrides";
import { mergeDeep } from "remeda";
import { localCreatures } from "@/data/localCreatures";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { projectSpellColumns } from "@/lib/spellProjection";

const getFrSpellURL = "https://www.aidedd.org/public/spell/fr";
const getEnSpellURL = "https://www.aidedd.org/public/spell";
const getEnCreatureURL = "https://www.aidedd.org/public/monster";

// AideDD is a public website, not an API. We present ourselves with realistic
// browser headers so our requests don't look like an automated scraper (the
// default axios User-Agent is a dead giveaway). Pacing/jitter between requests
// is the caller's responsibility (see scripts/backfill-spell-cache.ts).
const aideDDClient = axios.create({
  timeout: 20000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "fr-BE,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Ch-Ua": '"Chromium";v="126", "Google Chrome";v="126", "Not.A/Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  },
});

const inFlightCreatureRequests = new Map<string, Promise<Creature | null>>();

export const getSpellDataFromFrName = async (enSpellName: string) => {
  const response = await aideDDClient.get(`${getEnSpellURL}/${enSpellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  const frId = linkHref?.split("fr/")[1] ?? "";
  const spellData = getBaseSpellData(response.data, enSpellName);
  return { enId: spellData?.id, frId };
};

export const getEnSpellIdFromFrName = async (frSpellName: string) => {
  const response = await aideDDClient.get(`${getFrSpellURL}/${frSpellName}`);
  const $ = cheerio.load(response.data);
  const mainDataBlock = $(".col1");
  const linkHref = mainDataBlock.find(".trad > a").attr("href");
  return linkHref?.split("/")[1] ?? "";
};

const getSpellDataFromFRName = async (frSpellName: string, enSpellName: string) => {
  const response = await aideDDClient.get(`${getFrSpellURL}/${frSpellName}`);
  return parseSpellFromAideDD({ html: response.data, spellName: enSpellName });
};

export const getSummarySpellFromFR = async (spellName: string) => {
  const response = await aideDDClient.get(`${getFrSpellURL}/${spellName}`);
  return getBaseSpellData(response.data, spellName);
};

const inFlightSpellRequests = new Map<string, Promise<APISpell>>();

/**
 * Look up a spell's full data on the `Spell` row, or fetch it from AideDD and
 * cache it there. A spell is only fetched from AideDD once; afterwards it is
 * served from `Spell.data`. The fetch also projects the queryable columns
 * (concentration, actionType, classes, …). Use `clearSpellCache` to drop the
 * cached payload, or pass `{ force: true }` to refetch and overwrite it (e.g.
 * when AideDD changed or a field was parsed incorrectly).
 */
export const getSpellDetails = async (
  enSpellName: string,
  { force = false }: { force?: boolean } = {},
): Promise<APISpell> => {
  // 1. Reuse an in-flight request for this spell (dedup) — but a forced refresh
  // must always hit AideDD, so it never piggy-backs on an in-flight read.
  const inFlight = inFlightSpellRequests.get(enSpellName);
  if (inFlight && !force) {
    return inFlight;
  }

  // 2. Wrap the fetch logic in a promise and cache it
  const fetchPromise = (async () => {
    try {
      // 1. Serve the cached payload if present (skipped on a forced refresh)
      if (!force) {
        const existing = await prisma.spell.findUnique({
          where: { id: enSpellName },
        });

        if (existing?.data) {
          return apiSpellSchema.parse(existing.data);
        }
      }

      // 2. Fetch from AideDD
      const { frId } = await getSpellDataFromFrName(enSpellName);
      const spell = await getSpellDataFromFRName(frId, enSpellName);

      // 3. Cache the full payload + projected columns (upsert overwrites)
      const columns = projectSpellColumns(spell);
      await prisma.spell.upsert({
        where: { id: enSpellName },
        update: { ...columns, data: spell as unknown as Prisma.InputJsonValue },
        create: { id: enSpellName, ...columns, data: spell as unknown as Prisma.InputJsonValue },
      });

      return spell;
    } finally {
      // 4. Remove from in-flight requests once done
      inFlightSpellRequests.delete(enSpellName);
    }
  })();

  if (!force) {
    inFlightSpellRequests.set(enSpellName, fetchPromise);
  }
  return fetchPromise;
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
      const response = await aideDDClient.get(`${getEnCreatureURL}/${creatureName}`);
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
