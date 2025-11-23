"use client";

import { Renderer, Program, Mesh, Color, Triangle, Transform, Geometry } from 'ogl';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';
import './FaultyTerminal.css';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
uniform float uIsLight;

float time;

// Random / Noise functions
float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.5))) + 0.2; 
}

// Stepped noise for irregular blocky movement
float steppedNoise(vec2 p, float steps) {
    vec2 grid = floor(p * steps);
    return hash21(grid);
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  
  mat2 modify0 = rotate(time * 0.05);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify1 = rotate(time * 0.05);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

float digit(vec2 p){
    // Reduce grid density for larger pixels
    vec2 grid = uGridMul * 8.0; 
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    
    // Center and edges logic
    vec2 center = vec2(0.5 * iResolution.z, 0.5);
    float dist = distance(s, center);
    
    float intensity = 0.0;
    
    // Fixed center area (restored)
    float centerIntensity = 0.0;
    if (dist < 0.25) {
        centerIntensity = smoothstep(0.25, 0.05, dist);
    }

    // Organic noise animation across the whole screen
    vec2 q, r;
    vec2 flow = vec2(time * 0.05, time * 0.02);
    float noiseVal = pattern(s * 0.3 + flow, q, r);
    
    // Use noise to determine where pixels appear
    float threshold = 0.45;
    float tileIntensity = step(threshold, noiseVal);
    
    // Combine center and tile
    intensity = max(centerIntensity, tileIntensity);

    // Mouse interaction
    if(uUseMouse > 0.5){
        // Map mouse to same coordinate space as p (aspect corrected)
        vec2 mouseWorld = uMouse * vec2(iResolution.z, 1.0);
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = smoothstep(0.2, 0.0, distToMouse);
        intensity = max(intensity, mouseInfluence);
    }
    
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    
    p = fract(p);
    p *= uDigitSize;
    
    // Blocky shape
    float px = p.x;
    float py = p.y;
    
    // Simple square blocks
    float brightness = step(0.1, px) * step(px, 0.9) * step(0.1, py) * step(py, 0.9);
    
    return brightness * clamp(intensity, 0.0, 1.0);
}

float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look) {
    float y = look.y - mod(iTime * 0.1, 1.0);
    // Irregular displacement
    float d = sin(look.y * 5.0 + iTime) * 0.05;
    d += steppedNoise(look, 10.0) * 0.02;
    return d * onOff(4.0, 2.0, 0.8);
}

// Rainbow color palette
vec3 getNeonColor(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}



vec4 getColor(vec2 p){
    float bar = step(mod(p.y + time * 10.0, 1.0), 0.1) * 0.2 + 0.9;
    
    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float val = digit(p);
    
    // Return transparent background
    if (val < 0.01) return vec4(0.0);
    
    // Dynamic colors with smooth spatial variation
    float colorSeed = p.x * 0.3 + p.y * 0.3 + time * 0.15;
    vec3 neon = getNeonColor(colorSeed);
    
    // Boost saturation and brightness
    neon = pow(neon, vec3(0.7)) * 1.8;
    
    // Apply scanlines in dark mode only
    if (uIsLight < 0.5) {
        neon *= bar;
    }
    
    return vec4(neon, 1.0);
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;

    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    
    // Use aspect ratio to ensure full screen coverage
    vec2 p = uv * vec2(iResolution.z, 1.0);
    vec4 col = getColor(p);

    // Vignette
    vec2 vUv2 = vUv * (1.0 - vUv.yx);
    float vig = vUv2.x * vUv2.y * 15.0;
    vig = pow(vig, 0.15);
    col.rgb *= vig;

    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }
    
    col.rgb *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col.rgb += (rnd - 0.5) * (uDither * 0.003922);
    }

    gl_FragColor = col;
}
`;

function hexToRgb(hex: string) {
    let h = hex.replace('#', '').trim();
    if (h.length === 3)
        h = h
            .split('')
            .map(c => c + c)
            .join('');
    const num = parseInt(h, 16);
    return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

interface FaultyTerminalProps {
    scale?: number;
    gridMul?: [number, number];
    digitSize?: number;
    timeScale?: number;
    pause?: boolean;
    scanlineIntensity?: number;
    glitchAmount?: number;
    flickerAmount?: number;
    noiseAmp?: number;
    chromaticAberration?: number;
    dither?: number | boolean;
    curvature?: number;
    tint?: string;
    mouseReact?: boolean;
    mouseStrength?: number;
    dpr?: number;
    pageLoadAnimation?: boolean;
    brightness?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function FaultyTerminal({
    scale = 1,
    gridMul = [1.5, 1], // Default to larger pixels
    digitSize = 1.0, // Full block size
    timeScale = 0.05,
    pause = false,
    scanlineIntensity = 0.3,
    glitchAmount = 1,
    flickerAmount = 1,
    noiseAmp = 0,
    chromaticAberration = 0,
    dither = 0,
    curvature = 0.2,
    tint = '#ffffff',
    mouseReact = true,
    mouseStrength = 0.2,
    dpr = 1, // Default to 1 to avoid hydration mismatch, update in effect
    pageLoadAnimation = true,
    brightness = 1,
    className,
    style,
    ...rest
}: FaultyTerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const programRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
    const frozenTimeRef = useRef(0);
    const rafRef = useRef(0);
    const loadAnimationStartRef = useRef(0);
    const timeOffsetRef = useRef(Math.random() * 100);

    const { theme } = useTheme();
    const isLight = theme === 'light';

    const tintVec = useMemo(() => hexToRgb(tint), [tint]);

    const ditherValue = useMemo(() => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither), [dither]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Listen to window mouse events for full screen coverage
        const x = e.clientX / window.innerWidth;
        const y = 1 - e.clientY / window.innerHeight;
        mouseRef.current = { x, y };
    }, []);

    useEffect(() => {
        const ctn = containerRef.current;
        if (!ctn) return;

        // Use window.devicePixelRatio if available, otherwise default
        const actualDpr = Math.min(window.devicePixelRatio || 1, 2);

        const renderer = new Renderer({ alpha: true, dpr: actualDpr });
        rendererRef.current = renderer;
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: {
                    value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
                },
                uScale: { value: scale },
                uGridMul: { value: new Float32Array(gridMul) },
                uDigitSize: { value: digitSize },
                uScanlineIntensity: { value: scanlineIntensity },
                uGlitchAmount: { value: glitchAmount },
                uFlickerAmount: { value: flickerAmount },
                uNoiseAmp: { value: noiseAmp },
                uChromaticAberration: { value: chromaticAberration },
                uDither: { value: ditherValue },
                uCurvature: { value: curvature },
                uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
                uMouse: {
                    value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y])
                },
                uMouseStrength: { value: mouseStrength },
                uUseMouse: { value: mouseReact ? 1 : 0 },
                uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
                uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
                uBrightness: { value: brightness },
                uIsLight: { value: isLight ? 1 : 0 }
            }
        });
        programRef.current = program;

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            if (!ctn || !renderer) return;

            const width = ctn.offsetWidth;
            const height = ctn.offsetHeight;

            renderer.setSize(width, height);

            // Update uniforms
            program.uniforms.iResolution.value = new Color(
                gl.canvas.width,
                gl.canvas.height,
                gl.canvas.width / gl.canvas.height
            );
        }

        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(ctn);
        window.addEventListener('resize', resize);

        ctn.appendChild(gl.canvas);

        // Initial resize
        resize();
        requestAnimationFrame(resize);

        const update = (t: number) => {
            rafRef.current = requestAnimationFrame(update);

            if (!pause) {
                const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
                program.uniforms.iTime.value = elapsed;
                frozenTimeRef.current = elapsed;
            } else {
                program.uniforms.iTime.value = frozenTimeRef.current;
            }

            if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
                const animationDuration = 2000;
                const animationElapsed = t - loadAnimationStartRef.current;
                const progress = Math.min(animationElapsed / animationDuration, 1);
                program.uniforms.uPageLoadProgress.value = progress;
            }

            // Update isLight uniform
            program.uniforms.uIsLight.value = isLight ? 1 : 0;

            if (mouseReact) {
                const dampingFactor = 0.08;
                const smoothMouse = smoothMouseRef.current;
                const mouse = mouseRef.current;
                smoothMouse.x += (mouse.x - smoothMouse.x) * dampingFactor;
                smoothMouse.y += (mouse.y - smoothMouse.y) * dampingFactor;

                const mouseUniform = program.uniforms.uMouse.value;
                mouseUniform[0] = smoothMouse.x;
                mouseUniform[1] = smoothMouse.y;
            }

            // Manual render
            gl.clear(gl.COLOR_BUFFER_BIT);
            mesh.draw();
        };
        rafRef.current = requestAnimationFrame(update);

        if (mouseReact) window.addEventListener('mousemove', handleMouseMove as any);

        return () => {
            cancelAnimationFrame(rafRef.current);
            resizeObserver.disconnect();
            window.removeEventListener('resize', resize);
            if (mouseReact) window.removeEventListener('mousemove', handleMouseMove as any);
            if (gl.canvas.parentElement === ctn) ctn.removeChild(gl.canvas);
            loadAnimationStartRef.current = 0;
            timeOffsetRef.current = Math.random() * 100;
        };
    }, [
        dpr,
        pause,
        timeScale,
        scale,
        gridMul,
        digitSize,
        scanlineIntensity,
        glitchAmount,
        flickerAmount,
        noiseAmp,
        chromaticAberration,
        ditherValue,
        curvature,
        tintVec,
        mouseReact,
        mouseStrength,
        pageLoadAnimation,
        brightness,
        handleMouseMove,
        isLight // Add isLight dependency
    ]);

    return <div ref={containerRef} className={`faulty-terminal-container ${className || ''}`} style={style} {...rest} />;
}
