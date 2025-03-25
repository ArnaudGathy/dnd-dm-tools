import Breadcrumbs from "@/components/Breadcrumbs";

export default async function Sheet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const breadCrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Personnages", href: "/characters" },
    { name: "Feuille de personnage", href: `/characters/${id}/sheet` },
  ];

  return <Breadcrumbs crumbs={breadCrumbs}>Sheet</Breadcrumbs>;
}
