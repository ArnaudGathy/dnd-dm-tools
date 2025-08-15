"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormApp from "@/app/(with-nav)/characters/add/FormApp";
import FormGeneral from "@/app/(with-nav)/characters/add/FormGeneral";
import FormBio from "@/app/(with-nav)/characters/add/FormBio";
import FormBioBehaviour from "@/app/(with-nav)/characters/add/FormBioBehaviour";
import FormProficiencies from "@/app/(with-nav)/characters/add/FormProficiencies";
import { Button } from "@/components/ui/button";
import FormInventory from "@/app/(with-nav)/characters/add/FormInventory";
import {
  dataToForm,
  signupFormDefaultValues,
  signUpFormSchema,
} from "@/app/(with-nav)/characters/add/utils";
import { createCharacter, updateCharacter } from "@/lib/actions/characters";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";
import { CharacterById } from "@/lib/utils";

export type CharacterCreationForm = z.infer<typeof signUpFormSchema>;

export default function AddCharacter({
  owner,
  character,
}: {
  owner?: string;
  character?: CharacterById;
}) {
  const isEditMode = !!character;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<CharacterCreationForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: isEditMode ? dataToForm(character) : signupFormDefaultValues,
  });
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  const onSubmit = async (data: CharacterCreationForm) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line no-console
      console.log(
        "Données de création à copier (clique droit : \"copier l'objet",
        data,
      );

      if (!isEditMode && !!owner) {
        await createCharacter(data, owner);
      } else if (!!character) {
        await updateCharacter(data, character);
      }
    } catch (e) {
      if (!isNextRouterError(e)) {
        const error = e as Error;
        console.error(error);
        setError(error.message);
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-[60%_1fr] gap-8">
            <div className="flex flex-col gap-8">
              <FormApp form={form} isEditMode={isEditMode} />
              <FormGeneral
                form={form}
                isEditMode={isEditMode}
                hasSubclass={!!character?.subclassName}
              />
              <FormBio form={form} isEditMode={isEditMode} />
              <FormBioBehaviour form={form} />
            </div>
            <div className="flex flex-col gap-8">
              <FormProficiencies form={form} />
              <FormInventory form={form} />
            </div>
          </div>

          {error ||
            (Object.keys(form.formState.errors).length > 0 && (
              <Alert>
                <AlertCircle className="h-6 w-6 stroke-primary" />
                <AlertTitle className="text-primary">
                  {error
                    ? "Erreur backend"
                    : "Erreur de validation du formulaire"}
                </AlertTitle>
                {hasFormErrors && (
                  <AlertDescription>
                    <p>
                      Il y a une erreur de validation du formulaire, il faut la
                      corriger.
                    </p>
                    <p>Chercher un champ marqué en rouge</p>
                  </AlertDescription>
                )}
                {error && (
                  <AlertDescription>
                    <p>, il faut contacter Arnaud 🙈</p>
                    <p>
                      Ne quittes pas encore la page, envoie moi aussi les
                      informations de création de personnage pour ne pas les
                      perdre.
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
                )}
              </Alert>
            ))}

          <Button type="submit" size="lg" disabled={isLoading}>
            {isEditMode ? "Modifier le personnage" : "Créer le personnage"}
            {isLoading && <span>...</span>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
