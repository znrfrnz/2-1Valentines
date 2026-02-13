"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostItData } from "@/lib/types";
import { SpotifyMiniPlayer } from "./SpotifyMiniPlayer";
import { Trash2, X, Check } from "lucide-react";

export interface PostItNoteProps extends Omit<PostItData, "createdAt"> {
  createdAt?: string;
  rotation?: number;
  scale?: number;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function PostItNote({
  message,
  from,
  to,
  color = "pink",
  rotation = 0,
  scale = 1,
  spotifyTrackId,
  spotifyTrackName,
  spotifyArtistName,
  spotifyAlbumArt,
  isOwn,
  onDelete,
  isDeleting,
}: PostItNoteProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Random tape color based on message length
  const tapeColors = [
    "bg-pink-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
  ];
  const tapeColor =
    tapeColors[
      Math.abs(typeof message === "string" ? message.length : 0) %
        tapeColors.length
    ];

  // Color variant classes
  const colorClasses: Record<string, string> = {
    pink: "postit-pink",
    yellow: "postit-yellow",
    lavender: "postit-lavender",
  };

  const bgClass = colorClasses[color] ?? colorClasses.pink;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
    onDelete?.();
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
      animate={{
        opacity: isDeleting ? 0.5 : 1,
        scale: isDeleting ? scale * 0.95 : scale,
        rotate: rotation,
      }}
      whileHover={{ scale: scale * 1.05, rotate: rotation, zIndex: 50 }}
      className={`relative p-4 shadow-md border w-full max-w-[320px] transform-gpu rounded-sm ${bgClass} group`}
    >
      {/* Washi Tape Effect */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 ${tapeColor} opacity-80 rotate-[-2deg] shadow-sm rounded-[1px]`}
      />

      {/* Delete Button — only shown on own posts */}
      {isOwn && onDelete && !isDeleting && (
        <AnimatePresence>
          {!showConfirm ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleDeleteClick}
              className="absolute -top-2 -right-2 z-30 w-6 h-6 rounded-full bg-red-400 hover:bg-red-500 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Delete your note"
            >
              <Trash2 size={12} />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-bold text-gray-600 px-1 whitespace-nowrap">
                Delete?
              </span>
              <button
                onClick={handleConfirmDelete}
                className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                title="Confirm delete"
              >
                <Check size={10} />
              </button>
              <button
                onClick={handleCancelDelete}
                className="w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-700 flex items-center justify-center transition-colors"
                title="Cancel"
              >
                <X size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Deleting spinner overlay */}
      {isDeleting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 rounded-sm">
          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* "Your note" badge */}
      {isOwn && !isDeleting && (
        <div className="absolute -top-1 -left-1 z-10">
          <div className="bg-pink-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-sm leading-none">
            yours
          </div>
        </div>
      )}

      {/* Content */}
      <div className="font-handwriting text-gray-800 flex flex-col gap-2">
        {to && (
          <div className="text-lg font-bold text-gray-900 leading-none">
            To: {to}
          </div>
        )}

        <p className="text-xl leading-snug whitespace-pre-wrap break-words">
          {message}
        </p>

        {/* Spotify Mini Player */}
        {spotifyTrackId && spotifyTrackName && spotifyArtistName && (
          <SpotifyMiniPlayer
            trackId={spotifyTrackId}
            trackName={spotifyTrackName}
            artistName={spotifyArtistName}
          />
        )}

        {from && (
          <div className="text-right text-base text-gray-500 mt-1">
            - {from}
          </div>
        )}
      </div>
    </motion.div>
  );
}
