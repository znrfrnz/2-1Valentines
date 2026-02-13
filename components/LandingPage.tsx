"use client";

import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PostItNote } from "./PostItNote";
import { Sparkle } from "./Sparkle";
import { Heart, ArrowRight } from "lucide-react";

// Floating heart component for title decoration - memoized for perf
const FloatingHeart = memo(function FloatingHeart({ 
  delay = 0, 
  x = 0, 
  y = 0, 
  size = 20,
  color = "#FF6B9D"
}: { 
  delay?: number; 
  x?: number; 
  y?: number; 
  size?: number;
  color?: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, willChange: "transform" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 1],
        scale: [0, 1.2, 1, 1.1, 1],
        y: [0, -5, 0, -3, 0],
      }}
      transition={{
        delay: delay + 0.8,
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    >
      <Heart 
        size={size} 
        fill={color}
        color={color}
        className="drop-shadow-md"
      />
    </motion.div>
  );
});
import { PostItData } from "@/lib/types";
import { Ka21nanLogo } from "./Ka21nanLogo";

interface LandingPageProps {
  onViewWall: () => void;
  onSendMessage: () => void;
  sampleMessages: PostItData[];
}

export function LandingPage({
  onViewWall,
  onSendMessage,
  sampleMessages,
}: LandingPageProps) {
  // display some notes sa landing
  const displayMessages = sampleMessages.slice(0, 6);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scattered Sparkles */}
        <Sparkle
          color="pink"
          size={48}
          className="top-[10%] left-[10%]"
          delay={0}
        />
        <Sparkle
          color="yellow"
          size={32}
          className="top-[20%] right-[15%]"
          delay={0.5}
        />
        <Sparkle
          color="green"
          size={40}
          className="bottom-[15%] left-[20%]"
          delay={1}
        />
        <Sparkle
          color="white"
          size={24}
          className="bottom-[25%] right-[10%]"
          delay={1.5}
        />
        <Sparkle
          color="blue"
          size={36}
          className="top-[40%] left-[5%]"
          delay={2}
        />

        {/* Decorative Circles */}
        <div className="absolute top-[15%] left-[30%] w-4 h-4 rounded-full bg-sky-300/60" />
        <div className="absolute bottom-[30%] right-[25%] w-6 h-6 rounded-full bg-white/40" />
        <div className="absolute top-[60%] left-[15%] w-3 h-3 rounded-full bg-red-400/50" />
        <div className="absolute top-[75%] right-[12%] w-5 h-5 rounded-full bg-sky-200/50" />
        <div className="absolute top-[30%] right-[8%] w-3 h-3 rounded-full bg-rose-300/60" />
      </div>

      {/* Background Message Strips - Reduced opacity, no blur for better perf */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        {displayMessages.map((msg, i) => {
          const randomX = ((i * 18) % 80) + 10;
          const randomY = ((i * 15) % 80) + 10;
          const randomRot = (i % 2 === 0 ? 1 : -1) * ((i * 7) % 15);

          return (
            <div
              key={msg.id}
              className="absolute transition-all duration-1000 ease-in-out opacity-80 hover:opacity-100 pointer-events-auto"
              style={{
                left: `${randomX}%`,
                top: `${randomY}%`,
                zIndex: i,
              }}
            >
              <div className="transform scale-75 md:scale-90 origin-center">
                <PostItNote
                  id={msg.id}
                  message={msg.message}
                  from={msg.from}
                  to={msg.to}
                  color={msg.color}
                  spotifyTrackId={msg.spotifyTrackId}
                  spotifyTrackName={msg.spotifyTrackName}
                  spotifyArtistName={msg.spotifyArtistName}
                  spotifyAlbumArt={msg.spotifyAlbumArt}
                  createdAt={msg.createdAt}
                  rotation={randomRot}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-20 text-center flex flex-col items-center"
      >
        {/* Main Title with 3D Effect and BOOM Entrance Animation */}
        <div className="relative mb-6">
          {/* Floating Hearts integrated with title */}
          <FloatingHeart x={-30} y={10} size={18} delay={0} color="#FF6B9D" />
          <FloatingHeart x={-15} y={50} size={14} delay={0.3} color="#FF9EAA" />
          <FloatingHeart x={200} y={5} size={20} delay={0.5} color="#FF6B9D" />
          <FloatingHeart x={220} y={60} size={12} delay={0.2} color="#F472B6" />
          <FloatingHeart x={100} y={-15} size={16} delay={0.7} color="#FF9EAA" />
          <FloatingHeart x={180} y={110} size={14} delay={0.4} color="#FF6B9D" />
          <FloatingHeart x={-20} y={100} size={16} delay={0.6} color="#F472B6" />

          <motion.h1
            className="font-display text-5xl md:text-7xl text-white text-outline-3d tracking-wide relative z-10"
            initial={{ opacity: 0, scale: 3, y: -50 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.02, 1], 
              y: 0, 
              rotate: [-2, 2, -2] 
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { 
                duration: 0.6, 
                type: "spring", 
                bounce: 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              },
              y: { duration: 0.6, type: "spring", bounce: 0.4 },
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            }}
          >
            2-1&apos;s
          </motion.h1>
          <motion.h1
            className="font-display text-5xl md:text-7xl text-white text-outline-3d tracking-wide -mt-2 md:-mt-4 relative z-20 flex items-center justify-center gap-1"
            initial={{ opacity: 0, scale: 3 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.02, 1], 
              rotate: [2, -2, 2] 
            }}
            transition={{
              opacity: { duration: 0.4, delay: 0.2 },
              scale: { 
                duration: 0.6, 
                type: "spring", 
                bounce: 0.3, 
                delay: 0.2,
                repeat: Infinity,
                repeatDelay: 3,
              },
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          >
            V
            <motion.span
              className="inline-block"
              animate={{ 
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Heart className="inline w-8 h-8 md:w-12 md:h-12 fill-pink-400 text-pink-400 drop-shadow-lg -mx-1" />
            </motion.span>
            lentine&apos;s
          </motion.h1>
          <motion.h1
            className="font-display text-5xl md:text-7xl text-white text-outline-3d tracking-wide -mt-2 md:-mt-4 relative z-30"
            initial={{ opacity: 0, scale: 3, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.02, 1], 
              y: 0, 
              rotate: [-1, 1, -1] 
            }}
            transition={{
              opacity: { duration: 0.4, delay: 0.4 },
              scale: { 
                duration: 0.6, 
                type: "spring", 
                bounce: 0.3, 
                delay: 0.4,
                repeat: Infinity,
                repeatDelay: 3,
              },
              y: { duration: 0.6, type: "spring", bounce: 0.4, delay: 0.4 },
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              },
            }}
          >
            Wall
          </motion.h1>

          {/* Decorative elements around title */}
          <Sparkle color="blue" size={40} className="-top-8 -right-8 z-30" />
          <Sparkle color="yellow" size={30} className="bottom-0 -left-8 z-30" />
        </div>

        <p className="font-handwriting text-2xl md:text-3xl text-gray-800 mb-12 max-w-md mx-auto bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm rotate-1 drop-shadow-md">
          Send a sweet note to someone special! <br />
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <button
            onClick={onSendMessage}
            className="glossy-btn px-8 py-4 rounded-full text-white font-display text-xl md:text-2xl flex items-center gap-3 group relative overflow-hidden"
          >
            <span className="relative z-10">Send a Message</span>
            <Heart className="fill-white w-6 h-6 animate-pulse" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            onClick={onViewWall}
            className="bg-white/80 hover:bg-white text-pink-500 border-2 border-pink-300 px-8 py-3 rounded-full font-display text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            View Wall <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Ka21nan Logo above footer */}
      <div className="absolute bottom-14 z-20">
        <Ka21nanLogo />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-800 font-bold text-sm z-20 drop-shadow-sm flex items-center gap-1 bg-white/60 px-3 py-1.5 rounded-full">
        Made by{" "}
        <a
          href="https://www.instagram.com/franzmatigasulo/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-pink-600 transition-colors"
        >
          <Image
            src="/Instagram_logo_2022.jpg"
            alt="Instagram"
            width={16}
            height={16}
            className="rounded"
          />
          @franzmatigasulo
        </a>
        {" & "}
        <a
          href="https://www.instagram.com/svjr4k/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-pink-600 transition-colors"
        >
          <Image
            src="/Instagram_logo_2022.jpg"
            alt="Instagram"
            width={16}
            height={16}
            className="rounded"
          />
          @svjr4k
        </a>
      </div>
    </div>
  );
}
