import Image from "next/image";
import dndLogo from "@/../public/logo_name.png";
import googleLogo from "@/../public/google_logo.png";
import { Button } from "@/components/ui/button";
import { signIn as signInFunction } from "@/../auth";
import { Book, PawPrint, SquareUserIcon, SwordsIcon } from "lucide-react";

const highlights = [
  { icon: SwordsIcon, label: "Rencontres" },
  { icon: SquareUserIcon, label: "Personnages" },
  { icon: Book, label: "Sorts" },
  { icon: PawPrint, label: "Créatures" },
];

export default function HomeLanding() {
  return (
    <div className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center overflow-hidden text-center">
      {/* Atmosphère : halo rouge en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <Image
          src={dndLogo}
          alt="Dungeons & Dragons"
          height={96}
          priority
          className="sm:h-24 h-20 w-auto"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-5xl font-bold tracking-tight">Dungeon Master Tools</h1>
          <p className="text-balance text-lg text-muted-foreground">
            Vos outils de Maître du Donjon, réunis
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {highlights.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-sm text-muted-foreground"
            >
              <Icon className="size-4 text-primary" />
              {label}
            </li>
          ))}
        </ul>

        <form
          action={async () => {
            "use server";
            await signInFunction("google");
          }}
        >
          <Button type="submit" variant="secondary" size="lg" className="gap-2">
            <Image src={googleLogo} alt="Logo Google" width={20} height={20} />
            Connexion avec Google
          </Button>
        </form>
      </div>
    </div>
  );
}
