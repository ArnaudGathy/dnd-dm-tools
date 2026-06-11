"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/character/combat-hp.module.css";
import pageStyles from "@/app/(plain)/tracker/character/page.module.css";

interface CombatHPBarProps {
  name: string;
  currentHP: number;
  maximumHP: number;
  currentTempHP: number;
}

export default function CombatHPBar({
  name,
  currentHP,
  maximumHP,
  currentTempHP,
}: CombatHPBarProps) {
  const prevHPRef = useRef(currentHP);
  const [isHit, setIsHit] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [ghostPercent, setGhostPercent] = useState(Math.round((currentHP / maximumHP) * 100));
  const hitCountRef = useRef(0);
  const healCountRef = useRef(0);

  const currentPercent = Math.max(0, Math.min(100, Math.round((currentHP / maximumHP) * 100)));

  useEffect(() => {
    const prevHP = prevHPRef.current;

    if (currentHP < prevHP) {
      // Damage taken — trigger animations
      hitCountRef.current += 1;

      // Ghost bar still shows the old value — it will animate via CSS transition
      setGhostPercent(Math.round((prevHP / maximumHP) * 100));

      setIsHit(true);

      // After a brief moment, update ghost to new value so CSS transition kicks in
      const ghostTimer = setTimeout(() => {
        setGhostPercent(currentPercent);
      }, 50);

      // Clear the hit state after all animations finish
      const clearTimer = setTimeout(() => {
        setIsHit(false);
      }, 1600);

      prevHPRef.current = currentHP;
      return () => {
        clearTimeout(ghostTimer);
        clearTimeout(clearTimer);
      };
    }

    // Healing — soothing animation
    if (currentHP > prevHP) {
      healCountRef.current += 1;
      setIsHealing(true);
      setGhostPercent(currentPercent);
      prevHPRef.current = currentHP;

      const clearTimer = setTimeout(() => {
        setIsHealing(false);
      }, 1400);

      return () => clearTimeout(clearTimer);
    }
  }, [currentHP, maximumHP, currentPercent]);

  // Bar color based on HP percentage
  const barColor =
    currentPercent > 50
      ? "bg-gradient-to-b from-green-600 to-green-800"
      : currentPercent > 25
        ? "bg-gradient-to-b from-orange-500 to-orange-700"
        : "bg-gradient-to-b from-red-600 to-red-800";

  const animKey = `${hitCountRef.current}-${healCountRef.current}`;

  return (
    <div className={cn("relative h-full w-full", { [styles.shake]: isHit })} key={animKey}>
      {/* Bar layers fill the whole plate */}
      <div className="absolute inset-0 bg-zinc-800">
        {/* Ghost bar (amber, drains slowly after damage) */}
        <div
          className={cn("absolute left-0 top-0 h-full bg-amber-400/70", styles.ghostBar)}
          style={{ width: `${ghostPercent}%` }}
        />

        {/* Main HP bar */}
        <div
          className={cn("absolute left-0 top-0 h-full", barColor, {
            "transition-none": !isHealing,
            [styles.barFlash]: isHit,
            [styles.healShimmer]: isHealing,
            [styles.healFill]: isHealing,
          })}
          style={{ width: `${currentPercent}%` }}
        />

        {/* Sparkle sweep overlay on heal — clipped to bar width */}
        <AnimatePresence>
          {isHealing && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="pointer-events-none absolute left-0 top-0 h-full"
              style={{
                width: `${currentPercent}%`,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), rgba(34,197,94,0.3), transparent)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Shine strip on the filled portion */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-[35%] bg-white/15"
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      {/* Hit/heal glow above the bar layers, kept inset for clean chroma keying */}
      <div
        className={cn("pointer-events-none absolute inset-0 z-[5]", {
          [styles.hitGlow]: isHit,
          [styles.healGlow]: isHealing,
        })}
      />

      {/* Name + HP overlaid on the bar */}
      <div className="relative z-10 flex h-full items-center justify-between gap-3 px-3">
        <span
          className={cn(
            pageStyles.display,
            "truncate text-xl text-stone-100",
            "[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]",
          )}
        >
          {name}
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={`hp-${currentHP}`}
            className="text-xl font-bold tabular-nums [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
            initial={false}
            animate={
              isHit
                ? {
                    color: ["#b91c1c", "#ffffff", "#b91c1c", "#ffffff", "#b91c1c", "#fca5a5"],
                    scale: [1, 1.3, 1, 1.2, 1, 1],
                  }
                : isHealing
                  ? {
                      color: ["#fafaf9", "#4ade80", "#86efac", "#4ade80", "#fafaf9"],
                      scale: [1, 1.15, 1.1, 1.05, 1],
                    }
                  : { color: "#fafaf9", scale: 1 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {`${currentHP}/${maximumHP} ${currentTempHP && currentTempHP > 0 ? `(+${currentTempHP})` : ""}`}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
