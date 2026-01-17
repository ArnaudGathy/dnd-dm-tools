"use client";

import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, Trash } from "lucide-react";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import FormFieldSelect from "@/components/ui/inputs/FormFieldSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicItemFormSchema, MagicItemFormSchema } from "@/app/(with-nav)/characters/add/utils";
import { Form, FormField } from "@/components/ui/form";
import { addMagicItem, deleteMagicItem } from "@/lib/actions/MagicItems";
import { CharacterById } from "@/lib/utils";
import { useState } from "react";
import { MagicItem, MagicItemRarity } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { MAGIC_ITEM_RARITY_COLOR_MAP, MAGIC_ITEM_RARITY_MAP } from "@/constants/maps";
import { mapValues } from "remeda";

export default function AddMagicItemForm({
  character,
  item,
  closeAction,
  title,
}: {
  character: CharacterById;
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
          charges: String(item.charges),
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
    const response = await addMagicItem(data, character.id, item?.id);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {error && <p className="max-w-[300px] text-red-500">{error}</p>}

        <FormFieldInput formInstance={form} formFieldName="name" label="Nom" required />

        <div className="grid w-[350px] grid-cols-[1fr_1fr] gap-2 md:w-[400px]">
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isAttuned"
                  defaultChecked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isAttuned">Objet harmonisé avec le personnage</Label>
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
