"use client";

import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, Trash } from "lucide-react";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InventoryFormSchema,
  inventoryItemFormSchema,
} from "@/app/(with-nav)/characters/add/utils";
import { Form } from "@/components/ui/form";
import {
  addInventoryItem,
  deleteInventoryItem,
} from "@/lib/actions/InventoryItems";
import { CharacterById } from "@/lib/utils";
import { useState } from "react";
import { InventoryItem } from "@prisma/client";

export default function AddInventoryItemForm({
  character,
  item,
  closeAction,
  title,
}: {
  character: CharacterById;
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
    const response = await addInventoryItem(data, character.id, item?.id);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        {error && <p className="max-w-[300px] text-red-500">{error}</p>}
        <div className="grid w-[350px] grid-cols-[1fr_50px_60px] gap-2 md:w-[400px]">
          <FormFieldInput
            formInstance={form}
            formFieldName="name"
            label="Nom"
            required
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="quantity"
            label="Qté"
          />
          <FormFieldInput
            formInstance={form}
            formFieldName="value"
            label="Valeur"
          />
        </div>
        <FormFieldInput
          formInstance={form}
          formFieldName="description"
          label="Description"
          textarea
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            <>
              <Check /> {isEditMode ? "Modifier" : "Ajouter"}
            </>
          )}
        </Button>
      </form>

      {isEditMode && (
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => handleDelete(item.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            <>
              <Trash /> Supprimer
            </>
          )}
        </Button>
      )}
    </Form>
  );
}
