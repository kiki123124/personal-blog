"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { Play, Pause, Music as MusicIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMusic } from '@/components/music-context';
import { getStaticUrl } from '@/lib/utils';

export default function MusicPage() {
    const { tracks, isPlaying, activeIndex, playTrack, nextTrack, prevTrack } = useMusic();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".vinyl-record",
            { scale: 0.8, opacity: 0, rotation: -180 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.2)" }
        );
        gsap.fromTo(".player-controls",
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
    }, { scope: containerRef });

    const activeTrack = activeIndex !== -1 ? tracks[activeIndex] : null;

    return (
        <div ref={containerRef} className="min-h-[80vh] flex items-center justify-center w-full">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Vinyl Record */}
                <div className="relative flex items-center justify-center aspect-square vinyl-record">
                    {/* Vinyl Disc */}
                    <div className={`relative w-full h-full rounded-full bg-black border-[12px] border-gray-900 shadow-2xl flex items-center justify-center overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                        {/* Grooves */}
                        <div className="absolute inset-0 rounded-full border-[40px] border-gray-800/50 opacity-50"></div>
                        <div className="absolute inset-0 rounded-full border-[80px] border-gray-800/30 opacity-30"></div>

                        {/* Cover Art */}
                        <div className="w-[65%] h-[65%] rounded-full overflow-hidden relative z-10 border-4 border-black">
                            {activeTrack?.coverImage ? (
                                <Image
                                    src={getStaticUrl(activeTrack.coverImage)}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                    sizes="400px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                    <MusicIcon size={64} className="opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Center Hole */}
                        <div className="absolute w-8 h-8 bg-black rounded-full z-20 border-2 border-gray-700"></div>
                    </div>

                    {/* Playing Status Badge */}
                    {isPlaying && (
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 shadow-lg z-30 animate-pulse">
                            <div className="flex gap-1 h-3 items-end">
                                <div className="w-1 bg-white animate-[bounce_1s_infinite] h-full"></div>
                                <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-2/3"></div>
                                <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-full"></div>
                            </div>
                            <span className="text-xs font-bold tracking-widest">PLAYING</span>
                        </div>
                    )}
                </div>

                {/* Right: Controls & List */}
                <div className="space-y-8 player-controls">
                    <div className="space-y-2">
                        <h2 className="text-sm font-bold text-primary tracking-widest uppercase">Now Playing</h2>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground leading-tight">
                            {activeTrack?.title || "Select a Track"}
                        </h1>
                        <p className="text-xl text-muted-foreground font-mono">
                            {activeTrack?.artist || "---"}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        <button onClick={prevTrack} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors group">
                            <Play className="rotate-180 fill-current text-foreground group-hover:text-primary transition-colors" size={24} />
                        </button>

                        <button onClick={() => activeTrack && playTrack(activeIndex)} className="p-6 rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            {isPlaying ? (
                                <Pause className="fill-current" size={32} />
                            ) : (
                                <Play className="fill-current ml-1" size={32} />
                            )}
                        </button>

                        <button onClick={nextTrack} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors group">
                            <Play className="fill-current text-foreground group-hover:text-primary transition-colors" size={24} />
                        </button>
                    </div>

                    {/* Track List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {tracks.map((track, index) => (
                            <div
                                key={track.filename}
                                onClick={() => playTrack(index)}
                                className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border ${activeIndex === index
                                    ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(0,255,128,0.1)]'
                                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-mono ${activeIndex === index ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3 className={`font-bold ${activeIndex === index ? 'text-primary' : 'text-foreground'}`}>
                                            {track.title || track.filename}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{track.artist || 'Unknown'}</p>
                                    </div>
                                </div>
                                {activeIndex === index && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-4">
                                        <div className="w-0.5 bg-primary animate-[bounce_1s_infinite] h-full"></div>
                                        <div className="w-0.5 bg-primary animate-[bounce_1.2s_infinite] h-2/3"></div>
                                        <div className="w-0.5 bg-primary animate-[bounce_0.8s_infinite] h-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
