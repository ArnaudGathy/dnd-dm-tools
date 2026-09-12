"use client";

import { Braces, LoaderCircle, Pencil } from "lucide-react";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateCreatureJson } from "@/lib/actions/creatures";
import { Creature } from "@/types/types";
import { creatureSchema } from "@/types/schemas";
import { isCtrlChord } from "@/utils/keyboard";

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);
const draftStorageKey = (creatureId: string) => `creature-json-draft:${creatureId}`;

const readDraft = (creatureId: string) => {
  try {
    return localStorage.getItem(draftStorageKey(creatureId));
  } catch {
    return null;
  }
};
const writeDraft = (creatureId: string, json: string | null) => {
  try {
    if (json === null) {
      localStorage.removeItem(draftStorageKey(creatureId));
    } else {
      localStorage.setItem(draftStorageKey(creatureId), json);
    }
  } catch {
    // Storage unavailable (private mode, quota…) — the draft simply isn't persisted.
  }
};

/**
 * Parses + validates the editor content against the creature schema without touching
 * the server, so a malformed draft is reported inline and never sent to the DB.
 */
const validateJson = (json: string, creatureId: string): { error?: string } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { error: `JSON invalide : ${e instanceof Error ? e.message : "impossible à parser"}` };
  }

  const validation = creatureSchema.safeParse(parsed);
  if (!validation.success) {
    const issues = validation.error.issues
      .slice(0, 8)
      .map((issue) => `• ${issue.path.join(".") || "(racine)"} : ${issue.message}`)
      .join("\n");
    return { error: `Le JSON ne correspond pas au schéma d'une créature :\n${issues}` };
  }

  if (validation.data.id !== creatureId) {
    return { error: `L'id doit rester "${creatureId}".` };
  }

  return {};
};

/**
 * Admin-only JSON editor for creatures stored in the DB (CachedCreature). The raw JSON
 * is validated against the creature schema server-side before being written back.
 */
export default function EditCreatureJsonButton({ creature }: { creature: Creature }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [json, setJsonState] = useState(() => formatJson(creature));
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Every keystroke is mirrored to localStorage so a crash, reload or accidental close
  // never loses an in-progress edit; the draft is dropped once saved or discarded.
  const setJson = (next: string) => {
    setJsonState(next);
    writeDraft(creature.id, next);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const draft = readDraft(creature.id);
      setJsonState(draft ?? formatJson(creature));
      setHasRestoredDraft(draft !== null);
      setError(null);
    }
    setIsOpen(open);
  };

  const handleDiscardDraft = () => {
    writeDraft(creature.id, null);
    setJsonState(formatJson(creature));
    setHasRestoredDraft(false);
    setError(null);
  };

  const handleFormat = () => {
    try {
      setJson(formatJson(JSON.parse(json)));
      setError(null);
    } catch {
      setError("JSON invalide : impossible de formater le contenu.");
    }
  };

  const handleValidate = () => {
    const { error: validationError } = validateJson(json, creature.id);
    setError(validationError ?? null);
    return !validationError;
  };

  const handleSave = () => {
    if (!handleValidate()) {
      return;
    }
    startTransition(async () => {
      const result = await updateCreatureJson({
        creatureId: creature.id,
        json,
        pathToRevalidate: pathname,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      writeDraft(creature.id, null);
      setHasRestoredDraft(false);
      toast.success(result.message);
      setIsOpen(false);
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCtrlChord(e.nativeEvent, "s")) {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
      return;
    }
    // Keep Tab inside the editor as a two-space indent instead of moving focus.
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;
      setJson(`${json.slice(0, selectionStart)}  ${json.slice(selectionEnd)}`);
      requestAnimationFrame(() => {
        textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Modifier le JSON de la créature"
          className="ml-2 flex items-center text-xs text-muted-foreground underline"
        >
          <Pencil className="size-3" />
        </button>
      </DialogTrigger>

      <DialogContent className="flex h-[85vh] max-w-4xl flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Braces className="size-5 text-sky-400" />
            {creature.name}
          </DialogTitle>
          <DialogDescription>
            Modifie le JSON stocké en base pour cette créature · Ctrl + S pour sauvegarder ·
            brouillon conservé automatiquement
          </DialogDescription>
        </DialogHeader>

        {hasRestoredDraft && (
          <p className="flex flex-wrap items-center gap-x-2 rounded-md border border-amber-400/50 bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
            Brouillon non sauvegardé restauré.
            <button type="button" onClick={handleDiscardDraft} className="underline">
              Repartir du JSON en base
            </button>
          </p>
        )}

        <Textarea
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none whitespace-pre font-mono text-xs leading-relaxed md:text-xs"
        />

        {error && (
          <p className="whitespace-pre-wrap rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleFormat} disabled={isPending}>
            Formater
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (handleValidate()) {
                toast.success("JSON valide.");
              }
            }}
            disabled={isPending}
          >
            Valider
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending && <LoaderCircle className="size-4 animate-spin" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
