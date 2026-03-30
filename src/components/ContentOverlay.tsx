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
    <div className="w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-32 space-y-40 text-slate-50">
        
        {/* --- TOPIC LIBRARY --- */}
        <section id="topics">
          <div className="mb-12">
            <p className="text-blue-400 tracking-[0.15em] text-sm uppercase font-bold mb-2 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-blue-400"></span> Topic Library
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Every branch of <span className="text-blue-300 italic">geology, structured.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic) => (
              <div key={topic.id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 group cursor-pointer shadow-xl">
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{topic.name}</h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">{topic.desc}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs font-mono text-blue-400">{topic.count}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${topic.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    {topic.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- EXAM CORNER --- */}
        <section id="exams">
          <div className="mb-12">
            <p className="text-blue-400 tracking-[0.15em] text-sm uppercase font-bold mb-2 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-blue-400"></span> Exam Corner
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Every geology exam, <span className="text-blue-300 italic">one place.</span></h2>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl w-fit mb-8">
            <button onClick={() => setExamTab('profiles')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${examTab === 'profiles' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Exam Profiles</button>
            <button onClick={() => setExamTab('notifications')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${examTab === 'notifications' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>🔔 Notifications</button>
            <button onClick={() => setExamTab('pyq')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${examTab === 'pyq' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>PYQ Archive</button>
          </div>

          {examTab === 'profiles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EXAMS.map((exam) => (
                <div key={exam.name} className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-400/50 transition-colors shadow-xl">
                  <div className="text-3xl mb-4">{exam.icon}</div>
                  <h3 className="text-lg font-bold mb-1">{exam.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 h-8">{exam.full}</p>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {Object.entries(exam.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-400">{key}</span>
                        <span className="font-semibold text-blue-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- MINERAL DATABASE --- */}
        <section id="minerals">
           <div className="mb-12">
            <p className="text-blue-400 tracking-[0.15em] text-sm uppercase font-bold mb-2 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-blue-400"></span> Glacier Lab
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Mineral <span className="text-blue-300 italic">ID Database.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MINERALS.map((min) => (
              <div key={min.name} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:-translate-y-1 transition-transform">
                <div className="h-2 w-full" style={{ backgroundColor: min.colorHex }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{min.name}</h3>
                      <p className="text-sm font-mono text-blue-400 mt-1">{min.formula}</p>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-center">
                      <span className="text-[10px] block text-slate-400 uppercase">Hardness</span>
                      <span className="font-bold">{min.hardness}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-white/10">
                     <div className="flex justify-between"><span className="text-slate-400">Lustre</span><span>{min.lustre}</span></div>
                     <div className="flex justify-between"><span className="text-slate-400">Cleavage</span><span>{min.cleavage}</span></div>
                     <div className="flex justify-between"><span className="text-slate-400">Spec. Gravity</span><span>{min.sg}</span></div>
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
