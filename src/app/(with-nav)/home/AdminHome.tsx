import { getSessionData } from "@/lib/utils";
import DeathList from "@/app/(with-nav)/death/DeathList";
import HomeHeader from "@/app/(with-nav)/home/HomeHeader";
import HomeSectionGrid from "@/app/(with-nav)/home/HomeSectionGrid";
import { adminSections, gameScreens } from "@/app/(with-nav)/home/homeSections";

export default async function AdminHome() {
  const { userName } = await getSessionData();

  return (
    <div className="mx-auto mt-4 flex w-full max-w-5xl flex-col gap-10">
      <HomeHeader
        firstName={userName}
        subtitle="Votre table de jeu en un coup d'œil. Sélectionnez une campagne dans la barre de navigation."
      />

      {/* Alerte combat : n'apparaît que lorsqu'un personnage est à terre. */}
      <DeathList hideWhenIdle />

      <HomeSectionGrid title="Écrans de jeu" sections={gameScreens} />

      <HomeSectionGrid title="Explorer" sections={adminSections} />
    </div>
  );
}
