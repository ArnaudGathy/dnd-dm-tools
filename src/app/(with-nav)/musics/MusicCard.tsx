"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getYoutubeUrlFromId } from "@/utils/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type Music = { id: number; youtubeId: string; name: string };

export default function MusicCard({ music }: { music: Music }) {
  const copyYoutubeId = async () => {
    try {
      await navigator.clipboard.writeText(music.youtubeId);
      toast.success(`${music.youtubeId} copié`);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de copier l'identifiant");
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-video w-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={getYoutubeUrlFromId(music.youtubeId)}
          title={music.name}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <CardContent className="flex items-center justify-between gap-2 p-2">
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold" title={music.name}>
            {music.name}
          </span>
          <code className="text-xs text-muted-foreground">{music.youtubeId}</code>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={copyYoutubeId}
          aria-label={`Copier l'identifiant ${music.youtubeId}`}
          className="size-7 shrink-0"
        >
          <Copy className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
