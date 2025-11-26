import React, { useRef, useEffect } from 'react';

const RainCanvas = ({ mode, color, speed, density, glow }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = []; // For Matrix mode
        const particles = []; // For Rain mode

        // Initialize Matrix drops
        // Density affects how many columns are active or spawn rate
        // For simplicity in Matrix mode, we'll use density to control spawn probability in the draw loop
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above screen
        }

        // Initialize Rain particles
        // Density maps to particle count (e.g., 50 to 500)
        const particleCount = Math.floor((density / 100) * 500) + 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseSpeed: Math.random() * 15 + 10, // Store base speed
                length: Math.random() * 20 + 10,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const alphabet = katakana + latin;

        // Speed multiplier (0.1 to 3.0)
        const speedMultiplier = (speed / 50) * 1.5;

        const drawMatrix = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color; // User defined color
            ctx.font = `${fontSize}px monospace`;

            if (glow) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = color;
            } else {
                ctx.shadowBlur = 0;
            }

            for (let i = 0; i < drops.length; i++) {
                // Density check for Matrix: skip some columns based on density
                // We'll use a simple modulus or random check to simulate density if needed, 
                // but standard Matrix rain usually fills columns. 
                // Let's use density to control "reset" probability to make it look denser or sparser

                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Only draw if density threshold is met (simple way to thin out columns)
                // But better is to just draw everything and let the reset logic handle density feel?
                // Actually, let's just draw. Matrix usually fills screen.

                ctx.fillText(text, x, y);

                // Sending the drop back to the top randomly after it has crossed the screen
                // Use density to control how likely it is to restart immediately
                // Higher density = higher restart probability
                const restartThreshold = 0.99 - ((density / 100) * 0.05);

                if (y * fontSize > canvas.height && Math.random() > restartThreshold) {
                    drops[i] = 0;
                }

                // Incrementing Y coordinate
                drops[i] += speedMultiplier;
            }
            ctx.shadowBlur = 0; // Reset
        };

        const drawRain = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add a slight glow effect
            if (glow) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y + p.length);
                ctx.globalAlpha = p.opacity;
                ctx.stroke();

                // Update position
                p.y += p.baseSpeed * speedMultiplier;

                // Reset if off screen
                if (p.y > canvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * canvas.width;
                    // Recalculate base speed for variety
                    p.baseSpeed = Math.random() * 15 + 10;
                }
            }
            // Reset global alpha and shadow for next frame
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        };

        const render = () => {
            if (mode === 'matrix') {
                drawMatrix();
            } else {
                drawRain();
            }
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode, color, speed, density, glow]);

    return <canvas ref={canvasRef} style={{ display: 'block', background: '#050505' }} />;
};

export default RainCanvas;
