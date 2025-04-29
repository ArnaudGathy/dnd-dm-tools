"use client";

import { Button } from "@/components/ui/button";
import { Check, Trash } from "lucide-react";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InventoryFormSchema,
  inventoryItemFormSchema,
} from "@/app/characters/add/utils";
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
    const response = await addInventoryItem(data, character.id, item?.id);
    if (!!response) {
      setError(response);
    }
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

        <Button type="submit" className="w-full">
          <Check /> {isEditMode ? "Modifier" : "Ajouter"}
        </Button>
      </form>

      {isEditMode && (
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => deleteInventoryItem(item.id)}
        >
          <Trash /> Supprimer
        </Button>
      )}
    </Form>
  );
}
