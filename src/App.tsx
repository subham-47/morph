import React from 'react';
import { GlacierScene } from './components/GlacierScene';
import { motion } from 'motion/react';
import { ArrowRight, Mountain, Wind, Flame, Layers, Globe, Zap } from 'lucide-react';
import { cn } from './lib/utils';

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

export default function App() {
  const [phase, setPhase] = React.useState(0);

  return (
    <div className="relative bg-[#020617] text-slate-50 min-h-screen selection:bg-blue-500/30">
      <GlacierScene onPhaseUpdate={setPhase} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-4 h-4 bg-[#020617] rounded-sm -rotate-45" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider uppercase">GeoGlacier</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Research', 'Evolution', 'Data', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-blue-600/20 transition-all">
              Explore Data
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll Container */}
      <div id="scroll-container" className="relative z-10">
        {/* Phase Overlays */}
        {phases.map((phase, i) => (
          <section 
            key={phase.id} 
            className="h-screen flex items-center px-6 md:px-24"
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

        {/* Features Section */}
        <section id="research" className="min-h-screen bg-[#020617] py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
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
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 py-24 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-950 rounded-sm -rotate-45" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider uppercase">GeoGlacier</span>
            </div>
            
            <div className="flex gap-12">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Navigation</span>
                <div className="flex flex-col gap-2">
                  {['Home', 'Research', 'Evolution', 'Contact'].map(item => (
                    <a key={item} href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Legal</span>
                <div className="flex flex-col gap-2">
                  {['Privacy', 'Terms', 'Security'].map(item => (
                    <a key={item} href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm mb-4">© 2026 GeoGlacier. All rights reserved.</p>
              <div className="flex justify-center md:justify-end gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                  <Zap className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none opacity-50">
        <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-slate-500">Scroll to evolve</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent animate-pulse" />
      </div>

      {/* Phase Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        {[0, 1, 2].map((dot) => (
          <button 
            key={dot}
            onClick={() => {
              const target = document.getElementById('scroll-container')?.children[dot];
              target?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-500 cursor-pointer",
              Math.round(phase) === dot 
                ? "bg-blue-400 scale-150 shadow-[0_0_10px_rgba(96,165,250,0.5)]" 
                : "bg-white/20 border border-white/10 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
