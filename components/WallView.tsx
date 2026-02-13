"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostItNote } from "./PostItNote";
import { Sparkle } from "./Sparkle";
import { ArrowLeft, Plus, Heart } from "lucide-react";
import { PostItData } from "@/lib/types";

// Floating heart component for title decoration (same as LandingPage)
function FloatingHeart({
  delay = 0,
  x = 0,
  y = 0,
  size = 20,
  color = "#FF6B9D",
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
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 1],
        scale: [0, 1.2, 1, 1.1, 1],
        y: [0, -5, 0, -3, 0],
      }}
      transition={{
        delay: delay + 0.8,
        duration: 2,
        repeat: Infinity,
        repeatDelay: 0.5,
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
}

interface WallViewProps {
  messages: PostItData[];
  onBack: () => void;
  onNewMessage: () => void;
  onDeleteMessage?: (messageId: string) => void;
  deletingIds?: Set<string>;
}

export function WallView({
  messages,
  onBack,
  onNewMessage,
  onDeleteMessage,
  deletingIds = new Set(),
}: WallViewProps) {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 pb-24 overflow-x-hidden relative">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Sparkle
          color="white"
          size={60}
          className="top-10 left-10 opacity-50"
        />
        <Sparkle
          color="blue"
          size={40}
          className="top-20 right-20 opacity-50"
        />
        <Sparkle
          color="yellow"
          size={50}
          className="bottom-40 left-20 opacity-50"
        />
        <Sparkle
          color="blue"
          size={30}
          className="bottom-10 right-10 opacity-50"
        />
      </div>

      {/* Header / Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-display text-lg transition-all hover:scale-105 hover:rotate-[-2deg]"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={onNewMessage}
          className="pointer-events-auto glossy-btn px-6 py-2 rounded-full text-white shadow-lg flex items-center gap-2 font-display text-lg transition-all hover:scale-105 hover:rotate-[2deg]"
        >
          <Plus size={20} /> New Note
        </button>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mt-16 mb-12">
        <div className="relative inline-block">
          {/* Floating Hearts integrated with title */}
          <FloatingHeart x={-30} y={10} size={18} delay={0} color="#FF6B9D" />
          <FloatingHeart x={-15} y={50} size={14} delay={0.3} color="#FF9EAA" />
          <FloatingHeart x={200} y={5} size={20} delay={0.5} color="#FF6B9D" />
          <FloatingHeart x={220} y={60} size={12} delay={0.2} color="#F472B6" />
          <FloatingHeart
            x={100}
            y={-15}
            size={16}
            delay={0.7}
            color="#FF9EAA"
          />
          <FloatingHeart
            x={180}
            y={110}
            size={14}
            delay={0.4}
            color="#FF6B9D"
          />
          <FloatingHeart
            x={-20}
            y={100}
            size={16}
            delay={0.6}
            color="#F472B6"
          />

          <motion.h2
            className="font-display text-5xl md:text-7xl text-white text-outline-3d tracking-wide relative z-10"
            initial={{ opacity: 0, scale: 3, y: -50 }}
            animate={{
              opacity: 1,
              scale: [1, 1, 1.02, 1, 1.02, 1],
              y: 0,
              rotate: [-2, 2, -2],
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: {
                duration: 0.6,
                type: "spring",
                bounce: 0.3,
                times: [0, 0.5, 0.6, 0.7, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 0.5,
              },
              y: { duration: 0.6, type: "spring", bounce: 0.4 },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            }}
          >
            Dear
          </motion.h2>
          <motion.h2
            className="font-display text-5xl md:text-7xl text-white text-outline-3d tracking-wide -mt-2 md:-mt-4 relative z-20 flex items-center justify-center gap-1"
            initial={{ opacity: 0, scale: 3, y: 50 }}
            animate={{
              opacity: 1,
              scale: [1, 1, 1.02, 1, 1.02, 1],
              y: 0,
              rotate: [2, -2, 2],
            }}
            transition={{
              opacity: { duration: 0.4, delay: 0.2 },
              scale: {
                duration: 0.6,
                type: "spring",
                bounce: 0.3,
                delay: 0.2,
                times: [0, 0.5, 0.6, 0.7, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 0.5,
              },
              y: { duration: 0.6, type: "spring", bounce: 0.4, delay: 0.2 },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          >
            Y
            <motion.span
              className="inline-block"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Heart className="inline w-8 h-8 md:w-12 md:h-12 fill-pink-400 text-pink-400 drop-shadow-lg -mx-1" />
            </motion.span>
            u..
          </motion.h2>

          {/* Decorative sparkles around title */}
          <Sparkle color="blue" size={40} className="-top-8 -right-8 z-30" />
          <Sparkle color="yellow" size={30} className="bottom-0 -left-8 z-30" />
        </div>
      </div>

      {/* Masonry-ish Grid Layout */}
      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {messages.map((msg, index) => {
            // Deterministic rotation
            const rotation =
              (index % 2 === 0 ? 1 : -1) *
              ((msg.id.toString().charCodeAt(0) % 5) + 1);

            const isDeleting = deletingIds.has(msg.id);

            return (
              <motion.div
                key={msg.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 50 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                className={`w-full sm:w-auto flex justify-center ${
                  isDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
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
                  isOwn={msg.isOwn}
                  rotation={rotation}
                  onDelete={
                    msg.isOwn && onDeleteMessage
                      ? () => onDeleteMessage(msg.id)
                      : undefined
                  }
                  isDeleting={isDeleting}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center relative z-10">
          <p className="font-display text-3xl text-white text-outline-3d mb-4">
            The wall is empty...
          </p>
          <button
            onClick={onNewMessage}
            className="text-white font-handwriting text-4xl hover:scale-110 transition-transform drop-shadow-md"
          >
            Be the first to post!
          </button>
        </div>
      )}
    </div>
  );
}
