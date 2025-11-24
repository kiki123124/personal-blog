"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type VisualContextType = {
    isMono: boolean;
    toggleMono: () => void;
};

const VisualContext = createContext<VisualContextType | undefined>(undefined);

export function VisualProvider({ children }: { children: React.ReactNode }) {
    const [isMono, setIsMono] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("visual-mono");
        if (saved) {
            setIsMono(JSON.parse(saved));
        }
    }, []);

    const toggleMono = () => {
        setIsMono((prev) => {
            const next = !prev;
            localStorage.setItem("visual-mono", JSON.stringify(next));
            return next;
        });
    };

    // Prevent hydration mismatch by not rendering until mounted, 
    // or just accept that default is false. 
    // For visual toggles, it's better to wait or use a specific technique, 
    // but for now we'll just render children.

    return (
        <VisualContext.Provider value={{ isMono, toggleMono }}>
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
