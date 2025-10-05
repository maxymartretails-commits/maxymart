// components/ui/CircularProgress.tsx
"use client";

import React from "react";

type LoadingProps = {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
};

const Loading = ({
  size = 40,
  thickness = 4,
  color = "#4f46e5",
  className = "",
}: LoadingProps) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className={`animate-spin mx-auto my-auto ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={thickness}
      />
      {/* Foreground stroke */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        style={{ transformOrigin: "50% 50%" }}
      />
    </svg>
  );
};

export default Loading;
