import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import GlacierScene from './components/GlacierScene';
import ContentOverlay from './components/ContentOverlay';
import { motion } from 'motion/react';
import { Mountain, Wind, Flame, Layers, Globe, Zap } from 'lucide-react';
import { cn } from './lib/utils';
import QuizTopics from './pages/QuizTopics';
import QuizPage from './pages/QuizPage';
import GlacierLabHub from './pages/GlacierLabHub';
import CrystalLab from './pages/CrystalLab';
import MineralDatabase from './pages/MineralDatabase';

const phases = [
  {
    id: 'ice',
    tag: 'I · Glacial',
    title: 'The Deep Ice',
    desc: 'Witness the crystalline architecture of ancient glaciers. Shaped over millennia, these frozen giants hold the secrets of Earth\'s climatic history.',
    stats: [
      { label: 'Max Depth', value: '-2,400m' },
      { label: 'Hidden Mass', value: '~90%' },
    ],
    color: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  {
    id: 'mountain',
    tag: 'II · Terrestrial',
    title: 'Living Peaks',
    desc: 'Tectonic forces transform frozen landscapes into verdant mountain ranges. A testament to the resilience of life and the power of geological uplift.',
    stats: [
      { label: 'Highest Peak', value: '8,849m' },
      { label: 'Surface Area', value: '24%' },
    ],
    color: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  {
    id: 'volcano',
    tag: 'III · Volcanic',
    title: 'Primal Fury',
    desc: 'From the depths of the mantle, molten energy reshapes the world. Volcanic eruptions are the ultimate engine of planetary renewal and destruction.',
    stats: [
      { label: 'Lava Temp', value: '1,200°C' },
      { label: 'Active Sites', value: '1,500+' },
    ],
    color: 'text-orange-500',
    glow: 'shadow-orange-500/20',
  },
];

function App() {
  const [phase, setPhase] = React.useState(0);

  // --- SEARCH STATE & LOGIC ---
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="relative bg-[#020617] text-slate-50 min-h-screen selection:bg-blue-500/30">
      <GlacierScene onPhaseUpdate={setPhase} />

      {/* --- TOP NAVIGATION (Original Fonts Restored) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wider uppercase">Geo<span className="text-blue-400 italic font-medium text-base lowercase">Glacier</span></span>
          </div>

          {/* Desktop Links & Mega Menus */}
          <div className="hidden md:flex items-center gap-8">

            {/* 1. Topic Library */}
            <div className="relative group">
              <button 
                onClick={() => {
                  const el = document.getElementById('topics');
                  el && window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-colors py-4"
              >
                Topic Library <span className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
              </button>
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[600px] invisible opacity-0 translate-y-4 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-slate-950 border border-white/10 rounded-xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)] grid grid-cols-2 gap-8 text-left normal-case tracking-normal">
                <div>
                  <h4 className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Foundational</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 hover:bg-white/5 p-2 -m-2 rounded-lg cursor-pointer transition-colors group/link">
                      <span className="text-lg">💎</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover/link:text-blue-400 transition-colors">Mineralogy</div>
                        <div className="text-xs text-slate-500 mt-0.5">Crystal systems, properties</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover:bg-white/5 p-2 -m-2 rounded-lg cursor-pointer transition-colors group/link">
                      <span className="text-lg">🪨</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover/link:text-blue-400 transition-colors">Petrology</div>
                        <div className="text-xs text-slate-500 mt-0.5">Igneous, sedimentary, metamorphic</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Applied</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 hover:bg-white/5 p-2 -m-2 rounded-lg cursor-pointer transition-colors group/link">
                      <span className="text-lg">🌋</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover/link:text-blue-400 transition-colors">Structural Geology</div>
                        <div className="text-xs text-slate-500 mt-0.5">Folds, faults, tectonics</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover:bg-white/5 p-2 -m-2 rounded-lg cursor-pointer transition-colors group/link">
                      <span className="text-lg">🗺️</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover/link:text-blue-400 transition-colors">Geomorphology</div>
                        <div className="text-xs text-slate-500 mt-0.5">Landforms, erosion cycles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Quiz Hub */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-colors py-4">
                Quiz Hub <span className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
              </button>
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[240px] invisible opacity-0 translate-y-4 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-slate-950 border border-white/10 rounded-xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.8)] space-y-2 text-left normal-case tracking-normal">
                <Link to="/quiz" className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3">
              <span>📝</span>
              <div>
              <div className="text-sm font-bold text-slate-200">Topic Quiz</div>
              <div className="text-xs text-slate-500">Practice by subject</div>
            </div>
          </Link>
                <div className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3">
                  <span>⏱️</span>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Mock Test</div>
                    <div className="text-xs text-slate-500">Full simulation</div>
                  </div>
                  <span className="ml-auto text-[9px] uppercase font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Live</span>
                </div>
              </div>
            </div>

            {/* 3. Exam Corner */}
            <button 
              onClick={() => {
                const el = document.getElementById('exams');
                el && window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
              }}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-colors py-4"
            >
              Exam Corner
            </button>

            {/* 4. Glacier Lab */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-colors py-4">
                Glacier Lab <span className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
              </button>
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[260px] invisible opacity-0 translate-y-4 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-slate-950 border border-white/10 rounded-xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.8)] space-y-2 text-left normal-case tracking-normal">
                
                {/* Main Hub Link */}
                <Link to="/lab" className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3">
                  <span className="text-xl">🔬</span>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Experimental Hub</div>
                    <div className="text-xs text-slate-500">View all lab modules</div>
                  </div>
                </Link>

                {/* Direct Link to Crystallography */}
                <Link to="/lab/crystallography" className="hover:bg-white/5 p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Crystallography 3D</div>
                    <div className="text-xs text-slate-500">Interactive crystal viewer</div>
                  </div>
                  <span className="ml-auto text-[9px] uppercase font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">New</span>
                </Link>

              </div>
            </div>
            </div>

          {/* Right Actions (Search & Quiz) */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className="hidden md:flex px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-blue-600/20 transition-all">
              Start Quiz
            </button>
          </div>

        </div>
      </nav>

      {/* --- SCROLLING CONTENT --- */}
      <div className="relative z-10">

        {/* 1. Evolution Section (The 3D Phases) */}
        <div id="evolution">
          {phases.map((phase, i) => (
            <section 
              key={phase.id} 
              className="h-screen flex items-center px-6 md:px-24 pointer-events-none"
            >
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl p-8 md:p-12 bg-gradient-to-b from-slate-900/30 to-transparent backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl"
              >
                <span className={cn("font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block", phase.color)}>
                  {phase.tag}
                </span>
                <h2 className="font-display text-5xl md:text-7xl font-black leading-tight mb-6">
                  {phase.title.split(' ').map((word, idx) => (
                    <span key={idx} className={idx === 1 ? phase.color : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                  {phase.desc}
                </p>

                <div className="flex gap-12">
                  {phase.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className={cn("font-display text-2xl font-bold mb-1", phase.color)}>{stat.value}</div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          ))}
        </div>

        {/* 2. Research Section */}
        <section id="research" className="min-h-screen py-32 px-6 md:px-12 pointer-events-auto flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-24">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="font-mono text-[10px] uppercase tracking-[0.5em] text-blue-500 mb-4 block"
              >
                Scientific Capabilities
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="font-display text-4xl md:text-6xl font-bold mb-6"
              >
                Advanced <span className="text-blue-400">Geological</span> Analysis
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 max-w-2xl mx-auto"
              >
                Our platform integrates multi-spectral satellite data with real-time sensor networks to provide unprecedented insights into planetary evolution.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Wind, title: 'Atmospheric Dynamics', desc: 'Tracking gas emissions and particulate matter across volcanic plumes with global precision.' },
                { icon: Layers, title: 'Stratigraphic Mapping', desc: 'High-resolution subsurface imaging revealing millions of years of geological deposition.' },
                { icon: Zap, title: 'Seismic Monitoring', desc: 'Real-time detection of tectonic shifts using advanced machine learning algorithms.' },
                { icon: Mountain, title: 'Topographic Evolution', desc: 'Monitoring erosion and uplift patterns to predict future landscape transformations.' },
                { icon: Globe, title: 'Global Data Sync', desc: 'Seamless integration with international geological databases for collaborative research.' },
                { icon: Flame, title: 'Thermal Analysis', desc: 'Infrared monitoring of geothermal hotspots and magma chamber dynamics.' },
              ].map((feature, i) => (
                <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                key={i}
                className="max-w-xl p-8 md:p-12 bg-slate-900/10 border border-white/10 rounded-3xl shadow-2xl transition-transform hover:-translate-y-2"
              >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Data Section (Contains Library, Exams, Minerals, and Footer) */}
        <div id="data">
          <ContentOverlay />
        </div>

      </div>

      {/* --- FIXED UI: SCROLL INDICATOR --- */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none opacity-50">
        <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-slate-500">Scroll to evolve</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent animate-pulse" />
      </div>

      {/* --- FULL-SCREEN SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center pt-32 px-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl">

            {/* The Input Box */}
            <div className="flex items-center gap-4 bg-slate-900/50 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                autoFocus
                placeholder="Search minerals, topics, PYQs, exam info..."
                className="flex-1 bg-transparent border-none text-xl text-white outline-none placeholder:text-slate-600"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <p className="text-center text-slate-500 text-xs font-mono uppercase tracking-widest mt-6">
              Press ESC to close
            </p>

            {/* Quick Links / Popular Searches */}
            <div className="mt-12">
               <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Popular Searches</h4>
               <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all">GATE 2026 Syllabus</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all">Quartz Properties</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all">Bowen's Reaction Series</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 cursor-pointer hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all">IIT JAM PYQs</span>
               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function HomePage() {
  return <App />;
}

export default function Root() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizTopics />} />
      <Route path="/quiz/:topicId" element={<QuizPage />} />
      <Route path="/lab" element={<GlacierLabHub />} />
      <Route path="/lab/crystallography" element={<CrystalLab />} />
    </Routes>
  );
}
