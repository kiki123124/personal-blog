"use client";

import { useVisual } from "@/components/visual-context";
import { Gauge } from "lucide-react";
import { useState } from "react";

export function SpeedControl() {
    const { effectSpeed, setEffectSpeed } = useVisual();
    const [isOpen, setIsOpen] = useState(false);

    const speeds = [
        { value: 0.5, label: "0.5x", name: "慢速" },
        { value: 1, label: "1x", name: "正常" },
        { value: 1.5, label: "1.5x", name: "快速" },
        { value: 2, label: "2x", name: "极快" },
    ];

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <div className="relative">
                {/* Speed Options */}
                {isOpen && (
                    <div className="absolute bottom-full mb-2 bg-background/80 backdrop-blur-xl border border-border rounded-xl p-2 shadow-2xl">
                        <div className="flex flex-col gap-1">
                            {speeds.map((speed) => (
                                <button
                                    key={speed.value}
                                    onClick={() => {
                                        setEffectSpeed(speed.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${effectSpeed === speed.value
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent text-foreground"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono">{speed.label}</span>
                                        <span className="text-xs opacity-70">{speed.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 rounded-full bg-background/40 backdrop-blur-md border border-border hover:bg-background/60 hover:border-primary/50 transition-all shadow-lg flex items-center justify-center group"
                    title="调整速度"
                >
                    <Gauge
                        size={20}
                        className="text-foreground group-hover:text-primary transition-colors"
                        style={{ transform: `rotate(${(effectSpeed - 0.5) * 90}deg)`, transition: "transform 0.3s ease" }}
                    />
                </button>
            </div>
        </div>
    );
}
