"use client";

import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostItData } from "@/lib/types";
import { SpotifyMiniPlayer } from "./SpotifyMiniPlayer";
import { Trash2, X, Check, Heart } from "lucide-react";

export interface PostItNoteProps extends Omit<PostItData, "createdAt"> {
  createdAt?: string;
  rotation?: number;
  scale?: number;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const PostItNote = memo(function PostItNote({
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

  // Deterministic bubble positions based on message content
  const bubbles = useMemo(() => {
    const seed = typeof message === "string" ? message.length : 0;
    return [
      {
        size: 40 + (seed % 30),
        x: 65 + (seed % 20),
        y: 15 + (seed % 25),
        opacity: 0.12,
      },
      {
        size: 20 + ((seed * 3) % 20),
        x: 10 + ((seed * 2) % 30),
        y: 55 + ((seed * 3) % 25),
        opacity: 0.1,
      },
      {
        size: 30 + ((seed * 7) % 25),
        x: 75 + ((seed * 5) % 15),
        y: 60 + ((seed * 2) % 20),
        opacity: 0.08,
      },
      {
        size: 15 + ((seed * 4) % 15),
        x: 25 + ((seed * 6) % 30),
        y: 20 + ((seed * 4) % 15),
        opacity: 0.1,
      },
      {
        size: 50 + ((seed * 2) % 20),
        x: 45 + ((seed * 3) % 20),
        y: 75 + ((seed * 5) % 15),
        opacity: 0.06,
      },
    ];
  }, [message]);

  // Color theme config
  const colorTheme = {
    pink: {
      card: "postit-pink",
      headerBg: "bg-gradient-to-r from-pink-400 to-rose-400",
      headerBorder: "border-pink-300",
      accentText: "text-pink-500",
      badgeBg: "bg-pink-500",
      bubbleColor: "bg-pink-300",
      sparkleColor: "text-pink-300",
      heartColor: "text-pink-400 fill-pink-400",
      dotColor: "bg-pink-300",
    },
    yellow: {
      card: "postit-yellow",
      headerBg: "bg-gradient-to-r from-amber-300 to-yellow-300",
      headerBorder: "border-yellow-300",
      accentText: "text-amber-600",
      badgeBg: "bg-amber-500",
      bubbleColor: "bg-amber-200",
      sparkleColor: "text-amber-300",
      heartColor: "text-amber-400 fill-amber-400",
      dotColor: "bg-amber-300",
    },
    lavender: {
      card: "postit-lavender",
      headerBg: "bg-gradient-to-r from-purple-400 to-violet-400",
      headerBorder: "border-purple-300",
      accentText: "text-purple-500",
      badgeBg: "bg-purple-500",
      bubbleColor: "bg-purple-200",
      sparkleColor: "text-purple-300",
      heartColor: "text-purple-400 fill-purple-400",
      dotColor: "bg-purple-300",
    },
    blue: {
      card: "postit-blue",
      headerBg: "bg-gradient-to-r from-sky-400 to-blue-400",
      headerBorder: "border-sky-300",
      accentText: "text-sky-500",
      badgeBg: "bg-sky-500",
      bubbleColor: "bg-sky-200",
      sparkleColor: "text-sky-300",
      heartColor: "text-sky-400 fill-sky-400",
      dotColor: "bg-sky-300",
    },
    green: {
      card: "postit-green",
      headerBg: "bg-gradient-to-r from-green-400 to-emerald-400",
      headerBorder: "border-green-300",
      accentText: "text-green-500",
      badgeBg: "bg-green-500",
      bubbleColor: "bg-green-200",
      sparkleColor: "text-green-300",
      heartColor: "text-green-400 fill-green-400",
      dotColor: "bg-green-300",
    },
    red: {
      card: "postit-red",
      headerBg: "bg-gradient-to-r from-red-400 to-rose-500",
      headerBorder: "border-red-300",
      accentText: "text-red-500",
      badgeBg: "bg-red-500",
      bubbleColor: "bg-red-200",
      sparkleColor: "text-red-300",
      heartColor: "text-red-400 fill-red-400",
      dotColor: "bg-red-300",
    },
  };

  const theme = colorTheme[color] ?? colorTheme.pink;

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
      style={{ willChange: "transform, opacity" }}
      className={`relative w-full max-w-[320px] transform-gpu rounded-2xl ${theme.card} group overflow-hidden`}
    >
      {/* ── Glossy Overlay ────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* ── Bubble Decorations ────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-[0]">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${theme.bubbleColor}`}
            style={{
              width: b.size,
              height: b.size,
              left: `${b.x}%`,
              top: `${b.y}%`,
              opacity: b.opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* ── Header Strip ──────────────────────────────── */}
      <div
        className={`relative z-[2] ${theme.headerBg} px-4 py-2.5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
        </div>
        {to ? (
          <span className="font-display text-white text-sm tracking-wide drop-shadow-sm truncate max-w-[180px]">
            To: {to}
          </span>
        ) : (
          <span className="font-display text-white/70 text-xs tracking-wider uppercase">
            Note
          </span>
        )}
        <Heart
          size={14}
          className="text-white/70 fill-white/40 flex-shrink-0"
        />
      </div>

      {/* ── Card Body ─────────────────────────────────── */}
      <div className="relative z-[2] p-5 flex flex-col gap-3">
        {/* Delete Button — only shown on own posts */}
        {isOwn && onDelete && !isDeleting && (
          <AnimatePresence>
            {!showConfirm ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-400 hover:bg-red-500 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Delete your note"
              >
                <Trash2 size={13} />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-2 right-2 z-40 flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1"
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
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 rounded-2xl backdrop-blur-sm">
            <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* "Your note" badge */}
        {isOwn && !isDeleting && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={`${theme.badgeBg} text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm leading-none`}
            >
              ✨ yours
            </div>
          </div>
        )}

        {/* ── Message Content ─────────────────────────── */}
        <div className="font-handwriting text-gray-800 flex flex-col gap-2 mt-1">
          <p className="text-xl leading-snug whitespace-pre-wrap break-words">
            {message}
          </p>

          {/* Spotify Mini Player */}
          {spotifyTrackId && spotifyTrackName && spotifyArtistName && (
            <div className="rounded-xl overflow-hidden -mx-1">
              <SpotifyMiniPlayer
                trackId={spotifyTrackId}
                trackName={spotifyTrackName}
                artistName={spotifyArtistName}
              />
            </div>
          )}
        </div>

        {/* ── Footer / From ───────────────────────────── */}
        {from && (
          <div
            className={`flex items-center justify-end gap-1.5 pt-2 border-t border-black/5 mt-1`}
          >
            <Heart size={12} className={theme.heartColor} />
            <span
              className={`font-handwriting text-base ${theme.accentText} italic`}
            >
              {from}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom Sparkle Accent ─────────────────────── */}
      <div className="absolute bottom-2 left-3 z-[2] pointer-events-none opacity-40">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={theme.sparkleColor}
        >
          <path
            d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="absolute bottom-5 left-7 z-[2] pointer-events-none opacity-25">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          className={theme.sparkleColor}
        >
          <path
            d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </motion.div>
  );
});
