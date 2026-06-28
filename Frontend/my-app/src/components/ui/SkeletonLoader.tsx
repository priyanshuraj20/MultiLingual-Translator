"use client";

import React from "react";

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

/**
 * SkeletonLoader renders multiple rows of shimmering placeholders
 * representing loaded text lines. It uses the design's dark-surface color tokens.
 */
export function SkeletonLoader({ lines = 3, className = "" }: SkeletonLoaderProps) {
  // Generate random widths for each line to look like a natural paragraph block
  const getRandomWidth = (index: number) => {
    if (index === lines - 1) return "w-1/2"; // Last line is shorter
    if (index % 2 === 0) return "w-full";
    return "w-5/6";
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          {/* Label placeholder for extra context (optional, very subtle) */}
          {idx === 0 && (
            <div className="h-2 w-16 bg-white/5 border border-white/5 animate-pulse rounded" />
          )}
          {/* Shimmer line */}
          <div
            className={`h-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-md animate-pulse ${getRandomWidth(
              idx
            )}`}
            style={{
              animationDuration: "1.8s",
              animationDelay: `${idx * 0.15}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
export default SkeletonLoader;
