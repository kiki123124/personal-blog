"use client";

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
    cursor?: boolean;
}

export function TypewriterText({ text, speed = 100, className, cursor = true }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, speed, text]);

    return (
        <span className={className}>
            {displayedText}
            {cursor && <span className="animate-pulse">_</span>}
        </span>
    );
}
