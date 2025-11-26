"use client";

import * as React from "react";
import { Palette, CloudRain, Terminal, Grid3X3, Moon, Sun, Monitor, Pause, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { useVisual, BackgroundMode } from "@/components/visual-context";
import { motion, AnimatePresence } from "framer-motion";

export function PaletteToggle() {
    const { setTheme, theme } = useTheme();
    const { isMono, toggleMono, backgroundMode, setBackgroundMode, isFrozen, toggleFrozen } = useVisual();
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const menuItems = [
        {
            id: 'matrix',
            label: '代码雨',
            icon: Terminal,
            active: backgroundMode === 'matrix',
            onClick: () => setBackgroundMode('matrix')
        },
        {
            id: 'rain',
            label: '下雨',
            icon: CloudRain,
            active: backgroundMode === 'rain',
            onClick: () => setBackgroundMode('rain')
        },
        {
            id: 'pixel',
            label: '像素',
            icon: Grid3X3,
            active: backgroundMode === 'pixel',
            onClick: () => setBackgroundMode('pixel')
        },
        {
            id: 'theme',
            label: theme === 'dark' ? '浅色' : '深色',
            icon: theme === 'dark' ? Sun : Moon,
            active: false,
            onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        },
        {
            id: 'mono',
            label: isMono ? '彩色' : '黑白',
            icon: Monitor,
            active: isMono,
            onClick: toggleMono
        },
        {
            id: 'freeze',
            label: isFrozen ? '播放' : '暂停',
            icon: isFrozen ? Play : Pause,
            active: isFrozen,
            onClick: toggleFrozen
        }
    ];

    return (
        <div
            className="relative flex items-center justify-center"
            ref={containerRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={`relative z-20 p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground rotate-90 scale-110' : 'hover:bg-accent hover:text-accent-foreground'}`}
                aria-label="Open palette"
            >
                <Palette className="h-[1.2rem] w-[1.2rem]" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {menuItems.map((item, index) => {
                            // Calculate position in a semi-circle below/around the button
                            // Total angle spread: 180 degrees (from -90 to 90 relative to bottom)
                            // Or full circle? Since it's in navbar, probably below is best.
                            // Let's do a fan out downwards.
                            const totalItems = menuItems.length;
                            const radius = 60; // Distance from center
                            // Spread from -70 to 70 degrees (0 is straight down)
                            const startAngle = -70;
                            const endAngle = 70;
                            const angleStep = (endAngle - startAngle) / (totalItems - 1);
                            const angle = startAngle + (index * angleStep);
                            const radian = (angle + 90) * (Math.PI / 180); // +90 to rotate so 0 is right, but we want 0 down. 
                            // Standard circle: 0 is right. 90 is down.
                            // We want angles around 90 degrees.
                            // Let's just use simple trig relative to 0 being down.
                            // x = sin(angle) * r
                            // y = cos(angle) * r

                            const x = Math.sin(angle * (Math.PI / 180)) * radius;
                            const y = Math.cos(angle * (Math.PI / 180)) * radius;

                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    animate={{ opacity: 1, x, y, scale: 1 }}
                                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                        delay: index * 0.05
                                    }}
                                    onClick={item.onClick}
                                    className={`absolute z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-border backdrop-blur-md transition-colors
                                        ${item.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }
                                    `}
                                    title={item.label}
                                >
                                    <item.icon className="h-4 w-4" />
                                </motion.button>
                            );
                        })}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
