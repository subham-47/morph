import React, { useState } from 'react';

// Strict TypeScript Interfaces to prevent build errors
interface Topic { id: string; icon: string; name: string; desc: string; count: string; status: string; }
interface Exam { icon: string; name: string; full: string; details: Record<string, string>; }
interface Mineral { name: string; formula: string; hardness: string; lustre: string; cleavage: string; sg: string; colorHex: string; }

const TOPICS: Topic[] = [
  { id: 'mineralogy', icon: '💎', name: 'Mineralogy', desc: 'Crystal systems, physical & optical properties, silicate classification', count: '48 subtopics', status: 'Active' },
  { id: 'petrology', icon: '🪨', name: 'Petrology', desc: 'Igneous, sedimentary and metamorphic rocks — classification & textures', count: '52 subtopics', status: 'Active' },
  { id: 'structural', icon: '🌋', name: 'Structural Geology', desc: 'Folds, faults, joints, plate tectonics and geologic structures', count: '38 subtopics', status: 'Active' },
  { id: 'geomorphology', icon: '🗺️', name: 'Geomorphology', desc: 'Landforms, Davis cycle, erosion processes and geomorphic agents', count: '30 subtopics', status: 'Active' },
  { id: 'stratigraphy', icon: '📐', name: 'Stratigraphy', desc: 'Rock sequences, geological time, stratigraphic principles', count: '28 subtopics', status: 'Active' },
  { id: 'palaeontology', icon: '🦕', name: 'Palaeontology', desc: 'Fossils, index fossils, evolutionary record and biostratigraphy', count: '24 subtopics', status: 'Coming Soon' },
  { id: 'economic', icon: '⛏️', name: 'Economic Geology', desc: 'Ore deposits, mineral resources, mining and India\'s wealth', count: '20 subtopics', status: 'Coming Soon' },
  { id: 'remote_sensing', icon: '🛰️', name: 'Remote Sensing & GIS', desc: 'Satellite imagery, image interpretation, GIS for geologists', count: '16 subtopics', status: 'Coming Soon' },
];

const EXAMS: Exam[] = [
  { icon: '🎯', name: 'GATE Geology', full: 'Graduate Aptitude Test in Engineering', details: { Body: 'IITs', Freq: 'Annual (Feb)', Marks: '100 (65 Q)', Use: 'M.Tech, PSU jobs' } },
  { icon: '📘', name: 'IIT JAM Geology', full: 'Joint Admission Test for M.Sc.', details: { Body: 'IITs', Freq: 'Annual (Feb)', Marks: '100 (60 Q)', Use: 'M.Sc Admission' } },
  { icon: '🏛️', name: 'GSI Geologist', full: 'Geological Survey of India', details: { Body: 'UPSC', Freq: 'Annual', Stages: 'Written + Interview', Qual: 'M.Sc Geology' } },
  { icon: '🛢️', name: 'ONGC Geologist', full: 'Oil & Natural Gas Corporation', details: { Recruit: 'GATE Score', Qual: 'M.Sc Geology', Grade: 'E1', Sector: 'Oil exploration' } },
];

const MINERALS: Mineral[] = [
  { name: 'Quartz', formula: 'SiO₂', hardness: '7', lustre: 'Vitreous', cleavage: 'None', sg: '2.65', colorHex: '#d4e5ff' },
  { name: 'Orthoclase', formula: 'KAlSi₃O₈', hardness: '6', lustre: 'Vitreous', cleavage: '2 dir @ 90°', sg: '2.56', colorHex: '#f0e0c0' },
  { name: 'Olivine', formula: '(Mg,Fe)₂SiO₄', hardness: '6.5', lustre: 'Vitreous', cleavage: 'Imperfect', sg: '3.27–4.37', colorHex: '#80a050' },
  { name: 'Biotite', formula: 'K(Mg,Fe)₃AlSi₃O₁₀(OH)₂', hardness: '2.5', lustre: 'Pearly', cleavage: '1 perfect', sg: '2.8–3.4', colorHex: '#8b6914' },
  { name: 'Calcite', formula: 'CaCO₃', hardness: '3', lustre: 'Vitreous', cleavage: '3 dir @ 75°', sg: '2.71', colorHex: '#f0f0f8' },
  { name: 'Magnetite', formula: 'Fe₃O₄', hardness: '6', lustre: 'Metallic', cleavage: 'None', sg: '5.18', colorHex: '#202020' },
];

export default function ContentOverlay() {
  const [examTab, setExamTab] = useState<string>('profiles');

  return (
    // Pointer-events-none allows scrolling the 3D scene, but we re-enable it on the content
    <div className="w-full relative z-10 pointer-events-none">
      <div className="max-w-6xl mx-auto px-6 py-32 space-y-48 text-slate-50">
        
        {/* --- TOPIC LIBRARY (Sleek Minimal Grid, limited to 4) --- */}
        <section id="topics" className="pointer-events-auto">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-blue-400 tracking-[0.2em] text-xs uppercase font-bold mb-3 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-blue-400"></span> Library
              </p>
              <h2 className="text-4xl font-light tracking-wide">Branches of <span className="text-blue-300 font-bold italic">Geology</span></h2>
            </div>
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-1">
              Explore All Topics &rarr;
            </button>
          </div>

          {/* Ultra-minimal cards: No heavy backgrounds, just thin borders and subtle hover */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPICS.slice(0, 4).map((topic) => ( // ONLY SHOW FIRST 4
              <div key={topic.id} className="p-6 border-t border-white/10 hover:border-blue-400/50 hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{topic.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">{topic.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{topic.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- EXAM CORNER (Clean List Layout instead of Grid boxes) --- */}
        <section id="exams" className="pointer-events-auto max-w-3xl">
          <div className="mb-10">
            <p className="text-blue-400 tracking-[0.2em] text-xs uppercase font-bold mb-3 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-blue-400"></span> Career
            </p>
            <h2 className="text-4xl font-light tracking-wide">Target <span className="text-blue-300 font-bold italic">Exams</span></h2>
          </div>

          <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
            <button onClick={() => setExamTab('profiles')} className={`text-sm font-medium transition-colors ${examTab === 'profiles' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>Exam Profiles</button>
            <button onClick={() => setExamTab('notifications')} className={`text-sm font-medium transition-colors ${examTab === 'notifications' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>Notifications</button>
          </div>

          {examTab === 'profiles' && (
            <div className="space-y-2">
              {EXAMS.map((exam) => (
                // Sleek horizontal rows instead of massive boxes
                <div key={exam.name} className="group flex items-center justify-between p-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-60 group-hover:opacity-100">{exam.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-200 group-hover:text-white">{exam.name}</h3>
                      <p className="text-xs text-slate-500">{exam.full}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                     {/* Just show one key piece of data to tease the user */}
                    <span className="text-xs font-mono text-blue-400/70">{Object.values(exam.details)[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- MINERAL DATABASE (Compact Bento Box) --- */}
        <section id="minerals" className="pointer-events-auto">
           <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-blue-400 tracking-[0.2em] text-xs uppercase font-bold mb-3 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-blue-400"></span> Glacier Lab
              </p>
              <h2 className="text-4xl font-light tracking-wide">Mineral <span className="text-blue-300 font-bold italic">Database</span></h2>
            </div>
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-1">
              Open Full Lab &rarr;
            </button>
          </div>

          {/* Smaller, sleeker cards that don't overwhelm the screen */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MINERALS.slice(0, 6).map((min) => (
              <div key={min.name} className="relative group overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm cursor-pointer hover:border-white/20 transition-all">
                {/* Thin color accent at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: min.colorHex }}></div>
                
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold mb-1 text-slate-200">{min.name}</h3>
                  <p className="text-xs font-mono text-slate-500 group-hover:text-blue-400 transition-colors">{min.formula}</p>
                  
                  {/* Hover reveal for the intense data (keeps it clean initially!) */}
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 overflow-hidden text-[10px] text-slate-400 space-y-1">
                    <p>Hardness: <span className="text-white">{min.hardness}</span></p>
                    <p>SG: <span className="text-white">{min.sg}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
