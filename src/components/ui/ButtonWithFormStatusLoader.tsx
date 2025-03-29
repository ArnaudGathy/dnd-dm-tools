"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";

export default function ButtonWithFormStatusLoader({
  children,
  hasTextDuringLoad = true,
}: {
  children: ReactNode;
  hasTextDuringLoad?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="space-x-2">
      {pending && <LoaderCircle className="size-6 animate-spin" />}
      {pending ? (hasTextDuringLoad ? "Chargement ..." : "") : children}
    </Button>
  );
}
