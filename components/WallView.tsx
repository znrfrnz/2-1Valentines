"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostItNote } from "./PostItNote";
import { Sparkle } from "./Sparkle";
import { ArrowLeft, Plus } from "lucide-react";
import { PostItData } from "@/lib/types";

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
        <Sparkle color="pink" size={60} className="top-10 left-10 opacity-50" />
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
          color="green"
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
        <h2 className="font-display text-5xl text-white text-outline-3d inline-block transform -rotate-2">
          Love Wall
        </h2>
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
