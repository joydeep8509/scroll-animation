"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CarModel } from "./CarModel";
import { StatCard } from "./StatCard";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const HEADLINE_CHARS = "WELCOME ITZFIZZ".split("");

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const gasContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial State: Staging elements
      gsap.set(carWrapperRef.current, { x: 0 });
      gsap.set(".letter-span", { y: 0, scale: 1 });
      gsap.set(
        ["#stat-card-1", "#stat-card-2", "#stat-card-3", "#stat-card-4"],
        {
          opacity: 0,
          y: 24,
          scale: 0.9,
          pointerEvents: "none",
        }
      );

      // Travel distance across the track from left corner to right edge
      const calculateTravelDistance = () => {
        const screenWidth = window.innerWidth;
        const carWidth = carWrapperRef.current?.offsetWidth || 440;
        return screenWidth - carWidth - 15;
      };

      //exhaust gas emitter
      const emitGasPuff = (intensity = 1) => {
        const container = gasContainerRef.current;
        if (!container) return;

        const count = Math.min(4, Math.max(2, Math.round(intensity * 2.5)));

        for (let i = 0; i < count; i++) {
          const puff = document.createElement("div");
          puff.className =
            "absolute rounded-full pointer-events-none will-change-transform";

          const pipeOffsetY = i % 2 === 0 ? -6 : 6;
          const jitterY = (Math.random() - 0.5) * 12;
          const size = Math.random() * 16 + 20;

          puff.style.width = `${size}px`;
          puff.style.height = `${size}px`;
          puff.style.left = `36px`;
          puff.style.top = `calc(50% + ${pipeOffsetY + jitterY}px)`;

          const core = Math.floor(Math.random() * 25 + 95);
          const mid = core + 35;
          const outer = core + 60;

          puff.style.background = `radial-gradient(circle, rgba(${core},${core + 2},${core + 5},0.9) 0%, rgba(${mid},${mid + 2},${mid + 5},0.75) 40%, rgba(${outer},${outer},${outer},0) 80%)`;
          puff.style.filter = `blur(${Math.random() * 2 + 3}px)`;
          puff.style.opacity = "0.85";
          puff.style.zIndex = "15";

          container.appendChild(puff);

          gsap.to(puff, {
            x: -(Math.random() * 140 + 110),
            y: (Math.random() - 0.5) * 70,
            scale: Math.random() * 2 + 2.5,
            rotation: (Math.random() - 0.5) * 160,
            opacity: 0,
            duration: Math.random() * 0.4 + 0.7,
            ease: "power2.out",
            onComplete: () => puff.remove(),
          });
        }
      };

      // 2. Scroll-Driven Core Animation
      let lastProgress = 0;
      let lastPuffTime = 0;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2400",
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            const now = performance.now();

            // Throttled particle emission during active scroll
            const velocity = Math.abs(self.getVelocity ? self.getVelocity() : 0);
            if (
              (velocity > 25 || Math.abs(prog - lastProgress) > 0.002) &&
              now - lastPuffTime > 45
            ) {
              emitGasPuff(Math.min(2.5, Math.max(1, velocity / 300)));
              lastPuffTime = now;
            }
            lastProgress = prog;
          },
        },
      });

      scrollTl
        // 1. Car drives forward from left to right
        .to(
          carWrapperRef.current,
          {
            x: calculateTravelDistance,
            duration: 10,
            ease: "power1.inOut",
          },
          0
        )
        // 2. Letters of "WELCOME ITZFIZZ" bounce up and settle sequentially
        .to(
          ".letter-span",
          {
            y: -16,
            scale: 1.1,
            stagger: {
              each: 0.35,
              from: "start",
            },
            duration: 0.35,
            yoyo: true,
            repeat: 1,
            ease: "back.out(2.5)",
          },
          1.2
        )
        // 3. The 4 colored boxes animate into view
        .to(
          ["#stat-card-1", "#stat-card-2", "#stat-card-3", "#stat-card-4"],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            stagger: 0.12,
            duration: 4.5,
            ease: "back.out(1.4)",
          },
          4.5
        )
        // 4. Scroll indicator fades away upon scrolling
        .to(
          scrollHintRef.current,
          {
            opacity: 0,
            duration: 1.5,
          },
          0
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <section className="relative w-full h-screen apple-card-bg flex flex-col justify-center items-center overflow-hidden gpu-accel">
        {/* TOP COLORED BOXES (Upper Right) - Symmetrical vertical alignment */}
        <div
          id="top-metrics"
          className="absolute top-6 sm:top-8 md:top-10 lg:top-12 right-4 sm:right-8 md:right-16 lg:right-28 z-30 flex gap-3 sm:gap-4 md:gap-6 justify-end items-center"
        >
          <StatCard
            id="stat-card-1"
            value={58}
            label="Increase in pick up point use"
            variant="lime"
            badge="GROWTH"
          />
          <StatCard
            id="stat-card-2"
            value={27}
            label="Increase in pick up point use"
            variant="dark"
            badge="ACTIVE"
          />
        </div>

        {/* ROAD CONTAINER WITH REALISTIC TRACK EMBOSSING */}
        <div
          id="track-container"
          className="relative w-full z-10 my-auto flex items-center justify-start overflow-hidden h-36 md:h-44 lg:h-52 bg-brandGreen shadow-[0_24px_50px_rgba(0,0,0,0.16)] border-y border-black/10"
        >
          {/* Subtle upper and lower rumble kerb depth */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/15 track-edge-top z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/15 track-edge-bottom z-10 pointer-events-none" />

          {/* BASE LAYER: Road-Lettered Headline */}
          <div className="absolute inset-0 flex items-center pl-8 md:pl-16 lg:pl-28 z-0">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-[0.16em] uppercase whitespace-nowrap select-none font-heading drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
              {HEADLINE_CHARS.map((char, idx) => (
                <span
                  key={idx}
                  className="inline-block letter-span will-change-transform"
                >
                  {char === " " ? "\u00A0\u00A0" : char}
                </span>
              ))}
            </h1>
          </div>

          {/* CAR SPRITE + SOLID PITCH BLACK ROAD OVERLAY */}
          <div
            ref={carWrapperRef}
            className="absolute z-20 left-0 top-1/2 -translate-y-1/2 pointer-events-none gpu-accel flex items-center"
          >
            {/* Dynamic Exhaust Gas Emitter */}
            <div
              ref={gasContainerRef}
              className="absolute inset-0 pointer-events-none overflow-visible"
            />

            {/* Supercar Model (Red Lamborghini) */}
            <div className="relative w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] flex-shrink-0 z-20">
              <CarModel />
            </div>

            {/* PURE PITCH BLACK ROAD WITH ACCENT DROP SHADOW */}
            <div className="absolute left-[36px] -top-32 -bottom-32 w-[300vw] bg-black z-10 pointer-events-none will-change-transform shadow-[-16px_0_32px_rgba(0,0,0,0.45)]" />
          </div>
        </div>

        {/* BOTTOM COLORED BOXES (Lower Right) - Symmetrical vertical alignment */}
        <div
          id="bottom-metrics"
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 right-4 sm:right-8 md:right-16 lg:right-28 z-30 flex gap-3 sm:gap-4 md:gap-6 justify-end items-center"
        >
          <StatCard
            id="stat-card-3"
            value={23}
            label="Decreased in customer phone calls"
            variant="blue"
            badge="SUPPORT"
          />
          <StatCard
            id="stat-card-4"
            value={40}
            label="Decreased in customer phone calls"
            variant="orange"
            badge="EFFICIENCY"
          />
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none transition-opacity duration-300"
        >
          <div className="flex items-center space-x-1.5 bg-black/5 backdrop-blur-md px-3 py-1 rounded-full border border-black/10 shadow-sm mb-1.5">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-700">
              Scroll Down
            </span>
          </div>
          <div className="w-4 h-6 border-2 border-zinc-600/75 rounded-full flex justify-center p-0.5">
            <div className="w-1 h-1.5 bg-zinc-800 rounded-full animate-bounce" />
          </div>
        </div>
      </section>
    </div>
  );
};