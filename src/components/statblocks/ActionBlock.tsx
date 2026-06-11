import { getDistanceInSquares, replaceMetersWithSquares } from "@/utils/utils";
import { Dices, Info, Ruler, Shield, Swords, Target } from "lucide-react";
import { WeaponDamageType } from "@prisma/client";
import { getDamageTypeIconAndColor } from "@/utils/stats/weapons";
import { Action } from "@/types/types";
import { NamedEntry } from "@/components/statblocks/NamedEntry";
import { Pill } from "@/components/statblocks/Pill";
import { TooltipComponent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TOOLTIP_DELAY = 200;

// Hit strings are free-form DM prose mixing FR/EN. We tokenize them into ordered parts:
// damage rolls become pills colored/iconed by damage type, saving throws become "JdS"
// pills, everything else stays inline text. Shapes covered (all taken from the data):
//   "7 (2d4 + 2) piercing damage."           type after the roll (EN, "slashing –damage")
//   "5 (1d4 + 3) dégâts perforants."         type after the roll (FR: "dégâts de force",
//                                            "dégats d'acide", bare "tranchants", "psi")
//   "8 (1d8 tranchant + 1d6 poison + 4)"     types inside the roll → one pill per component,
//                                            the flat modifier joins the first component
//   "18 (4d6 (+2d4) + 4) dégâts perçants"    nested parentheses
//   "Cible 6d6 poison au début de son tour"  bare dice outside parentheses
//   "JdS CON 12 ou 2d4 poison"               FR saves, with optional "DD" and "DEX/FOR"
//   "DC 12 Constitution saving throw"        EN saves, normalized to the FR "JdS" form
// Non-roll parentheticals like "(DD 14)" or "(Recharge 5–6)" stay literal text.

// Every spelling a damage type takes across the data, EN and FR, full words and DM
// shorthand ("cont.", "psi", "nécro"). Patterns carry their own word boundaries.
// Icon and color come from getDamageTypeIconAndColor so pills match the weapon
// damage display and resistance/immunity tags.
const DAMAGE_TYPES = {
  slashing: {
    pattern: "\\b(?:slashing|tranchants?)\\b",
    label: "tranchant",
    type: WeaponDamageType.SLASHING,
  },
  piercing: {
    pattern: "\\b(?:piercing|per[çc]ants?|perforants?)\\b",
    label: "perçant",
    type: WeaponDamageType.PIERCING,
  },
  bludgeoning: {
    pattern: "\\b(?:bludgeoning|contondants?|cont\\b\\.?)",
    label: "contondant",
    type: WeaponDamageType.BLUDGEONING,
  },
  fire: { pattern: "\\b(?:fire|feu)\\b", label: "feu", type: WeaponDamageType.FIRE },
  cold: { pattern: "\\b(?:cold|froids?|givre)\\b", label: "froid", type: WeaponDamageType.COLD },
  lightning: {
    pattern: "\\b(?:lightning|foudre)\\b",
    label: "foudre",
    type: WeaponDamageType.LIGHTNING,
  },
  thunder: {
    pattern: "\\b(?:thunder|tonnerre)\\b",
    label: "tonnerre",
    type: WeaponDamageType.THUNDER,
  },
  poison: { pattern: "\\bpoison\\b", label: "poison", type: WeaponDamageType.POISON },
  acid: { pattern: "\\b(?:acid|acides?)\\b", label: "acide", type: WeaponDamageType.ACID },
  necrotic: {
    pattern: "\\b(?:necrotic|n[ée]crotiques?|n[ée]cro)\\b",
    label: "nécrotique",
    type: WeaponDamageType.NECROTIC,
  },
  psychic: {
    pattern: "\\b(?:psychic|psychiques?|psi)\\b",
    label: "psychique",
    type: WeaponDamageType.PSYCHIC,
  },
  force: { pattern: "\\bforce\\b", label: "force", type: WeaponDamageType.FORCE },
  radiant: { pattern: "\\bradiant\\b", label: "radiant", type: WeaponDamageType.RADIANT },
} satisfies Record<string, { pattern: string; label: string; type: WeaponDamageType }>;

type DamageTypeKey = keyof typeof DAMAGE_TYPES;

type HitPart =
  | { kind: "text"; value: string }
  | { kind: "damage"; value: string; damageType?: DamageTypeKey }
  // A save that directly causes damage carries that damage's type so both pills share a color.
  | { kind: "save"; value: string; damageType?: DamageTypeKey };

const DAMAGE_TYPE_KEYS = Object.keys(DAMAGE_TYPES) as DamageTypeKey[];

// One named group per type so a single exec tells us which type matched.
const typeAlternation = DAMAGE_TYPE_KEYS.map(
  (key) => `(?<${key}>${DAMAGE_TYPES[key].pattern})`,
).join("|");
const TYPE_FINDER = new RegExp(typeAlternation, "i");
// Type phrase directly after a roll: "piercing damage", "dégâts de froid", "dégats
// d'acide", "slashing –damage" or just the bare type word ("poison", "psi").
const TRAILING_TYPE = new RegExp(
  `^\\s*(?:d[ée]g[âa]ts?\\s+(?:de\\s+|d['’]\\s*)?)?(?:${typeAlternation})(?:\\s*[–-]?\\s*damage)?`,
  "i",
);

const matchedDamageType = (match: RegExpExecArray) =>
  DAMAGE_TYPE_KEYS.find((key) => match.groups?.[key] !== undefined);

const EN_ABILITIES: Record<string, string> = {
  strength: "FOR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "SAG",
  charisma: "CHA",
};
const EN_ABILITY_PATTERN = "Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma";

// `tail` re-emits as plain text whatever the match swallowed beyond the DC itself,
// e.g. "(DC 5 plus the damage taken)" → pill "JdS CON 5" followed by "plus the damage taken".
const SAVE_PATTERNS: {
  regex: RegExp;
  label: (match: RegExpExecArray) => string;
  tail?: (match: RegExpExecArray) => string;
}[] = [
  {
    // "JdS FOR 14", "JdS DEX/FOR 14", "JdS CON DD 5"
    regex: /JdS\s+([A-Za-zÀ-ÿ]{3}(?:\/[A-Za-zÀ-ÿ]{3})?)\s+(?:DD\s*)?(\d+)/g,
    label: (match) => `JdS ${match[1].toUpperCase()} ${match[2]}`,
  },
  {
    // "must succeed on a DC 12 Constitution saving throw"
    regex: new RegExp(`DC\\s*(\\d+)\\s+(${EN_ABILITY_PATTERN})\\s+saving\\s+throw`, "gi"),
    label: (match) => `JdS ${EN_ABILITIES[match[2].toLowerCase()]} ${match[1]}`,
  },
  {
    // "Constitution Saving Throw: DC 10"
    regex: new RegExp(`(${EN_ABILITY_PATTERN})\\s+saving\\s+throw\\s*:\\s*DC\\s*(\\d+)`, "gi"),
    label: (match) => `JdS ${EN_ABILITIES[match[1].toLowerCase()]} ${match[2]}`,
  },
  {
    // "Constitution saving throw (DC 5 plus the damage taken)"
    regex: new RegExp(
      `(${EN_ABILITY_PATTERN})\\s+saving\\s+throw\\s+\\(DC\\s*(\\d+)([^)]*)\\)`,
      "gi",
    ),
    label: (match) => `JdS ${EN_ABILITIES[match[1].toLowerCase()]} ${match[2]}`,
    tail: (match) => match[3].trim(),
  },
  {
    // "Constitution saving throw with a DC of 5"
    regex: new RegExp(
      `(${EN_ABILITY_PATTERN})\\s+saving\\s+throw\\s+with\\s+a\\s+DC\\s+of\\s+(\\d+)`,
      "gi",
    ),
    label: (match) => `JdS ${EN_ABILITIES[match[1].toLowerCase()]} ${match[2]}`,
  },
];

const parseSaves = (text: string): HitPart[] => {
  const matches: { start: number; end: number; label: string; tail?: string }[] = [];
  for (const { regex, label, tail } of SAVE_PATTERNS) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        label: label(match),
        tail: tail?.(match),
      });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  const parts: HitPart[] = [];
  let cursor = 0;
  for (const save of matches) {
    if (save.start < cursor) continue; // two patterns matched the same phrase
    parts.push({ kind: "text", value: text.slice(cursor, save.start) });
    parts.push({ kind: "save", value: save.label });
    if (save.tail) parts.push({ kind: "text", value: save.tail });
    cursor = save.end;
  }
  parts.push({ kind: "text", value: text.slice(cursor) });
  return parts;
};

const DICE = /\d+d\d+/;

// A parenthetical is a damage roll only when, once nested parens and damage-type words
// are stripped, nothing but dice arithmetic remains ("4d6 (+2d4) + 4", "1d8 tranchant +
// 1d6 poison + 4"). Prose that merely mentions dice ("(+2 toucher, +1d6 dégats)") stays text.
const isRollContent = (content: string) => {
  if (!DICE.test(content)) return false;
  const stripped = content
    .replace(/\([^)]*\)/g, " ")
    .replace(new RegExp(typeAlternation, "gi"), " ");
  return /^[\d\sd+.]*$/i.test(stripped);
};

const findBalancedClose = (text: string, open: number) => {
  let depth = 0;
  for (let index = open; index < text.length; index++) {
    if (text[index] === "(") depth++;
    else if (text[index] === ")" && --depth === 0) return index;
  }
  return -1;
};

// Split a roll on its top-level "+" signs, leaving nested parens ("4d6 (+2d4)") intact.
const splitTopLevel = (content: string): string[] => {
  const segments: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of content) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    if (char === "+" && depth === 0) {
      segments.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  segments.push(current);
  return segments.map((segment) => segment.trim()).filter(Boolean);
};

// "(1d8 tranchant + 1d6 poison + 4)" → one pill per typed component; the flat modifier
// belongs to the whole roll so it joins the first component. Null when the roll carries
// no internal type (single-pill case, typed by the trailing phrase if any).
const buildComponentPills = (content: string): Extract<HitPart, { kind: "damage" }>[] | null => {
  const segments = splitTopLevel(content);
  if (!segments.some((segment) => TYPE_FINDER.test(segment))) return null;

  const flats: string[] = [];
  const pills: Extract<HitPart, { kind: "damage" }>[] = [];
  for (const segment of segments) {
    if (/^\d+$/.test(segment)) {
      flats.push(segment);
      continue;
    }
    const match = TYPE_FINDER.exec(segment);
    const value = match
      ? `${segment.slice(0, match.index)}${segment.slice(match.index + match[0].length)}`
          .replace(/\s+/g, " ")
          .trim()
      : segment;
    pills.push({ kind: "damage", value, damageType: match ? matchedDamageType(match) : undefined });
  }
  if (flats.length > 0 && pills.length > 0) {
    pills[0].value = `${pills[0].value} + ${flats.join(" + ")}`;
  }
  return pills;
};

// Next damage roll at or after `from`: either a parenthesized dice expression (with an
// optional leading average, e.g. "7 (2d4 + 2)") or bare dice in prose ("ou 2d4 poison").
const findNextRoll = (text: string, from: number) => {
  let paren: { start: number; end: number; value: string } | null = null;
  let searchFrom = from;
  while (paren === null) {
    const open = text.indexOf("(", searchFrom);
    if (open === -1) break;
    const close = findBalancedClose(text, open);
    if (close === -1) break;
    const content = text.slice(open + 1, close);
    if (isRollContent(content)) {
      const average = /\d+\s*$/.exec(text.slice(from, open));
      paren = { start: average ? from + average.index : open, end: close + 1, value: content };
    } else {
      searchFrom = close + 1; // "(DD 14)" and friends stay literal text
    }
  }

  const bareRegex = /\d+d\d+(?:\s*\+\s*\d+)?/g;
  bareRegex.lastIndex = from;
  const bare = bareRegex.exec(text);
  if (bare && (!paren || bare.index < paren.start)) {
    return { paren: false, start: bare.index, end: bare.index + bare[0].length, value: bare[0] };
  }
  return paren ? { paren: true, ...paren } : null;
};

const parseDamage = (text: string): HitPart[] => {
  const parts: HitPart[] = [];
  let cursor = 0;

  let roll: ReturnType<typeof findNextRoll>;
  while ((roll = findNextRoll(text, cursor)) !== null) {
    parts.push({ kind: "text", value: text.slice(cursor, roll.start) });
    cursor = roll.end;

    const componentPills = roll.paren ? buildComponentPills(roll.value) : null;
    if (componentPills) {
      parts.push(...componentPills);
    } else {
      const trailing = TRAILING_TYPE.exec(text.slice(cursor));
      if (trailing) cursor += trailing[0].length;
      parts.push({
        kind: "damage",
        value: roll.value.trim(),
        damageType: trailing ? matchedDamageType(trailing) : undefined,
      });
    }
  }
  parts.push({ kind: "text", value: text.slice(cursor) });
  return parts;
};

// A save tied to the damage it triggers ("JdS CON 12 ou 2d4 poison", "DC 12 Constitution
// saving throw, taking 21 (6d6) poison damage") takes that damage's type so the pair reads
// as one effect. The link only holds within the same clause: a short connector ("ou",
// "taking") before a damage pill, or — in plain description prose — dice right after the
// save. A sentence break cuts the link, so unrelated damage further on stays unlinked.
const SAVE_DAMAGE_MAX_GAP = 30;

const isClauseConnector = (value: string) =>
  value.length <= SAVE_DAMAGE_MAX_GAP && !value.includes(".");

const leadingDamageType = (text: string): DamageTypeKey | undefined => {
  const roll = findNextRoll(text, 0);
  if (!roll || !isClauseConnector(text.slice(0, roll.start))) return undefined;
  const componentPills = roll.paren ? buildComponentPills(roll.value) : null;
  if (componentPills) return componentPills[0]?.damageType;
  const trailing = TRAILING_TYPE.exec(text.slice(roll.end));
  return trailing ? matchedDamageType(trailing) : undefined;
};

const associateSavesToDamage = (parts: HitPart[]): HitPart[] =>
  parts.map((part, index) => {
    if (part.kind !== "save") return part;
    const next = parts[index + 1];
    if (next?.kind === "damage") return { ...part, damageType: next.damageType };
    if (next?.kind !== "text") return part;
    if (isClauseConnector(next.value)) {
      const afterConnector = parts[index + 2];
      if (afterConnector?.kind === "damage") {
        return { ...part, damageType: afterConnector.damageType };
      }
    }
    return { ...part, damageType: leadingDamageType(next.value) };
  });

// Trim text fragments, drop the orphaned punctuation a pill leaves behind
// ("piercing damage." → pill + ".") and remove empties.
const cleanupParts = (parts: HitPart[]): HitPart[] => {
  const cleaned: HitPart[] = [];
  for (const part of parts) {
    if (part.kind !== "text") {
      cleaned.push(part);
      continue;
    }
    const previous = cleaned[cleaned.length - 1];
    const value = (
      previous && previous.kind !== "text" ? part.value.replace(/^[\s.,;]+/, "") : part.value
    ).trim();
    if (value) cleaned.push({ kind: "text", value });
  }
  return cleaned;
};

// Full pipeline, used for hit strings and description prose alike: saves first, then
// damage rolls inside the remaining text, cleanup, then save→damage color association.
const parseActionText = (text: string): HitPart[] =>
  associateSavesToDamage(
    cleanupParts(
      parseSaves(text).flatMap((part) => (part.kind === "text" ? parseDamage(part.value) : [part])),
    ),
  );

// Parts are rendered in normal inline flow (separated by plain spaces) so pills wrap
// with the prose instead of stacking like flex items.
const renderParts = (parts: HitPart[]) =>
  parts.flatMap((part, index) =>
    index > 0 ? [" ", renderPart(part, index)] : [renderPart(part, index)],
  );

const renderPart = (part: HitPart, index: number) => {
  if (part.kind === "save") {
    const damageType = part.damageType ? DAMAGE_TYPES[part.damageType] : undefined;
    const style = damageType ? getDamageTypeIconAndColor(damageType.type) : undefined;
    return (
      <TooltipComponent
        key={index}
        delayDuration={TOOLTIP_DELAY}
        definition={
          damageType ? `Jet de sauvegarde (dégâts ${damageType.label})` : "Jet de sauvegarde"
        }
      >
        <Pill
          className={cn("whitespace-nowrap", !style && "text-emerald-400")}
          style={style && { color: style.color }}
        >
          <Shield className="size-3.5 shrink-0" />
          {part.value}
        </Pill>
      </TooltipComponent>
    );
  }
  if (part.kind === "damage") {
    const damageType = part.damageType ? DAMAGE_TYPES[part.damageType] : undefined;
    const style = damageType ? getDamageTypeIconAndColor(damageType.type) : undefined;
    const Icon = style?.icon ?? Dices;
    return (
      <TooltipComponent
        key={index}
        delayDuration={TOOLTIP_DELAY}
        definition={damageType ? `Dégâts ${damageType.label}` : "Dégâts"}
      >
        <Pill
          className={cn("whitespace-nowrap", !style && "text-red-500")}
          style={style && { color: style.color }}
        >
          <Icon className="size-3.5 shrink-0" />
          {part.value}
        </Pill>
      </TooltipComponent>
    );
  }
  return (
    <span key={index} className="text-muted-foreground">
      {part.value}
    </span>
  );
};

// Compact display for dual melee/ranged reach: "1.5 m ou distance 6/18 m" reads
// "1 ou 4/12 cases" — the "distance"/"portée" wording goes, and only the last
// converted value keeps its "cases" unit.
const formatReach = (reach: string) =>
  replaceMetersWithSquares(reach)
    .replace(/\s+ou\s+(?:distance|portée)\s+/i, " ou ")
    .replace(/ cases(?=.* cases)/g, "");

// Escape hatch from the formatted pills: a dedicated icon whose tooltip dumps every raw
// action field exactly as written in the data file.
const RawActionTooltip = ({ action }: { action: Action }) => {
  const fields = (["type", "modifier", "reach", "hit", "description"] as const).filter(
    (field) => action[field],
  );
  return (
    <TooltipComponent
      delayDuration={TOOLTIP_DELAY}
      contentClassName="max-w-md"
      definition={
        <div className="flex flex-col gap-1">
          {fields.map((field) => (
            <div key={field}>
              <span className="font-medium">{field} : </span>
              {action[field]}
            </div>
          ))}
        </div>
      }
    >
      <Info className="inline size-4 shrink-0 cursor-help align-middle text-muted-foreground/50" />
    </TooltipComponent>
  );
};

export const ActionBlock = ({ action }: { action: Action }) => {
  if (action.description) {
    const descriptionParts = parseActionText(action.description);
    return (
      <NamedEntry name={action.name}>
        {descriptionParts.some((part) => part.kind !== "text") ? (
          <span>
            {renderParts(descriptionParts)} <RawActionTooltip action={action} />
          </span>
        ) : (
          action.description
        )}
      </NamedEntry>
    );
  }

  const isUnCommonReach = action.reach && getDistanceInSquares(action.reach) > 1;
  const hitParts = action.hit ? parseActionText(action.hit) : [];

  // type is free-form and mixes FR/EN ("Melee", "Ranged", "Melee or Ranged", "Distance").
  const typeLower = action.type?.toLowerCase() ?? "";
  const isMelee = /melee|corps/.test(typeLower);
  const isRanged = /ranged|distance/.test(typeLower);
  // A pure melee attack at 1 square is the default 5 ft reach — redundant, so hide it.
  const isDefaultMeleeReach = isMelee && !isRanged && !isUnCommonReach;

  return (
    <NamedEntry name={action.name}>
      <span className="mr-1">
        {action.type && !isMelee && !isRanged && (
          <span className="italic text-muted-foreground">{action.type}</span>
        )}{" "}
        {action.modifier && (
          <Pill className="whitespace-nowrap text-indigo-300">{action.modifier}</Pill>
        )}{" "}
        {action.reach && !isDefaultMeleeReach && (
          // The attack type lives on the pill itself: Swords for an abnormal melee
          // reach (> 1 case, the default is hidden), Target for ranged. Melee + ranged
          // interleaves each icon with its own value: "⚔ 1 ◎ 4/12 cases".
          <TooltipComponent delayDuration={TOOLTIP_DELAY} definition={action.type ?? "Portée"}>
            <Pill className="whitespace-nowrap text-amber-400">
              {(() => {
                const reach = formatReach(action.reach);
                const dualReach = isMelee && isRanged ? reach.split(/\s+ou\s+/) : [];
                if (dualReach.length === 2) {
                  return (
                    <>
                      <Swords className="size-3.5 shrink-0" />
                      {dualReach[0]}
                      <Target className="size-3.5 shrink-0" />
                      {dualReach[1]}
                    </>
                  );
                }
                return (
                  <>
                    {isMelee && <Swords className="size-3.5 shrink-0" />}
                    {isRanged && <Target className="size-3.5 shrink-0" />}
                    {!isMelee && !isRanged && <Ruler className="size-3.5 shrink-0" />}
                    {reach}
                  </>
                );
              })()}
            </Pill>
          </TooltipComponent>
        )}{" "}
        {renderParts(hitParts)} <RawActionTooltip action={action} />
      </span>
    </NamedEntry>
  );
};
