"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "./LandingPage";
import { WallView } from "./WallView";
import { SendForm } from "./SendForm";
import { PostItData, Message, messageToPostIt } from "@/lib/types";
import { createClient } from "@/lib/supabase";

type View = "landing" | "wall";

interface ValentineAppProps {
  initialMessages: PostItData[];
  visitorId: string | null;
  savedNickname: string | null;
}

export function ValentineApp({
  initialMessages,
  visitorId: initialVisitorId,
  savedNickname,
}: ValentineAppProps) {
  const [view, setView] = useState<View>("landing");
  const [isWriting, setIsWriting] = useState(false);
  const [messages, setMessages] = useState<PostItData[]>(initialMessages);
  const [visitorId, setVisitorId] = useState<string | null>(initialVisitorId);
  const [nickname, setNickname] = useState<string | null>(savedNickname);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(
    null,
  );

  // Ini session
  useEffect(() => {
    if (!visitorId) {
      fetch("/api/session")
        .then((res) => res.json())
        .then((data) => {
          if (data.visitorId) {
            setVisitorId(data.visitorId);
            if (data.nickname) {
              setNickname(data.nickname);
            }
            if (data.rateLimit) {
              setRateLimitRemaining(data.rateLimit.remaining);
            }

            setMessages((prev) =>
              prev.map((msg) => ({
                ...msg,
                isOwn:
                  !!data.visitorId &&
                  !!msg.visitorId &&
                  msg.visitorId === data.visitorId,
              })),
            );
          }
        })
        .catch((err) => {
          console.error("Failed to initialize session:", err);
        });
    }
  }, [visitorId]);

  // DO NOT TOUCH SUPABASE
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null =
      null;

    try {
      const supabase = createClient();

      channel = supabase
        .channel("messages-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMessage = messageToPostIt(
              payload.new as Message,
              visitorId,
            );
            setMessages((prev) => {
              // Avoid duplicates (in case we already added it optimistically)
              if (prev.some((m) => m.id === newMessage.id)) {
                return prev;
              }
              return [newMessage, ...prev];
            });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const deletedId = (payload.old as { id: string }).id;
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          },
        )
        .subscribe();
    } catch {}

    return () => {
      if (channel) {
        try {
          const supabase = createClient();
          supabase.removeChannel(channel);
        } catch {}
      }
    };
  }, [visitorId]);

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      if (deletingIds.has(messageId)) return;

      // deleting msg
      setDeletingIds((prev) => new Set(prev).add(messageId));

      try {
        const res = await fetch(`/api/messages?id=${messageId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // local state
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        } else {
          const data = await res.json().catch(() => ({}));
          const errorMsg =
            data.error || "Failed to delete message. Please try again.";
          console.error("Delete failed:", errorMsg);
          alert(errorMsg);
        }
      } catch (err) {
        console.error("Error deleting message:", err);
        alert("Something went wrong. Please try again.");
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });
      }
    },
    [deletingIds],
  );

  const handleSendMessage = useCallback(
    async (data: {
      to: string;
      from: string;
      message: string;
      color: "pink" | "yellow" | "lavender";
      spotifyTrackId?: string | null;
      spotifyTrackName?: string | null;
      spotifyArtistName?: string | null;
      spotifyAlbumArt?: string | null;
    }) => {
      setIsWriting(false);
      setView("wall");
      setNickname(data.from);

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: data.message,
            from_name: data.from,
            to_name: data.to || null,
            color: data.color,
            spotify_track_id: data.spotifyTrackId ?? null,
            spotify_track_name: data.spotifyTrackName ?? null,
            spotify_artist_name: data.spotifyArtistName ?? null,
            spotify_album_art: data.spotifyAlbumArt ?? null,
          }),
        });

        if (res.ok) {
          const responseData = await res.json();
          const savedMessage = responseData.message;

          if (responseData.rateLimit) {
            setRateLimitRemaining(responseData.rateLimit.remaining);
          }

          const newPost = messageToPostIt(savedMessage as Message, visitorId);
          setMessages((prev) => [newPost, ...prev]);
        } else if (res.status === 429) {
          const errorData = await res.json().catch(() => ({}));
          alert(
            errorData.error ||
              "You're posting too fast! Please wait a moment before trying again.",
          );
        } else {
          const errText = await res.text();
          console.error("Failed to save message:", errText);
          alert("Failed to save your note. Please try again.");
        }
      } catch (err) {
        console.error("Error saving message:", err);
        alert("Something went wrong. Please try again.");
      }
    },
    [visitorId],
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Halftone Pattern Overlay */}
      <div className="halftone-bg" />

      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative z-10"
          >
            <LandingPage
              onViewWall={() => setView("wall")}
              onSendMessage={() => setIsWriting(true)}
              sampleMessages={messages}
            />
          </motion.div>
        ) : (
          <motion.div
            key="wall"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative z-10"
          >
            <WallView
              messages={messages}
              onBack={() => setView("landing")}
              onNewMessage={() => setIsWriting(true)}
              onDeleteMessage={handleDeleteMessage}
              deletingIds={deletingIds}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      <AnimatePresence>
        {isWriting && (
          <SendForm
            onCancel={() => setIsWriting(false)}
            onSubmit={handleSendMessage}
            savedNickname={nickname}
            rateLimitRemaining={rateLimitRemaining}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
