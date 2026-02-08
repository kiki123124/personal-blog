"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface MusicTrack {
    filename: string;
    title?: string;
    artist?: string;
    coverImage?: string;
}

interface MusicContextType {
    tracks: MusicTrack[];
    currentTrack: MusicTrack | null;
    isPlaying: boolean;
    activeIndex: number;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    playTrack: (index: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    togglePlayPause: () => void;
    loadTracks: (tracks: MusicTrack[]) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [tracks, setTracks] = useState<MusicTrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Load tracks from API on mount
    useEffect(() => {
        fetch('/api/music')
            .then((res) => res.json())
            .then((data) => setTracks(data))
            .catch((err) => console.error("Failed to load tracks", err));
    }, []);

    const playTrack = (index: number) => {
        if (index < 0 || index >= tracks.length) return;

        const track = tracks[index];
        if (currentTrack?.filename === track.filename) {
            // Same track - if not playing, start playing; if playing, do nothing (prevent restart)
            if (!isPlaying) {
                setIsPlaying(true);
                if (audioRef.current) {
                    audioRef.current.play();
                }
            }
            // If already playing, do nothing (prevent duplicate playback)
        } else {
            // New track
            setCurrentTrack(track);
            setActiveIndex(index);
            setIsPlaying(true);
        }
    };

    const nextTrack = () => {
        if (tracks.length === 0) return;
        const nextIndex = activeIndex < tracks.length - 1 ? activeIndex + 1 : 0;
        playTrack(nextIndex);
    };

    const prevTrack = () => {
        if (tracks.length === 0) return;
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : tracks.length - 1;
        playTrack(prevIndex);
    };

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const loadTracks = (newTracks: MusicTrack[]) => {
        setTracks(newTracks);
    };

    // Auto-play when currentTrack changes
    useEffect(() => {
        if (currentTrack && audioRef.current && isPlaying) {
            audioRef.current.play();
        }
    }, [currentTrack]);

    return (
        <MusicContext.Provider
            value={{
                tracks,
                currentTrack,
                isPlaying,
                activeIndex,
                audioRef,
                playTrack,
                nextTrack,
                prevTrack,
                togglePlayPause,
                loadTracks,
            }}
        >
            {children}
            {/* Global Audio Element */}
            {currentTrack && (
                <audio
                    ref={audioRef}
                    src={`/api/static/music/${currentTrack.filename}`}
                    onEnded={nextTrack}
                    className="hidden"
                />
            )}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
}
