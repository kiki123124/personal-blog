"use client";

import { useVisual } from "@/components/visual-context";
import { Sparkles } from "lucide-react";

export function AdvancedToggle() {
    const { backgroundMode, setBackgroundMode } = useVisual();
    const isAdvanced = backgroundMode === 'advanced';

    return (
        <button
            onClick={() => setBackgroundMode(isAdvanced ? 'pixel' : 'advanced')}
            className={`w-12 h-12 rounded-full backdrop-blur-md border transition-all shadow-lg flex items-center justify-center group ${isAdvanced
                    ? "bg-gradient-to-br from-yellow-500/40 to-white/40 border-yellow-500/50"
                    : "bg-background/40 border-border hover:bg-background/60 hover:border-primary/50"
                }`}
            title={isAdvanced ? "退出高级模式" : "高级模式"}
        >
            <Sparkles
                size={20}
                className={`transition-all ${isAdvanced
                        ? "text-yellow-600 dark:text-yellow-300"
                        : "text-foreground group-hover:text-primary"
                    }`}
            />
        </button>
    );
}
