import * as cheerio from "cheerio";
import { Creature } from "@/types/types";
import { load } from "cheerio";
import { map, pipe, split } from "remeda";

function getStrongValueByLabel(html: string, label: string) {
  const $ = cheerio.load(html);
  const strongElements = $(".red").find("strong");

  const target = strongElements
    .toArray()
    .find((el) => $(el).text().trim().toLowerCase() === label.toLowerCase());

  if (!target) return undefined;

  let node = target.nextSibling;

  while (node) {
    if (node.type === "text") {
      const value = node.nodeValue?.trim();
      if (value) return value;
    } else if (node.type === "tag") {
      const value = $(node).text().trim();
      if (value) return value;
    }
    node = node.nextSibling;
  }

  return undefined;
}

function extractSpeed(text: string, target?: "Swim" | "Fly" | "Climb") {
  const regex = new RegExp(`${target}\\s+(\\d+)\\s*ft`, "i");

  let match;
  if (!target) {
    match = text.match(/^(\d+)\s*ft/i);
  } else {
    match = text.match(regex);
  }

  return match ? `${(parseInt(match[1], 10) / 5) * 1.5} m` : undefined;
}

function extractStats(html: string) {
  const $ = load(html);
  const result: Record<string, string[]> = {};

  $(".car1, .car4").each((_, el) => {
    const label = $(el).text().trim();
    const values: string[] = [];

    let node = el.nextSibling;

    while (node && values.length < 3) {
      if (node.type === "tag") {
        values.push($(node).text().trim());
      }
      node = node.nextSibling;
    }

    result[label] = values;
  });

  return result;
}

function getSavingThrow(
  abilities: Record<string, string[]>,
  abilityName: string,
) {
  const savingThrow = abilities[abilityName][2];
  if (savingThrow === "+0") {
    return undefined;
  }
  return savingThrow;
}

function parseSkillString(input: string): Record<string, string> {
  return Object.fromEntries(
    input
      .split(",")
      .map((s) => s.trim())
      .map((pair) => {
        const match = pair.match(/^([A-Za-z\s]+)\s*([+-]?\d+)$/);
        if (!match) return null;
        const skill = match[1].trim().toLowerCase();
        const bonus = match[2].startsWith("+") ? match[2] : `+${match[2]}`;
        return [skill, bonus];
      })
      .filter((entry): entry is [string, string] => entry !== null),
  );
}

function commaSeparatedValuesToArray(list: string) {
  return pipe(
    list,
    split(/[,;]+/),
    map((val) => val.trim().toLowerCase()),
  );
}

function extractAndConvertCr(input?: string): number | undefined {
  if (!input) return undefined;

  const match = input.trim().match(/^(\S+)/);
  if (!match) return undefined;

  const value = match[1];
  if (value.includes("/")) {
    const [numerator, denominator] = value.split("/").map(Number);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

function parseSenseString(input?: string): Creature["senses"] {
  if (!input) {
    throw new Error("No senses found");
  }

  return Object.fromEntries(
    input
      .split(",")
      .map((s) => s.trim())
      .map((pair) => {
        const match = pair.match(/^([A-Za-z\s]+?)\s+([+-]?\d+(?:\s*ft\.)?)$/);
        if (!match) return null;
        const sense = match[1].trim().toLowerCase();
        const value = match[2].trim().toLowerCase();
        return [sense, value];
      })
      .filter((entry): entry is [string, string] => entry !== null)
      .map(([sense, value]) => {
        if (sense === "passive perception") {
          return ["passivePerception", parseInt(value, 10)];
        }
        if (sense === "truesight") {
          return [
            "trueSight",
            `${(parseInt(value.split(" ")[0], 10) / 5) * 1.5} m`,
          ];
        }
        if (sense === "blindsight") {
          return [
            "blindSight",
            `${(parseInt(value.split(" ")[0], 10) / 5) * 1.5} m`,
          ];
        }
        if (sense === "darkvision") {
          return [
            "darkvision",
            `${(parseInt(value.split(" ")[0], 10) / 5) * 1.5} m`,
          ];
        }
        return [sense, value];
      }),
  );
}

function convertFeetToMeters(text: string): string {
  return text.replace(/(\d+)\s*ft\.?/gi, (_, feetStr) => {
    const feet = parseInt(feetStr, 10);
    const meters = (feet / 5) * 1.5;
    return `${meters % 1 === 0 ? meters : meters.toFixed(1)} m`;
  });
}

function extractSectionParagraphs(
  html: string,
  sectionTitle: string,
  isAction = false,
) {
  const $ = load(html);
  const entries = [];

  const sectionDiv = $("div.rub")
    .filter(
      (_, el) =>
        $(el).text().trim().toLowerCase() === sectionTitle.toLowerCase(),
    )
    .first();

  if (!sectionDiv.length) return undefined;

  let node = sectionDiv[0].nextSibling;

  while (node) {
    if (node.type === "tag") {
      const el = $(node);

      if (el.is("div.rub")) break;
      if (el.is("p")) {
        const name = el.find("strong em").first().text().trim();

        const descriptionRaw = el
          .clone()
          .children("strong")
          .remove()
          .end()
          .text()
          .trim();
        const description = descriptionRaw.replace(/^\.\s*/, "");

        if (isAction && /attack roll/i.test(description)) {
          const match = description.match(
            /^([A-Za-z\s]+?)\s+Attack Roll:\s*([+-]?\d+),\s*reach\s+(.+?)\s*Hit:\s*(.+)$/i,
          );

          if (match) {
            const [, type, modifier, reach, hit] = match;
            entries.push({
              name,
              type: type.trim(),
              modifier: modifier.trim(),
              reach: convertFeetToMeters(reach.trim()).replace(
                "or range",
                "ou portée",
              ),
              hit: hit.trim(),
            });
            node = node.nextSibling;
            continue;
          }
        }

        // Default case
        if (name) {
          entries.push({ name, description });
        }
      }
    }
    node = node.nextSibling;
  }

  return entries.length > 0 ? entries : undefined;
}

function extractLegendaryActionUses(html: string): string | undefined {
  const $ = load(html);

  const matchingElement = $("*")
    .toArray()
    .find((el) => {
      const text = $(el).text();
      return /Legendary Action Uses:\s*.+?\./.test(text);
    });

  if (!matchingElement) return undefined;

  const fullText = $(matchingElement).text();
  const match = fullText.match(/Legendary Action Uses:\s*(.+?)\./);

  return match ? match[1].trim() : undefined;
}

export const parse2024CreaturesFromAideDD = (
  html: string,
  creatureName: string,
) => {
  const $ = cheerio.load(html);
  const statBlockSelector = $(".jaune");

  const readableName = statBlockSelector.find("h1").text().trim();

  const typeBlock = statBlockSelector.find(".type").text().trim();
  const type = typeBlock.match(/^\S+\s+([^,]+)/)?.[1];
  const size = typeBlock.match(/^\w+/)?.[0];
  const alignment = typeBlock.split(", ")[1].trim();
  if (type === undefined) {
    throw new Error("No creature type found");
  }
  if (size === undefined) {
    throw new Error("No creature size found");
  }

  const CR = getStrongValueByLabel(html, "CR");
  const CRNumber = extractAndConvertCr(CR);
  if (!CRNumber) {
    throw new Error("No creature CR found");
  }

  const AC = getStrongValueByLabel(html, "AC");
  if (!AC) {
    throw new Error("No creature AC found");
  }
  const HP = getStrongValueByLabel(html, "HP");
  if (!HP) {
    throw new Error("No creature HP found");
  }
  const speed = getStrongValueByLabel(html, "Speed");
  if (!speed) {
    throw new Error("No creature speed found");
  }
  const walkSpeed = extractSpeed(speed);
  const flySpeed = extractSpeed(speed, "Fly");
  const swimSpeed = extractSpeed(speed, "Swim");
  const climbSpeed = extractSpeed(speed, "Climb");
  if (!walkSpeed) {
    throw new Error("No creature walking speed found");
  }

  const abilities = extractStats(html);

  const skills = getStrongValueByLabel(html, "Skills");
  const immunities = getStrongValueByLabel(html, "Immunities");
  const vulnerabilities = getStrongValueByLabel(html, "Vulnerabilities");
  const resistances = getStrongValueByLabel(html, "Resistances");
  const languages = getStrongValueByLabel(html, "Languages");
  const senses = getStrongValueByLabel(html, "Senses");

  const traits = extractSectionParagraphs(html, "Traits") as {
    name: string;
    description: string;
  }[];
  const actions = extractSectionParagraphs(html, "Actions", true);
  if (!actions) {
    throw new Error("No creature actions found");
  }

  const reactions = extractSectionParagraphs(html, "Reactions", true);
  const bonusActions = extractSectionParagraphs(html, "Bonus actions", true);
  const legendaryActions = extractSectionParagraphs(
    html,
    "Legendary actions",
    true,
  );
  const legendaryActionsSlots = extractLegendaryActionUses(html);

  return {
    name: readableName,
    id: creatureName,
    type,
    size,
    alignment,
    armorClass: AC,
    hitPoints: HP,
    challengeRating: CRNumber,
    speed: {
      walk: walkSpeed,
      swim: swimSpeed,
      fly: flySpeed,
      climb: climbSpeed,
    },
    abilities: {
      strength: Number(abilities.Str[0]),
      dexterity: Number(abilities.Dex[0]),
      constitution: Number(abilities.Con[0]),
      intelligence: Number(abilities.Int[0]),
      wisdom: Number(abilities.Wis[0]),
      charisma: Number(abilities.Cha[0]),
    },
    savingThrows: {
      strength: getSavingThrow(abilities, "Str"),
      dexterity: getSavingThrow(abilities, "Dex"),
      constitution: getSavingThrow(abilities, "Con"),
      intelligence: getSavingThrow(abilities, "Int"),
      wisdom: getSavingThrow(abilities, "Wis"),
      charisma: getSavingThrow(abilities, "Cha"),
    },
    skills: skills ? parseSkillString(skills) : undefined,
    immunities: immunities
      ? commaSeparatedValuesToArray(immunities)
      : undefined,
    vulnerabilities: vulnerabilities
      ? commaSeparatedValuesToArray(vulnerabilities)
      : undefined,
    resistances: resistances
      ? commaSeparatedValuesToArray(resistances)
      : undefined,
    languages: languages ? commaSeparatedValuesToArray(languages) : undefined,
    senses: parseSenseString(senses),
    traits,
    actions,
    reactions,
    legendaryActions,
    legendaryActionsSlots: legendaryActionsSlots,
    bonusActions,
    // lairActions
    // spellStats
    // spells
    // colors
  } satisfies Creature;
};
