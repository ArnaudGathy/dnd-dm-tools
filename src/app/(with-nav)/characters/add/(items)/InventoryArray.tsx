import { UseFormReturn, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import GearQuickAdd from "@/app/(with-nav)/characters/add/(items)/GearQuickAdd";
import { GEAR_PRESETS, GearPreset } from "@/app/(with-nav)/characters/add/(items)/gearPresets";
import { InventoryFormSchema } from "@/app/(with-nav)/characters/add/utils";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Inventory as a quick-add search plus one compact line per item. Preset
 * items land fully filled (name, valeur, description, bundle quantity) and
 * stay collapsed; a custom item opens its row for editing right away. Rows
 * expand to edit any field, and rows with validation errors are forced open
 * so the error summary can reach their inputs.
 */
export default function InventoryArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "inventory";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });
  const rootError = form.formState.errors.inventory?.root?.message;
  const itemErrors = form.formState.errors.inventory;
  // Rows opened by the user — keyed by field id so deletions don't shift the
  // state onto another item.
  const [openRows, setOpenRows] = useState<string[]>([]);
  // Set when appending a custom item: the row id only exists after re-render.
  const shouldExpandLastRow = useRef(false);

  const openedRows = new Set(openRows);

  const inventory = form.watch(fieldName);

  useEffect(() => {
    if (shouldExpandLastRow.current && fields.length > 0) {
      shouldExpandLastRow.current = false;
      const lastIndex = fields.length - 1;
      setOpenRows((open) => [...open, fields[lastIndex].id]);
      requestAnimationFrame(() => form.setFocus(`${fieldName}.${lastIndex}.name`));
    }
  }, [fields, form]);

  const setQuantity = (index: number, quantity: number) => {
    form.setValue(`${fieldName}.${index}.quantity`, String(Math.max(1, quantity)), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addPreset = (preset: GearPreset) => {
    // A pack (paquetage) adds its contents as individual entries, never
    // itself. Adding gear already in the list stacks quantities instead of
    // duplicating the row; appends are batched because `inventory` reflects
    // the values of this render only.
    const additions = (preset.contents ?? [{ key: "", quantity: preset.quantity }]).map(
      ({ key, quantity }) => {
        const gear = preset.contents ? GEAR_PRESETS[key] : preset;
        return { gear, quantity: quantity ?? gear.quantity ?? 1 };
      },
    );

    const toAppend: InventoryFormSchema[] = [];
    additions.forEach(({ gear, quantity }) => {
      const existingIndex = inventory.findIndex((item) => item.name === gear.name);
      if (existingIndex >= 0) {
        const current = Number(inventory[existingIndex].quantity) || 0;
        setQuantity(existingIndex, current + quantity);
        return;
      }
      const pending = toAppend.find((item) => item.name === gear.name);
      if (pending) {
        pending.quantity = String(Number(pending.quantity) + quantity);
        return;
      }
      toAppend.push({
        name: gear.name,
        description: gear.description,
        quantity: String(quantity),
        value: gear.value,
      });
    });
    if (toAppend.length > 0) {
      append(toAppend);
    }
  };

  const addCustom = (name: string) => {
    shouldExpandLastRow.current = true;
    append({ name, description: "", quantity: "1", value: "" });
  };

  const toggleRow = (id: string) => {
    setOpenRows((open) => (open.includes(id) ? open.filter((row) => row !== id) : [...open, id]));
  };

  return (
    <div className="flex flex-col gap-3" data-anchor={fieldName}>
      <GearQuickAdd onAddPreset={addPreset} onAddCustom={addCustom} />

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          Aucun objet pour l&apos;instant. Cherchez dans l&apos;équipement du Manuel des joueurs
          ci-dessus, ou créez un objet personnalisé.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {fields.map((field, index) => {
            const item = inventory[index];
            const hasError = !!itemErrors?.[index];
            const isOpen = openedRows.has(field.id) || hasError;
            const quantity = Number(item?.quantity) || 1;

            return (
              <div key={field.id} data-anchor={`${fieldName}.${index}`}>
                <div className="flex items-center gap-1 py-1 pl-1 pr-2">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-1.5 text-left hover:bg-muted/60"
                    onClick={() => toggleRow(field.id)}
                    aria-expanded={isOpen}
                    aria-label={`Modifier : ${item?.name || `objet ${index + 1}`}`}
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-90",
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        !item?.name && "font-normal italic text-muted-foreground",
                        hasError && "text-destructive",
                      )}
                    >
                      {item?.name || "Objet sans nom"}
                    </span>
                  </button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity(index, quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Réduire la quantité"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity(index, quantity + 1)}
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="size-3.5" />
                  </Button>

                  <span className="w-14 shrink-0 truncate text-right text-xs text-muted-foreground">
                    {item?.value || "—"}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={`Supprimer : ${item?.name || `objet ${index + 1}`}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {isOpen && (
                  <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
                    <div className="grid gap-3 md:grid-cols-[1fr_6rem_8rem]">
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.name`}
                        label="Nom"
                        labelClassName="text-sm"
                        required
                      />
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.quantity`}
                        label="Quantité"
                        labelClassName="text-sm"
                        inputMode="numeric"
                      />
                      <FormFieldInput
                        formInstance={form}
                        formFieldName={`${fieldName}.${index}.value`}
                        label="Valeur"
                        labelClassName="text-sm"
                        placeholder="Ex : 25 po"
                      />
                    </div>
                    <FormFieldInput
                      formInstance={form}
                      formFieldName={`${fieldName}.${index}.description`}
                      label="Description"
                      labelClassName="text-sm"
                      textarea
                      inputClassName="h-24"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {fields.length > 1 && (
        <p className="text-right text-xs text-muted-foreground">{fields.length} objets</p>
      )}

      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}
    </div>
  );
}
