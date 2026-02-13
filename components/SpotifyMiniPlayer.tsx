"use client";

import React, { memo } from "react";

interface SpotifyMiniPlayerProps {
  trackId: string;
  trackName: string;
  artistName: string;
}

export const SpotifyMiniPlayer = memo(function SpotifyMiniPlayer({
  trackId,
  trackName,
  artistName,
}: SpotifyMiniPlayerProps) {
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

  return (
    <div className="mt-2 rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block"
        title={`Spotify player: ${trackName} by ${artistName}`}
      />
    </div>
  );
});
