import { restrictToAdmins } from "@/lib/utils";
import musics from "@/data/musics.json";
import MusicCard from "@/app/(with-nav)/musics/MusicCard";

const MusicsPage = async () => {
  await restrictToAdmins();

  return (
    <div className="mx-auto mt-4 flex w-full max-w-[1600px] flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Musiques</h1>
        <p className="text-muted-foreground">
          Écoutez les thèmes disponibles et copiez l&apos;identifiant YouTube à utiliser dans une
          rencontre ({musics.length} pistes).
        </p>
      </header>

      <div className="lg:grid-cols-4 xl:grid-cols-5 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        {musics.map((music) => (
          <MusicCard key={music.id} music={music} />
        ))}
      </div>
    </div>
  );
};

export default MusicsPage;
