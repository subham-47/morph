import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  { icon: '🏭', name: 'PSU Recruitment', full: 'ONGC, Coal India, NMDC, MECL', details: { Recruit: 'GATE Score / CBT', Qual: 'M.Sc/M.Tech Geology', Grade: 'Executive (E1/E2)', Sectors: 'Energy, Mining, Oil' } },
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
    <div className="w-full relative z-10 pointer-events-none">
      
      {/* ----------------------------- */}
      {/* MAIN CONTENT WRAPPER (Constrained Width) */}
      {/* ----------------------------- */}
      <div className="max-w-6xl mx-auto px-6 py-32 space-y-48 text-slate-50">
        
        {/* --- TOPIC LIBRARY --- */}
        <section id="topics" className="pointer-events-auto">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-blue-400 tracking-[0.2em] text-xs uppercase font-bold mb-3 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-blue-400"></span> Library
              </p>
              <h2 className="text-4xl font-light tracking-wide">Branches of <span className="text-blue-300 font-bold italic">Geology</span></h2>
            </div>
            <button 
              onClick={() => alert("Link to topics!")}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-1"
            >
              Explore All Topics &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPICS.slice(0, 4).map((topic) => (
              <div key={topic.id} className="p-6 border-t border-white/10 hover:border-blue-400/50 hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{topic.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">{topic.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{topic.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- EXAM CORNER --- */}
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
            <button onClick={() => setExamTab('pyq')} className={`text-sm font-medium transition-colors ${examTab === 'pyq' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>PYQ Archive</button>
          </div>

          {examTab === 'profiles' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {EXAMS.map((exam) => (
                <div key={exam.name} className="group flex items-center justify-between p-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-60 group-hover:opacity-100">{exam.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-200 group-hover:text-white">{exam.name}</h3>
                      <p className="text-xs text-slate-500">{exam.full}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono text-blue-400/70">{Object.values(exam.details)[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {examTab === 'notifications' && (
            <div className="p-8 text-center border border-white/5 rounded-xl bg-white/[0.01] animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="text-3xl mb-3 block opacity-50">🔔</span>
              <p className="text-slate-400 text-sm">No new exam notifications.</p>
              <p className="text-slate-600 text-xs mt-1">Check back later for admit card and result updates.</p>
            </div>
          )}

          {examTab === 'pyq' && (
            <div className="p-8 text-center border border-white/5 rounded-xl bg-white/[0.01] animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="text-3xl mb-3 block opacity-50">📚</span>
              <p className="text-slate-400 text-sm">Previous Year Questions</p>
              <p className="text-slate-600 text-xs mt-1">Select an exam to start browsing the archive.</p>
            </div>
          )}
        </section>

        {/* --- MINERAL DATABASE --- */}
        <section id="minerals" className="pointer-events-auto pb-10">
           <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-blue-400 tracking-[0.2em] text-xs uppercase font-bold mb-3 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-blue-400"></span> Glacier Lab
              </p>
              <h2 className="text-4xl font-light tracking-wide">Mineral <span className="text-blue-300 font-bold italic">Database</span></h2>
            </div>
            <Link 
              to="/database" 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-1"
            >
              Open Full Tab &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
            {MINERALS.slice(0, 6).map((min) => (
              <div key={min.name} className="h-fit relative group overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm cursor-pointer hover:border-white/20 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: min.colorHex }}></div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold mb-1 text-slate-200">{min.name}</h3>
                  <p className="text-xs font-mono text-slate-500 group-hover:text-blue-400 transition-colors">{min.formula}</p>
                  
                  <div className="max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 overflow-hidden text-[10px] text-slate-400 space-y-1">
                    <p>Hardness: <span className="text-white">{min.hardness}</span></p>
                    <p>SG: <span className="text-white">{min.sg}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* END OF MAIN CONTENT WRAPPER */}
      </div>

      {/* ----------------------------- */}
      {/* COMPACT & TRANSPARENT FOOTER */}
      {/* ----------------------------- */}
      <footer id="contact" className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md pointer-events-auto mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Top Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-10">
            
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  <span className="text-white font-bold text-base">G</span>
                </div>
                <span className="text-lg font-bold text-white tracking-widest uppercase">GeoGlacier</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                The ultimate interactive ecosystem for earth science students. Master mineralogy, track PSU recruitments, and conquer your exams.
              </p>
              
              {/* Social Icons (Slightly smaller) */}
              <div className="flex gap-2 pt-1">
                {/* LinkedIn */}
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-400 transition-all text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
                {/* YouTube */}
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-red-600/20 hover:border-red-500/50 hover:text-red-500 transition-all text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </button>
                {/* Instagram */}
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-pink-600/20 hover:border-pink-500/50 hover:text-pink-400 transition-all text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </button>
                {/* X / Twitter */}
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-slate-600/20 hover:border-slate-500/50 hover:text-white transition-all text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lg:col-span-2">
              <h4 className="text-slate-300 font-semibold mb-4 tracking-wider text-xs uppercase">Platform</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button className="hover:text-blue-400 transition-colors">Mineral Lab</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Topic Library</button></li>
                <li><button className="hover:text-blue-400 transition-colors">PYQ Archive</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Exam Notifications</button></li>
              </ul>
            </div>

            {/* Column 3: Legal & Support */}
            <div className="lg:col-span-2">
              <h4 className="text-slate-300 font-semibold mb-4 tracking-wider text-xs uppercase">Legal & Support</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors">Report a Bug</button></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="lg:col-span-4">
              <h4 className="text-slate-300 font-semibold mb-4 tracking-wider text-xs uppercase">Stay Updated</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Join other geology aspirants. Get the latest study materials and exam alerts delivered to your inbox.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-full focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Settings */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs text-center md:text-left">
              © {new Date().getFullYear()} GeoGlacier. All rights reserved. <br className="md:hidden" />
              <span className="hidden md:inline"> | </span> 
              <span className="text-slate-600">Built for Earth Science Aspirants</span>
            </p>
            
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                All systems operational
              </span>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                Back to top
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
