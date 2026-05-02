"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading screenshots...",
  "Detecting language...",
  "Extracting messages...",
  "Analyzing effort patterns...",
  "Measuring reciprocity...",
  "Evaluating trajectory...",
  "Generating verdict...",
];

export default function Processing() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-fade-in">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-[4px] border-[#e4e4e7] rounded-full" />
        <div className="absolute inset-0 border-[4px] border-transparent border-t-[#18181b] rounded-full animate-spin" />
      </div>

      {/* Step text */}
      <div className="text-center space-y-5">
        <p className="text-lg font-serif text-[#09090b] transition-all duration-300" key={stepIdx}>
          {STEPS[stepIdx]}
        </p>
        <div className="flex gap-1.5 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stepIdx
                  ? "w-8 bg-[#18181b]"
                  : "w-2 bg-[#e4e4e7]"
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-[#71717a] mt-4 animate-pulse-slow">
          Usually takes 5–10 seconds
        </p>
      </div>
    </div>
  );
}
