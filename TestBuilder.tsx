import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card3D from '../components/Card3D';
import CircularProgress3D from '../components/CircularProgress3D';
import ElectricBorder from '../components/ElectricBorder';
import { useTests, useAttempts, getQuestionById } from '../store';
import { renderRichText } from '../components/RichText';


export default function Results() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { tests, resetTest } = useTests();
  const { getTestAttempts, clearTestAttempts } = useAttempts();
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const test = tests.find(t => t.id === testId);
  const attempts = test ? getTestAttempts(test.id) : [];

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-10 text-center">
          <p className="text-white/60 mb-4">Test not found</p>
          <button onClick={() => navigate('/')} className="glow-button px-6 py-2 text-sm">Go Home</button>
        </div>
      </div>
    );
  }

  const rwAttempts = attempts.filter(a => getQuestionById(a.question_id)?.module.startsWith('RW'));
  const mathAttempts = attempts.filter(a => getQuestionById(a.question_id)?.module.startsWith('Math'));
  const rwCorrect = rwAttempts.filter(a => a.is_correct).length;
  const mathCorrect = mathAttempts.filter(a => a.is_correct).length;
  const totalCorrect = attempts.filter(a => a.is_correct).length;
  const totalWrong = attempts.length - totalCorrect;

  const scorePercent = (test.score || 0) / 1600;
  const electricColor = scorePercent >= 0.9 ? '#34d399' : scorePercent >= 0.7 ? '#818cf8' : scorePercent >= 0.5 ? '#fbbf24' : '#f87171';

  const filteredAttempts = attempts.filter(a => {
    if (filter === 'wrong') return !a.is_correct;
    if (filter === 'correct') return a.is_correct;
    return true;
  });

  const handlePracticeAgain = () => {
    clearTestAttempts(test.id);
    resetTest(test.id);
    navigate(`/practice/${test.id}`);
  };

  const formatTime = (s?: number) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const renderQuestionReview = (attempt: typeof attempts[0], idx: number) => {
    const q = getQuestionById(attempt.question_id);
    if (!q) return null;
    const isExpanded = expandedQ === attempt.id;

    return (
      <motion.div key={attempt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}>
        <Card3D className="overflow-hidden" intensity={3}>
          {/* Summary row */}
          <div className="p-4 cursor-pointer flex items-center justify-between gap-3" onClick={() => setExpandedQ(isExpanded ? null : attempt.id)}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${attempt.is_correct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {attempt.is_correct ? '✓' : '✗'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">{q.module.includes('RW') ? 'R&W' : 'Math'}</span>
                  <span className="text-[10px] font-medium text-white/25">{q.skill}</span>
                </div>
                <p className="text-sm text-white/70 truncate">{q.question_text}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p className="text-[9px] uppercase text-white/20 tracking-wider">Yours</p>
                <p className={`font-bold text-sm ${attempt.is_correct ? 'text-green-400' : 'text-red-400'}`}>{attempt.selected_answer || '—'}</p>
              </div>
              {!attempt.is_correct && (
                <div className="text-center">
                  <p className="text-[9px] uppercase text-white/20 tracking-wider">Correct</p>
                  <p className="font-bold text-sm text-green-400">{q.is_free_response ? q.correct_value : q.correct_answer}</p>
                </div>
              )}
              <span className={`text-white/20 text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </div>

          {/* Expanded: Full question review */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="px-4 pb-5 border-t border-white/5 pt-4">
                  {/* Passage */}
                  {q.passage_text && (
                    <div className="bg-white/[0.02] rounded-xl p-4 mb-4 border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Passage</p>
                      <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{renderRichText(q.passage_text)}</p>
                    </div>
                  )}

                  {/* Question */}
                  <p className="text-sm text-white/80 font-medium mb-4">{renderRichText(q.question_text)}</p>

                  {/* Options or free-response review */}
                  {q.is_free_response ? (
                    <div className="space-y-2 mb-4">
                      <div className={`p-3 rounded-xl border ${attempt.is_correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <span className="text-xs text-white/30 block mb-1">Your answer:</span>
                        <span className={`text-sm font-bold ${attempt.is_correct ? 'text-green-400' : 'text-red-400'}`}>{attempt.selected_answer || '(blank)'}</span>
                      </div>
                      {!attempt.is_correct && (
                        <div className="p-3 rounded-xl border border-green-500/30 bg-green-500/5">
                          <span className="text-xs text-white/30 block mb-1">Correct answer:</span>
                          <span className="text-sm font-bold text-green-400">{q.correct_value}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {q.options.map(opt => {
                        const isCorrect = opt.key === q.correct_answer;
                        const isSelected = opt.key === attempt.selected_answer;
                        const isWrongSelection = isSelected && !isCorrect;
                        return (
                          <div key={opt.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isCorrect ? 'border-green-500/30 bg-green-500/5' : isWrongSelection ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 shrink-0 ${isCorrect ? 'bg-green-500 border-green-500 text-white' : isWrongSelection ? 'bg-red-500 border-red-500 text-white' : 'border-white/15 text-white/30'}`}>
                              {isCorrect ? '✓' : isWrongSelection ? '✗' : opt.key}
                            </span>
                            <span className="text-sm text-white/60 flex-1">{opt.text}</span>
                            {isCorrect && <span className="text-green-400 text-[10px] font-bold shrink-0">Correct Answer</span>}
                            {isWrongSelection && <span className="text-red-400 text-[10px] font-bold shrink-0">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5">💡 Explanation</p>
                    <p className="text-sm text-white/55 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card3D>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-white/30 hover:text-white/60 mb-4 flex items-center gap-1">← Back to Dashboard</button>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-2"><span className="gradient-text">Results</span> — {test.name}</h1>
            <p className="text-white/40 text-sm">Completed {new Date(test.created_at).toLocaleDateString()} • Time: {formatTime(test.time_taken)}</p>
          </div>
          <button onClick={handlePracticeAgain} className="glow-button px-5 py-2.5 text-sm flex items-center gap-2 shrink-0">
            🔄 Practice Again
          </button>
        </div>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card3D className="p-6 flex flex-col items-center h-full" glowColor="99, 102, 241">
            <CircularProgress3D value={test.rw_score || 0} max={800} label="Reading & Writing" color="#818cf8" />
            <p className="text-sm text-white/30 mt-4">{rwCorrect}/{rwAttempts.length} correct</p>
          </Card3D>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ElectricBorder color={electricColor} speed={0.8} chaos={0.08} borderRadius={20}>
            <div className="p-6 flex flex-col items-center justify-center" style={{ background: 'rgba(15,15,35,0.9)', borderRadius: 20, minHeight: 220 }}>
              <p className="text-white/50 font-semibold text-sm mb-3 uppercase tracking-wider">Total Score</p>
              <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                className="text-6xl font-black gradient-text" style={{ textShadow: `0 0 30px ${electricColor}60` }}>{test.score}</motion.span>
              <span className="text-xl text-white/20">/1600</span>
              <div className="mt-4 w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${scorePercent * 100}%` }} transition={{ delay: 0.5, duration: 1.5 }}
                  className="h-full rounded-full" style={{ background: electricColor, boxShadow: `0 0 15px ${electricColor}80` }} />
              </div>
              <p className="text-xs text-white/25 mt-2">{totalCorrect} correct · {totalWrong} wrong</p>
            </div>
          </ElectricBorder>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card3D className="p-6 flex flex-col items-center h-full" glowColor="52, 211, 153">
            <CircularProgress3D value={test.math_score || 0} max={800} label="Math" color="#34d399" />
            <p className="text-sm text-white/30 mt-4">{mathCorrect}/{mathAttempts.length} correct</p>
          </Card3D>
        </motion.div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl font-bold text-white">
          Question Review
        </motion.h2>
        <div className="glass-card px-1.5 py-1.5 flex gap-1">
          {[
            { key: 'all' as const, label: `All (${attempts.length})` },
            { key: 'wrong' as const, label: `❌ Wrong (${totalWrong})` },
            { key: 'correct' as const, label: `✅ Correct (${totalCorrect})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f.key ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredAttempts.map((attempt, i) => renderQuestionReview(attempt, i))}
      </div>

      {filteredAttempts.length === 0 && (
        <div className="glass-card p-10 text-center" style={{ borderStyle: 'dashed' }}>
          <p className="text-white/40 text-sm">{filter === 'wrong' ? 'No wrong answers — great job! 🎉' : filter === 'correct' ? 'No correct answers yet.' : 'No attempts found.'}</p>
        </div>
      )}
    </div>
  );
}
