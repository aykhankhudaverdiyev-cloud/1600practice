import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function StudyPlan() {
  const [targetDate, setTargetDate] = useState('')
  const [plan, setPlan] = useState([])
  const [weakness, setWeakness] = useState([])

  useEffect(() => { analyzePerformance() }, [])

  async function analyzePerformance() {
    const { data } = await supabase.from('attempts').select('*, questions(module)')
    if (!data || data.length === 0) return

    const moduleStats = {}
    data.forEach(a => {
      const mod = a.questions?.module || 'Unknown'
      if (!moduleStats[mod]) moduleStats[mod] = { total: 0, correct: 0 }
      moduleStats[mod].total++
      if (a.is_correct) moduleStats[mod].correct++
    })

    const weak = Object.entries(moduleStats)
      .map(([mod, s]) => ({ module: mod, accuracy: Math.round((s.correct / s.total) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)

    setWeakness(weak)
  }

  function generatePlan() {
    if (!targetDate) { alert('Pick your target test date first.'); return }
    const days = Math.max(1, Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)))
    const focus = weakness.length > 0 ? weakness : [{ module: 'RW Module 1', accuracy: 0 }, { module: 'Math Module 1', accuracy: 0 }]

    const generated = Array.from({ length: Math.min(days, 14) }).map((_, i) => {
      const target = focus[i % focus.length]
      return {
        day: i + 1,
        focus: target.module,
        task: `Complete a ${target.module} practice set (15-20 questions), review every mistake with explanations.`
      }
    })
    setPlan(generated)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Study Plan</h1>
      <p className="text-slate-500 text-sm mb-6">A personalized schedule based on your weakest areas.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-1">Target test date</label>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={generatePlan} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700">
          Generate Plan
        </button>
      </div>

      {weakness.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-2 text-sm">Your weakest areas</h3>
          <div className="flex gap-2 flex-wrap">
            {weakness.map(w => (
              <span key={w.module} className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {w.module}: {w.accuracy}% accuracy
              </span>
            ))}
          </div>
        </div>
      )}

      {plan.length > 0 && (
        <div className="space-y-3">
          {plan.map(p => (
            <div key={p.day} className="border border-slate-200 bg-white rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <span className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white font-bold rounded-lg shrink-0">D{p.day}</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{p.focus}</p>
                <p className="text-slate-600 text-sm mt-1">{p.task}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}