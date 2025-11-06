import { APISpell, SpellSource, SummaryAPISpell } from "@/types/schemas";
import * as cheerio from "cheerio";
import { capitalize } from "remeda";

export const getBaseSpellData = (html: string, spellName: string) => {
  const $ = cheerio.load(html);
  const mainDataBlock = $(".col1");

  const name = mainDataBlock.find("h1").text().trim();

  const levelAndSchoolBlock = mainDataBlock.find(".ecole").text();
  const level = levelAndSchoolBlock.split("-")[0].trim().match(/\d+/)?.[0];
  const isRitual = mainDataBlock.find(".t").text().toLowerCase().includes("rituel");

  if (!level) {
    return null;
  }

  return {
    id: spellName,
    name,
    level: parseInt(level, 10),
    isRitual,
  } satisfies SummaryAPISpell;
};

export const parseSpellFromAideDD = ({ html, spellName }: { html: string; spellName: string }) => {
  const $ = cheerio.load(html);
  const mainDataBlock = $(".col1");
  const baseSpellData = getBaseSpellData(html, spellName);

  const levelAndSchoolBlock = mainDataBlock.find(".ecole").text();
  const school = levelAndSchoolBlock.match(/^(.*?)\s+de niveau\b/)?.[1].trim();

  if (!school) {
    throw new Error("No school found");
  }

  const castingTime = mainDataBlock.find(".t").text().split(":")[1].trim();
  const range = mainDataBlock.find(".r").text().split(":")[1].trim();

  const componentsFullString = mainDataBlock.find(".c").text().split(":")[1].trim();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, componentsString, material] =
    componentsFullString.match(/^([^()]+?)(?:\s*\(([^)]*)\))?$/) || [];
  const components = componentsString?.split(",").map((c) => c.trim()) ?? [];

  const duration = mainDataBlock.find(".d").text().split(":")[1].trim();
  const isConcentration = duration.toLowerCase().includes("concentration");

  const descriptionArray = mainDataBlock
    .find(".description")
    .contents()
    .toArray()
    .reduce<string[]>((acc, el) => {
      if (el.type === "text" || (el.type === "tag" && el.tagName)) {
        const text = $(el).text().trim();
        if (text !== "") {
          return [...acc, text];
        }
      }

      return acc;
    }, []);
  const description = descriptionArray.join(" ");

  const [desc, atHigherLevel] = description.includes("Emplacement de niveau supérieur")
    ? description.split("Emplacement de niveau supérieur")
    : description.split("Amélioration de sort mineur");

  const classRole = mainDataBlock
    .find(".classe")
    .contents()
    .toArray()
    .map((el) => {
      if (el.type === "text") {
        return el.data?.trim();
      }
      return null;
    });

  return {
    name: baseSpellData?.name,
    index: spellName,
    casting_time: castingTime,
    duration: duration,
    concentration: isConcentration,
    components,
    ritual: baseSpellData?.isRitual,
    material,
    range,
    desc: [desc],
    higher_level: atHigherLevel
      ? [atHigherLevel.substring(2, atHigherLevel.length - 1)]
      : undefined,
    level: baseSpellData?.level,
    classes: classRole?.map((c) => ({
      name: capitalize(c ?? ""),
      index: c ?? "",
    })),
    school: {
      index: school.toLowerCase(),
      name: capitalize(school),
    },
    source: SpellSource.AIDE_DD_2024,
  } satisfies APISpell;
};
