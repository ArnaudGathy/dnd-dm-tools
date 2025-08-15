"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/initiative/page.module.css";
import DidYouKnow from "@/app/(plain)/tracker/initiative/(initiative)/DidYouKnow";

export default function InitiativeTrackerLoader() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 5000);
    };

    const play = () => {
      video.playbackRate = 0.7;
      video.play();
    };

    video.addEventListener("canplay", play);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className={cn(styles.antiqua, "flex h-dvh flex-col gap-8")}>
      <h1 className="mt-8 text-center text-4xl uppercase text-orange-100">
        Le combat va commencer
      </h1>
      <DidYouKnow />
      <video
        ref={videoRef}
        muted
        src="../dragon_video.mp4"
        // style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
