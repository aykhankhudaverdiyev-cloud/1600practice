import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card3D from '../components/Card3D';
import { useAttempts, getQuestionById, showToast } from '../store';
import { renderRichText } from '../components/RichText';

export default function SavedQuestions() {
  const { getSavedQuestions, toggleReview } = useAttempts();
  const saved = getSavedQuestions();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    toggleReview(id);
    showToast('Removed from saved');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">
          <span className="gradient-text">Saved</span> Questions
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Questions you marked for review during practice. ({saved.length} saved)
        </p>
      </motion.div>

      {saved.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-12 text-center" style={{ borderStyle: 'dashed' }}>
            <div className="text-5xl mb-4">🔖</div>
            <p className="text-white/40 text-sm">No saved questions yet.</p>
            <p className="text-white/20 text-xs mt-2">Mark questions with ⭐ during practice to save them here.</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {saved.map((attempt, i) => {
            const q = getQuestionById(attempt.question_id);
            if (!q) return null;
            const isExpanded = expanded === attempt.id;
            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card3D className="p-5 overflow-hidden" glowColor={attempt.is_correct ? '52, 211, 153' : '239, 68, 68'}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full">{q.module}</span>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${
                        q.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' :
                        q.difficulty === 'medium' ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>{q.difficulty}</span>
                      <span className="text-[10px] font-medium text-white/20 px-2 py-1 rounded-full bg-white/5">{q.skill}</span>
                      {q.is_free_response && (
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full">Free Response</span>
                      )}
                    </div>
                    <button onClick={() => handleRemove(attempt.id)} className="text-xs text-white/20 hover:text-red-400 font-semibold transition-colors shrink-0 ml-2">
                      ✕ Remove
                    </button>
                  </div>

                  {/* Question text */}
                  <p className="text-sm text-white/80 font-medium mb-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : attempt.id)}>
                    {renderRichText(q.question_text)}
                  </p>

                  {/* Answer summary */}
                  <div className="flex items-center gap-4 text-sm mb-1">
                    <span className={`font-semibold ${attempt.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                      Your answer: {attempt.selected_answer || 'Skipped'} {attempt.is_correct ? '✓' : '✗'}
                    </span>
                    <span className="text-white/30">Correct: {q.is_free_response ? q.correct_value : q.correct_answer}</span>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : attempt.id)}
                    className="text-xs text-indigo-400/60 hover:text-indigo-400 font-medium mt-2 transition-colors"
                  >
                    {isExpanded ? '▲ Collapse' : '▼ Show full review'}
                  </button>

                  {/* Expanded review */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                          {/* Passage */}
                          {q.passage_text && (
                            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Passage</p>
                              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{renderRichText(q.passage_text)}</p>
                            </div>
                          )}

                          {/* Options review */}
                          {q.is_free_response ? (
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                              {q.options.map(opt => {
                                const isCorrect = opt.key === q.correct_answer;
                                const isSelected = opt.key === attempt.selected_answer;
                                const isWrong = isSelected && !isCorrect;
                                return (
                                  <div key={opt.key} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : isWrong ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
                                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 shrink-0 ${isCorrect ? 'bg-green-500 border-green-500 text-white' : isWrong ? 'bg-red-500 border-red-500 text-white' : 'border-white/15 text-white/30'}`}>
                                      {isCorrect ? '✓' : isWrong ? '✗' : opt.key}
                                    </span>
                                    <span className="text-sm text-white/60 flex-1">{opt.text}</span>
                                    {isCorrect && <span className="text-green-400 text-[10px] font-bold shrink-0">Correct</span>}
                                    {isWrong && <span className="text-red-400 text-[10px] font-bold shrink-0">Your Answer</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Explanation */}
                          {q.explanation && (
                            <div className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl p-4">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5">💡 Explanation</p>
                              <p className="text-sm text-white/55 leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
