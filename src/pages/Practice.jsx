import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Practice() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [eliminated, setEliminated] = useState({})
  const [seconds, setSeconds] = useState(0)
  const [highlights, setHighlights] = useState([])
  const passageRef = useRef(null)

  useEffect(() => { loadTest() }, [testId])

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  async function loadTest() {
    const { data: test } = await supabase.from('tests').select('*').eq('id', testId).single()
    if (!test) return
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

  function selectAnswer(choice) {
    setAnswers(prev => ({ ...prev, [current]: choice }))
  }

  function toggleMark() {
    setMarked(prev => ({ ...prev, [current]: !prev[current] }))
  }

  function toggleEliminate(choice) {
    setEliminated(prev => {
      const curr = prev[current] || []
      const next = curr.includes(choice) ? curr.filter(c => c !== choice) : [...curr, choice]
      return { ...prev, [current]: next }
    })
  }

  function handleHighlight() {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !passageRef.current) return
    const text = sel.toString()
    if (text.trim().length === 0) return
    setHighlights(prev => [...prev, { id: Date.now(), text }])
    sel.removeAllRanges()
  }

  async function finishTest() {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      await supabase.from('attempts').insert([{
        test_id: testId,
        question_id: q.id,
        selected_answer: answers[i] || null,
        is_correct: answers[i] === q.correct_answer,
        marked_for_review: !!marked[i],
        time_spent_seconds: seconds
      }])
    }
    navigate('/')
  }

  if (questions.length === 0) {
    return <div className="p-10 text-center text-slate-500">Loading test...</div>
  }

  const q = questions[current]
  const currentElim = eliminated[current] || []
  const choices = [
    { key: 'A', text: q.choice_a }, { key: 'B', text: q.choice_b },
    { key: 'C', text: q.choice_c }, { key: 'D', text: q.choice_d }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
        <span className="text-sm font-semibold text-slate-600">{q.module}</span>
        <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-1.5">
          <span className="font-mono font-semibold text-slate-800">{formatTime(seconds)}</span>
        </div>
        <button onClick={finishTest} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700">
          End & Submit
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-8 bg-white" ref={passageRef} onMouseUp={handleHighlight}>
          {q.passage_text ? (
            <>
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wide">Passage</h3>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line select-text">
                {q.passage_text}
              </p>
              {highlights.length > 0 && (
                <div className="mt-4 text-xs text-slate-400">Select text to highlight it (visual marker only for now).</div>
              )}
            </>
          ) : (
            <p className="text-slate-400 italic">No passage for this question (math/standalone item).</p>
          )}
        </div>

        <div className="w-1/2 overflow-y-auto p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white font-bold rounded">{current + 1}</span>
            <button onClick={toggleMark} className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border ${marked[current] ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'border-slate-300 text-slate-600'}`}>
              🔖 Mark for Review
            </button>
          </div>

          <p className="text-slate-900 font-medium mb-6">{q.question_text}</p>

          <div className="space-y-3">
            {choices.map(c => {
              const isElim = currentElim.includes(c.key)
              const isSelected = answers[current] === c.key
              return (
                <div key={c.key} className="flex items-center gap-2">
                  <button
                    onClick={() => !isElim && selectAnswer(c.key)}
                    disabled={isElim}
                    className={`flex-1 text-left flex items-center gap-3 border rounded-xl p-4 transition-colors ${
                      isElim ? 'opacity-40 line-through border-slate-200' :
                      isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full border text-sm font-semibold ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-400 text-slate-600'}`}>
                      {c.key}
                    </span>
                    <span className="text-sm text-slate-800">{c.text}</span>
                  </button>
                  <button
                    onClick={() => toggleEliminate(c.key)}
                    title="Eliminate"
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                  >
                    ⊘
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="text-sm text-slate-500">Question {current + 1} of {questions.length}</span>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
            Next →
          </button>
        ) : (
          <button onClick={finishTest} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold">
            Finish Test
          </button>
        )}
      </div>
    </div>
  )
}