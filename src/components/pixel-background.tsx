"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useVisual } from "@/components/visual-context";

export default function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const { isMono } = useVisual();
    const mouseRef = useRef({ x: 0, y: 0 });
    const randomPixelsRef = useRef<Set<string>>(new Set());
    const lastRandomUpdateRef = useRef(0);
    const seedRef = useRef(Math.random() * 1000);
    const mountTimeRef = useRef(0);
    const shapeTypeRef = useRef<'circle' | 'heart' | 'dog' | 'alien' | 'finger' | 'ghost' | 'smile'>('circle');

    // Simple pixel art shapes (1 = pixel, 0 = empty)
    const SHAPES = {
        heart: [
            "011000110",
            "111101111",
            "111111111",
            "111111111",
            "011111110",
            "001111100",
            "000111000",
            "000010000"
        ],
        dog: [
            "1000001",
            "1100011",
            "1111111",
            "1101011", // Eyes
            "1111111",
            "0111110",
            "0011100"
        ],
        alien: [
            "001000100",
            "011111110",
            "110111011",
            "111111111",
            "111111111",
            "010111010",
            "001000100"
        ],
        finger: [
            "0001100",
            "0001100",
            "0011100",
            "0111110",
            "1111111",
            "1111111",
            "0111110"
        ],
        ghost: [
            "00111100",
            "01111110",
            "11111111",
            "11011011",
            "11111111",
            "11111111",
            "10100101"
        ],
        smile: [
            "00111100",
            "01000010",
            "10100101",
            "10000001",
            "10100101",
            "01011010",
            "00111100"
        ]
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        mountTimeRef.current = performance.now() / 1000;

        // Random shape selection
        const shapes = ['circle', 'heart', 'dog', 'alien', 'finger', 'ghost', 'smile'];
        shapeTypeRef.current = shapes[Math.floor(Math.random() * shapes.length)] as any;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Initial resize
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        });

        const blockSize = 40; // Balanced block size

        const draw = () => {
            time += 0.001; // Moderate speed
            const scrollY = window.scrollY;
            const now = performance.now() / 1000;
            const entranceDuration = 1.5;
            const timeSinceMount = now - mountTimeRef.current;

            // Update random pixels every 0.5s
            if (now - lastRandomUpdateRef.current > 0.5) {
                lastRandomUpdateRef.current = now;
                const newSet = new Set<string>();
                const cols = Math.ceil(canvas.width / blockSize);
                const rows = Math.ceil(canvas.height / blockSize);
                // Add 20 random pixels
                for (let k = 0; k < 20; k++) {
                    const ri = Math.floor(Math.random() * cols);
                    const rj = Math.floor(Math.random() * rows);
                    newSet.add(`${ri},${rj}`);
                }
                randomPixelsRef.current = newSet;
            }

            // Clear and fill background to prevent transparency issues with z-index -1
            ctx.fillStyle = theme === 'dark' ? '#000000' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / blockSize);
            const rows = Math.ceil(canvas.height / blockSize);

            // Center coordinates in grid units
            const centerCol = Math.floor(cols / 2);
            const centerRow = Math.floor(rows / 2);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * blockSize;
                    const y = j * blockSize;

                    // Calculate distance to center
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const distToCenter = Math.sqrt(
                        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                    );

                    // Calculate distance to mouse
                    const distToMouse = Math.sqrt(
                        Math.pow(x - mouseRef.current.x, 2) + Math.pow(y - mouseRef.current.y, 2)
                    );

                    // Organic Noise Calculation
                    // 1. Use seedRef for uniqueness on refresh
                    // 2. Use scrollY to modulate the phase/frequency, causing pixels to "morph" rather than slide
                    const seed = seedRef.current;
                    const scrollEffect = scrollY * 0.002;

                    // Complex organic noise function
                    // Multiplicative noise to avoid diagonals (Grid/Blob structure)
                    const n1 = Math.sin(i * 0.1 + time + seed + scrollEffect);
                    const n2 = Math.cos(j * 0.1 + time + seed - scrollEffect);

                    // Multiplicative interaction creates blobs/grid instead of diagonal waves
                    const noise = (n1 * n2) * 0.5 + 0.5; // Normalized roughly 0-1

                    let opacity = 0;

                    // 1. Center Shape Logic
                    let isShape = false;
                    if (shapeTypeRef.current !== 'circle') {
                        const shape = SHAPES[shapeTypeRef.current as keyof typeof SHAPES];
                        const shapeH = shape.length;
                        const shapeW = shape[0].length;
                        const startCol = centerCol - Math.floor(shapeW / 2);
                        const startRow = centerRow - Math.floor(shapeH / 2);

                        const localCol = i - startCol;
                        const localRow = j - startRow;

                        if (localCol >= 0 && localCol < shapeW && localRow >= 0 && localRow < shapeH) {
                            if (shape[localRow][localCol] === '1') {
                                opacity = 1.0;
                                isShape = true;
                            }
                        }
                    }

                    // Fallback to circle if not a shape pixel or if shape is circle
                    if (!isShape) {
                        if (shapeTypeRef.current === 'circle' && distToCenter < 100) {
                            opacity = 1.0;
                        } else if (distToCenter < 300) {
                            const fade = 1 - (distToCenter - 100) / 200;
                            opacity = fade * (0.3 + noise * 0.5);
                        }
                    }

                    // 2. Random Flickering
                    if (randomPixelsRef.current.has(`${i},${j}`)) {
                        opacity = Math.max(opacity, 0.8);
                    }

                    // 3. Organic Tiling (Scroll Density)
                    // Reduce density at the top (scrollY = 0)
                    const scrollDensity = Math.min((scrollY + 200) / 800, 1.0);

                    // Increased threshold significantly to 0.85 to reduce count
                    if (noise > 0.85) {
                        // Apply scroll density factor
                        const baseTiling = (noise - 0.85) * 3.0;
                        opacity = Math.max(opacity, baseTiling * scrollDensity);
                    }

                    // 4. Mouse Interaction (Eraser / Void)
                    // Create a blank space around the mouse
                    if (distToMouse < 100) {
                        const mouseRepel = Math.pow(distToMouse / 100, 2); // Smooth ease-in
                        opacity *= mouseRepel;
                    }

                    // 5. Entrance Animation (Staggered)
                    // Pixels further from center appear later? Or random?
                    // Let's do random staggered appearance
                    const staggerDelay = (Math.sin(i * j + seed) + 1) * 0.5; // 0-1
                    const pixelEntranceStart = staggerDelay * 0.5; // Start between 0s and 0.5s
                    const pixelProgress = Math.max(0, Math.min(1, (timeSinceMount - pixelEntranceStart) / 0.5));

                    opacity *= pixelProgress;

                    if (opacity > 0.05) {
                        if (isMono) {
                            // Monochrome Mode
                            // Use shades of gray based on theme
                            const baseColor = theme === 'dark' ? 255 : 0;
                            // Add slight variation based on noise
                            const variation = Math.floor(noise * 50);
                            const c = theme === 'dark' ? baseColor - variation : baseColor + variation;

                            // Lower opacity for cleaner look
                            ctx.fillStyle = `rgba(${c}, ${c}, ${c}, ${opacity * 0.3})`;
                        } else {
                            // Retro Color Palette (Cyberpunk/Arcade)
                            const RETRO_COLORS = [
                                '#FF0055', // Neon Red/Pink
                                '#00FF9F', // Neon Green
                                '#00B8FF', // Neon Blue
                                '#7000FF', // Neon Purple
                                '#FFBD00'  // Neon Yellow
                            ];

                            // Select color based on position and time (quantized)
                            // Use noise or position to pick an index
                            const colorIndex = Math.floor((i * 0.1 + j * 0.1 + time * 2 + scrollY * 0.01) % RETRO_COLORS.length);
                            const hex = RETRO_COLORS[Math.abs(colorIndex)];

                            // Convert hex to rgba for opacity
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);

                            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        }

                        const gap = 4;
                        ctx.fillRect(x + gap / 2, y + gap / 2, blockSize - gap, blockSize - gap);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, isMono]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                pointerEvents: "none",
            }}
        >
            <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
    );
}
