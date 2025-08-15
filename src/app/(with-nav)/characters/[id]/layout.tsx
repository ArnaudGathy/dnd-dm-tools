import { ReactNode } from "react";
import { CharacterBreadcrumbs } from "@/app/(with-nav)/characters/breadcrumbs";

export default async function layout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <CharacterBreadcrumbs id={id} />
      {children}
    </div>
  );
}
