"use client";

import React from "react";

interface CarModelProps {
  className?: string;
}

export const CarModel: React.FC<CarModelProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] pointer-events-none select-none ${className}`}
    >
      {/* Contact ambient shadow under wheels & chassis */}
      <div
        className="absolute -bottom-3 sm:-bottom-4 left-[6%] right-[6%] h-7 sm:h-9 car-contact-shadow pointer-events-none z-10 filter blur-[2px]"
        aria-hidden="true"
      />

      <img
        src="/car.svg"
        alt="Red Lamborghini SVJ"
        className="relative z-20 w-full h-auto drop-shadow-[0_14px_22px_rgba(0,0,0,0.42)] select-none"
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};