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
