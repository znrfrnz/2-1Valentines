"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface SparkleProps {
  color?: "pink" | "green" | "yellow" | "white" | "blue";
  size?: number;
  className?: string;
  delay?: number;
}

const colors: Record<string, string> = {
  pink: "#FF9EAA",
  green: "#A3E635",
  yellow: "#FDE047",
  white: "#FFFFFF",
  blue: "#7DD3FC",
};

export const Sparkle = memo(function Sparkle({
  color = "white",
  size = 24,
  className = "",
  delay = 0,
}: SparkleProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${className}`}
      style={{ willChange: "transform" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 0.8, 1],
        opacity: 1,
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatDelay: 1.5,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill={colors[color]}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="0.5"
      />
    </motion.svg>
  );
});
