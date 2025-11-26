import React, { useState, useEffect } from 'react';
import RainCanvas from './components/RainCanvas';
import Controls from './components/Controls';

function App() {
  const [mode, setMode] = useState('rain'); // 'rain' or 'matrix'
  const [color, setColor] = useState('#0F0'); // Default green
  const [speed, setSpeed] = useState(50); // 1-100
  const [density, setDensity] = useState(50); // 1-100
  const [glow, setGlow] = useState(true);
  const [uiVisible, setUiVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setUiVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <RainCanvas
        mode={mode}
        color={color}
        speed={speed}
        density={density}
        glow={glow}
      />

      {uiVisible && (
        <>
          <Controls
            mode={mode} setMode={setMode}
            color={color} setColor={setColor}
            speed={speed} setSpeed={setSpeed}
            density={density} setDensity={setDensity}
            glow={glow} setGlow={setGlow}
          />

          {/* Overlay Title for aesthetic */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            color: color,
            fontFamily: 'monospace',
            pointerEvents: 'none',
            opacity: 0.8,
            textShadow: glow ? `0 0 10px ${color}` : 'none',
            transition: 'all 0.3s ease'
          }}>
            <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '2px' }}>
              {mode === 'rain' ? 'CYBER RAIN' : 'SYSTEM BREACH'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
              STATUS: {mode === 'rain' ? 'ATMOSPHERIC STABILIZED' : 'DATA STREAM ACTIVE'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
