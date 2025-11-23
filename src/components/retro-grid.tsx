"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function RetroGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = () => {
            if (!ctx) return;
            const width = canvas.width;
            const height = canvas.height;

            // Clear with a slight fade for trail effect (optional, but clean clear is better for grid)
            ctx.clearRect(0, 0, width, height);

            // Grid Settings
            const gridSize = 40;
            const speed = 0.5;
            const perspective = 300; // Perspective depth

            // Colors
            const isDark = document.documentElement.classList.contains("dark");
            const gridColor = isDark ? "rgba(0, 255, 128, 0.15)" : "rgba(0, 0, 0, 0.1)"; // Cyber Green / Black

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;

            // Vertical Lines (Perspective)
            // We draw lines radiating from a vanishing point
            const centerX = width / 2;
            const centerY = height / 2;

            // Moving Horizontal Lines (Floor/Ceiling effect)
            // We simulate movement by offsetting the y position based on time
            const offset = (time * speed) % gridSize;

            // Draw "Floor" Grid (Bottom half)
            ctx.beginPath();

            // Horizontal lines
            for (let y = centerY; y < height; y += gridSize * (y / centerY * 0.5)) { // Non-linear spacing for depth
                // Simple linear for now to avoid complex math issues, but let's try to make it look 3D
                // Actually, let's do a simple distorted plane
            }

            // Let's try a simpler "Digital Rain" / "Matrix Grid" style that is flatter but distorted
            // Like the ReactBits image: a curved grid

            const cols = Math.floor(width / gridSize) + 2;
            const rows = Math.floor(height / gridSize) + 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize - (time * 0.2) % gridSize;
                    const y = j * gridSize;

                    // Distortion
                    const dist = Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2));
                    const wave = Math.sin(dist * 0.002 - time * 0.005) * 20;

                    const xPos = x + wave;
                    const yPos = y + wave;

                    // Draw small crosses or dots instead of full lines for a "tech" feel
                    ctx.fillStyle = gridColor;
                    ctx.fillRect(xPos, yPos, 2, 2);
                }
            }

            // Let's do the "Curved Grid" lines
            ctx.beginPath();
            for (let i = 0; i <= width + gridSize; i += gridSize) {
                // Vertical lines with wave
                const xBase = i - (time * 10) % gridSize; // Move left

                ctx.moveTo(xBase, 0);
                for (let y = 0; y < height; y += 10) {
                    const dist = Math.abs(xBase - width / 2);
                    const x = xBase + Math.sin(y * 0.005 + time * 0.01) * (dist * 0.05);
                    ctx.lineTo(x, y);
                }
            }

            for (let j = 0; j <= height; j += gridSize) {
                // Horizontal lines
                ctx.moveTo(0, j);
                for (let x = 0; x < width; x += 10) {
                    const dist = Math.abs(j - height / 2);
                    const y = j + Math.sin(x * 0.005 + time * 0.01) * (dist * 0.05);
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            time++;
            animationFrameId = requestAnimationFrame(drawGrid);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        drawGrid();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none opacity-40"
        />
    );
}
