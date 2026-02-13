"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostItNote } from "./PostItNote";
import { Sparkle } from "./Sparkle";
import { Heart, ArrowRight } from "lucide-react";
import { PostItData } from "@/lib/types";

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
        <div className="absolute top-[15%] left-[30%] w-4 h-4 rounded-full bg-pink-300/50" />
        <div className="absolute bottom-[30%] right-[25%] w-6 h-6 rounded-full bg-yellow-300/50" />
        <div className="absolute top-[60%] left-[15%] w-3 h-3 rounded-full bg-blue-300/50" />
      </div>

      {/* Background Message Strips */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-20 text-center flex flex-col items-center"
      >
        {/* Main Title with 3D Effect */}
        <div className="relative mb-6">
          <motion.h1
            className="font-display text-6xl md:text-8xl text-[#FF9EAA] text-outline-3d tracking-wide relative z-10"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Valentine&apos;s
          </motion.h1>
          <motion.h1
            className="font-display text-6xl md:text-8xl text-white text-outline-3d tracking-wide -mt-4 md:-mt-8 relative z-20"
            animate={{ rotate: [2, -2, 2] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            Wall
          </motion.h1>

          {/* Decorative elements around title */}
          <Sparkle color="yellow" size={40} className="-top-8 -right-8 z-30" />
          <Sparkle color="green" size={30} className="bottom-0 -left-8 z-30" />
        </div>

        <p className="font-handwriting text-2xl md:text-3xl text-gray-700 mb-12 max-w-md mx-auto bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm rotate-1">
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
            className="bg-white/80 hover:bg-white text-blue-500 border-2 border-blue-300 px-8 py-3 rounded-full font-display text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            View Wall <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/80 font-bold text-sm z-20 drop-shadow-md">
        Made by @franzmatigasulo & @svjr4k
      </div>
    </div>
  );
}
