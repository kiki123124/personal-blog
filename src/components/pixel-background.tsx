"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useVisual } from "@/components/visual-context";

export default function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const { isMono, backgroundMode, isFrozen, effectSpeed } = useVisual();
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

    const particlesRef = useRef<any[]>([]);
    const dropsRef = useRef<number[]>([]); // For Matrix drops

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

            // Re-init rain particles on resize
            if (backgroundMode === 'rain') {
                const density = 50; // Default density
                const particleCount = Math.floor((density / 100) * 500) + 50;
                particlesRef.current = [];
                for (let i = 0; i < particleCount; i++) {
                    particlesRef.current.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        baseSpeed: Math.random() * 15 + 10,
                        length: Math.random() * 20 + 10,
                        opacity: Math.random() * 0.5 + 0.1,
                    });
                }
            } else if (backgroundMode === 'matrix') {
                const fontSize = 14;
                const columns = Math.floor(canvas.width / fontSize);
                dropsRef.current = [];
                for (let i = 0; i < columns; i++) {
                    dropsRef.current[i] = Math.random() * -100; // Start above screen
                }
            }
        };

        // Initial resize
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        });

        const blockSize = 40; // Balanced block size

        // Matrix characters
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const alphabet = katakana + latin;

        const draw = () => {
            if (!isFrozen) {
                time += 0.001 * effectSpeed; // Apply speed multiplier
            }
            const scrollY = window.scrollY;
            const now = performance.now() / 1000;
            const timeSinceMount = now - mountTimeRef.current;

            // Common color logic for vibrant modes
            const getVibrantColor = (index: number) => {
                const RETRO_COLORS = [
                    '#FF0055', '#00FF9F', '#00B8FF', '#7000FF', '#FFBD00'
                ];
                const colorIndex = Math.floor((index * 0.1 + time * 2) % RETRO_COLORS.length);
                return RETRO_COLORS[Math.abs(colorIndex)];
            };

            if (backgroundMode === 'matrix') {
                // MATRIX MODE
                ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const fontSize = 14;
                ctx.font = `${fontSize}px monospace`;

                // Initialize drops if empty
                if (dropsRef.current.length === 0) {
                    const columns = Math.floor(canvas.width / fontSize);
                    for (let i = 0; i < columns; i++) {
                        dropsRef.current[i] = Math.random() * -100;
                    }
                }

                for (let i = 0; i < dropsRef.current.length; i++) {
                    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    const x = i * fontSize;
                    const y = dropsRef.current[i] * fontSize;

                    if (isMono) {
                        ctx.fillStyle = theme === 'dark' ? '#0f0' : '#000'; // Classic Green or Black
                    } else {
                        ctx.fillStyle = getVibrantColor(i);
                    }

                    ctx.fillText(text, x, y);

                    if (!isFrozen) {
                        if (y * fontSize > canvas.height && Math.random() > 0.975) {
                            dropsRef.current[i] = 0;
                        }
                        dropsRef.current[i] += effectSpeed; // Apply speed multiplier to matrix
                    }
                }

            } else if (backgroundMode === 'rain') {
                // RAIN MODE
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                let color = theme === 'dark' ? '#ffffff' : '#000000';

                // Initialize particles if empty
                if (particlesRef.current.length === 0) {
                    const density = 50;
                    const particleCount = Math.floor((density / 100) * 500) + 50;
                    for (let i = 0; i < particleCount; i++) {
                        particlesRef.current.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            baseSpeed: Math.random() * 15 + 10,
                            length: Math.random() * 20 + 10,
                            opacity: Math.random() * 0.5 + 0.1,
                        });
                    }
                }

                ctx.lineWidth = 1;
                ctx.lineCap = 'round';
                const speedMultiplier = 1.5 * effectSpeed; // Apply speed multiplier to rain

                for (let i = 0; i < particlesRef.current.length; i++) {
                    const p = particlesRef.current[i];

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);

                    if (isMono) {
                        ctx.strokeStyle = color;
                    } else {
                        // Use vibrant colors for rain too
                        ctx.strokeStyle = getVibrantColor(i);
                    }

                    ctx.globalAlpha = p.opacity;
                    ctx.stroke();

                    if (!isFrozen) {
                        p.y += p.baseSpeed * speedMultiplier;

                        if (p.y > canvas.height) {
                            p.y = -p.length;
                            p.x = Math.random() * canvas.width;
                            p.baseSpeed = Math.random() * 15 + 10;
                        }
                    }
                }
                ctx.globalAlpha = 1;

            } else if (backgroundMode === 'advanced') {
                // ADVANCED MODE - Kanye Aesthetic: Minimal, Sacred, Golden
                ctx.fillStyle = theme === 'dark' ? '#000000' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Initialize particles for advanced mode
                if (particlesRef.current.length === 0) {
                    const particleCount = 8; // Minimal count
                    for (let i = 0; i < particleCount; i++) {
                        particlesRef.current.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: (Math.random() - 0.5) * 0.5,
                            size: Math.random() * 40 + 60,
                            phase: Math.random() * Math.PI * 2,
                            type: Math.random() > 0.7 ? 'triangle' : 'circle'
                        });
                    }
                }

                // Draw sacred geometry with halos
                for (let i = 0; i < particlesRef.current.length; i++) {
                    const p = particlesRef.current[i];

                    // Breathing effect
                    const breathe = Math.sin(time * 0.5 + p.phase) * 0.1 + 1;
                    const currentSize = p.size * breathe;

                    // Golden glow color
                    const glowColor = isMono
                        ? (theme === 'dark' ? '255, 255, 255' : '0, 0, 0')
                        : '255, 215, 0'; // Gold #FFD700

                    // Draw multiple halos (神圣光晕)
                    for (let j = 4; j > 0; j--) {
                        const haloSize = currentSize * (1 + j * 0.3);
                        const haloOpacity = (0.15 / j) * (isMono ? 0.3 : 1);

                        const gradient = ctx.createRadialGradient(
                            p.x, p.y, 0,
                            p.x, p.y, haloSize
                        );
                        gradient.addColorStop(0, `rgba(${glowColor}, ${haloOpacity * 0.8})`);
                        gradient.addColorStop(0.5, `rgba(${glowColor}, ${haloOpacity * 0.3})`);
                        gradient.addColorStop(1, `rgba(${glowColor}, 0)`);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, haloSize, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Draw core shape
                    if (p.type === 'circle') {
                        // Circle with gradient
                        const coreGradient = ctx.createRadialGradient(
                            p.x, p.y, 0,
                            p.x, p.y, currentSize * 0.4
                        );
                        coreGradient.addColorStop(0, `rgba(${glowColor}, 0.6)`);
                        coreGradient.addColorStop(1, `rgba(${glowColor}, 0.1)`);

                        ctx.fillStyle = coreGradient;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, currentSize * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Triangle (equilateral)
                        ctx.fillStyle = `rgba(${glowColor}, 0.3)`;
                        ctx.beginPath();
                        const angle = time * 0.2 + p.phase;
                        for (let k = 0; k < 3; k++) {
                            const a = angle + (k * Math.PI * 2 / 3);
                            const px = p.x + Math.cos(a) * currentSize * 0.4;
                            const py = p.y + Math.sin(a) * currentSize * 0.4;
                            if (k === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.fill();
                    }

                    // Gentle mouse interaction
                    const dx = mouseRef.current.x - p.x;
                    const dy = mouseRef.current.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const force = (200 - dist) / 200 * 0.02;
                        p.x += dx * force * 0.1;
                        p.y += dy * force * 0.1;
                    }

                    // Slow elegant movement
                    if (!isFrozen) {
                        p.x += p.vx * effectSpeed;
                        p.y += p.vy * effectSpeed;

                        // Bounce off edges
                        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                        // Keep in bounds
                        p.x = Math.max(0, Math.min(canvas.width, p.x));
                        p.y = Math.max(0, Math.min(canvas.height, p.y));
                    }
                }

            } else {
                // PIXEL GRID MODE LOGIC
                if (particlesRef.current.length > 0) particlesRef.current = [];
                if (dropsRef.current.length > 0) dropsRef.current = [];

                // Update random pixels every 0.5s
                if (!isFrozen && now - lastRandomUpdateRef.current > 0.5 / effectSpeed) {
                    lastRandomUpdateRef.current = now;
                    const newSet = new Set<string>();
                    const cols = Math.ceil(canvas.width / blockSize);
                    const rows = Math.ceil(canvas.height / blockSize);
                    for (let k = 0; k < 20; k++) {
                        const ri = Math.floor(Math.random() * cols);
                        const rj = Math.floor(Math.random() * rows);
                        newSet.add(`${ri},${rj}`);
                    }
                    randomPixelsRef.current = newSet;
                }

                ctx.fillStyle = theme === 'dark' ? '#000000' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const cols = Math.ceil(canvas.width / blockSize);
                const rows = Math.ceil(canvas.height / blockSize);
                const centerCol = Math.floor(cols / 2);
                const centerRow = Math.floor(rows / 2);

                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = i * blockSize;
                        const y = j * blockSize;
                        const centerX = canvas.width / 2;
                        const centerY = canvas.height / 2;
                        const distToMouse = Math.sqrt(
                            Math.pow(x - mouseRef.current.x, 2) + Math.pow(y - mouseRef.current.y, 2)
                        );

                        const seed = seedRef.current;
                        const scrollEffect = scrollY * 0.002;
                        const n1 = Math.sin(i * 0.1 + time + seed + scrollEffect);
                        const n2 = Math.cos(j * 0.1 + time + seed - scrollEffect);
                        const noise = (n1 * n2) * 0.5 + 0.5;

                        let opacity = 0;

                        // 1. Center Shape Logic
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
                                }
                            }
                        }

                        // 2. Random Flickering
                        if (randomPixelsRef.current.has(`${i},${j}`)) {
                            opacity = Math.max(opacity, 0.8);
                        }

                        // 3. Organic Tiling
                        const scrollDensity = Math.min((scrollY + 200) / 800, 1.0);
                        if (noise > 0.85) {
                            const baseTiling = (noise - 0.85) * 3.0;
                            opacity = Math.max(opacity, baseTiling * scrollDensity);
                        }

                        // 4. Mouse Interaction
                        if (distToMouse < 100) {
                            const mouseRepel = Math.pow(distToMouse / 100, 2);
                            opacity *= mouseRepel;
                        }

                        // 5. Entrance Animation
                        const staggerDelay = (Math.sin(i * j + seed) + 1) * 0.5;
                        const pixelEntranceStart = staggerDelay * 0.5;
                        const pixelProgress = Math.max(0, Math.min(1, (timeSinceMount - pixelEntranceStart) / 0.5));
                        opacity *= pixelProgress;

                        if (opacity > 0.05) {
                            if (isMono) {
                                const baseColor = theme === 'dark' ? 255 : 0;
                                const variation = Math.floor(noise * 50);
                                const c = theme === 'dark' ? baseColor - variation : baseColor + variation;
                                ctx.fillStyle = `rgba(${c}, ${c}, ${c}, ${opacity * 0.3})`;
                            } else {
                                const hex = getVibrantColor(i + j);
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
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, isMono, backgroundMode, isFrozen, effectSpeed]);

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
