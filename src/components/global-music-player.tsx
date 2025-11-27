"use client";

import { useMusic } from "@/components/music-context";
import { Play, Pause, SkipForward, SkipBack, Music as MusicIcon, X } from "lucide-react";
import { useState } from "react";

export function GlobalMusicPlayer() {
    const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack } = useMusic();
    const [isMinimized, setIsMinimized] = useState(false);

    if (!currentTrack) return null;

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-24 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 backdrop-blur-md border border-primary/30 shadow-2xl flex items-center justify-center group hover:scale-105 transition-all"
                >
                    {currentTrack.coverImage ? (
                        <img
                            src={currentTrack.coverImage}
                            alt={currentTrack.title}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <MusicIcon size={24} className="text-primary" />
                    )}
                    {isPlaying && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-24 z-50 w-80">
            <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 items-end h-4">
                            <div className={`w-1 bg-primary ${isPlaying ? 'animate-[bounce_1s_infinite]' : ''} h-full`}></div>
                            <div className={`w-1 bg-primary ${isPlaying ? 'animate-[bounce_1.2s_infinite]' : ''} h-2/3`}></div>
                            <div className={`w-1 bg-primary ${isPlaying ? 'animate-[bounce_0.8s_infinite]' : ''} h-full`}></div>
                        </div>
                        <span className="text-xs font-bold text-primary tracking-wider">NOW PLAYING</span>
                    </div>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1 hover:bg-accent rounded-full transition-colors"
                    >
                        <X size={16} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Album Art & Info */}
                <div className="p-4 flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/30 ${isPlaying ? 'animate-pulse' : ''}`}>
                            {currentTrack.coverImage ? (
                                <img
                                    src={currentTrack.coverImage}
                                    alt={currentTrack.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                    <MusicIcon size={24} className="text-primary/50" />
                                </div>
                            )}
                        </div>
                        {isPlaying && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">
                            {currentTrack.title || currentTrack.filename}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {currentTrack.artist || "Unknown Artist"}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-4 pt-0 flex items-center justify-center gap-4">
                    <button
                        onClick={prevTrack}
                        className="p-2 hover:bg-accent rounded-full transition-all group"
                    >
                        <SkipBack size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        {isPlaying ? (
                            <Pause size={20} className="fill-current" />
                        ) : (
                            <Play size={20} className="fill-current ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={nextTrack}
                        className="p-2 hover:bg-accent rounded-full transition-all group"
                    >
                        <SkipForward size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}
