import { z } from "zod";

export enum SpellSource {
  AIDE_DD_2024 = "Aide DD 2024",
  LOCAL = "fichier local",
}

export const externalRessourceSchema = z
  .object({
    index: z.string(),
    name: z.string(),
    url: z.string(),
    updated_at: z.string(),
  })
  .partial();

export const apiSpellSchema = z
  .object({
    index: z.string(),
    name: z.string(),
    url: z.string(),
    updated_at: z.string(),
    range: z.string(),
    components: z.array(z.string()),
    ritual: z.boolean(),
    duration: z.string(),
    concentration: z.boolean(),
    casting_time: z.string(),
    level: z.number(),
    dc: z
      .object({
        dc_success: z.string(),
        dc_type: externalRessourceSchema,
      })
      .partial(),
    attack_type: z.string().optional(),
    desc: z.array(z.string()),
    material: z.string().optional(),
    higher_level: z.array(z.string()),
    damage: z
      .object({
        damage_type: externalRessourceSchema,
        damage_at_slot_level: z.record(z.coerce.number(), z.string()),
        damage_at_character_level: z.record(z.coerce.number(), z.string()),
      })
      .partial(),
    heal_at_slot_level: z.record(z.coerce.number(), z.string()),

    area_of_effect: z
      .object({
        type: z.string(),
        size: z.number(),
      })
      .partial(),
    school: externalRessourceSchema,
    classes: z.array(externalRessourceSchema),
    subclasses: z.array(externalRessourceSchema),
    source: z.nativeEnum(SpellSource),
  })
  .partial()
  .strict();

export type APISpell = z.infer<typeof apiSpellSchema>;
export type SummaryAPISpell = {
  id: string;
  name: string;
  level: number;
  isRitual: boolean;
};

export const subClassSchema = z
  .object({
    index: z.string(),
    name: z.string(),
    class: externalRessourceSchema,
    subclass_flavor: z.string(),
  })
  .partial();
export type SubClass = z.infer<typeof subClassSchema>;

export enum QuestStatus {
  NOT_GIVEN = "Pas donnée",
  NO_INTEREST = "Pas intéressé",
  INTERESTED = "Intéressé",
  IN_PROGRESS = "En cours",
  DONE = "Terminé",
}

export const questSchema = z.object({
  id: z.number(),
  name: z.string(),
  giver: z.string(),
  location: z.string(),
  task: z.string(),
  providedItem: z.string().optional(),
  reward: z.string().optional(),
  status: z.nativeEnum(QuestStatus),
  outcome: z.string().optional(),
});
export type Quest = z.infer<typeof questSchema>;

export const rulesSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
});

const actionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  modifier: z.string().optional(),
  reach: z.string().optional(),
  hit: z.string().optional(),
});

export const creatureSchema = z.object({
  name: z.string(),
  id: z.string(),
  type: z.string(),
  size: z.string(),
  challengeRating: z.number(),
  alignment: z.string().optional(),
  armorClass: z.union([z.number(), z.string()]),
  hitPoints: z.string(),
  speed: z
    .object({
      walk: z.string(),
      swim: z.string().optional(),
      fly: z.string().optional(),
      climb: z.string().optional(),
    })
    .optional(),
  abilities: z
    .object({
      strength: z.number(),
      dexterity: z.number(),
      constitution: z.number(),
      intelligence: z.number(),
      wisdom: z.number(),
      charisma: z.number(),
    })
    .optional(),
  savingThrows: z
    .record(
      z.enum(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]),
      z.string().optional(),
    )
    .optional(),
  skills: z
    .record(
      z.enum([
        "acrobatics",
        "animalHandling",
        "arcana",
        "athletics",
        "deception",
        "history",
        "insight",
        "intimidation",
        "investigation",
        "medicine",
        "nature",
        "perception",
        "performance",
        "persuasion",
        "religion",
        "sleightOfHand",
        "stealth",
        "survival",
      ]),
      z.string().optional(),
    )
    .optional(),
  immunities: z.array(z.string()).optional(),
  vulnerabilities: z.array(z.string()).optional(),
  resistances: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  senses: z
    .object({
      blindSight: z.string().optional(),
      darkvision: z.string().optional(),
      passivePerception: z.number().optional(),
      trueSight: z.string().optional(),
      tremorsense: z.string().optional(),
    })
    .optional(),
  traits: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
  actions: z.array(actionSchema),
  reactions: z.array(actionSchema).optional(),
  legendaryActions: z.array(actionSchema).optional(),
  legendaryActionsSlots: z.string().optional(),
  lairActions: z.array(actionSchema).optional(),
  bonusActions: z.array(actionSchema).optional(),
  spellStats: z
    .object({
      attackMod: z.number(),
      spellDC: z.number(),
      slots: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  spells: z.array(z.object({ id: z.string(), summary: z.string().optional() })).optional(),
  colors: z.array(z.string()).optional(),
  behavior: z.string().optional(),
});

export type Creature = z.infer<typeof creatureSchema>;
