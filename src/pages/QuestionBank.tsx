import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card3D from '../components/Card3D';
import QuestionEditor from '../components/QuestionEditor';
import type { QuestionFormData } from '../components/QuestionEditor';
import { useQuestions, useQuestionActions, showToast } from '../store';
import type { Question } from '../store';
import { renderRichText } from '../components/RichText';

const moduleColors: Record<string, string> = {
  'RW Module 1': 'from-blue-500 to-indigo-600',
  'RW Module 2': 'from-purple-500 to-pink-600',
  'Math Module 1': 'from-emerald-500 to-cyan-500',
  'Math Module 2': 'from-amber-500 to-orange-500',
};

const difficultyColors: Record<string, string> = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function ActionMenu({
  onEdit,
  onDuplicate,
  onDelete,
}: {
  question?: Question;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={e => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
        title="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-30 w-44 py-1.5 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(20, 20, 50, 0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(99, 102, 241, 0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <span className="text-base w-5 text-center">✏️</span>
              Edit Question
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                onDuplicate();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <span className="text-base w-5 text-center">📋</span>
              Duplicate
            </button>
            <div className="my-1 border-t border-white/5" />
            <button
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
            >
              <span className="text-base w-5 text-center">🗑️</span>
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  questionText,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  questionText: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(15, 15, 40, 0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Delete Question?</h3>
            <p className="text-sm text-white/40 text-center mb-1 leading-relaxed">This action cannot be undone.</p>
            <p className="text-xs text-white/25 text-center mb-6 truncate px-4">"{questionText}"</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/8 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function QuestionBank() {
  const questions = useQuestions();
  const { addQuestion, updateQuestion, deleteQuestion, duplicateQuestion } = useQuestionActions();

  const [filterModule, setFilterModule] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const modules = ['All', ...Array.from(new Set(questions.map(q => q.module)))];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  const filtered = questions.filter(q => {
    if (filterModule !== 'All' && q.module !== filterModule) return false;
    if (filterDiff !== 'All' && q.difficulty !== filterDiff) return false;

    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      return (
        q.question_text.toLowerCase().includes(s) ||
        q.skill.toLowerCase().includes(s) ||
        q.module.toLowerCase().includes(s) ||
        (q.passage_text && q.passage_text.toLowerCase().includes(s)) ||
        (q.passage_image_alt && q.passage_image_alt.toLowerCase().includes(s)) ||
        (q.passage_image_caption && q.passage_image_caption.toLowerCase().includes(s))
      );
    }

    return true;
  });

  const customCount = questions.filter(q => q.is_custom).length;

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setEditorOpen(true);
  };

  const handleEditorSave = (data: QuestionFormData) => {
    const payload = {
      module: data.module,
      difficulty: data.difficulty,
      skill: data.skill,
      question_text: data.question_text,
      passage_text: data.passage_text || undefined,
      passage_image_url: data.passage_image_url || undefined,
      passage_image_alt: data.passage_image_alt || undefined,
      passage_image_caption: data.passage_image_caption || undefined,
      options: data.is_free_response ? [] : data.options,
      correct_answer: data.is_free_response ? '' : data.correct_answer,
      correct_value: data.is_free_response ? data.correct_value : undefined,
      is_free_response: data.is_free_response,
      explanation: data.explanation,
    };

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, payload);
      showToast('Question updated successfully');
    } else {
      addQuestion(payload);
      showToast('Question added to bank');
    }

    setEditorOpen(false);
    setEditingQuestion(null);
  };

  const handleDuplicate = (q: Question) => {
    duplicateQuestion(q.id);
    showToast('Question duplicated');
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteQuestion(deleteTarget.id);
    showToast('Question deleted');
    if (expanded === deleteTarget.id) setExpanded(null);
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            <span className="gradient-text">Question</span> Bank
          </h1>
          <p className="text-white/40 text-sm">
            {questions.length} total questions{customCount > 0 ? ` • ${customCount} custom` : ''}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="glow-button px-5 py-2.5 text-sm flex items-center gap-2 shrink-0"
        >
          <span className="text-lg leading-none">+</span>
          Add Question
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3 mb-8"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions, skills, passages..."
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl"
            style={{ background: 'rgba(15, 15, 35, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="glass-card px-1.5 py-1.5 flex gap-1 flex-wrap">
            {modules.map(m => (
              <button
                key={m}
                onClick={() => setFilterModule(m)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterModule === m
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="glass-card px-1.5 py-1.5 flex gap-1">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setFilterDiff(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterDiff === d
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/30 font-medium">
          {filtered.length} question{filtered.length !== 1 ? 's' : ''} found
          {searchQuery && <span className="text-indigo-400/60 ml-1">for "{searchQuery}"</span>}
        </p>
        {(filterModule !== 'All' || filterDiff !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setFilterModule('All');
              setFilterDiff('All');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-400/60 hover:text-indigo-400 font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((q, i) => (
            <motion.div
              key={q.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.3 }}
            >
              <Card3D className="p-5" intensity={5}>
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div
                    className="flex items-center gap-2 flex-wrap flex-1 cursor-pointer"
                    onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  >
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r ${moduleColors[q.module] || 'from-slate-600 to-slate-700'} text-white shadow-sm`}>
                      {q.module}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${difficultyColors[q.difficulty]} capitalize`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-medium text-white/30 px-2 py-1 rounded-full bg-white/5">
                      {q.skill}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${q.is_free_response ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20' : 'text-white/20 bg-white/[0.03]'}`}>
                      {q.is_free_response ? '✎ Free Response' : 'MC'}
                    </span>
                    {q.is_custom && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Custom
                      </span>
                    )}
                    {q.passage_image_url && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                        Image
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                      className={`text-white/20 text-xs transition-transform duration-300 cursor-pointer hover:text-white/40 p-1 ${expanded === q.id ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                    <ActionMenu
                      question={q}
                      onEdit={() => handleOpenEdit(q)}
                      onDuplicate={() => handleDuplicate(q)}
                      onDelete={() => setDeleteTarget(q)}
                    />
                  </div>
                </div>

                {(q.passage_text || q.passage_image_url) && (
                  <div
                    className="bg-white/[0.03] rounded-xl p-4 mb-3 border border-white/5 cursor-pointer"
                    onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  >
                    {q.passage_image_url && (
                      <figure className="mb-3 overflow-hidden rounded-xl border border-white/8 bg-white/5">
                        <img
                          src={q.passage_image_url}
                          alt={q.passage_image_alt || 'Passage image'}
                          className="w-full h-auto max-h-[280px] object-cover"
                          loading="lazy"
                        />
                        {q.passage_image_caption && (
                          <figcaption className="px-3 py-2 text-xs text-white/40">
                            {q.passage_image_caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {q.passage_text && (
                      <p
                        className="text-xs text-white/50 leading-relaxed"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: expanded === q.id ? 999 : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {renderRichText(q.passage_text)}
                      </p>
                    )}
                  </div>
                )}

                <p
                  className="text-sm text-white/80 font-medium cursor-pointer"
                  onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                >
                  {renderRichText(q.question_text)}
                </p>

                <AnimatePresence>
                  {expanded === q.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-2">
                        {q.is_free_response ? (
                          <div className="flex items-center gap-3 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                            <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 shrink-0 bg-cyan-500 border-cyan-500 text-white">
                              ✎
                            </span>
                            <span className="text-sm text-white/70">
                              Correct value: <span className="text-cyan-300 font-semibold">{q.correct_value}</span>
                            </span>
                          </div>
                        ) : (
                          q.options.map(opt => (
                            <div
                              key={opt.key}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                opt.key === q.correct_answer
                                  ? 'border-green-500/30 bg-green-500/5'
                                  : 'border-white/5 bg-white/[0.02]'
                              }`}
                            >
                              <span
                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 shrink-0 ${
                                  opt.key === q.correct_answer
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-white/20 text-white/40'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span className="text-sm text-white/70">{opt.text}</span>
                              {opt.key === q.correct_answer && (
                                <span className="ml-auto text-green-400 text-xs font-bold">✓ Correct</span>
                              )}
                            </div>
                          ))
                        )}

                        <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                          <p className="text-xs text-indigo-300 font-bold mb-1">Explanation</p>
                          <p className="text-sm text-white/60 leading-relaxed">{q.explanation}</p>
                        </div>

                        <div className="mt-3 pt-3 flex items-center gap-2 border-t border-white/5">
                          <button
                            onClick={() => handleOpenEdit(q)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDuplicate(q)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                          >
                            📋 Duplicate
                          </button>
                          <button
                            onClick={() => setDeleteTarget(q)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-red-400/40 hover:text-red-400 bg-red-500/[0.03] hover:bg-red-500/[0.06] transition-all ml-auto"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card3D>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 text-center"
          style={{ borderStyle: 'dashed' }}
        >
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/40 text-sm mb-2">No questions match your filters</p>
          <p className="text-white/20 text-xs mb-6">Try adjusting your search or filter criteria</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setFilterModule('All');
                setFilterDiff('All');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              Clear Filters
            </button>
            <button
              onClick={handleOpenAdd}
              className="glow-button px-5 py-2 text-xs"
            >
              + Add Question
            </button>
          </div>
        </motion.div>
      )}

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={handleOpenAdd}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white z-20 sm:hidden"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        +
      </motion.button>

      <QuestionEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleEditorSave}
        editQuestion={editingQuestion}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        questionText={deleteTarget?.question_text || ''}
      />
    </div>
  );
}
