import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const QUIZ_TOPICS = [
  { id: 'mineralogy', icon: '💎', name: 'Mineralogy', desc: 'Crystal systems, physical & optical properties', questions: 48, difficulty: 'Medium' },
  { id: 'petrology', icon: '🪨', name: 'Petrology', desc: 'Igneous, sedimentary and metamorphic rocks', questions: 52, difficulty: 'Hard' },
  { id: 'structural', icon: '🌋', name: 'Structural Geology', desc: 'Folds, faults, joints, plate tectonics', questions: 38, difficulty: 'Hard' },
  { id: 'geomorphology', icon: '🗺️', name: 'Geomorphology', desc: 'Landforms, Davis cycle, erosion processes', questions: 30, difficulty: 'Medium' },
  { id: 'stratigraphy', icon: '📐', name: 'Stratigraphy', desc: 'Rock sequences, geological time, principles', questions: 28, difficulty: 'Medium' },
  { id: 'palaeontology', icon: '🦕', name: 'Palaeontology', desc: 'Fossils, index fossils, biostratigraphy', questions: 24, difficulty: 'Easy' },
  { id: 'economic', icon: '⛏️', name: 'Economic Geology', desc: 'Ore deposits, mineral resources, mining', questions: 20, difficulty: 'Hard' },
  { id: 'remote-sensing', icon: '🛰️', name: 'Remote Sensing & GIS', desc: 'Satellite imagery, image interpretation', questions: 16, difficulty: 'Medium' },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function QuizTopics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-widest">Back to Home</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-sm tracking-wider uppercase">
              Geo<span className="text-blue-400 italic font-medium lowercase">Glacier</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-blue-500 mb-4 block">
            Quiz Hub
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose a <span className="text-blue-400 italic font-medium">Topic</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Select any branch of geology below to start a practice quiz. Instant feedback, explanations, and score tracking included.
          </p>
        </motion.div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZ_TOPICS.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => navigate(`/quiz/${topic.id}`)}
              className="group relative p-6 bg-slate-900/40 border border-white/8 rounded-2xl cursor-pointer hover:border-blue-500/40 hover:bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(37,99,235,0.15)]"
            >
              {/* Icon & Difficulty */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{topic.icon}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${DIFFICULTY_COLOR[topic.difficulty]}`}>
                  {topic.difficulty}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">
                {topic.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                {topic.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {topic.questions} questions
                </span>
                <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Start Quiz
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
