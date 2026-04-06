import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, Skull, Wind, Target } from 'lucide-react';

// --- ENRICHED TIME SCALE DATA ---
const TIME_DATA = [
  {
    eon: 'Phanerozoic', eon_color: '#1a3a5c',
    eras: [
      {
        era: 'Cenozoic', color: '#6e2a0a',
        periods: [
          { name: 'Quaternary', time: '2.6 Ma – Now', color: '#8b3a12', desc: 'Ice ages, human evolution, modern landforms form. Glacial and interglacial cycles dominate the climate.', fossils: 'Mammoths, early humans, modern flora', o2: '~21%', extinction: 'Ongoing Holocene Extinction' },
          { name: 'Neogene', time: '23 – 2.6 Ma', color: '#7a3010', desc: 'Himalayan uplift accelerates, grasslands spread globally replacing forests, whales evolve.', fossils: 'Early hominids, grazing horses, megalodon', o2: '~21%', extinction: 'None major' },
          { name: 'Palaeogene', time: '66 – 23 Ma', color: '#6a2808', desc: 'Mammals rapidly diversify to fill ecological niches left by dinosaurs. India collides with Asia.', fossils: 'Early primates, giant flightless birds', o2: '~24%', extinction: 'Eocene-Oligocene event' },
        ]
      },
      {
        era: 'Mesozoic', color: '#2d1a5c',
        periods: [
          { name: 'Cretaceous', time: '145 – 66 Ma', color: '#3d2a7a', desc: 'First flowering plants (angiosperms). High sea levels. Deccan Traps volcanism begins in India.', fossils: 'T-rex, Triceratops, Ammonites', o2: '~30%', extinction: 'K-Pg Extinction (Asteroid hit)' },
          { name: 'Jurassic', time: '201 – 145 Ma', color: '#4a3580', desc: 'Dinosaurs dominate the land. Pangaea continues splitting. First birds (Archaeopteryx) appear.', fossils: 'Stegosaurus, Brachiosaurus, Ichthyosaurs', o2: '~26%', extinction: 'None major' },
          { name: 'Triassic', time: '252 – 201 Ma', color: '#3a2870', desc: 'Recovery from the Great Dying. First dinosaurs and true mammals appear. Pangaea is a single supercontinent.', fossils: 'Early dinosaurs, Conodonts', o2: '~16%', extinction: 'End-Triassic Extinction' },
        ]
      },
      {
        era: 'Palaeozoic', color: '#0a3a6e',
        periods: [
          { name: 'Permian', time: '299 – 252 Ma', color: '#0a4a8e', desc: 'Pangaea forms completely. Reptiles diversify in dry climates. Massive Gondwana glaciation.', fossils: 'Dimetrodon, Fusulinids, Glossopteris flora', o2: '~23%', extinction: 'Permian-Triassic (The Great Dying - 96% loss)' },
          { name: 'Carboniferous', time: '359 – 299 Ma', color: '#0a5a9e', desc: 'Vast coal swamps form (source of modern coal). First reptiles evolve from amphibians. High oxygen leads to giant insects.', fossils: 'Giant dragonflies, crinoids, scale trees', o2: '~35% (Highest ever)', extinction: 'Carboniferous Rainforest Collapse' },
          { name: 'Devonian', time: '419 – 359 Ma', color: '#0a6aae', desc: 'The Age of Fishes. First extensive forests on land. Amphibians take their first steps out of water.', fossils: 'Placoderms (armoured fish), early sharks', o2: '~15%', extinction: 'Late Devonian Extinction' },
          { name: 'Silurian', time: '444 – 419 Ma', color: '#0a7abe', desc: 'First vascular plants colonize the land. Coral reefs flourish in shallow, warm seas.', fossils: 'Graptolites, early jawed fishes', o2: '~14%', extinction: 'None major' },
          { name: 'Ordovician', time: '485 – 444 Ma', color: '#0a8ace', desc: 'Marine invertebrates peak in diversity. First primitive land plants (mosses). Ends in massive ice age.', fossils: 'Graptolites, orthocone cephalopods', o2: '~13%', extinction: 'End-Ordovician Extinction' },
          { name: 'Cambrian', time: '541 – 485 Ma', color: '#0a9ade', desc: 'The Cambrian Explosion — rapid appearance of most major animal phyla with hard shells.', fossils: 'Trilobites, Archaeocyathids, Burgess Shale fauna', o2: '~12.5%', extinction: 'End-Cambrian Extinction' },
        ]
      },
    ]
  },
  {
    eon: 'Precambrian', eon_color: '#1a472a',
    eras: [
      {
        era: 'Proterozoic', color: '#1a5c30',
        periods: [
          { name: 'Neoproterozoic', time: '1000 – 541 Ma', color: '#1a6e38', desc: 'Snowball Earth events freeze the planet. First complex, soft-bodied multicellular animals appear.', fossils: 'Ediacaran fauna (Dickinsonia)', o2: '~5%', extinction: 'None defined' },
          { name: 'Mesoproterozoic', time: '1600 – 1000 Ma', color: '#1a7e40', desc: 'Formation of supercontinent Rodinia. Sexual reproduction evolves, accelerating evolution.', fossils: 'Stromatolites, early red algae', o2: '~2%', extinction: 'None defined' },
          { name: 'Palaeoproterozoic', time: '2500 – 1600 Ma', color: '#1a8e48', desc: 'The Great Oxygenation Event. Banded Iron Formations (BIFs) are deposited globally.', fossils: 'Earliest eukaryotic cells', o2: '~1%', extinction: 'Anaerobic life extinction' },
        ]
      },
      {
        era: 'Archean', color: '#0d3d1e',
        periods: [
          { name: 'Archean Eon', time: '4000 – 2500 Ma', color: '#0d4d26', desc: 'Earth cools enough for solid rocks. First single-celled life (prokaryotes) emerges in oceans. Cratons form.', fossils: 'Stromatolites, chemical microfossils', o2: '< 0.001%', extinction: 'None' },
        ]
      },
      {
        era: 'Hadean', color: '#0a2a14',
        periods: [
          { name: 'Hadean Eon', time: '4600 – 4000 Ma', color: '#0a3a1a', desc: 'Earth forms from the solar nebula. Molten surface, heavy meteorite bombardment, formation of the Moon.', fossils: 'None (No life exists)', o2: '0%', extinction: 'None' },
        ]
      },
    ]
  },
];

export default function TimeScale() {
  const [selectedPeriod, setSelectedPeriod] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 font-body overflow-hidden">
      
      {/* Header */}
      <header className="p-8 md:px-12 md:pt-12 md:pb-6 border-b border-white/5 bg-slate-950/50 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 z-10 shadow-xl">
        <div>
          <nav className="mb-4">
            <Link to="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Lab
            </Link>
          </nav>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-500 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Glacier Lab Interactive
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black">Geological <span className="text-blue-400 italic">Time Scale</span></h1>
        </div>
        <p className="text-sm text-slate-400 max-w-sm md:text-right border-l md:border-l-0 md:border-r-2 border-blue-500/30 pl-4 md:pl-0 md:pr-4">
          Scroll right to travel back in time. Click any period to analyze index fossils, atmospheric conditions, and extinction events.
        </p>
      </header>

      {/* Main Timeline Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden bg-[radial-gradient(ellipse_at_bottom,#0f172a,#020617)] p-8 md:p-12 cursor-grab active:cursor-grabbing relative">
        <div className="inline-flex flex-col gap-4 min-w-max h-full justify-center pb-20">
          
          {TIME_DATA.map((eon, eIdx) => (
            <div key={eIdx} className="flex rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
              
              {/* Eon Label (Vertical) */}
              <div 
                className="w-16 flex flex-col items-center justify-center border-r border-white/10 shrink-0"
                style={{ backgroundColor: `${eon.eon_color}40` }}
              >
                <span 
                  className="font-display font-black text-xl tracking-widest uppercase -rotate-180" 
                  style={{ writingMode: 'vertical-rl', color: eon.eon === 'Phanerozoic' ? '#93c5fd' : '#86efac' }}
                >
                  {eon.eon}
                </span>
              </div>

              {/* Eras Container */}
              <div className="flex flex-col divide-y divide-white/10">
                {eon.eras.map((era, eraIdx) => (
                  <div key={eraIdx} className="flex">
                    
                    {/* Era Label (Vertical) */}
                    <div 
                      className="w-12 flex items-center justify-center border-r border-white/10 shrink-0"
                      style={{ backgroundColor: `${era.color}40` }}
                    >
                      <span 
                        className="font-bold text-xs tracking-widest uppercase -rotate-180 text-white/50" 
                        style={{ writingMode: 'vertical-rl' }}
                      >
                        {era.era}
                      </span>
                    </div>

                    {/* Periods Row */}
                    <div className="flex divide-x divide-white/10">
                      {era.periods.map((period, pIdx) => (
                        <div 
                          key={pIdx} 
                          onClick={() => setSelectedPeriod({ ...period, era: era.era, eon: eon.eon })}
                          className="w-64 p-6 flex flex-col justify-between cursor-pointer group transition-all hover:bg-white/5 relative overflow-hidden"
                          style={{ backgroundColor: `${period.color}20` }}
                        >
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="relative z-10">
                            <h4 
                              className="font-display font-bold text-2xl mb-1 group-hover:scale-105 transition-transform origin-left"
                              style={{ color: period.color === '#8b3a12' ? '#fbbf24' : '#86efac' }}
                            >
                              {period.name}
                            </h4>
                            <div className="font-mono text-xs text-slate-400 bg-black/30 w-fit px-2 py-1 rounded border border-white/5 mb-4">
                              {period.time}
                            </div>
                            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                              {period.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* --- THE PERIOD INSPECTOR MODAL --- */}
      {selectedPeriod && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
          onClick={() => setSelectedPeriod(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-8 border-b border-white/10 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: selectedPeriod.color }}
              ></div>
              <button 
                onClick={() => setSelectedPeriod(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-slate-400 hover:text-white hover:bg-red-500/50 transition-all cursor-pointer"
              >
                ✕
              </button>
              
              <div className="relative z-10">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                  {selectedPeriod.eon} EON • {selectedPeriod.era} ERA
                </div>
                <h2 className="text-4xl font-display font-black text-white mb-2">{selectedPeriod.name}</h2>
                <div className="font-mono text-sm text-blue-300 bg-black/40 inline-block px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  {selectedPeriod.time}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 bg-slate-900/80">
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                {selectedPeriod.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Fossil Card */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-5">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" /> Index Fossils
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    {selectedPeriod.fossils}
                  </div>
                </div>

                {/* Atmosphere Card */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-5">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-400" /> Atmospheric O₂
                  </div>
                  <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-2">
                    {selectedPeriod.o2}
                    <span className="text-xs text-slate-500 font-sans font-normal">(Today: 21%)</span>
                  </div>
                </div>

                {/* Extinction Card */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-5">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <Skull className="w-4 h-4 text-red-400" /> Extinction Events
                  </div>
                  <div className={`text-sm font-bold ${selectedPeriod.extinction === 'None' || selectedPeriod.extinction === 'None major' ? 'text-slate-400' : 'text-red-300'}`}>
                    {selectedPeriod.extinction}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
