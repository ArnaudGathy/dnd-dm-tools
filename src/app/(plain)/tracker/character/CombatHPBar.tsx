"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/character/combat-hp.module.css";

interface CombatHPBarProps {
  currentHP: number;
  maximumHP: number;
  currentTempHP: number;
}

export default function CombatHPBar({ currentHP, maximumHP, currentTempHP }: CombatHPBarProps) {
  const prevHPRef = useRef(currentHP);
  const [isHit, setIsHit] = useState(false);
  const [ghostPercent, setGhostPercent] = useState(Math.round((currentHP / maximumHP) * 100));
  const hitCountRef = useRef(0);

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

    // Healing — just snap to new value, no drama
    if (currentHP > prevHP) {
      setGhostPercent(currentPercent);
      prevHPRef.current = currentHP;
    }
  }, [currentHP, maximumHP, currentPercent]);

  // Bar color based on HP percentage
  const barColor =
    currentPercent > 50 ? "bg-green-800" : currentPercent > 25 ? "bg-orange-600" : " bg-rose-700";

  return (
    <div
      className={cn("my-2 flex w-full flex-col items-center justify-center", {
        [styles.shake]: isHit,
        // [styles.hitGlow]: isHit,
      })}
      key={hitCountRef.current}
    >
      {/* HP Number */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hp-${currentHP}`}
          className="text-xl font-bold tabular-nums"
          initial={false}
          animate={
            isHit
              ? {
                  color: ["#b91c1c", "#ffffff", "#b91c1c", "#ffffff", "#b91c1c", "#dc2626"],
                  scale: [1, 1.3, 1, 1.2, 1, 1],
                }
              : { color: "#404040", scale: 1 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {`${currentHP}/${maximumHP} ${currentTempHP && currentTempHP > 0 ? `(+${currentTempHP})` : ""}`}
        </motion.div>
      </AnimatePresence>

      {/* HP Bar Container */}
      <div
        className={cn("relative h-5 w-full overflow-hidden rounded-full bg-neutral-300", {
          [styles.hitGlow]: isHit,
        })}
      >
        {/* Ghost bar (orange, drains slowly after damage) */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full bg-amber-400/80",
            styles.ghostBar,
          )}
          style={{ width: `${ghostPercent}%` }}
        />

        {/* Main HP bar */}
        <div
          className={cn("absolute left-0 top-0 h-full rounded-full transition-none", barColor, {
            [styles.barFlash]: isHit,
          })}
          style={{ width: `${currentPercent}%` }}
        />

        {/* Shine overlay on the bar for a polished look */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-[40%] rounded-full bg-white/20"
          style={{ width: `${currentPercent}%` }}
        />
      </div>
    </div>
  );
}
