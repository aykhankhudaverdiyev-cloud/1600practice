import type { JSX } from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTests, useAttempts, getQuestionById, showToast } from '../store';
import type { Question } from '../store';
import { renderRichText } from '../components/RichText';

const BB = {
  bg: '#f0f3f8', panel: '#ffffff', border: '#dce3ed', navBg: '#0f1e54',
  accent: '#1a56db', correct: '#0d7c3e', text: '#1e293b', muted: '#64748b',
  hlYellow: '#fde68a', hlPink: '#fca5a5', hlGreen: '#bbf7d0', hlBlue: '#bfdbfe',
};
const HL_COLORS = [
  { name: 'Yellow', color: BB.hlYellow },
  { name: 'Pink', color: BB.hlPink },
  { name: 'Green', color: BB.hlGreen },
  { name: 'Blue', color: BB.hlBlue },
];
interface HLEntry { id: string; text: string; color: string; start: number; end: number; }

function satSectionScore(correct: number, total: number): number {
  if (total === 0) return 200;
  if (correct === 0) return 200;
  if (correct >= total) return 800;
  const p = correct / total;
  if (p >= .95) return Math.round(780 + (p - .95) / .05 * 20);
  if (p >= .85) return Math.round(700 + (p - .85) / .10 * 80);
  if (p >= .70) return Math.round(580 + (p - .70) / .15 * 120);
  if (p >= .50) return Math.round(450 + (p - .50) / .20 * 130);
  if (p >= .30) return Math.round(330 + (p - .30) / .20 * 120);
  if (p >= .10) return Math.round(230 + (p - .10) / .20 * 100);
  return Math.round(200 + p / .10 * 30);
}

// ─── Persistence helpers ─────────────────────────────────────────────────────
interface PracticeState {
  current: number;
  answers: Record<number, string>;
  marked: number[];
  eliminated: Record<number, string[]>;
  timer: number;
  sectionBreak: boolean;
  highlights: Record<number, HLEntry[]>;
  annotations: Record<number, string>;
}

function saveSession(testId: string, state: PracticeState) {
  try { localStorage.setItem(`practice_${testId}`, JSON.stringify(state)); } catch {}
}
function loadSession(testId: string): PracticeState | null {
  try {
    const d = localStorage.getItem(`practice_${testId}`);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}
function clearSession(testId: string) {
  try { localStorage.removeItem(`practice_${testId}`); } catch {}
}

export default function Practice() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { tests, completeTest } = useTests();
  const { submitAttempts } = useAttempts();
  const test = tests.find(t => t.id === testId);

  const allQuestions = useMemo(() => {
    if (!test) return [];
    return test.question_ids.map(id => getQuestionById(id)).filter(Boolean) as Question[];
  }, [test]);
  const sortedQuestions = useMemo(() => {
    const rw = allQuestions.filter(q => q.module.startsWith('RW'));
    const math = allQuestions.filter(q => q.module.startsWith('Math'));
    return [...rw, ...math];
  }, [allQuestions]);
  const rwCount = useMemo(() => sortedQuestions.filter(q => q.module.startsWith('RW')).length, [sortedQuestions]);
  const mathCount = sortedQuestions.length - rwCount;
  const hasBothSections = rwCount > 0 && mathCount > 0;

  // ─── Restore session from localStorage ─────────────────────────────────────
  const saved = testId ? loadSession(testId) : null;

  const [current, setCurrent] = useState(saved?.current ?? 0);
  const [answers, setAnswers] = useState<Record<number, string>>(saved?.answers ?? {});
  const [marked, setMarked] = useState<Set<number>>(new Set(saved?.marked ?? []));
  const [eliminated, setEliminated] = useState<Record<number, string[]>>(saved?.eliminated ?? {});
  const [timer, setTimer] = useState(saved?.timer ?? 0);
  const [sectionBreak, setSectionBreak] = useState(saved?.sectionBreak ?? false);
  const [highlights, setHighlights] = useState<Record<number, HLEntry[]>>(saved?.highlights ?? {});
  const [annotations, setAnnotations] = useState<Record<number, string>>(saved?.annotations ?? {});

  const [showNav, setShowNav] = useState(false);
  const [showDesmos, setShowDesmos] = useState(false);
  const [desmosFullscreen, setDesmosFullscreen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hlMode, setHlMode] = useState(false);
  const [hlColor, setHlColor] = useState(0);
  const [hlPicker, setHlPicker] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [crossOut, setCrossOut] = useState(false);

  const passageRef = useRef<HTMLDivElement>(null);

  // ─── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => { const iv = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(iv); }, []);

  // ─── Auto-save session on every state change ───────────────────────────────
  useEffect(() => {
    if (!testId || sortedQuestions.length === 0) return;
    saveSession(testId, {
      current, answers, marked: [...marked], eliminated, timer,
      sectionBreak, highlights, annotations,
    });
  }, [testId, current, answers, marked, eliminated, timer, sectionBreak, highlights, annotations, sortedQuestions.length]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const q = sortedQuestions[current];
  const isMath = q?.module.startsWith('Math');
  const currentSection = current < rwCount ? 'rw' : 'math';
  const sectionLabel = currentSection === 'rw' ? 'Reading and Writing' : 'Math';
  const sectionQIdx = currentSection === 'rw' ? current + 1 : current - rwCount + 1;
  const sectionTotal = currentSection === 'rw' ? rwCount : mathCount;
  const answered = Object.keys(answers).filter(k => answers[parseInt(k)]).length;
  const currentElim = eliminated[current] || [];

  const selectAnswer = (key: string) => setAnswers(p => ({ ...p, [current]: key }));
  const setFree = (v: string) => setAnswers(p => ({ ...p, [current]: v }));
  const toggleElim = (key: string) => {
    setEliminated(p => { const c = p[current] || []; return { ...p, [current]: c.includes(key) ? c.filter(k => k !== key) : [...c, key] }; });
  };
  const toggleMark = () => setMarked(p => { const n = new Set(p); n.has(current) ? n.delete(current) : n.add(current); return n; });

  // ─── Highlighting ──────────────────────────────────────────────────────────
  const handleTextSelect = () => {
    if (!hlMode || !passageRef.current || !q?.passage_text) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (!text || text.length < 2) return;
    const startIdx = q.passage_text.indexOf(text);
    if (startIdx === -1) { sel.removeAllRanges(); return; }
    setHighlights(p => ({ ...p, [current]: [...(p[current] || []), { id: Math.random().toString(36).slice(2), text, color: HL_COLORS[hlColor].color, start: startIdx, end: startIdx + text.length }] }));
    sel.removeAllRanges();
  };
  const removeHighlight = (hlId: string) => { setHighlights(p => ({ ...p, [current]: (p[current] || []).filter(h => h.id !== hlId) })); };
  const renderPassage = (text: string, qIdx: number) => {
    const hls = (highlights[qIdx] || []).sort((a, b) => a.start - b.start);
    if (!hls.length) return <span>{renderRichText(text)}</span>;
    const parts: JSX.Element[] = [];
    let last = 0;
    hls.forEach((h, i) => {
      if (h.start < last) return;
      if (h.start > last) parts.push(<span key={`t${i}`}>{renderRichText(text.slice(last, h.start))}</span>);
      parts.push(
        <mark key={h.id} onClick={e => { e.stopPropagation(); removeHighlight(h.id); }}
          className="group relative cursor-pointer transition-all hover:brightness-90"
          style={{ backgroundColor: h.color, padding: '1px 3px', borderRadius: 3 }} title="Click to remove">
          {text.slice(h.start, h.end)}
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">✕</span>
        </mark>
      );
      last = h.end;
    });
    if (last < text.length) parts.push(<span key="end">{renderRichText(text.slice(last))}</span>);
    return <span>{parts}</span>;
  };

  // ─── Free response ─────────────────────────────────────────────────────────
  const checkFR = (input: string, cv: string): boolean => {
    if (!input.trim() || !cv) return false;
    const c = (s: string) => s.replace(/\s/g, '').toLowerCase();
    if (c(input) === c(cv)) return true;
    const ni = parseFloat(input), nc = parseFloat(cv);
    if (!isNaN(ni) && !isNaN(nc) && Math.abs(ni - nc) < 0.001) return true;
    const fm = input.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (fm) { const fv = parseInt(fm[1]) / parseInt(fm[2]); if (!isNaN(fv) && !isNaN(nc) && Math.abs(fv - nc) < 0.001) return true; }
    return false;
  };

  // ─── Section navigation ────────────────────────────────────────────────────
  const proceedToMath = () => { setSectionBreak(false); setCurrent(rwCount); setShowDesmos(false); };
  const handleNext = () => { if (hasBothSections && current === rwCount - 1) setSectionBreak(true); else setCurrent(c => c + 1); };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleFinish = useCallback(async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    try {
      const ad = sortedQuestions.map((sq, i) => {
        const sel = answers[i] || '';
        const ok = sq.is_free_response ? checkFR(sel, sq.correct_value || '') : sel === sq.correct_answer;
        return { test_id: test.id, question_id: sq.id, selected_answer: sel, is_correct: ok, marked_for_review: marked.has(i) };
      });
      submitAttempts(ad);
      const rwQ = sortedQuestions.filter(sq => sq.module.startsWith('RW'));
      const mQ = sortedQuestions.filter(sq => sq.module.startsWith('Math'));
      const rwC = rwQ.filter(sq => { const i = sortedQuestions.indexOf(sq); const a = answers[i] || ''; return sq.is_free_response ? checkFR(a, sq.correct_value || '') : a === sq.correct_answer; }).length;
      const mC = mQ.filter(sq => { const i = sortedQuestions.indexOf(sq); const a = answers[i] || ''; return sq.is_free_response ? checkFR(a, sq.correct_value || '') : a === sq.correct_answer; }).length;
      const rwS = satSectionScore(rwC, rwQ.length);
      const mS = satSectionScore(mC, mQ.length);
      let total: number;
      if (rwQ.length > 0 && mQ.length > 0) total = rwS + mS;
      else if (rwQ.length > 0) total = rwS * 2;
      else if (mQ.length > 0) total = mS * 2;
      else total = 400;
      total = Math.min(1600, Math.max(400, total));
      completeTest(test.id, total, rwQ.length > 0 ? rwS : 0, mQ.length > 0 ? mS : 0, timer);
      if (testId) clearSession(testId);
      showToast('Test submitted successfully!');
      navigate(`/results/${test.id}`);
    } catch (err) {
      setSubmitting(false);
      showToast('Something went wrong. Please try again.', 'error');
    }
  }, [test, submitting, sortedQuestions, answers, marked, submitAttempts, completeTest, navigate, timer, testId]);

  // no desmos dims needed — fullscreen or panel

  // ─── Guards ────────────────────────────────────────────────────────────────
  if (!test || sortedQuestions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BB.bg }}>
      <div style={{ background: BB.panel, border: `1px solid ${BB.border}`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
        <p style={{ color: BB.muted, marginBottom: 16 }}>Test not found or has no questions.</p>
        <button onClick={() => navigate('/')} className="glow-button px-6 py-2 text-sm">Go Home</button>
      </div>
    </div>
  );
  if (!q) { setCurrent(0); return null; }

  // ═══ SECTION BREAK ═════════════════════════════════════════════════════════
  if (sectionBreak) {
    const rwAns = Object.keys(answers).filter(k => parseInt(k) < rwCount && answers[parseInt(k)]).length;
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BB.bg }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full mx-4 rounded-2xl shadow-xl overflow-hidden" style={{ background: BB.panel, border: `1px solid ${BB.border}` }}>
          <div style={{ background: BB.navBg }} className="px-8 py-6 text-white"><h2 className="text-xl font-bold">Section Complete</h2><p className="text-sm opacity-70 mt-1">Reading and Writing section finished</p></div>
          <div className="p-8">
            <div className="flex gap-6 mb-6">
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}><p className="text-2xl font-black" style={{ color: BB.correct }}>{rwAns}/{rwCount}</p><p className="text-xs font-semibold mt-1" style={{ color: '#166534' }}>Questions Answered</p></div>
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}><p className="text-2xl font-black" style={{ color: BB.accent }}>{mathCount}</p><p className="text-xs font-semibold mt-1" style={{ color: '#1e40af' }}>Math Questions Next</p></div>
            </div>
            <div className="rounded-xl p-4 mb-6" style={{ background: '#fefce8', border: '1px solid #fde68a' }}><p className="text-sm font-semibold" style={{ color: '#854d0e' }}>⏱ Time elapsed: {fmt(timer)}</p><p className="text-xs mt-1" style={{ color: '#a16207' }}>You're about to start the Math section. A graphing calculator (Desmos) will be available.</p></div>
            <div className="flex gap-3">
              <button onClick={() => { setSectionBreak(false); setCurrent(rwCount - 1); }} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: '#f1f5f9', color: BB.text, border: `1px solid ${BB.border}` }}>← Back to R&W</button>
              <button onClick={proceedToMath} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background: BB.accent }}>Start Math Section →</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isLastQ = current === sortedQuestions.length - 1;
  const isLastRW = hasBothSections && current === rwCount - 1;

  // ═══ MAIN UI ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col select-none" style={{ background: BB.bg, color: BB.text }}>
      {/* Top Nav */}
      <header className="flex items-center justify-between px-5 py-2 shadow-sm sticky top-0 z-30" style={{ background: BB.navBg }}>
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black tracking-wider">SAT</div>
          <div className="h-4 w-px bg-white/20" />
          <div><p className="text-xs font-bold opacity-80">{sectionLabel}</p><p className="text-[10px] opacity-40">Section {currentSection === 'rw' ? '1' : '2'} of {hasBothSections ? '2' : '1'}</p></div>
        </div>
        <div className="bg-white/10 rounded-lg px-4 py-1.5 text-white text-center"><p className="text-[9px] uppercase tracking-widest opacity-40 leading-none">Time</p><p className="font-mono font-bold text-sm leading-tight">{fmt(timer)}</p></div>
        <div className="flex items-center gap-1.5">
          {isMath && <button onClick={() => setShowDesmos(!showDesmos)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all ${showDesmos ? 'bg-blue-500/40' : 'bg-white/10 hover:bg-white/15'}`}>📐 Calculator</button>}
          {q.passage_text && (
            <div className="relative">
              <button onClick={() => setHlPicker(!hlPicker)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all ${hlMode ? 'bg-yellow-500/40' : 'bg-white/10 hover:bg-white/15'}`}>🖍 Highlight</button>
              <AnimatePresence>{hlPicker && (
                <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }} className="absolute right-0 top-full mt-2 p-2 rounded-xl shadow-2xl z-50 flex gap-1.5 items-center" style={{ background: BB.panel, border: `1px solid ${BB.border}` }}>
                  {HL_COLORS.map((hc, i) => <button key={hc.name} onClick={() => { setHlColor(i); setHlMode(true); setHlPicker(false); }} className={`w-7 h-7 rounded-full transition-all ${hlColor === i && hlMode ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : 'hover:scale-105'}`} style={{ background: hc.color }} title={hc.name} />)}
                  <div className="w-px h-5 bg-gray-200 mx-0.5" />
                  <button onClick={() => { setHlMode(false); setHlPicker(false); }} className="w-7 h-7 rounded-full border border-gray-200 text-[9px] flex items-center justify-center text-gray-400 hover:bg-gray-50" title="Off">✕</button>
                </motion.div>
              )}</AnimatePresence>
            </div>
          )}
          <button onClick={() => setShowNote(!showNote)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all ${showNote ? 'bg-amber-500/40' : 'bg-white/10 hover:bg-white/15'}`}>📝</button>
          <button onClick={() => setCrossOut(!crossOut)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all ${crossOut ? 'bg-red-500/40' : 'bg-white/10 hover:bg-white/15'}`}>✂️</button>
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 w-full" style={{ background: BB.border }}><div className="h-full transition-all duration-500 ease-out" style={{ width: `${((current + 1) / sortedQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${BB.accent}, #7c3aed)` }} /></div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {q.passage_text && (
          <div className="lg:w-[48%] overflow-y-auto lg:border-r" style={{ borderColor: BB.border, maxHeight: 'calc(100vh - 108px)' }}>
            <div className="p-5 lg:p-7">
              <div ref={passageRef} onMouseUp={hlMode ? handleTextSelect : undefined} className="text-[14px] leading-[1.9] select-text" style={{ color: '#374151', cursor: hlMode ? 'text' : 'default' }}>{renderPassage(q.passage_text, current)}</div>
              {hlMode && <div className="mt-4 flex items-center gap-2 py-2 px-3 rounded-lg text-[11px] font-medium" style={{ background: HL_COLORS[hlColor].color + '50', color: '#6b7280' }}><span className="w-3 h-3 rounded-sm" style={{ background: HL_COLORS[hlColor].color }} /> Select text to highlight · Click any highlight to remove it</div>}
            </div>
          </div>
        )}
        <div className={`${q.passage_text ? 'lg:w-[52%]' : 'w-full max-w-3xl mx-auto'} overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 108px)' }}>
          <div className="p-5 lg:p-7">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: BB.navBg }}>{sectionQIdx}</span>
                    <button onClick={toggleMark} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all" style={{ background: marked.has(current) ? '#fef3c7' : '#f1f5f9', color: marked.has(current) ? '#92400e' : BB.muted, border: `1px solid ${marked.has(current) ? '#fde68a' : BB.border}` }}>
                      {marked.has(current) ? '⭐ Marked for Review' : '☆ Mark for Review'}
                    </button>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed mb-6 font-medium" style={{ color: BB.text }}>{renderRichText(q.question_text)}</p>
                {q.is_free_response ? (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: BB.muted }}>Your Answer</label>
                    <input type="text" value={answers[current] || ''} onChange={e => setFree(e.target.value)} placeholder="Type your answer" className="w-full px-4 py-3.5 rounded-xl text-base font-medium outline-none transition-all" style={{ background: '#fff', border: `2px solid ${answers[current] ? BB.accent : BB.border}`, color: BB.text }} autoComplete="off" />
                    <p className="text-[11px] mt-2" style={{ color: BB.muted }}>Enter a number, decimal, or fraction (e.g., 5, 3.14, 2/3, -7)</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {q.options.map(opt => {
                      const isElim = currentElim.includes(opt.key);
                      const isSel = answers[current] === opt.key;
                      return (
                        <div key={opt.key} className="flex items-center gap-2">
                          <button onClick={() => crossOut ? toggleElim(opt.key) : (isElim ? toggleElim(opt.key) : selectAnswer(opt.key))} className="flex-1 text-left flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all" style={{ background: isElim ? '#fafafa' : isSel ? '#eff6ff' : '#fff', border: `2px solid ${isElim ? '#e5e7eb' : isSel ? BB.accent : '#e2e8f0'}`, opacity: isElim ? 0.4 : 1 }}>
                            <span className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all" style={{ background: isSel && !isElim ? BB.accent : '#f1f5f9', color: isSel && !isElim ? '#fff' : BB.muted, border: `2px solid ${isSel && !isElim ? BB.accent : '#d1d5db'}` }}>{opt.key}</span>
                            <span className="text-sm" style={{ textDecoration: isElim ? 'line-through' : 'none', color: isElim ? '#9ca3af' : BB.text }}>{opt.text}</span>
                          </button>
                          {crossOut && <button onClick={() => toggleElim(opt.key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all" style={{ background: isElim ? '#fee2e2' : '#f1f5f9', color: isElim ? '#dc2626' : '#9ca3af', border: `1px solid ${isElim ? '#fca5a5' : '#e2e8f0'}` }}>{isElim ? '↺' : '✕'}</button>}
                        </div>
                      );
                    })}
                  </div>
                )}
                <AnimatePresence>{showNote && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden">
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: BB.muted }}>Scratch Work / Notes</label>
                    <textarea value={annotations[current] || ''} onChange={e => setAnnotations(p => ({ ...p, [current]: e.target.value }))} placeholder="Your notes for this question..." rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm resize-y outline-none" style={{ background: '#fefce8', border: '1px solid #fde68a', color: BB.text, minHeight: 56 }} />
                  </motion.div>
                )}</AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <footer className="flex items-center justify-between px-5 py-2.5 shadow-[0_-1px_6px_rgba(0,0,0,0.06)] sticky bottom-0 z-30" style={{ background: BB.panel, borderTop: `1px solid ${BB.border}` }}>
        <span className="text-[11px] font-semibold" style={{ color: BB.muted }}>{answered} of {sortedQuestions.length} answered</span>
        <button onClick={() => setShowNav(true)} className="px-5 py-2 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5" style={{ background: BB.navBg }}>{sectionLabel} · Question {sectionQIdx} of {sectionTotal} ▾</button>
        <div className="flex gap-2">
          <button onClick={() => setCurrent(c => Math.max(currentSection === 'math' ? rwCount : 0, c - 1))} disabled={sectionQIdx === 1} className="px-5 py-2 rounded-full text-[11px] font-bold disabled:opacity-30 transition-all" style={{ background: '#f1f5f9', color: BB.text, border: `1px solid ${BB.border}` }}>← Back</button>
          {isLastQ ? (
            <button onClick={handleFinish} disabled={submitting} className="px-6 py-2 rounded-full text-[11px] font-bold text-white disabled:opacity-50 transition-all" style={{ background: BB.correct }}>{submitting ? 'Submitting...' : '✓ Submit Test'}</button>
          ) : isLastRW ? (
            <button onClick={handleNext} className="px-6 py-2 rounded-full text-[11px] font-bold text-white" style={{ background: '#7c3aed' }}>Proceed to Math →</button>
          ) : (
            <button onClick={() => setCurrent(c => c + 1)} className="px-6 py-2 rounded-full text-[11px] font-bold text-white" style={{ background: BB.accent }}>Next →</button>
          )}
        </div>
      </footer>

      {/* ═══ Question Navigator — SECTION-LOCKED ═══ */}
      <AnimatePresence>{showNav && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center" onClick={() => setShowNav(false)}>
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
          <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', damping: 28 }} className="relative w-full max-w-lg rounded-t-2xl shadow-2xl" style={{ background: BB.panel }} onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold" style={{ color: BB.text }}>Question Navigator</h3>
                <button onClick={() => setShowNav(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-200">✕</button>
              </div>

              {/* R&W Section */}
              {rwCount > 0 && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: BB.accent }}>Reading & Writing ({rwCount})</p>
                  <div className="grid grid-cols-8 gap-1.5 mb-4">
                    {sortedQuestions.slice(0, rwCount).map((_, i) => {
                      const isCurrentSection = currentSection === 'rw';
                      const locked = !isCurrentSection;
                      return (
                        <button key={i}
                          onClick={() => { if (!locked) { setCurrent(i); setShowNav(false); } }}
                          disabled={locked}
                          className="h-9 rounded-lg text-[11px] font-bold transition-all relative"
                          style={{
                            background: locked ? '#f1f5f9' : i === current ? BB.accent : answers[i] ? '#dbeafe' : '#f8fafc',
                            color: locked ? '#c4c4c4' : i === current ? '#fff' : answers[i] ? BB.accent : '#94a3b8',
                            border: `1.5px solid ${locked ? '#e2e8f0' : i === current ? BB.accent : answers[i] ? '#93c5fd' : '#e2e8f0'}`,
                            boxShadow: marked.has(i) && !locked ? '0 0 0 2px #fbbf24' : 'none',
                            cursor: locked ? 'not-allowed' : 'pointer',
                            opacity: locked ? 0.5 : 1,
                          }}>
                          {locked ? '🔒' : i + 1}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Math Section */}
              {mathCount > 0 && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#7c3aed' }}>Math ({mathCount})</p>
                  <div className="grid grid-cols-8 gap-1.5 mb-4">
                    {sortedQuestions.slice(rwCount).map((_, i) => {
                      const gi = rwCount + i;
                      const isCurrentSection = currentSection === 'math';
                      const locked = !isCurrentSection;
                      return (
                        <button key={gi}
                          onClick={() => { if (!locked) { setCurrent(gi); setShowNav(false); } }}
                          disabled={locked}
                          className="h-9 rounded-lg text-[11px] font-bold transition-all relative"
                          style={{
                            background: locked ? '#f1f5f9' : gi === current ? '#7c3aed' : answers[gi] ? '#ede9fe' : '#f8fafc',
                            color: locked ? '#c4c4c4' : gi === current ? '#fff' : answers[gi] ? '#7c3aed' : '#94a3b8',
                            border: `1.5px solid ${locked ? '#e2e8f0' : gi === current ? '#7c3aed' : answers[gi] ? '#c4b5fd' : '#e2e8f0'}`,
                            boxShadow: marked.has(gi) && !locked ? '0 0 0 2px #fbbf24' : 'none',
                            cursor: locked ? 'not-allowed' : 'pointer',
                            opacity: locked ? 0.5 : 1,
                          }}>
                          {locked ? '🔒' : i + 1}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Legend */}
              <div className="flex gap-4 text-[10px] font-medium flex-wrap" style={{ color: BB.muted }}>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: BB.accent }} /> Current</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#dbeafe' }} /> Answered</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50" style={{ boxShadow: '0 0 0 2px #fbbf24' }} /> Marked</span>
                {hasBothSections && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 flex items-center justify-center text-[6px]">🔒</span> Locked Section</span>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ═══ Desmos Calculator — Panel or Fullscreen ═══ */}
      <AnimatePresence>{showDesmos && (
        desmosFullscreen ? (
          /* Fullscreen overlay */
          <motion.div key="desmos-fs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col" style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: '#f8fafc', borderBottom: `1px solid ${BB.border}` }}>
              <span className="text-[12px] font-bold" style={{ color: BB.text }}>📐 Desmos Graphing Calculator</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setDesmosFullscreen(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all" style={{ background: '#f1f5f9', color: BB.muted, border: `1px solid ${BB.border}` }}>↙ Exit Fullscreen</button>
                <button onClick={() => { setShowDesmos(false); setDesmosFullscreen(false); }} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs transition-all">✕</button>
              </div>
            </div>
            <div className="flex-1 relative">
              <iframe src="https://www.desmos.com/calculator?lang=en" title="Desmos Graphing Calculator" className="absolute inset-0 w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-popups" loading="lazy" />
            </div>
          </motion.div>
        ) : (
          /* Floating panel — draggable-resizable */
          <motion.div key="desmos-panel" initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed z-40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ background: BB.panel, border: `1px solid ${BB.border}`, width: 480, height: 460, bottom: 56, right: 16, resize: 'both', minWidth: 280, minHeight: 240, maxWidth: '95vw', maxHeight: 'calc(100vh - 80px)' }}>
            <div className="flex items-center justify-between px-3 py-2 shrink-0 cursor-move" style={{ background: '#f8fafc', borderBottom: `1px solid ${BB.border}` }}>
              <span className="text-[11px] font-bold" style={{ color: BB.text }}>📐 Calculator</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setDesmosFullscreen(true)} className="px-2 py-1 rounded text-[10px] font-bold transition-all hover:bg-blue-50" style={{ color: BB.accent }} title="Fullscreen">⛶ Full</button>
                <div className="w-px h-4 mx-0.5" style={{ background: BB.border }} />
                <button onClick={() => setShowDesmos(false)} className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs transition-all">✕</button>
              </div>
            </div>
            <div className="flex-1 relative" style={{ minHeight: 0 }}>
              <iframe src="https://www.desmos.com/calculator?lang=en" title="Desmos Graphing Calculator" className="absolute inset-0 w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-popups" loading="lazy" />
            </div>
            {/* Resize hint */}
            <div className="absolute bottom-1 right-1 w-4 h-4 opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 50%, #94a3b8 50%, transparent 52%, #94a3b8 70%, transparent 72%, #94a3b8 90%)', borderRadius: 2 }} />
          </motion.div>
        )
      )}</AnimatePresence>
    </div>
  );
}
