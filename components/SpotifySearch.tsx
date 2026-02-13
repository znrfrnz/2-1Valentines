"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Music, X, Loader2 } from "lucide-react";
import Image from "next/image";

export interface SelectedTrack {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
}

interface SpotifySearchProps {
  onSelect: (track: SelectedTrack | null) => void;
  selectedTrack: SelectedTrack | null;
}

interface TrackResult {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifySearch({ onSelect, selectedTrack }: SpotifySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TrackResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchTracks = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        limit: "5",
      });

      const res = await fetch(`/api/spotify/search?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Search failed");
      }

      const data = await res.json();
      setResults(data.tracks ?? []);
    } catch (err) {
      console.error("Spotify search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchTracks(query);
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchTracks]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (track: TrackResult) => {
    onSelect({
      id: track.id,
      name: track.name,
      artist: track.artist,
      albumName: track.albumName,
      albumArt: track.albumArt,
      previewUrl: track.previewUrl,
      spotifyUrl: track.spotifyUrl,
    });
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
    setResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const showDropdown = isFocused && (results.length > 0 || isLoading || error);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Selected Track Display */}
      {selectedTrack ? (
        <div className="song-result selected group">
          {selectedTrack.albumArt ? (
            <Image
              src={selectedTrack.albumArt}
              alt={selectedTrack.albumName}
              width={48}
              height={48}
              className="rounded shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
              <Music size={20} className="text-green-500" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-800 truncate">
              {selectedTrack.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {selectedTrack.artist}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="Remove song"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-green-500" />
              ) : (
                <Search size={18} />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search for a song..."
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all text-gray-700 placeholder-gray-300"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border-2 border-gray-100 z-50 max-h-[280px] overflow-y-auto">
              {error && (
                <div className="p-4 text-center text-red-500 text-sm">
                  <p>{error}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Make sure your Spotify API keys are configured.
                  </p>
                </div>
              )}

              {isLoading && results.length === 0 && !error && (
                <div className="p-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Searching Spotify...
                </div>
              )}

              {results.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelect(track)}
                  className="song-result w-full text-left"
                >
                  {track.albumArt ? (
                    <Image
                      src={track.albumArt}
                      alt={track.albumName}
                      width={40}
                      height={40}
                      className="rounded shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Music size={16} className="text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">
                      {track.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {track.artist} · {track.albumName}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatDuration(track.durationMs)}
                  </span>
                </button>
              ))}

              {!isLoading &&
                !error &&
                results.length === 0 &&
                query.trim().length >= 2 && (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No songs found for &ldquo;{query}&rdquo;
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
