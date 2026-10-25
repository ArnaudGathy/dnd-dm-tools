"use server";
import "server-only";

import prisma from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Every mutation is scoped by { id, characterId } so a note can only be touched
// through the sheet of the character that owns it.

const titleSchema = z.string().trim().min(1, "Le titre est requis.").max(255);

export const createCharacterNote = async (
  characterId: number,
  title = "Nouvelle note",
): Promise<{ error?: string; noteId?: number }> => {
  const validation = titleSchema.safeParse(title);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    // New notes go to the end of the user's custom order.
    const { _max } = await prisma.characterNote.aggregate({
      where: { characterId },
      _max: { position: true },
    });
    const note = await prisma.characterNote.create({
      data: { characterId, title: validation.data, position: (_max.position ?? -1) + 1 },
    });
    revalidatePath(`/characters/${characterId}`);
    return { noteId: note.id };
  } catch (error) {
    console.error("Failed to create character note:", error);
    return { error: "La création de la note a échoué." };
  }
};

export const updateCharacterNoteContent = async (
  characterId: number,
  noteId: number,
  content: string,
): Promise<{ error?: string }> => {
  const validation = z.string().safeParse(content);
  if (!validation.success) {
    console.error(validation.error);
    return { error: "Contenu invalide." };
  }

  const { count } = await prisma.characterNote.updateMany({
    where: { id: noteId, characterId },
    data: { content: validation.data },
  });
  if (count === 0) {
    return { error: "Note introuvable." };
  }
  revalidatePath(`/characters/${characterId}`);
  return {};
};

export const renameCharacterNote = async (
  characterId: number,
  noteId: number,
  title: string,
): Promise<{ error?: string }> => {
  const validation = titleSchema.safeParse(title);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { count } = await prisma.characterNote.updateMany({
    where: { id: noteId, characterId },
    data: { title: validation.data },
  });
  if (count === 0) {
    return { error: "Note introuvable." };
  }
  revalidatePath(`/characters/${characterId}`);
  return {};
};

export const deleteCharacterNote = async (
  characterId: number,
  noteId: number,
): Promise<{ error?: string }> => {
  const { count } = await prisma.characterNote.deleteMany({
    where: { id: noteId, characterId },
  });
  if (count === 0) {
    return { error: "Note introuvable." };
  }
  revalidatePath(`/characters/${characterId}`);
  return {};
};

/** Persists the drag-and-drop order: `noteIds[i]` gets position `i`. */
export const reorderCharacterNotes = async (
  characterId: number,
  noteIds: number[],
): Promise<{ error?: string }> => {
  const validation = z.array(z.number().int()).safeParse(noteIds);
  if (!validation.success) {
    console.error(validation.error);
    return { error: "Ordre invalide." };
  }

  try {
    await prisma.$transaction(
      validation.data.map((id, position) =>
        prisma.characterNote.updateMany({ where: { id, characterId }, data: { position } }),
      ),
    );
  } catch (error) {
    console.error("Failed to reorder character notes:", error);
    return { error: "Le réordonnancement des notes a échoué." };
  }
  revalidatePath(`/characters/${characterId}`);
  return {};
};
