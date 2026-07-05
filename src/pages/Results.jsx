import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'
import CircularProgress from '../components/CircularProgress'

export default function Results() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [tab, setTab] = useState('All')

  useEffect(() => { load() }, [testId])

  async function load() {
    const { data: t } = await supabase.from('tests').select('*').eq('id', testId).single()
    setTest(t)
    const { data: a } = await supabase.from('attempts').select('*, questions(*)').eq('test_id', testId).order('date', { ascending: true })
    setAttempts(a || [])
  }

  if (!test) return <div className="p-10 text-center text-slate-500">Loading results...</div>

  const rw = attempts.filter(a => a.questions?.module?.startsWith('RW'))
  const math = attempts.filter(a => a.questions?.module?.startsWith('Math'))
  const rwCorrect = rw.filter(a => a.is_correct).length
  const mathCorrect = math.filter(a => a.is_correct).length

  const filtered = attempts.filter(a => {
    if (tab === 'All') return true
    if (tab === 'R&W') return a.questions?.module?.startsWith('RW')
    return a.questions?.module?.startsWith('Math')
  })

  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 mb-4">← Back to Dashboard</button>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{test.name}</h1>
      <p className="text-slate-500 mb-8">Full score breakdown and question-by-question review.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
          <CircularProgress value={test.rw_score || 0} max={800} label="Reading & Writing" />
          <p className="text-sm text-slate-500 mt-4 text-center">{rwCorrect} Correct, {rw.length - rwCorrect} Wrong</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center">
          <p className="text-slate-500 font-semibold mb-2">Total Score</p>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-extrabold text-slate-900">{test.score}</span>
            <span className="text-xl text-slate-400 mb-1">/1600</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
          <CircularProgress value={test.math_score || 0} max={800} label="Math" />
          <p className="text-sm text-slate-500 mt-4 text-center">{mathCorrect} Correct, {math.length - mathCorrect} Wrong</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm w-fit mb-6">
        {['All', 'R&W', 'Math'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tab === t ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {filtered.map((a, i) => (
          <div key={a.id} className="flex items-center justify-between px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50">
            <div>
              <span className={`${moduleColor(a.questions?.module)} text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-1`}>
                {a.questions?.module?.includes('RW') ? 'R&W' : 'Math'} - M1
              </span>
              <p className="font-bold text-slate-900 text-sm">Question {i + 1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Your Answer</p>
              <p className={`font-bold ${a.is_correct ? 'text-green-600' : 'text-red-500'}`}>{a.selected_answer || '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Correct Answer</p>
              <p className="font-bold text-green-600">{a.questions?.correct_answer || a.questions?.correct_value}</p>
            </div>
            <button className="bg-slate-900 text-white text-sm font-bold px-5 py-2 rounded-full flex items-center gap-1 hover:bg-slate-800">
              Review →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}