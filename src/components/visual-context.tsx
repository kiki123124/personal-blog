"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type BackgroundMode = 'pixel' | 'rain' | 'matrix';

type VisualContextType = {
    isMono: boolean;
    toggleMono: () => void;
    isFrozen: boolean;
    toggleFrozen: () => void;
    backgroundMode: BackgroundMode;
    setBackgroundMode: (mode: BackgroundMode) => void;
};

const VisualContext = createContext<VisualContextType | undefined>(undefined);

export function VisualProvider({ children }: { children: React.ReactNode }) {
    const [isMono, setIsMono] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('pixel');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedMono = localStorage.getItem("visual-mono");
        if (savedMono) {
            setIsMono(JSON.parse(savedMono));
        }
        const savedFrozen = localStorage.getItem("visual-frozen");
        if (savedFrozen) {
            setIsFrozen(JSON.parse(savedFrozen));
        }
        const savedMode = localStorage.getItem("visual-mode");
        if (savedMode) {
            // Migrate old 'rain' boolean if needed, though 'visual-rain' was the key
            // If 'visual-rain' exists and is true, set to 'rain'
            const savedRain = localStorage.getItem("visual-rain");
            if (savedRain && JSON.parse(savedRain) === true) {
                setBackgroundMode('rain');
                localStorage.removeItem("visual-rain"); // Cleanup
            } else {
                setBackgroundMode(savedMode as BackgroundMode);
            }
        }
    }, []);

    const toggleMono = () => {
        setIsMono((prev) => {
            const next = !prev;
            localStorage.setItem("visual-mono", JSON.stringify(next));
            return next;
        });
    };

    const toggleFrozen = () => {
        setIsFrozen((prev) => {
            const next = !prev;
            localStorage.setItem("visual-frozen", JSON.stringify(next));
            return next;
        });
    };

    const handleSetBackgroundMode = (mode: BackgroundMode) => {
        setBackgroundMode(mode);
        localStorage.setItem("visual-mode", mode);
    };

    return (
        <VisualContext.Provider value={{
            isMono,
            toggleMono,
            isFrozen,
            toggleFrozen,
            backgroundMode,
            setBackgroundMode: handleSetBackgroundMode
        }}>
            {children}
        </VisualContext.Provider>
    );
}

export function useVisual() {
    const context = useContext(VisualContext);
    if (context === undefined) {
        throw new Error("useVisual must be used within a VisualProvider");
    }
    return context;
}
