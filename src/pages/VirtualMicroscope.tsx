import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Microscope, RefreshCw, Sun, Moon, Info } from 'lucide-react';

// --- MOCK PETROLOGY DATA & OPTICAL PROPERTIES ---
const THIN_SECTIONS = [
  {
    id: 'quartz',
    name: 'Quartz',
    rock: 'Granite',
    desc: 'Shows classic undulose (wavy) extinction in XPL. First-order gray/white interference colors.',
    extinctionAngle: 0, // Parallel extinction
    isPleochroic: false,
    // CSS generated textures to simulate the mineral
    texturePPL: 'radial-gradient(circle at center, #f8f9fa 0%, #e9ecef 100%)',
    textureXPL: 'conic-gradient(from 0deg, #d1d5db, #f3f4f6, #9ca3af, #f3f4f6, #d1d5db)'
  },
  {
    id: 'biotite',
    name: 'Biotite Mica',
    rock: 'Schist',
    desc: 'Strong pleochroism in PPL (changes from light to dark brown). Shows "birdseye" texture in XPL.',
    extinctionAngle: 3, // Near parallel
    isPleochroic: true,
    texturePPL: 'linear-gradient(45deg, #a0522d, #cd853f)',
    textureXPL: 'repeating-radial-gradient(circle at 0 0, #8b4513, #a0522d 10px, #5c4033 20px)'
  },
  {
    id: 'plagioclase',
    name: 'Plagioclase Feldspar',
    rock: 'Gabbro',
    desc: 'Diagnostic polysynthetic twinning (zebra stripes) visible in XPL. Low relief in PPL.',
    extinctionAngle: 30, // Inclined extinction
    isPleochroic: false,
   imgPPL: '/minerals/quartz-ppl.jpg', 
    imgXPL: '/minerals/quartz-xpl.jpg'  
  }
  // ... update your other minerals exactly like this
];

export default function VirtualMicroscope() {
  const [activeId, setActiveId] = useState('quartz');
  const [rotation, setRotation] = useState(0);
  const [isXPL, setIsXPL] = useState(true);

  const activeMineral = THIN_SECTIONS.find(m => m.id === activeId)!;

  // --- OPTICS SIMULATION ENGINE (HYBRID) ---
  const opticsStyle = useMemo(() => {
    const rad = (rotation - activeMineral.extinctionAngle) * (Math.PI / 180);
    
    // Check if the mineral has a real image, otherwise use the CSS texture
    const hasImage = !!activeMineral.imgPPL;
    const currentBg = hasImage 
      ? `url(${isXPL ? activeMineral.imgXPL : activeMineral.imgPPL})`
      : (isXPL ? activeMineral.textureXPL : activeMineral.texturePPL);
    
    if (isXPL) {
      const intensity = Math.pow(Math.sin(2 * rad), 2);
      const opacity = Math.max(0.08, intensity); 
      
      return {
        background: currentBg, // Use 'background' instead of 'backgroundImage' so CSS gradients still work
        backgroundSize: hasImage ? 'cover' : 'auto',
        backgroundPosition: 'center',
        opacity: opacity, 
        transform: `rotate(${rotation}deg)`
      };
    } else {
      let filter = 'none';
      if (activeMineral.isPleochroic) {
        const pleoIntensity = Math.abs(Math.cos(rad));
        filter = `brightness(${0.8 + pleoIntensity * 0.3}) saturate(${1 + pleoIntensity * 0.2})`;
      }
      return {
        background: currentBg, 
        backgroundSize: hasImage ? 'cover' : 'auto',
        backgroundPosition: 'center',
        opacity: 1,
        filter: filter, 
        transform: `rotate(${rotation}deg)`
      };
    }
  }, [rotation, isXPL, activeMineral]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-body flex flex-col md:flex-row">
      
      {/* LEFT PANEL: Controls & Info */}
      <div className="w-full md:w-1/3 border-r border-white/10 bg-slate-950/50 flex flex-col">
        <nav className="p-6 border-b border-white/5">
          <Link to="/lab" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Hub
          </Link>
        </nav>

        <div className="p-8 flex-1 overflow-y-auto">
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <Microscope className="w-6 h-6 text-indigo-400" />
            Virtual Stage
          </h1>
          <p className="text-sm text-slate-400 mb-8">Mount a thin section and rotate the stage under polarized light.</p>

          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Thin Section Rack</h3>
          <div className="space-y-3 mb-8">
            {THIN_SECTIONS.map(mineral => (
              <button
                key={mineral.id}
                onClick={() => setActiveId(mineral.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeId === mineral.id 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <div className="font-bold mb-1">{mineral.name}</div>
                <div className="text-xs opacity-70">Host: {mineral.rock}</div>
              </button>
            ))}
          </div>

          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
            <Info className="absolute top-4 right-4 w-16 h-16 text-blue-500/10" />
            <h4 className="font-bold text-blue-200 mb-2 relative z-10">Optics Notes</h4>
            <p className="text-sm text-blue-100/70 leading-relaxed relative z-10">
              {activeMineral.desc}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Microscope Viewer */}
      <div className="w-full md:w-2/3 relative flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,#0f172a,#020617)]">
        
        {/* Main Stage Ring */}
        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[16px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center bg-black overflow-hidden group">
          
          {/* Degree Markings Edge */}
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none z-30" />
          
          {/* Crosshairs (Reticle) */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-40 mix-blend-difference">
            <div className="w-full h-[1px] bg-white" />
            <div className="h-full w-[1px] bg-white absolute" />
          </div>

          {/* The Rotating Mineral Texture */}
          <div 
            className="absolute -inset-10 transition-all duration-100 ease-out"
            style={opticsStyle}
          />
        </div>

        {/* Bottom Controls */}
        <div className="mt-12 w-full max-w-md bg-slate-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          
          {/* Light Toggle */}
          <div className="flex bg-slate-950 rounded-lg p-1 mb-6 border border-white/5">
            <button 
              onClick={() => setIsXPL(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${!isXPL ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sun className="w-4 h-4" /> PPL
            </button>
            <button 
              onClick={() => setIsXPL(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${isXPL ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Moon className="w-4 h-4" /> XPL
            </button>
          </div>

          {/* Stage Rotation Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-3">
              <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Stage Rotation</span>
              <span className="text-white font-bold">{rotation}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={rotation} 
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>
      </div>

    </div>
  );
}
