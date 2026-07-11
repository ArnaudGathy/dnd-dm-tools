"use client";

import { z } from "zod";
import { FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TabIdentity from "@/app/(with-nav)/characters/add/TabIdentity";
import TabBackground from "@/app/(with-nav)/characters/add/TabBackground";
import TabProficiencies from "@/app/(with-nav)/characters/add/TabProficiencies";
import TabInventory from "@/app/(with-nav)/characters/add/TabInventory";
import TabCombat from "@/app/(with-nav)/characters/add/TabCombat";
import {
  dataToForm,
  signupFormDefaultValues,
  signUpFormSchema,
} from "@/app/(with-nav)/characters/add/utils";
import {
  FlatFormError,
  flattenFormErrors,
  FORM_TAB_CONFIG,
  FORM_TABS,
  FormTabId,
} from "@/app/(with-nav)/characters/add/formLayout";
import { createCharacter, updateCharacter } from "@/lib/actions/characters";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheck, LoaderCircle } from "lucide-react";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";
import { CharacterById } from "@/lib/utils";
import { entries } from "remeda";

export type CharacterCreationForm = z.infer<typeof signUpFormSchema>;

export default function AddCharacter({
  owner,
  character,
  dryRun = false,
}: {
  owner?: string;
  character?: CharacterById;
  /** Test mode: the server action runs every insert then rolls back. */
  dryRun?: boolean;
}) {
  const isEditMode = !!character;
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [dryRunMessage, setDryRunMessage] = useState("");
  const [activeTab, setActiveTab] = useState<FormTabId>("identity");
  const form = useForm<CharacterCreationForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: isEditMode ? dataToForm(character) : signupFormDefaultValues,
    mode: "onTouched",
  });

  const flatErrors = flattenFormErrors(form.formState.errors);
  const errorCountByTab = flatErrors.reduce<Record<FormTabId, number>>(
    (acc, error) => {
      acc[error.tab] += 1;
      return acc;
    },
    { identity: 0, background: 0, proficiencies: 0, inventory: 0, combat: 0 },
  );

  const goToField = (error: FlatFormError) => {
    setActiveTab(error.tab);
    // Wait for the target tab to become visible before scrolling/focusing.
    requestAnimationFrame(() => {
      const segments = error.path.split(".");
      let anchor: Element | null = null;
      for (let end = segments.length; end > 0 && !anchor; end--) {
        anchor = document.querySelector(`[data-anchor="${segments.slice(0, end).join(".")}"]`);
      }
      anchor?.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        form.setFocus(error.path as FieldPath<CharacterCreationForm>);
      } catch {
        // Selects and toggles aren't focusable through RHF — scrolling is enough.
      }
    });
  };

  const onSubmit = async (data: CharacterCreationForm) => {
    setIsLoading(true);
    setDryRunMessage("");
    try {
      // eslint-disable-next-line no-console
      console.log("Données de création à copier (clique droit : \"copier l'objet", data);

      if (!isEditMode && !!owner) {
        const result = await createCharacter(data, owner, { dryRun });
        if (result?.message) {
          setDryRunMessage(result.message);
        }
      } else if (!!character) {
        await updateCharacter(data, character);
      }
    } catch (e) {
      if (!isNextRouterError(e)) {
        const error = e as Error;
        console.error(error);
        setServerError(error.message);
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = () => {
    const firstError = flattenFormErrors(form.formState.errors)[0];
    if (firstError) {
      goToField(firstError);
    }
  };

  const showErrorSummary = form.formState.isSubmitted && flatErrors.length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
        <header className="mb-4 flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            {isEditMode ? `Modifier ${character.name}` : "Créer un personnage"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Toutes les sections sont accessibles à tout moment, dans n&apos;importe quel ordre.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormTabId)}>
          <TabsList className="grid h-auto w-full grid-cols-5 gap-1 rounded-xl border border-border bg-card p-1">
            {entries(FORM_TAB_CONFIG).map(([key, { label, icon: Icon }]) => {
              const errorCount = errorCountByTab[key];
              return (
                <TabsTrigger
                  value={key}
                  key={key}
                  className="relative flex-col gap-1 rounded-lg py-2 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:flex-row md:gap-1.5"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="hidden text-sm md:block">{label}</span>
                  {errorCount > 0 && (
                    <span
                      className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground md:static md:ml-1"
                      aria-label={`${errorCount} erreur${errorCount > 1 ? "s" : ""}`}
                    >
                      {errorCount}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Panels stay mounted so every field keeps validating and stays
              reachable by the error summary, whatever tab is displayed. */}
          {FORM_TABS.map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              forceMount
              className="mt-4 data-[state=inactive]:hidden"
            >
              {tab === "identity" && (
                <TabIdentity
                  form={form}
                  isEditMode={isEditMode}
                  hasSubclass={!!character?.subclassName}
                  level={character?.level}
                />
              )}
              {tab === "background" && <TabBackground form={form} />}
              {tab === "proficiencies" && <TabProficiencies form={form} />}
              {tab === "inventory" && <TabInventory form={form} />}
              {tab === "combat" && <TabCombat form={form} />}
            </TabsContent>
          ))}
        </Tabs>

        <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
          {dryRunMessage && (
            <Alert className="mb-3 border-emerald-500/40 bg-emerald-500/10">
              <CircleCheck className="h-6 w-6 stroke-emerald-400" />
              <AlertTitle className="text-emerald-400">Dry run réussi</AlertTitle>
              <AlertDescription>{dryRunMessage}</AlertDescription>
            </Alert>
          )}

          {serverError && (
            <Alert className="mb-3">
              <AlertCircle className="h-6 w-6 stroke-primary" />
              <AlertTitle className="text-primary">
                Erreur backend, il faut contacter Arnaud 🙈
              </AlertTitle>
              <AlertDescription>
                <p>
                  Ne quittes pas encore la page, envoie moi aussi les informations de création de
                  personnage pour ne pas les perdre.
                </p>
                <ul className="list-inside list-disc pl-4">
                  <li>{'Clique droit sur la page, option "Inspecter"'}</li>
                  <li>{'Onglet "Console"'}</li>
                  <li>
                    {
                      'Sur la ligne "données de création à copier", faire clique droit "copier l\'objet"'
                    }
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {showErrorSummary && (
            <div className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
              <p className="mb-2 text-sm font-semibold text-destructive">
                {flatErrors.length === 1
                  ? "1 champ est à corriger :"
                  : `${flatErrors.length} champs sont à corriger :`}
              </p>
              <ul className="flex max-h-36 flex-col gap-1 overflow-y-auto">
                {flatErrors.map((error) => (
                  <li key={error.path}>
                    <button
                      type="button"
                      onClick={() => goToField(error)}
                      className="text-left text-sm underline-offset-2 hover:underline"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {FORM_TAB_CONFIG[error.tab].label}
                      </span>{" "}
                      <span className="font-medium">{error.label}</span>
                      <span className="text-muted-foreground"> — {error.message}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
            {showErrorSummary && (
              <span className="text-sm text-destructive">
                Le personnage ne peut pas être enregistré tant qu&apos;il reste des erreurs.
              </span>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full shrink-0 md:ml-auto md:w-auto"
            >
              {isLoading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              {isEditMode
                ? "Modifier le personnage"
                : dryRun
                  ? "Tester le personnage (dry run)"
                  : "Créer le personnage"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
