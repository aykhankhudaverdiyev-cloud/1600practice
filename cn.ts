import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card3D from '../components/Card3D';
import { useAttempts, useQuestions, getQuestionById } from '../store';

const ALL_MODULES = ['RW Module 1', 'RW Module 2', 'Math Module 1', 'Math Module 2'];

interface DayPlan {
  day: number;
  date: string;
  phase: string;
  focus: string[];
  task: string;
  questionCount: number;
  mode: string;
}

const phaseStyles: Record<string, { bg: string; text: string; badge: string }> = {
  build: { bg: 'from-blue-600 to-indigo-600', text: 'text-blue-300', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  sharpen: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-300', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  final: { bg: 'from-red-500 to-rose-600', text: 'text-red-300', badge: 'bg-red-500/10 text-red-300 border-red-500/20' },
};

export default function StudyPlan() {
  const [targetDate, setTargetDate] = useState('');
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [coachNote, setCoachNote] = useState('');
  const [building, setBuilding] = useState(false);
  const { attempts } = useAttempts();
  useQuestions();

  const moduleStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number; hardWrong: number }> = {};
    ALL_MODULES.forEach(m => { stats[m] = { total: 0, correct: 0, hardWrong: 0 }; });
    
    attempts.forEach(a => {
      const q = getQuestionById(a.question_id);
      if (!q || !stats[q.module]) return;
      stats[q.module].total++;
      if (a.is_correct) stats[q.module].correct++;
      if (!a.is_correct && q.difficulty === 'hard') stats[q.module].hardWrong++;
    });

    return ALL_MODULES.map(m => {
      const s = stats[m];
      const accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
      const priority = s.total === 0 ? 50 : (100 - (accuracy ?? 0)) + s.hardWrong * 5;
      return { module: m, accuracy, attempts: s.total, priority };
    }).sort((a, b) => b.priority - a.priority);
  }, [attempts]);

  const generatePlan = () => {
    if (!targetDate) return;
    setBuilding(true);

    const now = new Date();
    const target = new Date(targetDate);
    const totalDays = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const planDays = Math.min(totalDays, 21);

    const sorted = [...moduleStats].sort((a, b) => b.priority - a.priority);
    const weak = sorted.slice(0, 2);

    const days: DayPlan[] = Array.from({ length: planDays }).map((_, i) => {
      const day = i + 1;
      const remaining = totalDays - i;
      const phase = remaining <= 3 ? 'final' : remaining <= Math.ceil(totalDays * 0.5) ? 'sharpen' : 'build';

      let focus: string[];
      let count: number;
      let mode: string;
      let task: string;

      if (phase === 'build') {
        focus = weak.map(w => w.module);
        count = 20;
        mode = 'Untimed deep practice — review every explanation.';
        task = `Deep practice on ${focus.join(' & ')} — no clock pressure, focus on understanding.`;
      } else if (phase === 'sharpen') {
        focus = i % 2 === 0 ? weak.map(w => w.module) : [sorted[Math.floor(Math.random() * sorted.length)].module];
        count = 25;
        mode = 'Timed per-question pacing (Bluebook realistic timing).';
        task = `Timed drill on ${focus.join(' & ')} — simulate real exam pacing and pressure.`;
      } else {
        focus = ALL_MODULES;
        count = 27;
        mode = 'Full timed module simulation, exactly like real Bluebook exam.';
        task = `Full-length timed simulation — treat this exactly like real test day.`;
      }

      return {
        day,
        date: new Date(now.getTime() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        phase,
        focus,
        task,
        questionCount: count,
        mode,
      };
    });

    setPlan(days);
    setCoachNote(`Based on your attempt history, ${sorted[0]?.module || 'your weakest area'} needs the most attention. Your plan starts with untimed deep-practice, shifts to timed drills, and finishes with full timed simulations before ${target.toLocaleDateString()}.`);
    setBuilding(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">
          <span className="gradient-text">Study</span> Plan
        </h1>
        <p className="text-white/40 text-sm mb-8">An adaptive schedule built the way an experienced SAT tutor would plan it.</p>
      </motion.div>

      {/* Date Picker & Generate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card3D className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-bold text-white/50 block mb-2">Target Test Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={generatePlan}
              disabled={building || !targetDate}
              className="glow-button px-8 py-3 text-sm disabled:opacity-40 shrink-0"
            >
              {building ? 'Building...' : 'Generate Plan ✨'}
            </button>
          </div>
        </Card3D>
      </motion.div>

      {/* Module Performance */}
      {moduleStats.some(m => m.attempts > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h3 className="font-bold text-white text-sm mb-3">Performance by Module</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moduleStats.map(m => (
              <Card3D key={m.module} className="p-4" intensity={6}>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full inline-block mb-2">
                  {m.module}
                </span>
                <p className="text-2xl font-extrabold text-white">
                  {m.accuracy === null ? '—' : `${m.accuracy}%`}
                </p>
                <p className="text-xs text-white/30">{m.attempts} attempts</p>
              </Card3D>
            ))}
          </div>
        </motion.div>
      )}

      {/* Coach's Note */}
      {coachNote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="glass-card p-5 border-indigo-500/20 bg-indigo-500/5">
            <span className="text-xs font-bold text-indigo-300">🎓 Coach's Note: </span>
            <span className="text-sm text-white/60">{coachNote}</span>
          </div>
        </motion.div>
      )}

      {/* Plan Timeline */}
      {plan.length > 0 && (
        <div className="space-y-3">
          {plan.map((day, i) => {
            const style = phaseStyles[day.phase] || phaseStyles.build;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
              >
                <Card3D className="p-5" intensity={4}>
                  <div className="flex gap-4 items-start">
                    <div className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br ${style.bg} text-white font-bold shrink-0 shadow-lg`}>
                      <span className="text-[9px] uppercase opacity-70">Day</span>
                      <span className="text-lg leading-none">{day.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-white text-sm">{day.date}</p>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                          {day.phase} phase
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-1">{day.task}</p>
                      <p className="text-xs text-white/25">{day.questionCount} questions • {day.mode}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      )}

      {plan.length === 0 && !coachNote && (
        <div className="glass-card p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-white/40 text-sm">Select your target date and generate a personalized study plan.</p>
        </div>
      )}
    </div>
  );
}
