import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../store';
import { renderRichText, insertFormatting } from './RichText';

const MODULES = ['RW Module 1', 'RW Module 2', 'Math Module 1', 'Math Module 2'];
const DIFFICULTIES: Question['difficulty'][] = ['easy', 'medium', 'hard'];
const SKILLS = [
  'Words in Context',
  'Central Ideas',
  'Command of Evidence',
  'Inferences',
  'Text Structure',
  'Rhetorical Synthesis',
  'Boundaries',
  'Form, Structure, Sense',
  'Linear Equations',
  'Systems of Equations',
  'Geometry',
  'Advanced Math',
  'Problem Solving',
  'Statistics & Probability',
  'Algebra',
  'Trigonometry',
  'Other',
];
const OPTION_KEYS = ['A', 'B', 'C', 'D'];

export interface QuestionFormData {
  module: string;
  difficulty: Question['difficulty'];
  skill: string;
  question_text: string;
  passage_text: string;
  options: { key: string; text: string }[];
  correct_answer: string;
  correct_value: string;
  is_free_response: boolean;
  explanation: string;
}

function emptyForm(): QuestionFormData {
  return {
    module: MODULES[0],
    difficulty: 'medium',
    skill: SKILLS[0],
    question_text: '',
    passage_text: '',
    options: OPTION_KEYS.map(key => ({ key, text: '' })),
    correct_answer: 'A',
    correct_value: '',
    is_free_response: false,
    explanation: '',
  };
}

function fromQuestion(q: Question): QuestionFormData {
  const opts = OPTION_KEYS.map(key => {
    const existing = q.options.find(o => o.key === key);
    return { key, text: existing?.text || '' };
  });
  return {
    module: q.module,
    difficulty: q.difficulty,
    skill: q.skill,
    question_text: q.question_text,
    passage_text: q.passage_text || '',
    options: opts,
    correct_answer: q.correct_answer,
    correct_value: q.correct_value || '',
    is_free_response: q.is_free_response || false,
    explanation: q.explanation,
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: QuestionFormData) => void;
  editQuestion?: Question | null;
}

export default function QuestionEditor({ open, onClose, onSave, editQuestion }: Props) {
  const [form, setForm] = useState<QuestionFormData>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isEdit = !!editQuestion;
  const totalSteps = 3;

  useEffect(() => {
    if (open) {
      setForm(editQuestion ? fromQuestion(editQuestion) : emptyForm());
      setErrors({});
      setStep(0);
    }
  }, [open, editQuestion]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const updateField = <K extends keyof QuestionFormData>(key: K, value: QuestionFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const updateOption = (index: number, text: string) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.map((o, i) => i === index ? { ...o, text } : o),
    }));
    setErrors(prev => { const n = { ...prev }; delete n[`option_${index}`]; return n; });
  };

  const isMathModule = form.module.startsWith('Math');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.question_text.trim()) e.question_text = 'Question text is required';
    if (form.is_free_response) {
      if (!form.correct_value.trim()) e.correct_value = 'Correct value is required for free-response';
    } else {
      const filledOptions = form.options.filter(o => o.text.trim());
      if (filledOptions.length < 2) e.options = 'At least 2 answer options are required';
      form.options.forEach((o, i) => {
        if (!o.text.trim() && i < 2) e[`option_${i}`] = `Option ${o.key} is required`;
      });
      const correctOption = form.options.find(o => o.key === form.correct_answer);
      if (!correctOption?.text.trim()) e.correct_answer = 'Correct answer option must have text';
    }
    if (!form.explanation.trim()) e.explanation = 'Explanation is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      // Jump to the step with the first error
      const errorKeys = Object.keys(errors);
      if (errorKeys.some(k => k === 'question_text' || k === 'module' || k === 'difficulty' || k === 'skill')) setStep(0);
      else if (errorKeys.some(k => k.startsWith('option') || k === 'options' || k === 'correct_answer')) setStep(1);
      else setStep(2);
      return;
    }
    // Clean options: keep only those with text
    const cleaned: QuestionFormData = {
      ...form,
      passage_text: form.passage_text.trim(),
      options: form.options.filter(o => o.text.trim()),
    };
    onSave(cleaned);
  };

  const canProceed = (s: number): boolean => {
    if (s === 0) return !!form.question_text.trim();
    if (s === 1) return form.is_free_response ? !!form.correct_value.trim() : form.options.filter(o => o.text.trim()).length >= 2;
    return true;
  };

  const stepLabels = ['Details', 'Answers', 'Review'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 15, 40, 0.98) 0%, rgba(10, 10, 30, 0.99) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(99, 102, 241, 0.08)',
            }}
          >
            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-white">
                  {isEdit ? 'Edit Question' : 'Add New Question'}
                </h2>
                <p className="text-xs text-white/30 mt-0.5">
                  {isEdit ? 'Update the question details below' : 'Create a custom SAT-style practice question'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/70 transition-all text-sm"
              >
                ✕
              </button>
            </div>

            {/* ── Step Indicator ── */}
            <div className="px-6 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                {stepLabels.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setStep(i)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <div className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-xl transition-all text-xs font-bold ${
                      i === step
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : i < step
                        ? 'bg-green-500/10 text-green-400/70 border border-green-500/20'
                        : 'bg-white/[0.02] text-white/20 border border-white/5'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        i === step
                          ? 'bg-indigo-500 text-white'
                          : i < step
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/5 text-white/20'
                      }`}>
                        {i < step ? '✓' : i + 1}
                      </span>
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
              <AnimatePresence mode="wait">
                {/* Step 0: Details */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Module + Difficulty + Skill row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Module</label>
                        <select
                          value={form.module}
                          onChange={e => updateField('module', e.target.value)}
                          className="w-full text-sm"
                        >
                          {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Difficulty</label>
                        <select
                          value={form.difficulty}
                          onChange={e => updateField('difficulty', e.target.value as Question['difficulty'])}
                          className="w-full text-sm"
                        >
                          {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Skill</label>
                        <select
                          value={form.skill}
                          onChange={e => updateField('skill', e.target.value)}
                          className="w-full text-sm"
                        >
                          {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Free Response Toggle (Math only) */}
                    {isMathModule && (
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: form.is_free_response ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.is_free_response ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                        <button
                          type="button"
                          onClick={() => updateField('is_free_response', !form.is_free_response)}
                          className="w-10 h-6 rounded-full relative transition-all shrink-0"
                          style={{ background: form.is_free_response ? '#818cf8' : 'rgba(255,255,255,0.1)' }}
                        >
                          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: form.is_free_response ? '18px' : '2px' }} />
                        </button>
                        <div>
                          <p className="text-sm font-semibold text-white/70">Free Response (Student-Produced Response)</p>
                          <p className="text-[10px] text-white/30">Student types their answer instead of choosing A–D</p>
                        </div>
                      </div>
                    )}

                    {/* Passage (optional) with formatting toolbar */}
                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                        Passage / Context <span className="text-white/15 normal-case font-medium">(optional)</span>
                      </label>
                      {/* Formatting toolbar */}
                      <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                        {[
                          { label: 'B', title: 'Bold (**text**)', prefix: '**', suffix: '**', style: { fontWeight: 800 } as React.CSSProperties },
                          { label: 'I', title: 'Italic (_text_)', prefix: '_', suffix: '_', style: { fontStyle: 'italic' } as React.CSSProperties },
                          { label: 'U', title: 'Underline (__text__)', prefix: '__', suffix: '__', style: { textDecoration: 'underline' } as React.CSSProperties },
                        ].map(btn => (
                          <button
                            key={btn.label}
                            type="button"
                            title={btn.title}
                            onClick={() => {
                              const ta = document.getElementById('passage-textarea') as HTMLTextAreaElement | null;
                              if (ta) insertFormatting(ta, btn.prefix, btn.suffix, form.passage_text, v => updateField('passage_text', v));
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:bg-white/10 text-white/40 hover:text-white/80"
                            style={{ ...btn.style, border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            {btn.label}
                          </button>
                        ))}
                        <span className="text-[9px] text-white/15 ml-2">Use __underline__, **bold**, _italic_</span>
                      </div>
                      <textarea
                        id="passage-textarea"
                        value={form.passage_text}
                        onChange={e => updateField('passage_text', e.target.value)}
                        rows={4}
                        placeholder="Add passage text. Use __underline__, **bold**, or _italic_ for formatting.&#10;&#10;Example: The author states that __this claim is central__ to the argument."
                        className="w-full resize-y text-sm"
                        style={{ minHeight: '80px' }}
                      />
                      {form.passage_text.trim() && (form.passage_text.includes('__') || form.passage_text.includes('**') || form.passage_text.includes('_')) && (
                        <div className="mt-2 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-1">Preview</p>
                          <p className="text-xs text-white/50 leading-relaxed">{renderRichText(form.passage_text)}</p>
                        </div>
                      )}
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                        Question Text <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.question_text}
                        onChange={e => updateField('question_text', e.target.value)}
                        rows={3}
                        placeholder="e.g. Which choice best completes the text?"
                        className={`w-full resize-y text-sm ${errors.question_text ? 'border-red-500/50' : ''}`}
                        style={{ minHeight: '64px' }}
                      />
                      {errors.question_text && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.question_text}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Answers */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {form.is_free_response ? (
                      /* Free Response Answer */
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-3">
                          Correct Answer Value <span className="text-red-400">*</span>
                        </label>
                        <p className="text-[11px] text-white/20 mb-3">Enter the exact correct answer. Numbers, decimals, and fractions are accepted.</p>
                        <input
                          type="text"
                          value={form.correct_value}
                          onChange={e => updateField('correct_value', e.target.value)}
                          placeholder="e.g. 5, 3.14, 2/3, -7"
                          className={`w-full text-sm ${errors.correct_value ? 'border-red-500/50' : form.correct_value.trim() ? 'border-green-500/30 bg-green-500/5' : ''}`}
                        />
                        {errors.correct_value && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1"><span>⚠</span> {errors.correct_value}</p>
                        )}
                        <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                          <p className="text-[10px] text-indigo-300 font-bold mb-1">💡 Student-Produced Response</p>
                          <p className="text-[11px] text-white/40">Students will type their answer in a text field. The system checks for numeric equivalence (e.g., "0.5" matches "1/2").</p>
                        </div>
                      </div>
                    ) : (
                      /* Multiple Choice Options */
                      <div>
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-3">
                          Answer Options <span className="text-red-400">*</span>
                          <span className="text-white/15 normal-case font-medium ml-2">Click the radio to set correct answer</span>
                        </label>

                        {errors.options && (
                          <p className="text-[11px] text-red-400 mb-3 flex items-center gap-1"><span>⚠</span> {errors.options}</p>
                        )}

                        <div className="space-y-2.5">
                          {form.options.map((opt, i) => {
                            const isCorrect = form.correct_answer === opt.key;
                            const hasError = errors[`option_${i}`];
                            return (
                              <div key={opt.key} className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => updateField('correct_answer', opt.key)}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all border-2 ${
                                    isCorrect ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'border-white/10 text-white/25 hover:border-white/25 hover:text-white/50'
                                  }`}
                                  title={isCorrect ? 'Correct answer' : `Set ${opt.key} as correct`}
                                >
                                  {isCorrect ? '✓' : opt.key}
                                </button>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={e => updateOption(i, e.target.value)}
                                  placeholder={`Option ${opt.key}${i < 2 ? ' (required)' : ' (optional)'}`}
                                  className={`flex-1 text-sm ${hasError ? 'border-red-500/50' : ''} ${isCorrect && opt.text.trim() ? 'border-green-500/30 bg-green-500/5' : ''}`}
                                />
                                {isCorrect && opt.text.trim() && (
                                  <span className="text-green-400 text-[10px] font-bold shrink-0 w-16 text-right">Correct</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {errors.correct_answer && (
                          <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1"><span>⚠</span> {errors.correct_answer}</p>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                        Explanation <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.explanation}
                        onChange={e => updateField('explanation', e.target.value)}
                        rows={3}
                        placeholder="Explain why the correct answer is right and common pitfalls..."
                        className={`w-full resize-y text-sm ${errors.explanation ? 'border-red-500/50' : ''}`}
                        style={{ minHeight: '64px' }}
                      />
                      {errors.explanation && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.explanation}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-white/30 mb-2">Preview how your question will appear</p>

                    {/* Preview card */}
                    <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          {form.module}
                        </span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border capitalize ${
                          form.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                          form.difficulty === 'medium' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                          'text-red-400 bg-red-400/10 border-red-400/20'
                        }`}>
                          {form.difficulty}
                        </span>
                        <span className="text-[10px] font-medium text-white/30 px-2 py-1 rounded-full bg-white/5">
                          {form.skill}
                        </span>
                      </div>

                      {/* Passage */}
                      {form.passage_text.trim() && (
                        <div className="bg-white/[0.03] rounded-xl p-4 mb-3 border border-white/5">
                          <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                            {form.passage_text}
                          </p>
                        </div>
                      )}

                      {/* Question */}
                      <p className="text-sm text-white/80 font-medium mb-4">
                        {form.question_text || <span className="text-white/20 italic">No question text</span>}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {form.options.filter(o => o.text.trim()).map(opt => {
                          const isCorrect = opt.key === form.correct_answer;
                          return (
                            <div
                              key={opt.key}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/[0.02]'
                              }`}
                            >
                              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 shrink-0 ${
                                isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-white/20 text-white/40'
                              }`}>
                                {opt.key}
                              </span>
                              <span className="text-sm text-white/70">{opt.text}</span>
                              {isCorrect && <span className="ml-auto text-green-400 text-xs font-bold">✓ Correct</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {form.explanation.trim() && (
                        <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                          <p className="text-xs text-indigo-300 font-bold mb-1">Explanation</p>
                          <p className="text-sm text-white/60 leading-relaxed">{form.explanation}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 shrink-0 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs text-white/15">
                {Object.keys(errors).length > 0 && (
                  <span className="text-red-400 font-medium">
                    {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                  >
                    ← Back
                  </button>
                )}
                {step < totalSteps - 1 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed(step)}
                    className="glow-button px-6 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 text-sm font-bold rounded-xl transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {isEdit ? '✓ Save Changes' : '✓ Create Question'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
