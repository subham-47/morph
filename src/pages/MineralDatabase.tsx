import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FlaskConical, Microscope, Layers, Activity, Search, Scale } from 'lucide-react';

// --- INTELLIGENCE: The Chemical Parser ---
const parseChemicalFormula = (formula: string) => {
  const regex = /([A-Z][a-z]?)([₀-₉0-9]*)/g;
  const proportions: Record<string, number> = {};
  const subMap: Record<string, string> = { '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9' };

  let match;
  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    let qtyStr = match[2];
    if (qtyStr && subMap[qtyStr[0]]) {
       qtyStr = Array.from(qtyStr).map(c => subMap[c] || c).join('');
    }
    proportions[element] = (proportions[element] || 0) + (qtyStr ? parseInt(qtyStr, 10) : 1);
  }
  return proportions;
};

// --- 1. THE NEW ONTOLOGY (KNOWLEDGE GRAPH) ---
const KNOWLEDGE_GRAPH = [
  {
    id: 'min-01',
    name: 'Quartz',
    class: 'Silicate',
    subclass: 'Tectosilicate',
    chemistry: { elements: ['Si', 'O'], formula: 'SiO₂' },
    structure: { system: 'Trigonal' },
    physical: { hardness: { min: 7, max: 7 }, cleavage: 'None', sg: 2.65 },
    optical: { birefringence: 0.009, relief: 'Low positive', extinction: 'Undulose (often)' },
    genesis: ['Igneous', 'Metamorphic', 'Sedimentary']
  },
  {
    id: 'min-02',
    name: 'Olivine (Solid Solution)',
    class: 'Silicate',
    subclass: 'Nesosilicate',
    isSeries: true,
    series: {
      memberA: { name: 'Forsterite', symbol: 'Fo', element: 'Mg', sg: 3.22, bi: 0.035 },
      memberB: { name: 'Fayalite', symbol: 'Fa', element: 'Fe', sg: 4.39, bi: 0.052 }
    },
    chemistry: { elements: ['Mg', 'Fe', 'Si', 'O'], formula: '(Mg,Fe)₂SiO₄' },
    structure: { system: 'Orthorhombic' },
    physical: { hardness: { min: 6.5, max: 7 }, cleavage: 'Imperfect', sg: 3.27 },
    optical: { birefringence: 0.035, relief: 'High positive', extinction: 'Parallel' },
    genesis: ['Igneous (Ultramafic)', 'Mantle']
  },
  {
    id: 'min-03',
    name: 'Almandine (Garnet)',
    class: 'Silicate',
    subclass: 'Nesosilicate',
    chemistry: { elements: ['Fe', 'Al', 'Si', 'O'], formula: 'Fe₃Al₂(SiO₄)₃' },
    structure: { system: 'Isometric' },
    physical: { hardness: { min: 7, max: 7.5 }, cleavage: 'None', sg: 4.32 },
    optical: { birefringence: 0.000, relief: 'Very High positive', extinction: 'Isotropic (Always dark)' },
    genesis: ['Metamorphic (Pelitic)']
  },
  {
    id: 'min-04',
    name: 'Calcite',
    class: 'Carbonate',
    subclass: 'Anhydrous Carbonate',
    chemistry: { elements: ['Ca', 'C', 'O'], formula: 'CaCO₃' },
    structure: { system: 'Trigonal' },
    physical: { hardness: { min: 3, max: 3 }, cleavage: 'Perfect rhombohedral', sg: 2.71 },
    optical: { birefringence: 0.172, relief: 'Variable (Twinkling)', extinction: 'Symmetrical' },
    genesis: ['Sedimentary', 'Hydrothermal']
  }
];

export default function MineralDatabase() {
  // --- 2. THE REASONING ENGINE STATE ---
  const [filters, setFilters] = useState<{
    elements: string[];
    system: string;
    minHardness: number;
  }>({
    elements: [],
    system: 'All',
    minHardness: 0
  });

  // State for the Optical Inspector Modal
  const [selectedMineral, setSelectedMineral] = useState<any | null>(null);
  const [seriesValue, setSeriesValue] = useState(0); // For Solid Solution Slider (0-100)

  // State for Smart Chemical Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Compare Mode
  const [compareQueue, setCompareQueue] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false); // Controls the Selection UI

  // --- 3. CONSTRAINT SOLVER ---
  const filteredResults = useMemo(() => {
    return KNOWLEDGE_GRAPH.filter(m => {
      // Logic A: Elements
      const elMatch = filters.elements.length === 0 || 
        filters.elements.every(e => m.chemistry.elements.includes(e));
      
      // Logic B: Crystal System
      const sysMatch = filters.system === 'All' || m.structure.system === filters.system;
      
      // Logic C: Mohs Hardness
      const hardMatch = m.physical.hardness.min >= filters.minHardness;

      // Logic D: Smart Search (Parses names, classes, and chemical components)
      let searchMatch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const isExactElement = m.chemistry.elements.some(el => el.toLowerCase() === q);
        searchMatch = 
          m.name.toLowerCase().includes(q) || 
          m.class.toLowerCase().includes(q) || 
          m.chemistry.formula.toLowerCase().includes(q) ||
          isExactElement;
      }

      return elMatch && sysMatch && hardMatch && searchMatch;
    });
  }, [filters, searchQuery]);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-body overflow-hidden">
      
      {/* LEFT PANEL: The Constraint Facets */}
      <aside className="w-80 border-r border-white/10 p-6 overflow-y-auto space-y-8 bg-slate-950 flex flex-col shadow-2xl z-10">
        
        <nav className="mb-4">
          <Link to="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Hub
          </Link>
        </nav>

        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-500 mb-1">System Constraints</h2>
          <h3 className="text-xl font-display font-bold">Query Engine</h3>
        </div>

        {/* Facet: Chemistry */}
        <div>
          <label className="text-sm font-bold flex items-center gap-2 mb-3 text-slate-300">
            <FlaskConical className="w-4 h-4 text-blue-400" /> Elemental Intersection
          </label>
          <div className="flex flex-wrap gap-2">
            {['Si', 'O', 'Mg', 'Fe', 'Ca', 'Al', 'C'].map(el => (
              <button
                key={el}
                onClick={() => {
                  const next = filters.elements.includes(el)
                    ? filters.elements.filter(e => e !== el)
                    : [...filters.elements, el];
                  setFilters({...filters, elements: next});
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  filters.elements.includes(el) 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        </div>

        {/* Facet: Structure */}
        <div>
          <label className="text-sm font-bold flex items-center gap-2 mb-3 text-slate-300">
            <Layers className="w-4 h-4 text-indigo-400" /> Crystal Symmetry
          </label>
          <select 
            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            onChange={(e) => setFilters({...filters, system: e.target.value})}
          >
            <option value="All">All Systems</option>
            <option value="Isometric">Isometric</option>
            <option value="Trigonal">Trigonal</option>
            <option value="Orthorhombic">Orthorhombic</option>
          </select>
        </div>

        {/* Facet: Hardness Slider */}
        <div>
          <label className="text-sm font-bold flex items-center gap-2 mb-3 text-slate-300">
            <Activity className="w-4 h-4 text-amber-400" /> Mohs Hardness (H)
          </label>
          <input 
            type="range" min="0" max="10" step="0.5" value={filters.minHardness}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            onChange={(e) => setFilters({...filters, minHardness: parseFloat(e.target.value)})}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-slate-500 font-mono">Talc</span>
            <span className="text-xs text-amber-400 font-mono font-bold">H ≥ {filters.minHardness}</span>
            <span className="text-[10px] text-slate-500 font-mono">Diamond</span>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: The Exploration Grid */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,#0f172a,#020617)] p-8 md:p-12 relative z-0">
        <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-3">Ontology <span className="text-blue-500">Explorer</span></h1>
            <p className="text-slate-400 text-sm flex items-center gap-3">
              Intersecting <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{filteredResults.length}</strong> geological nodes based on active constraints.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Smart Search Bar (Works during Compare Mode too!) */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search mineral, class, or element..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>

            {/* Compare Mode Toggle UI */}
            {isCompareMode ? (
              <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-900 border border-amber-500/50 p-1.5 rounded-xl animate-in fade-in slide-in-from-right-4">
                <span className="text-xs font-bold text-amber-400 px-3 whitespace-nowrap">
                  {compareQueue.length} / 4 Selected
                </span>
                <button 
                  onClick={() => { setIsCompareMode(false); setCompareQueue([]); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={compareQueue.length < 2}
                  onClick={() => setIsCompareModalOpen(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    compareQueue.length >= 2 ? 'bg-amber-500 text-amber-950 hover:bg-amber-400' : 'bg-white/5 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Run Comparison
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsCompareMode(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" /> Compare Mode
              </button>
            )}
          </div>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredResults.map(m => {
            const isSelectedForCompare = compareQueue.some(c => c.id === m.id);
            return (
            <div 
              key={m.id} 
              onClick={() => { 
                if (isCompareMode) {
                  // If in compare mode, clicking acts like a checkbox
                  if (isSelectedForCompare) {
                    setCompareQueue(compareQueue.filter(c => c.id !== m.id));
                  } else if (compareQueue.length < 4) {
                    setCompareQueue([...compareQueue, m]);
                  }
                } else {
                  // Normal mode opens the Petrographic stage
                  setSelectedMineral(m); 
                  setSeriesValue(0); 
                }
              }}
              className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all group cursor-pointer ${
                isCompareMode 
                  ? isSelectedForCompare 
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
                    : 'border-white/5 bg-slate-900/40 hover:border-amber-500/30'
                  : 'border-white/5 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-900/60'
              }`}
            >
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">{m.name}</h3>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">{m.class} • {m.subclass}</div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Dynamic Checkbox that only appears in Compare Mode */}
                  {isCompareMode && (
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelectedForCompare ? 'bg-amber-500 border-amber-500 text-amber-950' : 'border-slate-600'}`}>
                      {isSelectedForCompare && <span className="text-sm font-bold">✓</span>}
                    </div>
                  )}
                  <div className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded">
                    {m.structure.system}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="font-mono text-sm text-blue-300 bg-blue-950/30 inline-block px-3 py-1.5 rounded-md border border-blue-500/10">
                  {m.chemistry.formula}
                </div>
                {/* Dynamically parsed chemistry display from our Regex Engine! */}
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(parseChemicalFormula(m.chemistry.formula)).map(([el, qty]) => (
                    <span key={el} className="text-[9px] font-mono font-bold text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-white/5">
                      {el}<span className="text-blue-500">{qty > 1 ? qty : ''}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Optical Snapshot */}
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><Microscope className="w-3 h-3"/> Relief</div>
                  <div className="text-xs text-slate-300">{m.optical.relief}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3"/> Hardness</div>
                  <div className="text-xs text-slate-300">{m.physical.hardness.min}</div>
                </div>
              </div>

            </div>
          ))}

          {filteredResults.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <FlaskConical className="w-8 h-8 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No minerals match this specific intersection.</p>
              <button onClick={() => setFilters({elements: [], system: 'All', minHardness: 0})} className="mt-4 text-xs text-blue-400 hover:text-blue-300">Clear Constraints</button>
            </div>
          )}
        </div>
      </main>

      {/* --- THE THIN SECTION OPTICAL MODAL --- */}
      {selectedMineral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMineral(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-slate-400 hover:text-white hover:bg-red-500/50 transition-all"
            >
              ✕
            </button>

            {/* Left: Petrographic View Simulator */}
            <div className="w-full md:w-2/5 bg-black p-8 flex flex-col items-center justify-center relative border-r border-white/5">
              <div className="absolute top-4 left-4 text-[10px] font-mono text-blue-500 tracking-widest uppercase flex items-center gap-2">
                <Microscope className="w-3 h-3" /> Petrographic Stage
              </div>
              
              {/* Simulated Microscope Stage */}
              <div className="w-48 h-48 rounded-full border-4 border-slate-800 bg-slate-950 shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden mb-6">
                <div className="absolute inset-0 border border-white/10 rounded-full pointer-events-none z-20"></div>
                {/* Crosshairs */}
                <div className="w-full h-[1px] bg-white/20 absolute z-10"></div>
                <div className="h-full w-[1px] bg-white/20 absolute z-10"></div>
                {/* Simulated Mineral Graphic - dynamically changes color based on Birefringence data! */}
                <div 
                  className="w-32 h-32 rounded-lg rotate-12 opacity-80 mix-blend-screen"
                  style={{
                    background: selectedMineral.optical.birefringence > 0.03 
                      ? 'linear-gradient(45deg, #f472b6, #34d399, #fbbf24)' 
                      : 'linear-gradient(45deg, #9ca3af, #d1d5db)'          
                  }}
                ></div>
              </div>
              
              <div className="text-center w-full">
                <div className="text-sm font-bold text-white mb-1">Optical Signatures</div>
                
                <div className="text-xs text-slate-400 flex justify-between border-b border-white/5 py-1.5">
                  <span>Birefringence (δ)</span>
                  <span className="font-mono text-blue-300">
                    {selectedMineral.isSeries 
                      ? ((selectedMineral.series.memberA.bi * (1 - seriesValue/100)) + (selectedMineral.series.memberB.bi * (seriesValue/100))).toFixed(3)
                      : selectedMineral.optical.birefringence}
                  </span>
                </div>
                
                <div className="text-xs text-slate-400 flex justify-between border-b border-white/5 py-1.5">
                  <span>Extinction</span>
                  <span className="text-blue-300">{selectedMineral.optical.extinction}</span>
                </div>
                
                <div className="text-xs text-slate-400 flex justify-between py-1.5">
                  <span>Relief</span>
                  <span className="text-blue-300">{selectedMineral.optical.relief}</span>
                </div>
              </div>
            </div>

            {/* Right: Data Inspector */}
            <div className="w-full md:w-3/5 p-8 bg-slate-900/50 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{selectedMineral.class} • {selectedMineral.subclass}</div>
              <h2 className="text-3xl font-display font-black text-white mb-1">{selectedMineral.name}</h2>
              <div className="font-mono text-sm text-blue-400 mb-6">{selectedMineral.chemistry.formula}</div>

              {/* --- DYNAMIC SOLID SOLUTION SIMULATOR --- */}
              {selectedMineral.isSeries && (
                <div className="mb-8 p-5 bg-slate-950/50 border border-white/10 rounded-xl shadow-inner">
                  <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>{selectedMineral.series.memberA.name} ({selectedMineral.series.memberA.symbol})</span>
                    <span>{selectedMineral.series.memberB.name} ({selectedMineral.series.memberB.symbol})</span>
                  </div>
                  
                  <input 
                    type="range" min="0" max="100" value={seriesValue}
                    onChange={(e) => setSeriesValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
                  />
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono text-slate-400 border-t border-white/5 pt-4 mt-2">
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase mb-1">Exact Formula</span>
                      <span className="text-blue-300">
                        ({selectedMineral.series.memberA.element}
                        <sub className="text-[9px]">{(1 - seriesValue/100).toFixed(2)}</sub>
                        {selectedMineral.series.memberB.element}
                        <sub className="text-[9px]">{(seriesValue/100).toFixed(2)}</sub>)₂SiO₄
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase mb-1">Density (SG)</span>
                      <span className="text-white">
                        {((selectedMineral.series.memberA.sg * (1 - seriesValue/100)) + (selectedMineral.series.memberB.sg * (seriesValue/100))).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase mb-1">Birefringence</span>
                      <span className="text-white">
                        {((selectedMineral.series.memberA.bi * (1 - seriesValue/100)) + (selectedMineral.series.memberB.bi * (seriesValue/100))).toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-white/5">Physical Data</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex justify-between"><span>Crystal System</span> <strong className="text-white">{selectedMineral.structure.system}</strong></li>
                    <li className="flex justify-between"><span>Hardness (H)</span> <strong className="text-white">{selectedMineral.physical.hardness.min}{selectedMineral.physical.hardness.min !== selectedMineral.physical.hardness.max ? ` - ${selectedMineral.physical.hardness.max}` : ''}</strong></li>
                    <li className="flex justify-between"><span>Specific Gravity</span> <strong className="text-white">{selectedMineral.physical.sg}</strong></li>
                    <li className="flex justify-between"><span>Cleavage</span> <strong className="text-white">{selectedMineral.physical.cleavage}</strong></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-white/5">Genesis & Environment</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMineral.genesis.map((env: string) => (
                      <span key={env} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-300">{env}</span>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-white/5">Chemistry Elements</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMineral.chemistry.elements.map((el: string) => (
                         <span key={el} className="w-7 h-7 flex items-center justify-center bg-blue-900/30 border border-blue-500/30 rounded text-xs font-mono text-blue-300">{el}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- STEP 5: DYNAMIC MULTI-COMPARE MODE --- */}
      
           {/* The Dynamic Multi-Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#020617]/90 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-6xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
              <h2 className="text-xl font-display font-bold flex items-center gap-3 text-white">
                <Scale className="w-5 h-5 text-amber-400" /> Diagnostic Comparison ({compareQueue.length})
              </h2>
              <button 
                onClick={() => { setIsCompareModalOpen(false); setCompareQueue([]); }} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-red-500/50 transition-all"
              >
                ✕
              </button>
            </div>

            <div 
              className="grid divide-x divide-white/10" 
              style={{ gridTemplateColumns: `repeat(${compareQueue.length}, minmax(0, 1fr))` }}
            >
              {compareQueue.map((m) => {
                // Find the absolute highest and lowest values across ALL selected minerals
                const maxHardness = Math.max(...compareQueue.map(c => c.physical.hardness.min));
                const minHardness = Math.min(...compareQueue.map(c => c.physical.hardness.min));
                
                const maxSG = Math.max(...compareQueue.map(c => c.physical.sg));
                const minSG = Math.min(...compareQueue.map(c => c.physical.sg));

                return (
                  <div key={m.id} className="p-6 md:p-8 bg-slate-900/50">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{m.class}</div>
                    <h3 className="text-2xl lg:text-3xl font-display font-black text-white mb-2 leading-tight">{m.name}</h3>
                    <div className="font-mono text-xs text-blue-400 mb-8">{m.chemistry.formula}</div>

                    <ul className="space-y-4 text-xs lg:text-sm text-slate-400">
                      <li className="flex justify-between border-b border-white/5 pb-2 gap-2">
                        <span>Hardness (H)</span> 
                        <strong className={`font-mono text-right ${
                          m.physical.hardness.min === maxHardness && maxHardness !== minHardness ? 'text-green-400' : 
                          m.physical.hardness.min === minHardness && maxHardness !== minHardness ? 'text-red-400' : 'text-white'
                        }`}>
                          {m.physical.hardness.min}
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-2 gap-2">
                        <span>Specific Gravity</span> 
                        <strong className={`font-mono text-right ${
                          m.physical.sg === maxSG && maxSG !== minSG ? 'text-green-400' : 
                          m.physical.sg === minSG && maxSG !== minSG ? 'text-red-400' : 'text-white'
                        }`}>
                          {m.physical.sg}
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-2 gap-2">
                        <span>Crystal System</span> 
                        <strong className="text-white text-right">{m.structure.system}</strong>
                      </li>
                      <li className="flex justify-between pt-2 gap-2">
                        <span>Cleavage</span> 
                        <strong className="text-white text-right">{m.physical.cleavage}</strong>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
