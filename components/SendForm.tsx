"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Music,
  Heart,
  Palette,
  AlertTriangle,
} from "lucide-react";
import { Sparkle } from "./Sparkle";
import { SpotifySearch, SelectedTrack } from "./SpotifySearch";
import { NoteColor } from "@/lib/types";

interface SendFormProps {
  onCancel: () => void;
  onSubmit: (data: {
    to: string;
    from: string;
    message: string;
    color: NoteColor;
    spotifyTrackId?: string | null;
    spotifyTrackName?: string | null;
    spotifyArtistName?: string | null;
    spotifyAlbumArt?: string | null;
  }) => void;
  /** Pre-filled nickname from the visitor's session cookie */
  savedNickname?: string | null;
  /** Number of posts remaining before rate limit kicks in */
  rateLimitRemaining?: number | null;
}

const COLOR_OPTIONS: {
  value: NoteColor;
  label: string;
  cardClass: string;
  headerBg: string;
  ringColor: string;
  bubbleColor: string;
  checkColor: string;
}[] = [
  {
    value: "pink",
    label: "Pink",
    cardClass: "postit-pink",
    headerBg: "bg-gradient-to-r from-pink-400 to-rose-400",
    ringColor: "ring-pink-400",
    bubbleColor: "bg-pink-300",
    checkColor: "text-pink-600",
  },
  {
    value: "yellow",
    label: "Yellow",
    cardClass: "postit-yellow",
    headerBg: "bg-gradient-to-r from-amber-300 to-yellow-300",
    ringColor: "ring-amber-400",
    bubbleColor: "bg-amber-200",
    checkColor: "text-amber-600",
  },
  {
    value: "lavender",
    label: "Lavender",
    cardClass: "postit-lavender",
    headerBg: "bg-gradient-to-r from-purple-400 to-violet-400",
    ringColor: "ring-purple-400",
    bubbleColor: "bg-purple-200",
    checkColor: "text-purple-600",
  },
  {
    value: "blue",
    label: "Blue",
    cardClass: "postit-blue",
    headerBg: "bg-gradient-to-r from-sky-400 to-blue-400",
    ringColor: "ring-sky-400",
    bubbleColor: "bg-sky-200",
    checkColor: "text-sky-600",
  },
  {
    value: "green",
    label: "Green",
    cardClass: "postit-green",
    headerBg: "bg-gradient-to-r from-green-400 to-emerald-400",
    ringColor: "ring-green-400",
    bubbleColor: "bg-green-200",
    checkColor: "text-green-600",
  },
  {
    value: "red",
    label: "Red",
    cardClass: "postit-red",
    headerBg: "bg-gradient-to-r from-red-400 to-rose-500",
    ringColor: "ring-red-400",
    bubbleColor: "bg-red-200",
    checkColor: "text-red-600",
  },
];

export function SendForm({
  onCancel,
  onSubmit,
  savedNickname,
  rateLimitRemaining,
}: SendFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    to: "",
    from: savedNickname ?? "",
    message: "",
    color: "pink" as NoteColor,
  });
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      onSubmit({
        to: formData.to,
        from: formData.from,
        message: formData.message,
        color: formData.color,
        spotifyTrackId: selectedTrack?.id ?? null,
        spotifyTrackName: selectedTrack?.name ?? null,
        spotifyArtistName: selectedTrack?.artist ?? null,
        spotifyAlbumArt: selectedTrack?.albumArt ?? null,
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 =
    formData.to.trim().length > 0 && formData.from.trim().length > 0;
  const canProceedStep4 = formData.message.trim().length > 0;

  const isNextDisabled =
    (step === 1 && !canProceedStep1) ||
    (step === totalSteps && !canProceedStep4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden"
      >
        {/* Decorative Header */}
        <div className="bg-pink-100 p-4 border-b-2 border-pink-200 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="font-display text-pink-500 uppercase tracking-wider text-sm">
            New Message
          </div>
          <Heart size={16} className="text-pink-400 fill-pink-400" />
        </div>

        {/* Floating Sparkle Decoration */}
        <Sparkle color="yellow" size={32} className="-top-4 -right-4 z-20" />
        <Sparkle color="green" size={24} className="bottom-10 -left-6 z-20" />

        {/* Form Content */}
        <div className="p-8 min-h-[420px] flex flex-col relative">
          <AnimatePresence mode="wait">
            {/* ── Step 1: To / From ─────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                <h3 className="font-display text-3xl text-gray-800 text-center mb-2">
                  Who is this for?
                </h3>

                <div className="space-y-2">
                  <label className="font-bold text-gray-500 text-sm uppercase tracking-wide ml-1">
                    To:
                  </label>
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                    placeholder="Recipient's Name"
                    className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all font-bold text-lg text-gray-700 placeholder-blue-200"
                    autoFocus
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-500 text-sm uppercase tracking-wide ml-1">
                    From:
                  </label>
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                    placeholder="Your Nickname"
                    className="w-full bg-pink-50 border-2 border-pink-100 rounded-xl px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all font-bold text-lg text-gray-700 placeholder-pink-200"
                    maxLength={50}
                  />
                  {savedNickname && formData.from === savedNickname && (
                    <p className="text-xs text-pink-400 ml-1">
                      ✨ Welcome back, {savedNickname}!
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Spotify Song Search ──────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                <h3 className="font-display text-3xl text-gray-800 text-center mb-2">
                  Add a song? 🎵
                </h3>

                <div className="flex-1 flex flex-col justify-start items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                    <Music size={32} className="text-green-500" />
                  </div>

                  <p className="text-sm text-center text-gray-500">
                    Search for a song that reminds you of them.
                    <br />
                    <span className="text-xs text-gray-400">
                      This is optional — skip ahead if you like!
                    </span>
                  </p>

                  <SpotifySearch
                    onSelect={setSelectedTrack}
                    selectedTrack={selectedTrack}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Choose Color ─────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                <h3 className="font-display text-3xl text-gray-800 text-center mb-2">
                  Pick a color
                </h3>

                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
                    <Palette size={32} className="text-purple-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 justify-center">
                    {COLOR_OPTIONS.map((opt) => {
                      const isSelected = formData.color === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, color: opt.value })
                          }
                          className={`relative w-20 h-24 rounded-2xl overflow-hidden transition-all transform-gpu ${opt.cardClass} ${
                            isSelected
                              ? `ring-4 ${opt.ringColor} scale-110`
                              : "hover:scale-105 opacity-75 hover:opacity-100"
                          }`}
                        >
                          {/* Mini header strip */}
                          <div
                            className={`${opt.headerBg} h-5 flex items-center justify-center`}
                          >
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                              <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
                            </div>
                          </div>
                          {/* Glossy overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)",
                            }}
                          />
                          {/* Bubble accents */}
                          <div
                            className={`absolute w-8 h-8 rounded-full ${opt.bubbleColor} opacity-15 -bottom-1 -right-1`}
                          />
                          <div
                            className={`absolute w-5 h-5 rounded-full ${opt.bubbleColor} opacity-10 top-7 left-1`}
                          />
                          {/* Check / Label */}
                          <div className="flex flex-col items-center justify-center h-[calc(100%-1.25rem)] gap-1">
                            {isSelected ? (
                              <Check
                                size={22}
                                className={opt.checkColor}
                                strokeWidth={3}
                              />
                            ) : null}
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? opt.checkColor : "text-gray-400"}`}
                            >
                              {opt.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Your note will appear in{" "}
                    <span className="font-bold capitalize">
                      {formData.color}
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Message ──────────────────────────── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col h-full"
              >
                <h3 className="font-display text-3xl text-gray-800 text-center mb-4">
                  Your Message
                </h3>

                <div className="flex-1 relative">
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Write something sweet..."
                    className="w-full h-full min-h-[200px] bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all font-handwriting text-2xl leading-relaxed resize-none placeholder-yellow-300/50"
                    maxLength={500}
                    autoFocus
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded-md">
                    {formData.message.length}/500
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation ────────────────────────────────── */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold transition-colors"
            >
              <ArrowLeft size={20} />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {/* Step Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    s === step
                      ? "bg-pink-400"
                      : s < step
                        ? "bg-pink-200"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={step === totalSteps ? handleSubmit : handleNext}
              disabled={isNextDisabled || isSubmitting}
              className={`
                glossy-btn-pink px-6 py-2 rounded-full text-white font-bold flex items-center gap-2 transition-opacity
                ${isNextDisabled || isSubmitting ? "opacity-50 cursor-not-allowed grayscale" : ""}
              `}
            >
              {isSubmitting ? (
                "Sending..."
              ) : step === totalSteps ? (
                <>
                  Pin It! <Check size={18} />
                </>
              ) : (
                <>
                  Next <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Rate limit warning */}
          {rateLimitRemaining !== null &&
            rateLimitRemaining !== undefined &&
            rateLimitRemaining <= 3 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span>
                  {rateLimitRemaining === 0
                    ? "You've reached the posting limit. Please wait a few minutes."
                    : `${rateLimitRemaining} note${rateLimitRemaining === 1 ? "" : "s"} remaining before cooldown.`}
                </span>
              </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}
