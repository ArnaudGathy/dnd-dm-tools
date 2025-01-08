import { z } from "zod";

export const CombatSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("save"),
    save: z.enum([
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "wisdom",
      "charisma",
    ]),
    saveSuccess: z.string(),
    damage: z.record(z.coerce.number(), z.string()).optional(),
    effects: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
    recovery: z.string().optional(),
    spellLevelScale: z.string().optional(),
  }),
  z.object({
    type: z.literal("attack"),
    damage: z.record(z.coerce.number(), z.string()),
    effects: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
    recovery: z.string().optional(),
    spellLevelScale: z.string().optional(),
  }),
  z.object({
    type: z.literal("status"),
    effects: z.array(z.string()),
    restrictions: z.array(z.string()).optional(),
    recovery: z.string().optional(),
    spellLevelScale: z.string().optional(),
  }),
]);

const spellSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    level: z.number(),
    castingTime: z.string(),
    range: z.string(),
    components: z.string(),
    duration: z.string(),
    description: z.string(),
    combat: CombatSchema.optional(),
  })
  .strict();

export const spellsSchema = z.array(spellSchema);

export type Spell = z.infer<typeof spellSchema>;
