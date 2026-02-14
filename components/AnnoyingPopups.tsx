"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const AD_IMAGES = ["/bingoplusad1.jpg", "/bingoplusad2.jpg", "/jiliad.jpg"];

// Random taglines for extra annoyance
const TAGLINES = [
  "CLAIM YOUR FREE GCASH FROM CARL CHACON NOW!!!",
  "CONGRATULATIONS! YOU WON FREE KISS FROM FRANZ!",
  "NUDE CHACON IN YOUR AREA",
  "1000 PESOS INSTANT CASH FROM DEAN BENE GOMEZ!!!",
  "CLICK NOW! FRANZ SPICY PICTURES",
  "USE CODE VINCENT420 FOR 1MILLION PESOS",
  "EXCLUSIVE VINCENT FEET PICS JUST FOR YOU!",
  "GET FRANZ LEAKED PICS HERE",
];

interface Popup {
  id: string;
  image: string;
  x: number;
  y: number;
  tagline: string;
  scale: number;
  rotation: number;
}

function getRandomPosition() {
  // Keep popups within visible area but random
  const x = Math.random() * (window.innerWidth - 350);
  const y = Math.random() * (window.innerHeight - 400);
  return { x: Math.max(10, x), y: Math.max(10, y) };
}

function createPopup(): Popup {
  const pos = getRandomPosition();
  return {
    id: Math.random().toString(36).substring(7),
    image: AD_IMAGES[Math.floor(Math.random() * AD_IMAGES.length)],
    x: pos.x,
    y: pos.y,
    tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
    scale: 0.8 + Math.random() * 0.4, // Random size between 0.8 and 1.2
    rotation: (Math.random() - 0.5) * 10, // Slight random rotation
  };
}

export function AnnoyingPopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [isActive, setIsActive] = useState(true); // Always active - push to prod on Feb 15!

  // Initialize popups when active
  useEffect(() => {
    if (!isActive) return;

    // Start with 2-3 popups
    const initialPopups = Array(2 + Math.floor(Math.random() * 2))
      .fill(null)
      .map(() => createPopup());
    setPopups(initialPopups);

    // Spawn new popup every 8-15 seconds
    const spawnInterval = setInterval(() => {
      setPopups((prev) => {
        if (prev.length < 6) {
          return [...prev, createPopup()];
        }
        return prev;
      });
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(spawnInterval);
  }, [isActive]);

  const handleClose = useCallback((id: string) => {
    // 40% chance closing spawns another popup (annoying!)
    if (Math.random() < 0.4) {
      setPopups((prev) => [
        ...prev.filter((p) => p.id !== id),
        createPopup(),
        createPopup(), // Spawn TWO as punishment
      ]);
    } else {
      setPopups((prev) => prev.filter((p) => p.id !== id));
      
      // Respawn after 3-8 seconds
      setTimeout(() => {
        setPopups((prev) => {
          if (prev.length < 4) {
            return [...prev, createPopup()];
          }
          return prev;
        });
      }, 3000 + Math.random() * 5000);
    }
  }, []);

  const handleFakeClose = useCallback((id: string) => {
    // Fake X button - spawns MORE popups!
    setPopups((prev) => [
      ...prev,
      createPopup(),
      createPopup(),
    ]);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: popup.scale, 
              opacity: 1,
              rotate: popup.rotation,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="popup-ad absolute pointer-events-auto"
            style={{ left: popup.x, top: popup.y }}
            drag
            dragMomentum={false}
          >
            {/* Fake X button that spawns more */}
            <button
              onClick={() => handleFakeClose(popup.id)}
              className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full z-10 hover:bg-red-600 shadow-lg"
              title="Close"
            >
              ✕
            </button>
            
            {/* Real X button (smaller, corner) */}
            <button
              onClick={() => handleClose(popup.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 text-white text-[10px] rounded-full z-10 hover:bg-gray-500 opacity-50"
            >
              ×
            </button>

            <div className="bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 p-1 rounded-lg shadow-2xl border-4 border-yellow-300">
              <div className="bg-black p-2 rounded">
                {/* Blinking header */}
                <div className="text-center mb-2">
                  <span className="blink-text text-yellow-400 font-bold text-sm">
                    ⚠️ {popup.tagline} ⚠️
                  </span>
                </div>
                
                {/* Ad image */}
                <div className="relative w-[280px] h-[200px] overflow-hidden rounded">
                  <Image
                    src={popup.image}
                    alt="Special Offer"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* CTA buttons */}
                <div className="mt-2 space-y-1">
                  <button 
                    onClick={() => handleFakeClose(popup.id)}
                    className="w-full py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded pulse-btn text-sm"
                  >
                    🎁 CLAIM NOW! 🎁
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleFakeClose(popup.id)}
                      className="flex-1 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      YES PLZ!
                    </button>
                    <button 
                      onClick={() => handleFakeClose(popup.id)}
                      className="flex-1 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>

                {/* Fake countdown */}
                <div className="text-center mt-2 text-red-500 text-xs font-bold">
                  ⏰ EXPIRES IN: 04:59 ⏰
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bottom banner ad - positioned above footer so "Made by" is visible */}
      {isActive && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 p-2 pointer-events-auto z-[9998] banner-scroll"
        >
          <div className="marquee-content text-white font-bold text-lg">
            🎰 BINGO PLUS - LIBRENG PERA!!! 🎰 JILI SLOTS - 999% WIN RATE!!! 💰 
            CLAIM YOUR FREE 1000 PESOS NOW!!! 🎁 LIMITED TIME OFFER!!! ⚡ 
            HOT NEW GAMES AVAILABLE!!! 🔥 INSTANT WITHDRAWAL!!! 💸
            🎰 BINGO PLUS - LIBRENG PERA!!! 🎰 JILI SLOTS - 999% WIN RATE!!! 💰 
            HOT BISAYA AVAILABLE!!! 🔥 INSTANT WITHDRAWAL!!! 💸
          </div>
        </motion.div>
      )}
    </div>
  );
}
