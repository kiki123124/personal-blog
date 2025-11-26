import React from 'react';

const Controls = ({
    mode, setMode,
    color, setColor,
    speed, setSpeed,
    density, setDensity,
    glow, setGlow
}) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: 100,
            fontFamily: 'monospace',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            width: '220px'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Mode</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setMode('rain')}
                        style={{
                            flex: 1,
                            background: mode === 'rain' ? color : 'transparent',
                            color: mode === 'rain' ? '#000' : '#fff',
                            border: `1px solid ${color}`,
                            padding: '8px 0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold'
                        }}
                    >
                        RAIN
                    </button>
                    <button
                        onClick={() => setMode('matrix')}
                        style={{
                            flex: 1,
                            background: mode === 'matrix' ? color : 'transparent',
                            color: mode === 'matrix' ? '#000' : '#fff',
                            border: `1px solid ${color}`,
                            padding: '8px 0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold'
                        }}
                    >
                        MATRIX
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            height: '30px',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Speed: {speed}</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    style={{ width: '100%', accentColor: color }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Density: {density}</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: color }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                <input
                    type="checkbox"
                    id="glow-check"
                    checked={glow}
                    onChange={(e) => setGlow(e.target.checked)}
                    style={{ accentColor: color, width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="glow-check" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, cursor: 'pointer' }}>Glow Effect</label>
            </div>

            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '10px', opacity: 0.5 }}>
                Press 'H' to toggle UI
            </div>
        </div>
    );
};

export default Controls;
