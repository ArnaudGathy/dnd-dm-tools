"use client";

import { Button } from "@/components/ui/button";
import { Backpack, Check, LoaderCircle, Trash } from "lucide-react";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InventoryFormSchema,
  inventoryItemFormSchema,
} from "@/app/(with-nav)/characters/add/utils";
import { Form } from "@/components/ui/form";
import { addInventoryItem, deleteInventoryItem } from "@/lib/actions/InventoryItems";
import { useState } from "react";
import { InventoryItem } from "@prisma/client";
import TransferInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/TransferInventoryItem";

/**
 * Popover body styled like a miniature SectionPanel: amber header (the
 * inventory domain), compact uppercase field labels, and a footer where
 * delete is a quiet icon and the primary action carries the weight.
 */
export default function AddInventoryItemForm({
  characterId,
  campaignId,
  item,
  closeAction,
  title,
}: {
  characterId: number | null;
  campaignId?: number;
  item?: InventoryItem;
  closeAction: () => void;
  title: string;
}) {
  const isEditMode = !!item;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: item ?? {
      name: "",
      quantity: "1",
      description: "",
    },
  });

  const onSubmit = async (data: InventoryFormSchema) => {
    setIsLoading(true);
    const response = await addInventoryItem(data, characterId, item?.id);
    if (!!response) {
      setError(response);
    }
    setIsLoading(false);
    closeAction();
  };

  const handleDelete = async (itemId: number) => {
    setIsLoading(true);
    await deleteInventoryItem(itemId);
    setIsLoading(false);
    closeAction();
  };

  return (
    <div className="flex w-[min(85vw,380px)] flex-col">
      <header className="flex items-center gap-2 border-l-4 border-l-amber-500 bg-amber-500/[0.07] px-3 py-2">
        <Backpack className="size-3.5 shrink-0 stroke-[2.5px] text-amber-400" />
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

          <div className="grid grid-cols-[1fr_3.5rem_5rem] gap-2">
            <FormFieldInput formInstance={form} formFieldName="name" label="Nom" required />
            <FormFieldInput formInstance={form} formFieldName="quantity" label="Qté" />
            <FormFieldInput formInstance={form} formFieldName="value" label="Valeur" />
          </div>

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
                aria-label="Supprimer l'objet"
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
            <TransferInventoryItem
              itemId={item.id}
              itemQuantity={item.quantity}
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
