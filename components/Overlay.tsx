import React, { useState } from 'react';
import { useStore } from '../store';

const Overlay: React.FC = () => {
  const { 
    isAiReady, isHandDetected, isFaceDetected, isPinching,
    mode, treeColor, setTreeColor, particleCount, setParticleCount,
    animationSpeed, setAnimationSpeed, titleText, subtitleText,
    setTitleText, setSubtitleText, cursorPosition
  } = useStore();
  const [showControls, setShowControls] = useState(false);

  const colorPresets = [
      { name: 'Classic', value: '#2f5e41' }, { name: 'Icy', value: '#00ccff' },
      { name: 'Purple', value: '#9900ff' }, { name: 'Gold', value: '#ffaa00' },
      { name: 'Night', value: '#1a237e' }, { name: 'Ruby', value: '#b71c1c' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-8">
      
      {/* Hand Cursor - Z-50 */}
      {isHandDetected && (
        <div 
            className={`fixed w-8 h-8 rounded-full border-2 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-75 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${isPinching ? 'scale-75 bg-white/30 border-yellow-400' : 'scale-100'}`}
            style={{ left: `${cursorPosition.x * 100}%`, top: `${cursorPosition.y * 100}%` }}
        >
            <div className={`w-1 h-1 rounded-full ${isPinching ? 'bg-yellow-400' : 'bg-white'}`} />
        </div>
      )}

      {/* Header */}
      <header className="text-white flex justify-between items-start pointer-events-auto relative z-[60]">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            {titleText}
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-2 tracking-widest uppercase">
            {subtitleText}
            </p>
        </div>
        
        <button onClick={() => setShowControls(!showControls)} className="bg-black/50 backdrop-blur-md border border-white/20 p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
        </button>
      </header>

      {/* Control Panel - Z-[100] (Must be top) */}
      {showControls && (
          <div className="absolute top-24 right-4 md:right-8 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 pointer-events-auto transition-all animate-in slide-in-from-right space-y-6 max-h-[80vh] overflow-y-auto z-[100]">
              <div>
                <h3 className="text-white font-cinzel font-bold mb-4 border-b border-white/10 pb-2">Customization</h3>
                <div className="space-y-3">
                   <input type="text" value={titleText} onChange={(e) => setTitleText(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm" placeholder="Title" />
                   <input type="text" value={subtitleText} onChange={(e) => setSubtitleText(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm" placeholder="Subtitle" />
                </div>
                <div className="mt-4">
                    <label className="text-xs text-gray-400 block mb-2">Color</label>
                    <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((c) => (
                            <button key={c.value} onClick={() => setTreeColor(c.value)} className={`h-8 rounded-md border ${treeColor === c.value ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c.value }} />
                        ))}
                    </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-cinzel font-bold mb-4 border-b border-white/10 pb-2">Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Particles: {particleCount}</span>
                    <input type="range" min="5000" max="45000" step="1000" value={particleCount} onChange={(e) => setParticleCount(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg accent-green-500" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Speed: {animationSpeed}x</span>
                    <input type="range" min="0.5" max="5.0" step="0.1" value={animationSpeed} onChange={(e) => setAnimationSpeed(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg accent-blue-500" />
                  </div>
                </div>
              </div>
          </div>
      )}

      {/* Loading */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        {!isAiReady && <div className="text-green-300 font-mono text-sm bg-black/50 px-2 py-1 rounded">INITIALIZING AI...</div>}
      </div>

      {/* Tips - Z-[40] */}
      <div className="flex flex-col gap-2 text-white/80 font-mono text-xs md:text-sm bg-black/60 p-4 rounded-xl backdrop-blur-md border border-white/10 w-fit max-w-sm self-end pointer-events-auto z-[40]">
        <h3 className="text-green-400 font-bold mb-1 uppercase border-b border-white/10 pb-1">Holo-Controls</h3>
        <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
            <span>🖐</span> <p>Palm/Fist = Explode/Assemble</p>
            <span>👌</span> <p>Pinch = Zoom Photo</p>
            <span>😎</span> <p>Head = Rotate / Move</p>
        </div>
        <div className="flex gap-4 mt-2 pt-2 border-t border-white/10 text-[10px]">
            <span className={isAiReady ? "text-green-400" : "text-red-400"}>SYSTEM: {isAiReady ? 'ON' : 'BOOT'}</span>
            <span className={isHandDetected ? "text-blue-400" : "text-gray-500"}>HAND: {isHandDetected ? 'ON' : 'OFF'}</span>
            <span className={isFaceDetected ? "text-purple-400" : "text-gray-500"}>FACE: {isFaceDetected ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default Overlay;