import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

// ===========================
// QUESTION DATA PER TOPIC
// ===========================
const QUESTIONS: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  mineralogy: [
    {
      q: 'Which mineral has a hardness of 10 on the Mohs scale?',
      options: ['Corundum', 'Diamond', 'Topaz', 'Quartz'],
      correct: 1,
      explanation: 'Diamond is the hardest natural mineral with a Mohs hardness of 10. Corundum is 9, Topaz is 8, and Quartz is 7.',
    },
    {
      q: 'What is the chemical formula of Quartz?',
      options: ['CaCO₃', 'SiO₂', 'Al₂O₃', 'FeS₂'],
      correct: 1,
      explanation: 'Quartz is silicon dioxide (SiO₂). CaCO₃ is Calcite, Al₂O₃ is Corundum, and FeS₂ is Pyrite.',
    },
    {
      q: 'Which crystal system does Halite belong to?',
      options: ['Hexagonal', 'Orthorhombic', 'Cubic', 'Monoclinic'],
      correct: 2,
      explanation: 'Halite (NaCl) belongs to the Cubic (Isometric) crystal system, forming perfect cube-shaped crystals.',
    },
    {
      q: 'The specific gravity of Olivine ranges approximately from:',
      options: ['2.2 – 2.6', '3.2 – 4.4', '5.0 – 5.5', '1.8 – 2.1'],
      correct: 1,
      explanation: 'Olivine has a specific gravity of approximately 3.27–4.37, depending on the Mg/Fe ratio in the solid solution series.',
    },
    {
      q: 'Which property distinguishes Calcite from Dolomite in the field?',
      options: ['Colour', 'Cleavage', 'Reaction with cold dilute HCl', 'Hardness'],
      correct: 2,
      explanation: 'Calcite effervesces vigorously with cold dilute HCl. Dolomite only reacts when powdered. This is the classic field test.',
    },
  ],
  petrology: [
    {
      q: 'Bowen\'s Reaction Series describes the sequence of:',
      options: ['Metamorphic grade increase', 'Mineral crystallisation from magma', 'Sediment deposition order', 'Fossil succession'],
      correct: 1,
      explanation: 'Bowen\'s Reaction Series describes the order in which minerals crystallise from a cooling magma, divided into continuous and discontinuous series.',
    },
    {
      q: 'Which rock texture is characterised by large crystals set in a fine-grained groundmass?',
      options: ['Pegmatitic', 'Porphyritic', 'Granular', 'Glassy'],
      correct: 1,
      explanation: 'Porphyritic texture has large phenocrysts embedded in a finer groundmass, indicating two stages of cooling.',
    },
    {
      q: 'The index mineral Kyanite indicates which metamorphic condition?',
      options: ['High temperature, low pressure', 'Low temperature, high pressure', 'High temperature, high pressure', 'Low temperature, low pressure'],
      correct: 1,
      explanation: 'Kyanite is stable at low temperature and high pressure conditions, making it an important pressure indicator in metamorphic petrology.',
    },
    {
      q: 'Which sedimentary structure indicates current direction?',
      options: ['Graded bedding', 'Cross-bedding', 'Ripple marks', 'Both B and C'],
      correct: 3,
      explanation: 'Both cross-bedding and ripple marks are reliable palaeocurrent indicators. Cross-bedding foreset dip and ripple mark asymmetry both indicate flow direction.',
    },
    {
      q: 'Granite and Rhyolite are compositionally equivalent but differ in:',
      options: ['Silica content', 'Mineral assemblage', 'Texture due to cooling rate', 'Tectonic setting'],
      correct: 2,
      explanation: 'Granite (coarse-grained) and Rhyolite (fine-grained) have the same composition but different textures because granite cools slowly deep underground while rhyolite cools rapidly at the surface.',
    },
  ],
  structural: [
    {
      q: 'In a syncline, the youngest rocks are found:',
      options: ['At the core', 'At the limbs', 'At the hinge', 'At the axial plane'],
      correct: 0,
      explanation: 'In a syncline, beds dip toward the core, so the youngest rocks occupy the central core. In an anticline, the oldest rocks are at the core.',
    },
    {
      q: 'A fault where the hanging wall moves up relative to the footwall is called:',
      options: ['Normal fault', 'Reverse fault', 'Strike-slip fault', 'Transform fault'],
      correct: 1,
      explanation: 'In a reverse fault, the hanging wall moves upward relative to the footwall, caused by compressional forces. It has a low dip angle when called a thrust fault.',
    },
    {
      q: 'The San Andreas Fault is an example of:',
      options: ['Normal fault', 'Reverse fault', 'Right-lateral strike-slip fault', 'Left-lateral strike-slip fault'],
      correct: 2,
      explanation: 'The San Andreas Fault is a right-lateral (dextral) strike-slip fault where the Pacific Plate moves northwest relative to the North American Plate.',
    },
    {
      q: 'Which of the following is NOT a type of fold?',
      options: ['Anticline', 'Syncline', 'Graben', 'Monocline'],
      correct: 2,
      explanation: 'A Graben is a down-dropped block bounded by normal faults — it is a fault structure, not a fold. Anticline, syncline, and monocline are all fold types.',
    },
    {
      q: 'Riedel shears are associated with which structural feature?',
      options: ['Thrust belts', 'Strike-slip fault zones', 'Fold hinges', 'Salt diapirs'],
      correct: 1,
      explanation: 'Riedel shears (R and R\' shears) are secondary shear fractures that develop in the damage zone of strike-slip fault systems.',
    },
  ],
  geomorphology: [
    {
      q: 'According to Davis\'s Geographical Cycle, a peneplain represents which stage?',
      options: ['Youth', 'Maturity', 'Old Age', 'Rejuvenation'],
      correct: 2,
      explanation: 'A peneplain is a nearly flat, featureless erosional surface representing the Old Age stage of Davis\'s cycle of erosion, where relief is minimal.',
    },
    {
      q: 'Which landform is formed by glacial deposition?',
      options: ['Cirque', 'Arête', 'Drumlin', 'Horn'],
      correct: 2,
      explanation: 'Drumlins are streamlined hills formed by glacial deposition. Cirques, arêtes, and horns are all erosional glacial landforms.',
    },
    {
      q: 'A barchan dune forms when:',
      options: ['Wind direction is variable', 'Vegetation cover is dense', 'Sand supply is limited and wind is unidirectional', 'Sand supply is abundant'],
      correct: 2,
      explanation: 'Barchan dunes are crescent-shaped dunes that form where sand supply is limited and wind blows consistently from one direction.',
    },
    {
      q: 'The term "knickpoint" refers to:',
      options: ['A sharp bend in a coastline', 'A break in slope along a river profile', 'The highest point of a watershed', 'A glacial cirque floor'],
      correct: 1,
      explanation: 'A knickpoint is a sharp break or irregularity in the longitudinal profile of a river, often caused by rejuvenation or resistant rock bands.',
    },
    {
      q: 'Karst topography is primarily developed in:',
      options: ['Granite terrain', 'Basalt terrain', 'Limestone terrain', 'Sandstone terrain'],
      correct: 2,
      explanation: 'Karst topography develops on soluble rocks, primarily limestone (CaCO₃), through dissolution by slightly acidic groundwater, forming sinkholes, caves, and dolines.',
    },
  ],
  stratigraphy: [
    {
      q: 'Steno\'s Law of Superposition states that:',
      options: ['Sediments are deposited horizontally', 'Younger beds lie above older beds', 'Lateral continuity exists across basins', 'Cross-cutting features are younger'],
      correct: 1,
      explanation: 'The Law of Superposition states that in an undisturbed sequence of sedimentary rocks, the youngest layers are at the top and oldest at the bottom.',
    },
    {
      q: 'The boundary between the Cretaceous and Paleogene periods is marked by:',
      options: ['A major volcanic event', 'The K-Pg mass extinction', 'A glaciation event', 'A sea level highstand'],
      correct: 1,
      explanation: 'The K-Pg (Cretaceous-Paleogene) boundary is marked by a major mass extinction event ~66 Ma ago, associated with a bolide impact and possibly volcanic activity.',
    },
    {
      q: 'Index fossils are characterised by:',
      options: ['Long stratigraphic range and narrow geographic distribution', 'Short stratigraphic range and wide geographic distribution', 'Rare occurrence and unique morphology', 'Preservation only in deep marine sediments'],
      correct: 1,
      explanation: 'Index fossils have a short stratigraphic range (existed for a brief period) and wide geographic distribution, making them ideal for correlating rock units globally.',
    },
    {
      q: 'The Deccan Traps in India were formed during which geological period?',
      options: ['Jurassic', 'Triassic', 'Late Cretaceous to Early Paleocene', 'Miocene'],
      correct: 2,
      explanation: 'The Deccan Traps are a large volcanic province formed during the Late Cretaceous to Early Paleocene (~66 Ma), coinciding with the K-Pg boundary.',
    },
    {
      q: 'Which principle states that a rock unit is younger than the rocks it cuts across?',
      options: ['Superposition', 'Original horizontality', 'Cross-cutting relationships', 'Lateral continuity'],
      correct: 2,
      explanation: 'The principle of cross-cutting relationships states that any geological feature (fault, intrusion, etc.) that cuts across another rock must be younger than the rock it cuts.',
    },
  ],
  palaeontology: [
    {
      q: 'Which era is known as the "Age of Reptiles"?',
      options: ['Palaeozoic', 'Mesozoic', 'Cenozoic', 'Proterozoic'],
      correct: 1,
      explanation: 'The Mesozoic Era (252–66 Ma) is known as the Age of Reptiles, dominated by dinosaurs, marine reptiles, and flying pterosaurs.',
    },
    {
      q: 'Ammonites are useful index fossils because they:',
      options: ['Are found only in deep water', 'Evolved slowly over long periods', 'Evolved rapidly and were widely distributed', 'Are resistant to weathering'],
      correct: 2,
      explanation: 'Ammonites evolved rapidly into many distinct forms and were geographically widespread, making them excellent zone fossils for Jurassic and Cretaceous rocks.',
    },
    {
      q: 'The Cambrian Explosion refers to:',
      options: ['A volcanic event in the Cambrian', 'Rapid diversification of multicellular life', 'The first appearance of vascular plants', 'A mass extinction at the end of the Cambrian'],
      correct: 1,
      explanation: 'The Cambrian Explosion (~541 Ma) was a rapid diversification of multicellular animal life where most major animal phyla appeared in the fossil record.',
    },
    {
      q: 'Graptolites are index fossils primarily used in:',
      options: ['Triassic rocks', 'Ordovician and Silurian rocks', 'Jurassic rocks', 'Permian rocks'],
      correct: 1,
      explanation: 'Graptolites are colonial organisms that are excellent zone fossils for Ordovician and Silurian marine sedimentary rocks.',
    },
    {
      q: 'Which of the following is the correct order from oldest to youngest?',
      options: ['Cambrian → Ordovician → Silurian → Devonian', 'Devonian → Silurian → Ordovician → Cambrian', 'Silurian → Cambrian → Devonian → Ordovician', 'Ordovician → Devonian → Cambrian → Silurian'],
      correct: 0,
      explanation: 'The correct Palaeozoic order is: Cambrian (541 Ma) → Ordovician (485 Ma) → Silurian (444 Ma) → Devonian (419 Ma) → Carboniferous → Permian.',
    },
  ],
  economic: [
    {
      q: 'The largest reserves of iron ore in India are found in:',
      options: ['Rajasthan', 'Jharkhand and Odisha', 'Karnataka', 'Madhya Pradesh'],
      correct: 1,
      explanation: 'Jharkhand and Odisha together hold the largest iron ore reserves in India, with major deposits at Singhbhum, Keonjhar, and Mayurbhanj.',
    },
    {
      q: 'A placer deposit forms by:',
      options: ['Hydrothermal activity', 'Mechanical concentration by water or wind', 'Magmatic segregation', 'Residual weathering'],
      correct: 1,
      explanation: 'Placer deposits form when heavy, resistant minerals (gold, cassiterite, ilmenite) are mechanically concentrated by flowing water in stream beds or beach environments.',
    },
    {
      q: 'The Kolar Gold Fields are located in which Indian state?',
      options: ['Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Telangana'],
      correct: 2,
      explanation: 'The Kolar Gold Fields (KGF) are located in Karnataka. They were among the deepest gold mines in the world before closure.',
    },
    {
      q: 'Porphyry copper deposits are associated with:',
      options: ['Oceanic mid-ridge basalts', 'Subduction-related magmatism', 'Rift valley sediments', 'Evaporite sequences'],
      correct: 1,
      explanation: 'Porphyry copper deposits form in continental arc settings where subduction-related magmas carry copper-rich hydrothermal fluids.',
    },
    {
      q: 'Which mineral is the primary ore of aluminium?',
      options: ['Galena', 'Sphalerite', 'Bauxite', 'Chalcopyrite'],
      correct: 2,
      explanation: 'Bauxite is the primary ore of aluminium. It is a weathering product formed by intense tropical laterisation of aluminium-bearing rocks.',
    },
  ],
  'remote-sensing': [
    {
      q: 'Which type of satellite sensor measures emitted radiation from Earth\'s surface?',
      options: ['Passive optical sensor', 'Active radar sensor', 'Thermal infrared sensor', 'Multispectral scanner'],
      correct: 2,
      explanation: 'Thermal infrared sensors detect heat emitted by the Earth\'s surface, useful for mapping geothermal activity, lithology, and soil moisture.',
    },
    {
      q: 'In a false colour composite image, healthy vegetation appears:',
      options: ['Blue', 'Green', 'Red', 'Bright Red'],
      correct: 3,
      explanation: 'In a standard false colour composite (NIR-R-G), healthy vegetation reflects strongly in NIR and appears bright red, as NIR is assigned to the red channel.',
    },
    {
      q: 'LIDAR stands for:',
      options: ['Light Imaging Detection and Ranging', 'Linear Image Data and Reconnaissance', 'Large Infrared Detection Array', 'Laser Integrated Data Analysis Receiver'],
      correct: 0,
      explanation: 'LIDAR (Light Detection and Ranging) uses laser pulses to measure distances and create high-resolution 3D terrain models, widely used in geological mapping.',
    },
    {
      q: 'The spatial resolution of a satellite image refers to:',
      options: ['Number of spectral bands', 'Smallest object detectable on the ground', 'Temporal frequency of imaging', 'Radiometric sensitivity'],
      correct: 1,
      explanation: 'Spatial resolution defines the smallest ground feature that can be distinguished in an image, measured as ground sampling distance (GSD) in metres.',
    },
    {
      q: 'Which index is commonly used to map water bodies using satellite data?',
      options: ['NDVI', 'NDWI', 'SAVI', 'EVI'],
      correct: 1,
      explanation: 'NDWI (Normalised Difference Water Index) uses Green and NIR bands to highlight water bodies and is widely used in geological and hydrological mapping.',
    },
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

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

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

  const question = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    if (idx === question.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1]);
    } else {
      setFinished(true);
    }
  };

  const percentage = Math.round((score / questions.length) * 100);
  const getEmoji = () => {
    if (percentage >= 80) return '🎉 Excellent!';
    if (percentage >= 60) return '👏 Very Good!';
    if (percentage >= 40) return '👍 Good Effort!';
    if (percentage >= 20) return '💪 Keep Practising!';
    return '📚 Study More!';
  };

  // --- RESULTS SCREEN ---
  if (finished) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <div className="text-6xl mb-6">{meta.icon}</div>
          <h2 className="text-3xl font-bold mb-2">{meta.name}</h2>
          <p className="text-slate-400 mb-10">Quiz Complete</p>

          {/* Score Circle */}
          <div className="relative w-36 h-36 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-blue-400">{percentage}%</span>
            </div>
          </div>

          <p className="text-2xl font-bold mb-2">{getEmoji()}</p>
          <p className="text-slate-400 mb-10">
            You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setCurrent(0); setSelected(answers[0]); setScore(0); setFinished(false); setAnswers(Array(questions.length).fill(null)); }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="px-6 py-3 bg-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              Other Topics
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
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
          <span className="text-xs font-mono text-slate-500">{current + 1} / {questions.length}</span>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 h-[2px] bg-slate-800">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Question Number & Text */}
          <div className="mb-10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-blue-500 mb-3 block">
              Question {current + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
              {question.q}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((opt, idx) => {
              let style = 'border-white/8 bg-slate-900/40 hover:border-blue-500/50 hover:bg-slate-900/70';
              if (selected !== null) {
                if (idx === question.correct) style = 'border-green-500/60 bg-green-500/10 text-green-300';
                else if (idx === selected && selected !== question.correct) style = 'border-red-500/60 bg-red-500/10 text-red-300';
                else style = 'border-white/5 bg-slate-900/20 opacity-50';
              }
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  whileTap={{ scale: selected === null ? 0.98 : 1 }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${style}`}
                >
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-900/60 border border-blue-500/20 rounded-xl mb-8"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">Explanation</p>
              <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
            </motion.div>
          )}

          {/* Next Button */}
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
