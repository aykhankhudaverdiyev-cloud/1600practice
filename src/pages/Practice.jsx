import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'
import { showToast } from '../lib/toast'

export default function Practice() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [eliminated, setEliminated] = useState({})
  const [seconds, setSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadTest() }, [testId])

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    supabase.from('tests').update({ status: 'in_progress', last_attempt_at: new Date().toISOString() }).eq('id', testId)
  }, [testId])

  async function loadTest() {
    const { data: test, error } = await supabase.from('tests').select('*').eq('id', testId).single()
    if (error || !test) { showToast('Could not load test.', 'error'); return }
    const { data: qs } = await supabase.from('questions').select('*').in('id', test.question_ids)
    const ordered = test.question_ids.map(id => qs.find(q => q.id === id)).filter(Boolean)
    setQuestions(ordered)
  }

  function formatTime(s) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  function selectAnswer(choice) { setAnswers(prev => ({ ...prev, [current]: choice })) }
  function toggleMark() { setMarked(prev => ({ ...prev, [current]: !prev[current] })) }
  function toggleEliminate(choice) {
    setEliminated(prev => {
      const curr = prev[current] || []
      const next = curr.includes(choice) ? curr.filter(c => c !== choice) : [...curr, choice]
      return { ...prev, [current]: next }
    })
  }

  function applyHighlight(color) {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    const span = document.createElement('span')
    span.style.backgroundColor = color
    span.style.borderRadius = '3px'
    span.style.padding = '1px 2px'
    try { range.surroundContents(span) } catch (e) {}
    sel.removeAllRanges()
  }

  async function finishTest() {
    setSubmitting(true)
    let correctCount = 0
    let rwTotal = 0, rwCorrect = 0, mathTotal = 0, mathCorrect = 0

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const isCorrect = answers[i] === q.correct_answer
      if (isCorrect) correctCount++
      if (q.module?.startsWith('RW')) { rwTotal++; if (isCorrect) rwCorrect++ }
      if (q.module?.startsWith('Math')) { mathTotal++; if (isCorrect) mathCorrect++ }

      const { error } = await supabase.from('attempts').insert([{
        test_id: testId,
        question_id: q.id,
        selected_answer: answers[i] || null,
        is_correct: isCorrect,
        marked_for_review: !!marked[i],
        time_spent_seconds: seconds
      }])
      if (error) showToast('Warning: one attempt failed to save: ' + error.message, 'error')
    }

    const scaledScore = Math.round((correctCount / questions.length) * 1600)
    const rwScore = rwTotal > 0 ? Math.round((rwCorrect / rwTotal) * 800) : 0
    const mathScore = mathTotal > 0 ? Math.round((mathCorrect / mathTotal) * 800) : 0

    const { error: updateError } = await supabase.from('tests').update({
      status: 'completed', score: scaledScore, rw_score: rwScore, math_score: mathScore,
      last_attempt_at: new Date().toISOString()
    }).eq('id', testId)

    setSubmitting(false)
    if (updateError) { showToast('Failed to save final score: ' + updateError.message, 'error'); return }
    showToast('Test submitted successfully!')
    navigate(`/results/${testId}`)
  }

  if (questions.length === 0) return <div className="p-10 text-center text-slate-500">Loading test...</div>

  const q = questions[current]
  const currentElim = eliminated[current] || []
  const choices = [
    { key: 'A', text: q.choice_a }, { key: 'B', text: q.choice_b },
    { key: 'C', text: q.choice_c }, { key: 'D', text: q.choice_d }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 glass">
        <span className={`${moduleColor(q.module)} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>{q.module}</span>
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full px-5 py-2 shadow-md">
          <span className="font-mono font-bold tracking-wider">{formatTime(seconds)}</span>
        </div>
        <button onClick={finishTest} disabled={submitting} className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 shadow-md disabled:opacity-50">
          {submitting ? 'Submitting...' : 'End & Submit'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-8 bg-white">
          {q.passage_text ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Passage</h3>
                <div className="flex gap-1.5">
                  <button onClick={() => applyHighlight('#fef08a')} className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-white shadow hover:scale-110 transition-transform" />
                  <button onClick={() => applyHighlight('#bfdbfe')} className="w-6 h-6 rounded-full bg-blue-300 border-2 border-white shadow hover:scale-110 transition-transform" />
                  <button onClick={() => applyHighlight('#fbcfe8')} className="w-6 h-6 rounded-full bg-pink-300 border-2 border-white shadow hover:scale-110 transition-transform" />
                </div>
              </div>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line select-text text-[15px]">{q.passage_text}</p>
            </>
          ) : (
            <p className="text-slate-400 italic">No passage for this question (math/standalone item).</p>
          )}
        </div>

        <div className="w-1/2 overflow-y-auto p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold rounded-lg shadow-md">{current + 1}</span>
            <button onClick={toggleMark} className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${marked[current] ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'border-slate-300 text-slate-600 hover:border-yellow-300'}`}>
              🔖 Mark for Review
            </button>
          </div>

          <p className="text-slate-900 font-medium mb-6 text-[15px]">{q.question_text}</p>

          <div className="space-y-3">
            {choices.map(c => {
              const isElim = currentElim.includes(c.key)
              const isSelected = answers[current] === c.key
              return (
                <div key={c.key} className="flex items-center gap-2 animate-fade">
                  <button
                    onClick={() => !isElim && selectAnswer(c.key)}
                    disabled={isElim}
                    className={`flex-1 text-left flex items-center gap-3 border-2 rounded-2xl p-4 transition-all ${
                      isElim ? 'opacity-40 line-through border-slate-200' :
                      isSelected ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                      isSelected ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md' : 'border-2 border-slate-300 text-slate-500'
                    }`}>{c.key}</span>
                    <span className="text-sm text-slate-800 font-medium">{c.text}</span>
                  </button>
                  <button onClick={() => toggleEliminate(c.key)} className="text-xs border-2 border-slate-200 rounded-xl px-2.5 py-2 text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">⊘</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 glass">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="px-5 py-2.5 rounded-full border-2 border-slate-300 text-sm font-bold disabled:opacity-40 hover:bg-slate-50">← Previous</button>
        <span className="text-sm text-slate-500 font-medium">Question {current + 1} of {questions.length}</span>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-bold shadow-md hover:opacity-90">Next →</button>
        ) : (
          <button onClick={finishTest} disabled={submitting} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Finish Test'}
          </button>
        )}
      </div>
    </div>
  )
}