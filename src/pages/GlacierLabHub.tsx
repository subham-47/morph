import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Gem, Microscope, Compass, Lock } from 'lucide-react';

const LAB_MODULES = [
  {
    id: 'crystallography',
    title: 'Crystallography 3D',
    desc: 'Manipulate crystal systems, mirror planes, and rotational axes in a true 3D sandbox.',
    icon: Gem,
    status: 'active',
    path: '/lab/crystallography',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  {
    id: 'petrology',
    title: 'Virtual Microscope',
    desc: 'Examine thin sections under cross-polarized light to identify index minerals.',
    icon: Microscope,
    status: 'locked',
    path: '#',
    color: 'text-slate-500',
    bg: 'bg-slate-800/50',
    border: 'border-white/5'
  },
  {
    id: 'topography',
    title: 'Topographic Sandbox',
    desc: 'Draw contour lines and watch them generate 3D terrain in real-time.',
    icon: Compass,
    status: 'locked',
    path: '#',
    color: 'text-slate-500',
    bg: 'bg-slate-800/50',
    border: 'border-white/5'
  }
];

export default function GlacierLabHub() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-body selection:bg-blue-500/30">
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Main
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24">
        <header className="mb-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-blue-500 mb-4 block">Experimental Zone</span>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6">Glacier <span className="text-blue-400">Lab</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the interactive geology sandbox. Select a module below to begin your spatial and analytical experiments.
          </p>
        </header>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LAB_MODULES.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${mod.bg} ${mod.border} ${
                mod.status === 'active' 
                  ? 'hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.3)] hover:border-blue-400/50' 
                  : 'cursor-not-allowed opacity-80'
              }`}
              onClick={(e) => mod.status === 'locked' && e.preventDefault()}
            >
              {mod.status === 'locked' && (
                <div className="absolute top-6 right-6">
                  <Lock className="w-4 h-4 text-slate-600" />
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-black/40 border border-white/5 ${mod.color}`}>
                <mod.icon className="w-7 h-7" />
              </div>
              
              <h3 className="font-display text-xl font-bold mb-3">{mod.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">{mod.desc}</p>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {mod.status === 'active' ? 'Module Ready' : 'In Development'}
                </span>
                {mod.status === 'active' && (
                  <span className="text-blue-400">&rarr;</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

    </div>
  );
}
