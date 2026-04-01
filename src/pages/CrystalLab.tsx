import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Maximize2, Rotate3D, Layers, Grid3X3, Play } from 'lucide-react';

const CRYSTAL_SYSTEMS = [
  { id: 'isometric', name: 'Isometric', desc: 'a = b = c, α = β = γ = 90°' },
  { id: 'tetragonal', name: 'Tetragonal', desc: 'a = b ≠ c, α = β = γ = 90°' },
  { id: 'orthorhombic', name: 'Orthorhombic', desc: 'a ≠ b ≠ c, α = β = γ = 90°' },
  { id: 'hexagonal', name: 'Hexagonal', desc: 'a = b ≠ c, α = β = 90°, γ = 120°' },
  { id: 'monoclinic', name: 'Monoclinic', desc: 'a ≠ b ≠ c, α = γ = 90°, β ≠ 90°' },
  { id: 'triclinic', name: 'Triclinic', desc: 'a ≠ b ≠ c, α ≠ β ≠ γ ≠ 90°' },
];

export default function CrystalLab() {
  // --- STATE ---
  const [activeSystem, setActiveSystem] = useState('isometric');
  const [showAxes, setShowAxes] = useState(false);
  const [showPlanes, setShowPlanes] = useState(false);
  const [showRotation, setShowRotation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#020617] text-slate-50 overflow-hidden font-body">
      
      {/* --- BACKGROUND (Placeholder for 3D) --- */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020617] to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <p className="font-mono tracking-[0.5em] text-slate-500 uppercase">3D Canvas Loading...</p>
        </div>
        {/* 🚀 Phase 3: The <Canvas> will go right here! */}
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link 
            to="/lab" 
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl tracking-wide">Interactive Crystal Lab</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">Module 01: Crystallography</p>
          </div>
        </div>
        
        <button className="pointer-events-auto w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all backdrop-blur-md">
          <Maximize2 className="w-4 h-4" />
        </button>
      </nav>

      {/* --- LEFT PANEL: CURRICULUM --- */}
      <aside className="absolute top-24 left-6 bottom-28 w-72 z-20 flex flex-col pointer-events-none">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-xl pointer-events-auto flex flex-col">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6 border-b border-white/10 pb-3">Crystal Systems</h2>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {CRYSTAL_SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setActiveSystem(sys.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  activeSystem === sys.id 
                    ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                    : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-sm mb-1">{sys.name}</div>
                <div className="font-mono text-[9px] text-slate-500">{sys.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- BOTTOM PANEL: TOOLS & SYMMETRY --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-2xl px-6">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl pointer-events-auto flex items-center justify-between shadow-2xl">
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAxes(!showAxes)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                showAxes ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Axes (a,b,c)
            </button>
            
            <button 
              onClick={() => setShowPlanes(!showPlanes)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                showPlanes ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Mirror Planes (m)
            </button>

            <button 
              onClick={() => setShowRotation(!showRotation)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                showRotation ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              <Rotate3D className="w-4 h-4" />
              Rotation Axis
            </button>
          </div>

          <div className="w-px h-8 bg-white/10 mx-2"></div>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!showRotation}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
              showRotation 
                ? isPlaying 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'Stop' : 'Animate C4'}
          </button>

        </div>
      </div>

    </div>
  );
}
