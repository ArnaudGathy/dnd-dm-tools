import { ReactNode } from "react";
import { Dices, Shield } from "lucide-react";
import { WeaponDamageType } from "@prisma/client";
import { getDamageTypeIconAndColor } from "@/utils/stats/weapons";
import { Pill } from "@/components/statblocks/Pill";
import { TooltipComponent } from "@/components/ui/tooltip";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";

export const TOOLTIP_DELAY = 200;

// Free-form DM/spell prose mixing FR/EN gets tokenized into ordered parts: damage rolls
// become pills colored/iconed by damage type, saving throws become "JdS" pills, everything
// else stays inline text. Shapes covered (all taken from the data):
//   "7 (2d4 + 2) piercing damage."           type after the roll (EN, "slashing –damage")
//   "5 (1d4 + 3) dégâts perforants."         type after the roll (FR: "dégâts de force"…)
//   "8 (1d8 tranchant + 1d6 poison + 4)"     types inside the roll → one pill per component
//   "18 (4d6 (+2d4) + 4) dégâts perçants"    nested parentheses
//   "Cible 6d6 poison au début de son tour"  bare dice outside parentheses
//   "JdS CON 12 ou 2d4 poison"               FR statblock saves, with optional "DD"/"DEX"
//   "DC 12 Constitution saving throw"        EN saves, normalized to the FR "JdS" form
//   "un jet de sauvegarde de Dextérité"      FR spell saves — no DC (it depends on the caster)
// Non-roll parentheticals like "(DD 14)" or "(Recharge 5–6)" stay literal text.

// Every spelling a damage type takes across the data, EN and FR, full words and DM
// shorthand ("cont.", "psi", "nécro"). Patterns carry their own word boundaries.
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
  radiant: {
    pattern: "\\b(?:radiant|radiants?)\\b",
    label: "radiant",
    type: WeaponDamageType.RADIANT,
  },
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

// FR spell saves: "un jet de sauvegarde de Dextérité" — no DC, it's derived from the caster.
const FR_ABILITY_PATTERN = "Force|Dext[ée]rit[ée]|Constitution|Intelligence|Sagesse|Charisme";
const stripAccents = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "");
const FR_ABILITIES: Record<string, string> = {
  force: "FOR",
  dexterite: "DEX",
  constitution: "CON",
  intelligence: "INT",
  sagesse: "SAG",
  charisme: "CHA",
};

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
    // "un jet de sauvegarde de Dextérité" (FR spell prose, no DC)
    regex: new RegExp(`jets?\\s+de\\s+sauvegarde\\s+de\\s+(${FR_ABILITY_PATTERN})`, "gi"),
    label: (match) => `JdS ${FR_ABILITIES[stripAccents(match[1].toLowerCase())]}`,
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
// `averagePrefix` controls whether a number before "(" is treated as that average and
// swallowed — true for statblocks ("7 (2d4)"), false for spell prose where a number before
// a roll is a spell level, not an average ("aux niveaux 5 (2d8)").
const findNextRoll = (text: string, from: number, averagePrefix: boolean) => {
  let paren: { start: number; end: number; value: string } | null = null;
  let searchFrom = from;
  while (paren === null) {
    const open = text.indexOf("(", searchFrom);
    if (open === -1) break;
    const close = findBalancedClose(text, open);
    if (close === -1) break;
    const content = text.slice(open + 1, close);
    if (isRollContent(content)) {
      const average = averagePrefix ? /\d+\s*$/.exec(text.slice(from, open)) : null;
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

const parseDamage = (text: string, averagePrefix: boolean): HitPart[] => {
  const parts: HitPart[] = [];
  let cursor = 0;

  let roll: ReturnType<typeof findNextRoll>;
  while ((roll = findNextRoll(text, cursor, averagePrefix)) !== null) {
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

// A save tied to the damage it triggers ("JdS CON 12 ou 2d4 poison", "jet de sauvegarde de
// Dextérité, subissant 8d6 dégâts de feu") takes that damage's type so the pair reads as one
// effect. The link only holds within the same clause: a short connector before a damage pill,
// or dice right after the save. A sentence break cuts the link.
const SAVE_DAMAGE_MAX_GAP = 30;

const isClauseConnector = (value: string) =>
  value.length <= SAVE_DAMAGE_MAX_GAP && !value.includes(".");

const leadingDamageType = (text: string, averagePrefix: boolean): DamageTypeKey | undefined => {
  const roll = findNextRoll(text, 0, averagePrefix);
  if (!roll || !isClauseConnector(text.slice(0, roll.start))) return undefined;
  const componentPills = roll.paren ? buildComponentPills(roll.value) : null;
  if (componentPills) return componentPills[0]?.damageType;
  const trailing = TRAILING_TYPE.exec(text.slice(roll.end));
  return trailing ? matchedDamageType(trailing) : undefined;
};

const associateSavesToDamage = (parts: HitPart[], averagePrefix: boolean): HitPart[] =>
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
    return { ...part, damageType: leadingDamageType(next.value, averagePrefix) };
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

// Full pipeline, used for hit strings and description/spell prose alike: saves first, then
// damage rolls inside the remaining text, cleanup, then save→damage color association.
export const parseActionText = (
  text: string,
  { averagePrefix = true }: { averagePrefix?: boolean } = {},
): HitPart[] =>
  associateSavesToDamage(
    cleanupParts(
      parseSaves(text).flatMap((part) =>
        part.kind === "text" ? parseDamage(part.value, averagePrefix) : [part],
      ),
    ),
    averagePrefix,
  );

// How a pill reveals its label. Tooltips (hover) suit the desktop statblock; popovers
// (tap/click) are needed wherever the page must work on touch, e.g. the spell page.
type Interaction = "tooltip" | "popover";

type RenderOptions = { textClassName?: string; interaction?: Interaction };

// Wrap a pill so its definition shows on hover (tooltip) or tap (popover).
const InteractivePill = ({
  interaction,
  definition,
  children,
}: {
  interaction: Interaction;
  definition: ReactNode;
  children: ReactNode;
}) =>
  interaction === "popover" ? (
    <PopoverComponent asChild noFocus definition={definition}>
      {children}
    </PopoverComponent>
  ) : (
    <TooltipComponent delayDuration={TOOLTIP_DELAY} definition={definition}>
      {children}
    </TooltipComponent>
  );

const renderPart = (
  part: HitPart,
  index: number,
  { textClassName = "text-muted-foreground", interaction = "tooltip" }: RenderOptions,
) => {
  if (part.kind === "text") {
    return (
      <span key={index} className={textClassName}>
        {part.value}
      </span>
    );
  }

  const damageType = part.damageType ? DAMAGE_TYPES[part.damageType] : undefined;
  const style = damageType ? getDamageTypeIconAndColor(damageType.type) : undefined;

  const isSave = part.kind === "save";
  const Icon = isSave ? Shield : (style?.icon ?? Dices);
  const definition = isSave
    ? damageType
      ? `Jet de sauvegarde (dégâts ${damageType.label})`
      : "Jet de sauvegarde"
    : damageType
      ? `Dégâts ${damageType.label}`
      : "Dégâts";
  const fallbackColor = isSave ? "text-emerald-400" : "text-red-500";

  return (
    <InteractivePill key={index} interaction={interaction} definition={definition}>
      <Pill
        className={cn(
          "whitespace-nowrap",
          interaction === "popover" && "cursor-pointer",
          !style && fallbackColor,
        )}
        style={style && { color: style.color }}
      >
        <Icon className="size-3.5 shrink-0" />
        {part.value}
      </Pill>
    </InteractivePill>
  );
};

// Parts are rendered in normal inline flow (separated by plain spaces) so pills wrap
// with the prose instead of stacking like flex items.
export const renderParts = (parts: HitPart[], options: RenderOptions = {}) =>
  parts.flatMap((part, index) =>
    index > 0 ? [" ", renderPart(part, index, options)] : [renderPart(part, index, options)],
  );

// Convenience wrapper for prose: parse + render inline, falling back to the raw string
// when nothing special was found (so plain paragraphs stay untouched).
export const RichText = ({
  text,
  averagePrefix = true,
  textClassName,
  interaction,
}: {
  text: string;
  averagePrefix?: boolean;
  textClassName?: string;
  interaction?: Interaction;
}) => {
  const parts = parseActionText(text, { averagePrefix });
  if (!parts.some((part) => part.kind !== "text")) {
    return <>{text}</>;
  }
  return <>{renderParts(parts, { textClassName, interaction })}</>;
};
