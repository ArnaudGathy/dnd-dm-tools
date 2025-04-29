"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormApp from "@/app/characters/add/FormApp";
import FormGeneral from "@/app/characters/add/FormGeneral";
import FormBio from "@/app/characters/add/FormBio";
import FormBioBehaviour from "@/app/characters/add/FormBioBehaviour";
import FormProficiencies from "@/app/characters/add/FormProficiencies";
import { Button } from "@/components/ui/button";
import FormInventory from "@/app/characters/add/FormInventory";
import {
  signupFormDefaultValues,
  signUpFormSchema,
} from "@/app/characters/add/utils";
import { createCharacter } from "@/lib/actions/characters";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";

export type CharacterCreationForm = z.infer<typeof signUpFormSchema>;

export default function AddCharacter({ owner }: { owner: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<CharacterCreationForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signupFormDefaultValues,
  });

  const onSubmit = async (data: CharacterCreationForm) => {
    setIsLoading(true);
    try {
      await createCharacter(data, owner);
    } catch (e) {
      if (!isNextRouterError(e)) {
        const error = e as Error;
        setError(error.message);
      }
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
              <FormApp form={form} />
              <FormGeneral form={form} />
              <FormBio form={form} />
              <FormBioBehaviour form={form} />
            </div>
            <div className="flex flex-col gap-8">
              <FormProficiencies form={form} />
              <FormInventory form={form} />
            </div>
          </div>

          {error && (
            <Alert>
              <AlertCircle className="h-6 w-6 stroke-primary" />
              <AlertTitle className="text-primary">
                Erreur lors de la création du personnage
              </AlertTitle>
              Essayer de corriger l&apos;erreur d&apos;encodage dans le
              formulaire ou sinon transmettre ce message à Arnaud
              <AlertDescription className="mt-4">
                <pre>{error}</pre>
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={isLoading}>
            Créer le personnage {isLoading && <span>...</span>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
