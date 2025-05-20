"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ButtonWithFormStatusLoader({
  children,
  hasTextDuringLoad = true,
  className,
}: {
  children: ReactNode;
  hasTextDuringLoad?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("space-x-2", className)}
    >
      {pending && <LoaderCircle className="size-6 animate-spin" />}
      {pending ? (hasTextDuringLoad ? "Chargement ..." : "") : children}
    </Button>
  );
}
