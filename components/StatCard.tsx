"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface StatCardProps {
  id: string;
  value: number;
  label: string;
  variant: "lime" | "dark" | "blue" | "orange";
  badge?: string;
  className?: string;
}

const VARIANT_STYLES = {
  lime: {
    bg: "bg-[#dfff38] text-black border border-black/15 shadow-[0_14px_32px_-8px_rgba(180,215,20,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)]",
    badge: "bg-black/10 text-black border-black/15",
    subtext: "text-black/85",
  },
  dark: {
    bg: "bg-[#1c1c20] text-white border border-white/15 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)]",
    badge: "bg-white/10 text-zinc-300 border-white/15",
    subtext: "text-zinc-300",
  },
  blue: {
    bg: "bg-[#4cc3ff] text-black border border-black/15 shadow-[0_14px_32px_-8px_rgba(60,175,250,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)]",
    badge: "bg-black/10 text-black border-black/15",
    subtext: "text-black/85",
  },
  orange: {
    bg: "bg-[#ff6420] text-black border border-black/15 shadow-[0_14px_32px_-8px_rgba(255,85,20,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)]",
    badge: "bg-black/10 text-black border-black/15",
    subtext: "text-black/85",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  id,
  value,
  label,
  variant,
  badge,
  className = "",
}) => {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numberRef.current) return;

    const tween = gsap.to(numberRef.current, {
      innerText: value,
      duration: 1.8,
      delay: 0.2,
      ease: "power2.out",
      snap: { innerText: 1 },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  const currentTheme = VARIANT_STYLES[variant];

  return (
    <div
      id={id}
      className={`stat-card gpu-accel w-44 sm:w-48 md:w-56 lg:w-60 p-5 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl select-none backdrop-blur-sm ${currentTheme.bg} ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-heading tabular-nums leading-none">
          <span ref={numberRef}>0</span>
          <span className="text-xl sm:text-2xl font-bold opacity-70 ml-0.5 align-top">%</span>
        </div>
        {badge && (
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${currentTheme.badge}`}
          >
            {badge}
          </span>
        )}
      </div>
      <p
        className={`text-xs md:text-sm font-semibold leading-snug tracking-tight mt-3 ${currentTheme.subtext}`}
      >
        {label}
      </p>
    </div>
  );
};