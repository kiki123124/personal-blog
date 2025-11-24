"use client";

import * as React from "react";
import { Palette, Droplets } from "lucide-react";
import { useVisual } from "@/components/visual-context";

export function MonoToggle() {
    const { isMono, toggleMono } = useVisual();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
    }

    return (
        <button
            onClick={toggleMono}
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle monochrome mode"
            title={isMono ? "开启彩色模式" : "开启黑白模式"}
        >
            {isMono ? (
                <Palette className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
                <Droplets className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
        </button>
    );
}
