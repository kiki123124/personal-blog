"use client";

import { useEffect, useRef, useState } from "react";
import { useScramble } from "use-scramble";

export function PersonalIntro() {
    const [index, setIndex] = useState(0);
    const roles = [
        "大三 地信学生 🌍",
        "前端 & Web3 爱好者 💻",
        "电影迷 🎬"
    ];

    const { ref, replay } = useScramble({
        text: roles[index],
        speed: 0.5,
        tick: 1,
        step: 1,
        scramble: 4,
        seed: 0,
        chance: 1,
        overdrive: false,
        overflow: true,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % roles.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [roles.length]);

    // Replay animation when index changes
    useEffect(() => {
        replay();
    }, [index, replay]);

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="text-xl md:text-2xl font-mono text-primary/80 h-8 flex items-center justify-center">
                <span className="mr-2 text-muted-foreground">{">"}</span>
                <span ref={ref} className="tracking-wider" />
                <span className="animate-pulse ml-1">_</span>
            </div>
            <div className="flex gap-2 mt-2">
                {roles.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-primary" : "w-2 bg-primary/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
