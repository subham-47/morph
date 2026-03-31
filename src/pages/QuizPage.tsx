import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

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

export default function QuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const questions = QUESTIONS[topicId ?? ''] ?? [];
  const meta = TOPIC_META[topicId ?? ''] ?? { name: 'Quiz', icon: '📝' };

  // answers[i] = index selected, or null if unanswered
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚧</p>
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-slate-400 mb-6">Questions for this topic are being prepared.</p>
          <button onClick={() => navigate('/quiz')} className="px-6 py-3 bg-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors">
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  const getEmoji = () => {
    if (percentage >= 80) return { label: '🎉 Excellent!', color: 'text-green-400' };
    if (percentage >= 60) return { label: '👏 Very Good!', color: 'text-blue-400' };
    if (percentage >= 40) return { label: '👍 Good Effort!', color: 'text-yellow-400' };
    return { label: '📚 Keep Studying!', color: 'text-red-400' };
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  // =====================
  // RESULTS SCREEN
  // =====================
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50">

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/quiz')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-widest">All Topics</span>
            </button>
            <span className="text-sm font-bold">{meta.icon} {meta.name}</span>
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Results</span>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">

          {/* === GLASSMORPHISM SCORE CARD === */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-14 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Glow blob behind card */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />

            <div className="relative z-10 p-10 text-center">

              {/* Topic icon */}
              <div className="text-5xl mb-4">{meta.icon}</div>
              <h2 className="text-2xl font-bold mb-1">{meta.name}</h2>
              <p className="text-slate-400 text-sm mb-8">Quiz Complete</p>

              {/* Score circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#eab308' : '#ef4444'}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 42}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 42 * (1 - percentage / 100)}` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{percentage}%</span>
                </div>
              </div>

              <p className={`text-xl font-bold mb-2 ${getEmoji().color}`}>{getEmoji().label}</p>
              <p className="text-slate-400 text-sm mb-8">
                You got <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> correct
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Correct', value: score, color: 'text-green-400' },
                  { label: 'Wrong', value: questions.length - score, color: 'text-red-400' },
                  { label: 'Score', value: `${percentage}%`, color: 'text-blue-400' },
                ].map(stat => (
                  <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setAnswers(Array(questions.length).fill(null)); setSubmitted(false); }}
                  className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors"
                >
                  Other Topics
                </button>
              </div>

            </div>
          </motion.div>

          {/* === REVIEW: ALL QUESTIONS WITH ANSWERS === */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-1">Answer Review</h3>
            <p className="text-slate-400 text-sm">See which questions you got right or wrong below.</p>
          </div>

          <div className="space-y-6">
            {questions.map((question, qIdx) => {
              const userAnswer = answers[qIdx];
              const isCorrect = userAnswer === question.correct;
              return (
                <motion.div
                  key={qIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIdx * 0.05 }}
                  className="p-6 rounded-2xl border bg-slate-900/40"
                  style={{ borderColor: isCorrect ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)' }}
                >
                  {/* Q header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <p className="text-sm font-semibold leading-relaxed text-slate-200">
                      <span className="text-slate-500 font-mono mr-2">Q{qIdx + 1}.</span>
                      {question.q}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4 ml-9">
                    {question.options.map((opt, oIdx) => {
                      const isThisCorrect = oIdx === question.correct;
                      const isThisSelected = oIdx === userAnswer;
                      let style = 'border-white/5 text-slate-500';
                      if (isThisCorrect) style = 'border-green-500/40 bg-green-500/8 text-green-300';
                      else if (isThisSelected && !isThisCorrect) style = 'border-red-500/40 bg-red-500/8 text-red-300 line-through';
                      return (
                        <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${style}`}>
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {opt}
                          {isThisCorrect && <span className="ml-auto text-[10px] font-mono text-green-400 uppercase tracking-wider">Correct</span>}
                          {isThisSelected && !isThisCorrect && <span className="ml-auto text-[10px] font-mono text-red-400 uppercase tracking-wider">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="ml-9 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1.5">Explanation</p>
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

  // =====================
  // QUIZ SCREEN (all questions visible)
  // =====================
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/quiz')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-widest">All Topics</span>
          </button>
          <span className="text-sm font-bold">{meta.icon} {meta.name}</span>
          {/* Live answered counter */}
          <span className="text-xs font-mono text-slate-400">
            <span className="text-white font-bold">{answeredCount}</span>/{questions.length} answered
          </span>
        </div>
      </nav>

      {/* Sticky progress bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 h-[2px] bg-slate-800">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-2">Practice Quiz</p>
          <h1 className="text-3xl font-bold mb-1">{meta.name}</h1>
          <p className="text-slate-400 text-sm">{questions.length} questions — answer all, then submit at the bottom</p>
        </motion.div>

        {/* All Questions */}
        <div className="space-y-8">
          {questions.map((question, qIdx) => (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIdx * 0.06 }}
              className="p-6 rounded-2xl border border-white/8 bg-slate-900/40"
            >
              {/* Question */}
              <div className="flex items-start gap-3 mb-5">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-base font-semibold leading-relaxed text-slate-100">{question.q}</p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 ml-10">
                {question.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all duration-200
                        ${isSelected
                          ? 'border-blue-500/60 bg-blue-500/12 text-blue-200'
                          : 'border-white/8 bg-slate-900/30 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                        }`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors
                        ${isSelected ? 'border-blue-400 text-blue-400' : 'border-slate-600 text-slate-500'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                      {isSelected && (
                        <span className="ml-auto">
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          {answeredCount < questions.length && (
            <p className="text-xs text-slate-500 font-mono">
              {questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's' : ''} remaining
            </p>
          )}
          <button
            onClick={() => { if (answeredCount === questions.length) setSubmitted(true); }}
            disabled={answeredCount < questions.length}
            className={`px-12 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${answeredCount === questions.length
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] scale-100 hover:scale-105'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
          >
            Submit Quiz
          </button>
        </motion.div>

      </div>
    </div>
  );
}
