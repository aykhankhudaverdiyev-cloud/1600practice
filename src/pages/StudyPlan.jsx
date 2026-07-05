import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'
import { showToast } from '../lib/toast'

const ALL_MODULES = ['RW Module 1', 'RW Module 2', 'Math Module 1', 'Math Module 2']

export default function StudyPlan() {
  const [targetDate, setTargetDate] = useState('')
  const [plan, setPlan] = useState([])
  const [analysis, setAnalysis] = useState([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')

  useEffect(() => { analyzePerformance() }, [])

  async function analyzePerformance() {
    const { data, error } = await supabase.from('attempts').select('*, questions(module, difficulty)')
    if (error) { showToast('Could not analyze performance: ' + error.message, 'error'); return }

    const stats = {}
    ALL_MODULES.forEach(m => { stats[m] = { total: 0, correct: 0, hardWrong: 0 } })

    ;(data || []).forEach(a => {
      const mod = a.questions?.module
      if (!mod || !stats[mod]) return
      stats[mod].total++
      if (a.is_correct) stats[mod].correct++
      if (!a.is_correct && a.questions?.difficulty === 'hard') stats[mod].hardWrong++
    })

    const result = ALL_MODULES.map(mod => {
      const s = stats[mod]
      const accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : null
      const priority = s.total === 0 ? 50 : (100 - accuracy) + s.hardWrong * 5
      return { module: mod, accuracy, attempts: s.total, priority }
    }).sort((a, b) => b.priority - a.priority)

    setAnalysis(result)
  }

  function generatePlan() {
    if (!targetDate) { showToast('Please select your target test date first.', 'error'); return }
    setLoading(true)

    const today = new Date()
    const target = new Date(targetDate)
    const totalDays = Math.max(1, Math.ceil((target - today) / (1000 * 60 * 60 * 24)))
    const planDays = Math.min(totalDays, 21)

    const priorityRanked = [...analysis].sort((a, b) => b.priority - a.priority)
    const topWeak = priorityRanked.slice(0, 2)
    const secondary = priorityRanked.slice(2)

    const generated = Array.from({ length: planDays }).map((_, i) => {
      const dayNum = i + 1
      const daysLeft = totalDays - i
      const phase = daysLeft <= 3 ? 'final' : daysLeft <= 10 ? 'sharpen' : 'build'

      let focusModules, taskDesc, questionCount, mode

      if (phase === 'build') {
        focusModules = i % 3 === 2 ? [secondary[0] || topWeak[0]] : topWeak
        questionCount = 20
        mode = 'Untimed, focus on accuracy and understanding why each wrong answer is wrong.'
        taskDesc = `Deep-practice ${focusModules.map(f => f.module).join(' & ')} — review every explanation, no clock pressure yet.`
      } else if (phase === 'sharpen') {
        focusModules = i % 2 === 0 ? topWeak : [priorityRanked[Math.floor(Math.random() * priorityRanked.length)]]
        questionCount = 25
        mode = 'Timed per-question pacing (Bluebook realistic timing).'
        taskDesc = `Timed drill on ${focusModules.map(f => f.module).join(' & ')} — simulate real exam pacing and pressure.`
      } else {
        focusModules = ALL_MODULES.map(m => ({ module: m }))
        questionCount = 27
        mode = 'Full timed module simulation, exactly like real Bluebook exam.'
        taskDesc = `Full-length timed module simulation — treat this exactly like real test day.`
      }

      return {
        day: dayNum,
        date: new Date(today.getTime() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        phase,
        focus: focusModules.map(f => f.module),
        task: taskDesc,
        questionCount,
        mode
      }
    })

    setPlan(generated)
    const weakestName = priorityRanked[0]?.module || 'your weakest area'
    setSummary(
      `Based on your attempt history, ${weakestName} needs the most attention. Your plan starts with untimed deep-practice, ` +
      `shifts to timed drills in the middle stretch, and finishes with full timed simulations in the final days before ${target.toLocaleDateString()} — ` +
      `exactly how I'd coach a student aiming for a 1600.`
    )
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Study Plan</h1>
      <p className="text-slate-500 text-sm mb-6">An adaptive schedule built the way an experienced SAT tutor would plan it.</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-700 block mb-1">Target test date</label>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <button onClick={generatePlan} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 shadow-md disabled:opacity-50">
          {loading ? 'Building...' : 'Generate Plan'}
        </button>
      </div>

      {analysis.some(a => a.attempts > 0) && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 mb-2 text-sm">Performance by module</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analysis.map(a => (
              <div key={a.module} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <span className={`${moduleColor(a.module)} text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-2`}>{a.module}</span>
                <p className="text-xl font-extrabold text-slate-900">{a.accuracy !== null ? `${a.accuracy}%` : '—'}</p>
                <p className="text-xs text-slate-500">{a.attempts} attempts</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 mb-6 text-sm text-indigo-900 animate-fade">
          <span className="font-bold">Coach's note: </span>{summary}
        </div>
      )}

      {plan.length > 0 && (
        <div className="space-y-3">
          {plan.map(p => (
            <div key={p.day} className="border border-slate-200 bg-white rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow animate-fade">
              <span className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl font-bold shrink-0 text-white ${
                p.phase === 'final' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                p.phase === 'sharpen' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                'bg-gradient-to-br from-blue-600 to-indigo-600'
              }`}>
                <span className="text-[10px] uppercase opacity-80">Day</span>
                <span className="text-lg leading-none">{p.day}</span>
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-sm">{p.date}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    p.phase === 'final' ? 'bg-red-100 text-red-700' :
                    p.phase === 'sharpen' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{p.phase} phase</span>
                </div>
                <p className="text-slate-700 text-sm mt-1">{p.task}</p>
                <p className="text-slate-400 text-xs mt-1">{p.questionCount} questions • {p.mode}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}