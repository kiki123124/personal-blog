"use client";

import * as React from "react";
import { CloudRain } from "lucide-react";
import { useVisual } from "@/components/visual-context";

export function RainToggle() {
    const { backgroundMode, setBackgroundMode } = useVisual();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
    }

    const isRain = backgroundMode === 'rain';
    const toggleRain = () => {
        setBackgroundMode(isRain ? 'pixel' : 'rain');
    };

    return (
        <button
            onClick={toggleRain}
            className={`relative p-2 rounded-full transition-colors ${isRain ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
            aria-label="Toggle rain mode"
            title={isRain ? "关闭雨天模式" : "开启雨天模式"}
        >
            <CloudRain className={`h-[1.2rem] w-[1.2rem] transition-all ${isRain ? 'animate-pulse' : ''}`} />
        </button>
    );
}
