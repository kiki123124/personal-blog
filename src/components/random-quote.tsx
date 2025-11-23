"use client";

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
    "The best way to predict the future is to invent it.",
    "Code is poetry.",
    "Stay hungry, stay foolish.",
    "Simplicity is the ultimate sophistication.",
    "Digital gardens grow with love.",
    "Hello, World!",
    "It works on my machine.",
    "Make it work, make it right, make it fast.",
    "Reality is broken. Game designers can fix it.",
    "We dream in code."
];

export function RandomQuote() {
    const [quote, setQuote] = useState('');
    const [displayQuote, setDisplayQuote] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    useEffect(() => {
        if (!quote) return;

        let i = 0;
        const timer = setInterval(() => {
            if (i < quote.length) {
                setDisplayQuote(prev => prev + quote.charAt(i));
                i++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [quote]);

    return (
        <div className="flex flex-col items-center space-y-2 opacity-80 hover:opacity-100 transition-opacity group">
            <Quote size={24} className="text-primary mb-2 group-hover:rotate-12 transition-transform" />
            <p className="text-lg font-serif italic text-center max-w-md min-h-[3rem]">
                "{displayQuote}"
                <span className={`inline-block w-0.5 h-5 ml-1 bg-primary align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
            </p>
        </div>
    );
}
