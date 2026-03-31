import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

const QUESTIONS: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  mineralogy: [
    { q: 'Which mineral has a hardness of 10 on the Mohs scale?', options: ['Corundum', 'Diamond', 'Topaz', 'Quartz'], correct: 1, explanation: 'Diamond is the hardest natural mineral with a Mohs hardness of 10. Corundum is 9, Topaz is 8, and Quartz is 7.' },
    { q: 'What is the chemical formula of Quartz?', options: ['CaCO₃', 'SiO₂', 'Al₂O₃', 'FeS₂'], correct: 1, explanation: 'Quartz is silicon dioxide (SiO₂). CaCO₃ is Calcite, Al₂O₃ is Corundum, and FeS₂ is Pyrite.' },
    { q: 'Which crystal system does Halite belong to?', options: ['Hexagonal', 'Orthorhombic', 'Cubic', 'Monoclinic'], correct: 2, explanation: 'Halite (NaCl) belongs to the Cubic (Isometric) crystal system, forming perfect cube-shaped crystals.' },
    { q: 'The specific gravity of Olivine ranges approximately from:', options: ['2.2 – 2.6', '3.2 – 4.4', '5.0 – 5.5', '1.8 – 2.1'], correct: 1, explanation: 'Olivine has a specific gravity of approximately 3.27–4.37, depending on the Mg/Fe ratio in the solid solution series.' },
    { q: 'Which property distinguishes Calcite from Dolomite in the field?', options: ['Colour', 'Cleavage', 'Reaction with cold dilute HCl', 'Hardness'], correct: 2, explanation: 'Calcite effervesces vigorously with cold dilute HCl. Dolomite only reacts when powdered. This is the classic field test.' },
  ],
  petrology: [
    { q: 'Bowen\'s Reaction Series describes the sequence of:', options: ['Metamorphic grade increase', 'Mineral crystallisation from magma', 'Sediment deposition order', 'Fossil succession'], correct: 1, explanation: 'Bowen\'s Reaction Series describes the order in which minerals crystallise from a cooling magma, divided into continuous and discontinuous series.' },
    { q: 'Which rock texture is characterised by large crystals set in a fine-grained groundmass?', options: ['Pegmatitic', 'Porphyritic', 'Granular', 'Glassy'], correct: 1, explanation: 'Porphyritic texture has large phenocrysts embedded in a finer groundmass, indicating two stages of cooling.' },
    { q: 'The index mineral Kyanite indicates which metamorphic condition?', options: ['High temperature, low pressure', 'Low temperature, high pressure', 'High temperature, high pressure', 'Low temperature, low pressure'], correct: 1, explanation: 'Kyanite is stable at low temperature and high pressure conditions, making it an important pressure indicator in metamorphic petrology.' },
    { q: 'Which sedimentary structure indicates current direction?', options: ['Graded bedding', 'Cross-bedding', 'Ripple marks', 'Both B and C'], correct: 3, explanation: 'Both cross-bedding and ripple marks are reliable palaeocurrent indicators. Cross-bedding foreset dip and ripple mark asymmetry both indicate flow direction.' },
    { q: 'Granite and Rhyolite are compositionally equivalent but differ in:', options: ['Silica content', 'Mineral assemblage', 'Texture due to cooling rate', 'Tectonic setting'], correct: 2, explanation: 'Granite (coarse-grained) and Rhyolite (fine-grained) have the same composition but different textures because granite cools slowly deep underground while rhyolite cools rapidly at the surface.' },
  ],
  structural: [
    { q: 'In a syncline, the youngest rocks are found:', options: ['At the core', 'At the limbs', 'At the hinge', 'At the axial plane'], correct: 0, explanation: 'In a syncline, beds dip toward the core, so the youngest rocks occupy the central core. In an anticline, the oldest rocks are at the core.' },
    { q: 'A fault where the hanging wall moves up relative to the footwall is called:', options: ['Normal fault', 'Reverse fault', 'Strike-slip fault', 'Transform fault'], correct: 1, explanation: 'In a reverse fault, the hanging wall moves upward relative to the footwall, caused by compressional forces.' },
    { q: 'The San Andreas Fault is an example of:', options: ['Normal fault', 'Reverse fault', 'Right-lateral strike-slip fault', 'Left-lateral strike-slip fault'], correct: 2, explanation: 'The San Andreas Fault is a right-lateral (dextral) strike-slip fault where the Pacific Plate moves northwest relative to the North American Plate.' },
    { q: 'Which of the following is NOT a type of fold?', options: ['Anticline', 'Syncline', 'Graben', 'Monocline'], correct: 2, explanation: 'A Graben is a down-dropped block bounded by normal faults — it is a fault structure, not a fold.' },
    { q: 'Riedel shears are associated with which structural feature?', options: ['Thrust belts', 'Strike-slip fault zones', 'Fold hinges', 'Salt diapirs'], correct: 1, explanation: 'Riedel shears (R and R\' shears) are secondary shear fractures that develop in the damage zone of strike-slip fault systems.' },
  ],
  geomorphology: [
    { q: 'According to Davis\'s Geographical Cycle, a peneplain represents which stage?', options: ['Youth', 'Maturity', 'Old Age', 'Rejuvenation'], correct: 2, explanation: 'A peneplain is a nearly flat, featureless erosional surface representing the Old Age stage of Davis\'s cycle of erosion.' },
    { q: 'Which landform is formed by glacial deposition?', options: ['Cirque', 'Arête', 'Drumlin', 'Horn'], correct: 2, explanation: 'Drumlins are streamlined hills formed by glacial deposition. Cirques, arêtes, and horns are all erosional glacial landforms.' },
    { q: 'A barchan dune forms when:', options: ['Wind direction is variable', 'Vegetation cover is dense', 'Sand supply is limited and wind is unidirectional', 'Sand supply is abundant'], correct: 2, explanation: 'Barchan dunes are crescent-shaped dunes that form where sand supply is limited and wind blows consistently from one direction.' },
    { q: 'The term "knickpoint" refers to:', options: ['A sharp bend in a coastline', 'A break in slope along a river profile', 'The highest point of a watershed', 'A glacial cirque floor'], correct: 1, explanation: 'A knickpoint is a sharp break or irregularity in the longitudinal profile of a river, often caused by rejuvenation or resistant rock bands.' },
    { q: 'Karst topography is primarily developed in:', options: ['Granite terrain', 'Basalt terrain', 'Limestone terrain', 'Sandstone terrain'], correct: 2, explanation: 'Karst topography develops on soluble rocks, primarily limestone (CaCO₃), through dissolution by slightly acidic groundwater.' },
  ],
  stratigraphy: [
    { q: 'Steno\'s Law of Superposition states that:', options: ['Sediments are deposited horizontally', 'Younger beds lie above older beds', 'Lateral continuity exists across basins', 'Cross-cutting features are younger'], correct: 1, explanation: 'The Law of Superposition states that in an undisturbed sequence, the youngest layers are at the top and oldest at the bottom.' },
    { q: 'The boundary between the Cretaceous and Paleogene periods is marked by:', options: ['A major volcanic event', 'The K-Pg mass extinction', 'A glaciation event', 'A sea level highstand'], correct: 1, explanation: 'The K-Pg boundary is marked by a major mass extinction ~66 Ma ago, associated with a bolide impact.' },
    { q: 'Index fossils are characterised by:', options: ['Long stratigraphic range and narrow geographic distribution', 'Short stratigraphic range and wide geographic distribution', 'Rare occurrence and unique morphology', 'Preservation only in deep marine sediments'], correct: 1, explanation: 'Index fossils have a short stratigraphic range and wide geographic distribution, making them ideal for correlating rock units globally.' },
    { q: 'The Deccan Traps in India were formed during which geological period?', options: ['Jurassic', 'Triassic', 'Late Cretaceous to Early Paleocene', 'Miocene'], correct: 2, explanation: 'The Deccan Traps formed during the Late Cretaceous to Early Paleocene (~66 Ma), coinciding with the K-Pg boundary.' },
    { q: 'Which principle states that a rock unit is younger than the rocks it cuts across?', options: ['Superposition', 'Original horizontality', 'Cross-cutting relationships', 'Lateral continuity'], correct: 2, explanation: 'The principle of cross-cutting relationships states that any geological feature that cuts across another rock must be younger than the rock it cuts.' },
  ],
  palaeontology: [
    { q: 'Which era is known as the "Age of Reptiles"?', options: ['Palaeozoic', 'Mesozoic', 'Cenozoic', 'Proterozoic'], correct: 1, explanation: 'The Mesozoic Era (252–66 Ma) is known as the Age of Reptiles, dominated by dinosaurs, marine reptiles, and flying pterosaurs.' },
    { q: 'Ammonites are useful index fossils because they:', options: ['Are found only in deep water', 'Evolved slowly over long periods', 'Evolved rapidly and were widely distributed', 'Are resistant to weathering'], correct: 2, explanation: 'Ammonites evolved rapidly into many distinct forms and were geographically widespread, making them excellent zone fossils.' },
    { q: 'The Cambrian Explosion refers to:', options: ['A volcanic event in the Cambrian', 'Rapid diversification of multicellular life', 'The first appearance of vascular plants', 'A mass extinction at the end of the Cambrian'], correct: 1, explanation: 'The Cambrian Explosion (~541 Ma) was a rapid diversification of multicellular animal life where most major animal phyla appeared.' },
    { q: 'Graptolites are index fossils primarily used in:', options: ['Triassic rocks', 'Ordovician and Silurian rocks', 'Jurassic rocks', 'Permian rocks'], correct: 1, explanation: 'Graptolites are excellent zone fossils for Ordovician and Silurian marine sedimentary rocks.' },
    { q: 'Which of the following is the correct order from oldest to youngest?', options: ['Cambrian → Ordovician → Silurian → Devonian', 'Devonian → Silurian → Ordovician → Cambrian', 'Silurian → Cambrian → Devonian → Ordovician', 'Ordovician → Devonian → Cambrian → Silurian'], correct: 0, explanation: 'The correct Palaeozoic order is: Cambrian (541 Ma) → Ordovician (485 Ma) → Silurian (444 Ma) → Devonian (419 Ma).' },
  ],
  economic: [
    { q: 'The largest reserves of iron ore in India are found in:', options: ['Rajasthan', 'Jharkhand and Odisha', 'Karnataka', 'Madhya Pradesh'], correct: 1, explanation: 'Jharkhand and Odisha together hold the largest iron ore reserves in India, with major deposits at Singhbhum and Keonjhar.' },
    { q: 'A placer deposit forms by:', options: ['Hydrothermal activity', 'Mechanical concentration by water or wind', 'Magmatic segregation', 'Residual weathering'], correct: 1, explanation: 'Placer deposits form when heavy, resistant minerals are mechanically concentrated by flowing water in stream beds or beach environments.' },
    { q: 'The Kolar Gold Fields are located in which Indian state?', options: ['Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Telangana'], correct: 2, explanation: 'The Kolar Gold Fields (KGF) are located in Karnataka and were among the deepest gold mines in the world.' },
    { q: 'Porphyry copper deposits are associated with:', options: ['Oceanic mid-ridge basalts', 'Subduction-related magmatism', 'Rift valley sediments', 'Evaporite sequences'], correct: 1, explanation: 'Porphyry copper deposits form in continental arc settings where subduction-related magmas carry copper-rich hydrothermal fluids.' },
    { q: 'Which mineral is the primary ore of aluminium?', options: ['Galena', 'Sphalerite', 'Bauxite', 'Chalcopyrite'], correct: 2, explanation: 'Bauxite is the primary ore of aluminium, formed by intense tropical laterisation of aluminium-bearing rocks.' },
  ],
  'remote-sensing': [
    { q: 'Which type of satellite sensor measures emitted radiation from Earth\'s surface?', options: ['Passive optical sensor', 'Active radar sensor', 'Thermal infrared sensor', 'Multispectral scanner'], correct: 2, explanation: 'Thermal infrared sensors detect heat emitted by the Earth\'s surface, useful for mapping geothermal activity and lithology.' },
    { q: 'In a false colour composite image, healthy vegetation appears:', options: ['Blue', 'Green', 'Red', 'Bright Red'], correct: 3, explanation: 'In a standard false colour composite (NIR-R-G), healthy vegetation reflects strongly in NIR and appears bright red.' },
    { q: 'LIDAR stands for:', options: ['Light Imaging Detection and Ranging', 'Linear Image Data and Reconnaissance', 'Large Infrared Detection Array', 'Laser Integrated Data Analysis Receiver'], correct: 0, explanation: 'LIDAR (Light Detection and Ranging) uses laser pulses to create high-resolution 3D terrain models.' },
    { q: 'The spatial resolution of a satellite image refers to:', options: ['Number of spectral bands', 'Smallest object detectable on the ground', 'Temporal frequency of imaging', 'Radiometric sensitivity'], correct: 1, explanation: 'Spatial resolution defines the smallest ground feature that can be distinguished in an image, measured as ground sampling distance in metres.' },
    { q: 'Which index is commonly used to map water bodies using satellite data?', options: ['NDVI', 'NDWI', 'SAVI', 'EVI'], correct: 1, explanation: 'NDWI (Normalised Difference Water Index) uses Green and NIR bands to highlight water bodies.' },
  ],
};

const TOPIC_META: Record<string, { name: string; icon: string }> = {
  mineralogy: { name: 'Mineralogy', icon: '💎' },
  petrology: { name: 'Petrology', icon: '🪨' },
  structural: { name: 'Structural Geology', icon: '🌋' },
  geomorphology: { name: 'Geomorphology', icon: '🗺️' },
  stratigraphy: { name: 'Stratigraphy', icon: '📐' },
  palaeontology: { name: 'Palaeontology', icon: '🦕' },
  economic: { name: 'Economic Geology', icon: '⛏️' },
  'remote-sensing': { name: 'Remote Sensing & GIS', icon: '🛰️' },
};

// ── tiny live score strip shown after each answered question ──
function LiveScoreBar({ score, total }: { score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/8 bg-slate-900/60 backdrop-blur-sm w-fit mx-auto"
    >
      <span className="text-xs font-mono text-slate-400">Score</span>
      <span className="text-sm font-bold text-white">{score}<span className="text-slate-500 font-normal">/{total}</span></span>
      <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <span className="text-xs font-mono text-blue-400">{pct}%</span>
    </motion.div>
  );
}

export default function QuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const meta = TOPIC_META[topicId ?? ''] ?? { name: 'Quiz', icon: '📝' };

  // Add an incrementing "attempt" state to force a re-shuffle
  const [attempt, setAttempt] = useState(0);

  const questions = useMemo(() => {
    if (!QUESTIONS[topicId ?? '']) return [];
    // Copy the array, shuffle it, and shuffle the options inside
    return [...QUESTIONS[topicId ?? '']]
      .sort(() => Math.random() - 0.5)
      .map(q => {
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        const newCorrectIdx = shuffledOptions.indexOf(q.options[q.correct]);
        return { ...q, options: shuffledOptions, correct: newCorrectIdx };
      });
  }, [topicId, attempt]);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  // Add this fix:
  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    window.scrollTo(0, 0); // Optional: scroll to top on topic change
  }, [topicId, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚧</p>
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-slate-400 mb-6">Questions for this topic are being prepared.</p>
          <button onClick={() => navigate('/quiz')} className="px-6 py-3 bg-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors">Back to Topics</button>
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const score = answers.filter((a, i) => a !== null && a === questions[i].correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  const getVerdict = () => {
    if (percentage >= 80) return { label: '🎉 Excellent!', color: 'text-green-400' };
    if (percentage >= 60) return { label: '👏 Very Good!', color: 'text-blue-400' };
    if (percentage >= 40) return { label: '👍 Good Effort!', color: 'text-yellow-400' };
    return { label: '📚 Keep Studying!', color: 'text-red-400' };
  };

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (answers[qIdx] !== null || submitted) return; // lock after first answer
    const updated = [...answers];
    updated[qIdx] = oIdx;
    setAnswers(updated);
  };

  // ─────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/quiz')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              <span className="text-[10px] font-mono uppercase tracking-widest">All Topics</span>
            </button>
            <span className="text-sm font-bold">{meta.icon} {meta.name}</span>
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Results</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">

          {/* ── GLASSMORPHISM SCORE CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative mb-12 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* soft glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
            </div>

            <div className="relative z-10 p-8 text-center">
              {/* top row: icon + topic */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-3xl">{meta.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Quiz Complete</p>
                  <p className="text-base font-bold text-white">{meta.name}</p>
                </div>
              </div>

              {/* score circle — compact */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                  <motion.circle cx="40" cy="40" r="32" fill="none"
                    stroke={percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#eab308' : '#ef4444'}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 32}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 32 * (1 - percentage / 100)}` }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{percentage}%</span>
                </div>
              </div>

              <p className={`text-lg font-bold mb-1 ${getVerdict().color}`}>{getVerdict().label}</p>
              <p className="text-slate-400 text-sm mb-6">
                <span className="text-white font-bold">{score}</span> correct out of <span className="text-white font-bold">{questions.length}</span>
              </p>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Correct', value: score, color: 'text-green-400' },
                  { label: 'Wrong', value: questions.length - score, color: 'text-red-400' },
                  { label: 'Score', value: `${percentage}%`, color: 'text-blue-400' },
                ].map(s => (
                  <div key={s.label} className="py-3 rounded-xl bg-white/5 border border-white/8">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setAnswers(Array(questions.length).fill(null)); setSubmitted(false); setAttempt(a => a + 1); }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors"
                >Retry</button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors"
                >Other Topics</button>
              </div>
            </div>
          </motion.div>

          {/* ── ANSWER REVIEW ── */}
          <h3 className="text-base font-bold mb-1">Answer Review</h3>
          <p className="text-slate-500 text-xs mb-6">Full breakdown of every question.</p>

          <div className="space-y-5">
            {questions.map((question, qIdx) => {
              const userAnswer = answers[qIdx];
              const isCorrect = userAnswer === question.correct;
              return (
                <motion.div key={qIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIdx * 0.04 }}
                  className="p-5 rounded-2xl border bg-slate-900/40"
                  style={{ borderColor: isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <p className="text-sm font-semibold leading-relaxed text-slate-200">
                      <span className="text-slate-500 font-mono text-xs mr-1.5">Q{qIdx + 1}.</span>{question.q}
                    </p>
                  </div>
                  <div className="space-y-1.5 ml-8 mb-3">
                    {question.options.map((opt, oIdx) => {
                      const isThisCorrect = oIdx === question.correct;
                      const isThisSelected = oIdx === userAnswer;
                      let cls = 'border-white/5 text-slate-600';
                      if (isThisCorrect) cls = 'border-green-500/30 bg-green-500/8 text-green-300';
                      else if (isThisSelected) cls = 'border-red-500/30 bg-red-500/8 text-red-300 line-through';
                      return (
                        <div key={oIdx} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs ${cls}`}>
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {opt}
                          {isThisCorrect && <span className="ml-auto text-[9px] font-mono text-green-400 uppercase">Correct</span>}
                          {isThisSelected && !isThisCorrect && <span className="ml-auto text-[9px] font-mono text-red-400 uppercase">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="ml-8 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-blue-400 mb-1">Explanation</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{question.explanation}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────
  // QUIZ SCREEN
  // ─────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/quiz')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            <span className="text-[10px] font-mono uppercase tracking-widest">All Topics</span>
          </button>
          <span className="text-sm font-bold">{meta.icon} {meta.name}</span>
          <span className="text-xs font-mono text-slate-400">
            <span className="text-white font-bold">{answeredCount}</span>/{questions.length}
          </span>
        </div>
      </nav>

      {/* progress bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 h-[2px] bg-slate-800">
        <motion.div className="h-full bg-blue-500" animate={{ width: `${(answeredCount / questions.length) * 100}%` }} transition={{ duration: 0.3 }}/>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-32">

        {/* header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-1">Practice Quiz</p>
          <h1 className="text-2xl font-bold mb-0.5">{meta.name}</h1>
          <p className="text-slate-500 text-xs">{questions.length} questions — answers revealed instantly after each selection</p>
        </motion.div>

        {/* live score strip — appears after first answer */}
        <AnimatePresence>
          {answeredCount > 0 && (
            <motion.div
              key="scorebar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <LiveScoreBar score={score} total={answeredCount} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* all questions */}
        <div className="space-y-8">
          {questions.map((question, qIdx) => {
            const userAnswer = answers[qIdx];
            const isAnswered = userAnswer !== null;

            return (
              <motion.div key={qIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.05 }}
                className="p-6 rounded-2xl border border-white/8 bg-slate-900/40"
              >
                {/* question */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <p className="text-base font-semibold leading-relaxed text-slate-100">{question.q}</p>
                </div>

                {/* options */}
                <div className="space-y-2.5 ml-10" role="radiogroup" aria-label="Quiz options">
                  {question.options.map((opt, oIdx) => {
                    let cls = 'border-white/8 bg-slate-900/30 text-slate-300 hover:border-white/20 hover:bg-slate-900/60 cursor-pointer';
                    if (isAnswered) {
                      if (oIdx === question.correct) cls = 'border-green-500/50 bg-green-500/10 text-green-200 cursor-default';
                      else if (oIdx === userAnswer) cls = 'border-red-500/50 bg-red-500/10 text-red-300 cursor-default';
                      else cls = 'border-white/5 bg-transparent text-slate-600 opacity-40 cursor-default';
                    }
                    return (
                      <button key={oIdx} onClick={() => handleSelect(qIdx, oIdx)} disabled={isAnswered || submitted}
                        role="radio" aria-checked={oIdx === userAnswer}
                        className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all duration-200 ${cls}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAnswered && oIdx === question.correct && (
                          <span className="text-[9px] font-mono uppercase text-green-400 tracking-wider">✓ Correct</span>
                        )}
                        {isAnswered && oIdx === userAnswer && oIdx !== question.correct && (
                          <span className="text-[9px] font-mono uppercase text-red-400 tracking-wider">✗ Wrong</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* instant explanation */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-10 overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-blue-400 mb-1.5">Explanation</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{question.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

        {/* submit */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 flex flex-col items-center gap-3">
          {answeredCount < questions.length && (
            <p className="text-xs text-slate-500 font-mono">{questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's' : ''} remaining</p>
          )}
          <button
            onClick={() => { if (answeredCount === questions.length) setSubmitted(true); }}
            disabled={answeredCount < questions.length}
            className={`px-12 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${answeredCount === questions.length
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:scale-105'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            Submit & See Results
          </button>
        </motion.div>

      </div>
    </div>
  );
}
