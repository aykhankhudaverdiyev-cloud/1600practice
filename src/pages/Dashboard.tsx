import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card3D from '../components/Card3D';
import Scene3D from '../components/Scene3D';
import BorderGlow from '../components/BorderGlow';
import MagicRings from '../components/MagicRings';
import { useTests, useAttempts, useQuestions } from '../store';

const statCards = [
  { label: 'Total Questions', icon: '📚', color: '99, 102, 241', key: 'questions' },
  { label: 'Tests Taken', icon: '📝', color: '168, 85, 247', key: 'tests' },
  { label: 'Best Score', icon: '🎯', color: '52, 211, 153', key: 'best' },
  { label: 'Streak', icon: '🔥', color: '251, 146, 60', key: 'streak' },
];

const features = [
  { title: 'Question Bank', desc: 'Browse and create SAT-style questions across R&W and Math', icon: '📚', path: '/bank', colors: ['#60a5fa', '#818cf8', '#a78bfa'], glowColor: '220 80 70' },
  { title: 'Test Builder', desc: 'Create custom practice tests from your question bank', icon: '🛠️', path: '/builder', colors: ['#a78bfa', '#c084fc', '#f472b6'], glowColor: '280 80 70' },
  { title: 'Study Plan', desc: 'AI-powered adaptive schedule built like an expert SAT tutor', icon: '🎯', path: '/plan', colors: ['#34d399', '#22d3ee', '#60a5fa'], glowColor: '160 70 65' },
  { title: 'Saved Questions', desc: 'Review bookmarked questions from your practice sessions', icon: '🔖', path: '/saved', colors: ['#fbbf24', '#fb923c', '#f472b6'], glowColor: '35 85 65' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const questions = useQuestions();
  const { tests, resetTest, deleteTest } = useTests();
  const { clearTestAttempts } = useAttempts();

  const completedTests = tests.filter(t => t.completed);
  const bestScore = completedTests.length > 0 ? Math.max(...completedTests.map(t => t.score || 0)) : 0;

  const getStatValue = (key: string) => {
    switch (key) {
      case 'questions': return questions.length;
      case 'tests': return completedTests.length;
      case 'best': return bestScore || '—';
      case 'streak': return Math.min(completedTests.length, 7);
      default: return 0;
    }
  };

  const handlePracticeAgain = (testId: string) => {
    clearTestAttempts(testId);
    resetTest(testId);
    try { localStorage.removeItem(`practice_${testId}`); } catch {}
    navigate(`/practice/${testId}`);
  };

  const handleDelete = (testId: string) => {
    clearTestAttempts(testId);
    deleteTest(testId);
    try { localStorage.removeItem(`practice_${testId}`); } catch {}
  };

  const formatTime = (s?: number) => {
    if (!s) return '';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
        <Scene3D variant="hero" />
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ opacity: 0.35 }}>
          <MagicRings color="#818cf8" colorTwo="#c084fc" ringCount={5} speed={0.6} attenuation={12} lineThickness={1.5} baseRadius={0.2} radiusStep={0.12} opacity={0.5} noiseAmount={0.05} scaleRate={0.08} />
        </div>
        <div className="absolute inset-0 radial-fade z-[2]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/60 font-medium">SAT Practice Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
              <span className="gradient-text">1600</span>{' '}<span className="text-white">Practice</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
              Master the Digital SAT with Bluebook-style practice. Build tests, track progress, and reach your perfect score.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/builder')} className="glow-button px-8 py-3.5 text-sm font-bold">Start Practice →</button>
              <button onClick={() => navigate('/bank')} className="px-8 py-3.5 text-sm font-bold rounded-full border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all">Question Bank</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.key} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <Card3D className="p-5" glowColor={card.color}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className="text-2xl font-extrabold text-white">{getStatValue(card.key)}</p>
                    <p className="text-xs text-white/40 font-medium">{card.label}</p>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl font-bold text-white mb-8">Quick Actions</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
              <BorderGlow colors={feat.colors} glowColor={feat.glowColor} borderRadius={20} edgeSensitivity={25} glowIntensity={0.8} fillOpacity={0.3} className="cursor-pointer">
                <div className="p-6" onClick={() => navigate(feat.path)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-lg" style={{ background: `linear-gradient(135deg, ${feat.colors[0]}, ${feat.colors[2]})` }}>{feat.icon}</div>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Tests */}
      {tests.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Your Tests</h2>
          <div className="space-y-3">
            {[...tests].reverse().map((test) => (
              <Card3D key={test.id} className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">{test.name}</h3>
                      {test.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                          Completed
                        </span>
                      )}
                      {!test.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/30">
                      {test.question_ids.length} questions • {new Date(test.created_at).toLocaleDateString()}
                      {test.time_taken ? ` • ${formatTime(test.time_taken)}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {test.completed ? (
                      <>
                        <div className="text-right mr-2">
                          <span className="text-2xl font-black gradient-text">{test.score}</span>
                          <span className="text-xs text-white/20 ml-1">/1600</span>
                        </div>
                        <button
                          onClick={() => navigate(`/results/${test.id}`)}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                          📊 Review Mistakes
                        </button>
                        <button
                          onClick={() => handlePracticeAgain(test.id)}
                          className="glow-button px-4 py-2 text-xs"
                        >
                          🔄 Practice Again
                        </button>
                      </>
                    ) : (
                      <button onClick={() => navigate(`/practice/${test.id}`)} className="glow-button px-5 py-2 text-xs">
                        ▶ Continue
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/builder/${test.id}`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-all text-sm"
                      title="Edit test"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/15 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm"
                      title="Delete test"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
