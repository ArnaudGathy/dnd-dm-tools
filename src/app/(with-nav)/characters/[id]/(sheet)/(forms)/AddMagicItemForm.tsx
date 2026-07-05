"use client";

import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, Sparkle, Sparkles, Trash } from "lucide-react";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicItemFormSchema, MagicItemFormSchema } from "@/app/(with-nav)/characters/add/utils";
import { Form, FormField } from "@/components/ui/form";
import { addMagicItem, deleteMagicItem } from "@/lib/actions/MagicItems";
import TransferMagicItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/TransferMagicItem";
import { useState } from "react";
import { MagicItem, MagicItemRarity } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { MAGIC_ITEM_RARITY_COLOR_MAP, MAGIC_ITEM_RARITY_MAP } from "@/constants/maps";
import { mapValues } from "remeda";

/**
 * Popover body styled like a miniature SectionPanel: sky header (the magic
 * domain), attunement as a switch row instead of a bare checkbox, and a
 * footer where delete is a quiet icon next to the primary action.
 */
export default function AddMagicItemForm({
  characterId,
  campaignId,
  item,
  closeAction,
  title,
}: {
  characterId: number | null;
  campaignId?: number;
  item?: MagicItem;
  closeAction: () => void;
  title: string;
}) {
  const isEditMode = !!item;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<MagicItemFormSchema>({
    resolver: zodResolver(magicItemFormSchema),
    defaultValues: item
      ? {
          ...item,
          charges: item.charges ?? "",
        }
      : {
          name: "",
          charges: "",
          description: "",

          isAttuned: false,
          rarity: MagicItemRarity.COMMON,
        },
  });

  const onSubmit = async (data: MagicItemFormSchema) => {
    setIsLoading(true);
    const response = await addMagicItem(data, characterId, item?.id);
    if (!!response) {
      setError(response);
    }
    setIsLoading(false);
    closeAction();
  };

  const handleDelete = async (itemId: number) => {
    setIsLoading(true);
    await deleteMagicItem(itemId);
    setIsLoading(false);
    closeAction();
  };

  return (
    <div className="flex w-[min(85vw,380px)] flex-col">
      <header className="flex items-center gap-2 border-l-4 border-l-sky-500 bg-sky-500/[0.07] px-3 py-2">
        <Sparkles className="size-3.5 shrink-0 stroke-[2.5px] text-sky-400" />
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
          {title}
        </span>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 p-3 [&_input]:h-9 [&_label]:text-tiny [&_label]:font-semibold [&_label]:uppercase [&_label]:tracking-wide [&_label]:text-muted-foreground"
        >
          {error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <FormFieldInput formInstance={form} formFieldName="name" label="Nom" required />

          <div className="grid grid-cols-[1fr_5rem] gap-2">
            <FormFieldSelect
              formInstance={form}
              formFieldName="rarity"
              label="Rareté"
              items={mapValues(MAGIC_ITEM_RARITY_MAP, (label, key) => (
                <span className={MAGIC_ITEM_RARITY_COLOR_MAP[key]}>{label}</span>
              ))}
              required
            />
            <FormFieldInput formInstance={form} formFieldName="charges" label="Charges" />
          </div>

          <FormField
            control={form.control}
            name="isAttuned"
            render={({ field }) => {
              return (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2.5">
                  <Label
                    htmlFor="isAttuned"
                    className="flex cursor-pointer items-center gap-1.5 !text-sm !normal-case !tracking-normal !text-foreground"
                  >
                    <Sparkle className="size-3.5 fill-current text-sky-400" />
                    Harmonisé avec le personnage
                  </Label>
                  <Switch
                    id="isAttuned"
                    className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-white/15"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              );
            }}
          />

          <FormFieldInput
            formInstance={form}
            formFieldName="description"
            label="Description"
            textarea
          />

          <div className="mt-1 flex items-center gap-2 border-t border-border pt-3">
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Supprimer l'objet magique"
                className="h-10 w-10 shrink-0 text-red-400 hover:text-red-400"
                onClick={() => handleDelete(item.id)}
                disabled={isLoading}
              >
                <Trash />
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="size-6 animate-spin" />
              ) : (
                <>
                  <Check /> {isEditMode ? "Modifier" : "Ajouter"}
                </>
              )}
            </Button>
          </div>

          {isEditMode && characterId !== null && campaignId !== undefined && (
            <TransferMagicItem
              itemId={item.id}
              campaignId={campaignId}
              currentCharacterId={characterId}
              closeAction={closeAction}
            />
          )}
        </form>
      </Form>
    </div>
  );
}
