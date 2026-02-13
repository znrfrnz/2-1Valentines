import React from "react";

interface PushPinProps {
  color?: "red" | "gold" | "silver" | "blue";
  className?: string;
}

export function PushPin({ color = "red", className = "" }: PushPinProps) {
  const colors = {
    red: {
      head: "#ef4444",
      highlight: "#fca5a5",
      shadow: "#991b1b",
    },
    gold: {
      head: "#eab308",
      highlight: "#fde047",
      shadow: "#854d0e",
    },
    silver: {
      head: "#94a3b8",
      highlight: "#cbd5e1",
      shadow: "#475569",
    },
    blue: {
      head: "#3b82f6",
      highlight: "#93c5fd",
      shadow: "#1e40af",
    },
  };

  const c = colors[color];

  return (
    <svg
      viewBox="0 0 40 40"
      className={`w-8 h-8 drop-shadow-md ${className}`}
      style={{
        filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.3))",
      }}
    >
      {/* Pin Shaft (Metal part going into cork) */}
      <path
        d="M20 20 L20 38"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Pin Head (Plastic part) */}
      <circle cx="20" cy="14" r="10" fill={c.head} />

      {/* Highlight/Reflection on Head */}
      <circle cx="16" cy="10" r="3" fill={c.highlight} opacity="0.6" />

      {/* Shadow on Head for 3D effect */}
      <path d="M10 14 A10 10 0 0 0 30 14" fill={c.shadow} opacity="0.2" />
    </svg>
  );
}
