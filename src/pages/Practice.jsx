import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showToast } from '../lib/toast'
import ScientificCalculator from '../components/ScientificCalculator'
import QuestionNav from '../components/QuestionNav'

export default function Practice() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [frResponses, setFrResponses] = useState({})
  const [marked, setMarked] = useState({})
  const [eliminated, setEliminated] = useState({})
  const [seconds, setSeconds] = useState(0)
  const [splitPct, setSplitPct] = useState(50)
  const [showCalc, setShowCalc] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [module, setModule] = useState('Section 1: Reading and Writing')
  const containerRef = useRef(null)
  const draggingSplit = useRef(false)

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
    if (ordered[0]) setModule(ordered[0].module?.startsWith('Math') ? 'Section 2: Math' : 'Section 1: Reading and Writing')
  }

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  function selectAnswer(choice) { setAnswers(prev => ({ ...prev, [current]: choice })) }
  function setFR(val) { setFrResponses(prev => ({ ...prev, [current]: val })) }
  function toggleMark() { setMarked(prev => ({ ...prev, [current]: !prev[current] })) }
  function toggleEliminate(choice) {
    setEliminated(prev => {
      const curr = prev[current] || []
      const next = curr.includes(choice) ? curr.filter(c => c !== choice) : [...curr, choice]
      return { ...prev, [current]: next }
    })
  }

  function startSplitDrag() {
    draggingSplit.current = true
    function move(e) {
      if (!draggingSplit.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPct(Math.min(75, Math.max(25, pct)))
    }
    function up() { draggingSplit.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  function applyHighlight(color) {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    const span = document.createElement('span')
    span.style.backgroundColor = color
    span.style.borderRadius = '2px'
    span.className = 'highlight-mark'
    try { range.surroundContents(span) } catch (e) {}
    sel.removeAllRanges()
  }

  async function exitTest() {
    if (!confirm('Exit test? Your progress will be saved and marked as In Progress.')) return
    await supabase.from('tests').update({ status: 'in_progress' }).eq('id', testId)
    navigate('/')
  }

  async function finishTest() {
    setSubmitting(true)
    let correctCount = 0
    let rwTotal = 0, rwCorrect = 0, mathTotal = 0, mathCorrect = 0

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const isFR = q.question_type === 'free_response'
      const userAns = isFR ? (frResponses[i] || null) : (answers[i] || null)
      const isCorrect = isFR
        ? parseFloat(userAns) === parseFloat(q.correct_value)
        : userAns === q.correct_answer

      if (isCorrect) correctCount++
      if (q.module?.startsWith('RW')) { rwTotal++; if (isCorrect) rwCorrect++ }
      if (q.module?.startsWith('Math')) { mathTotal++; if (isCorrect) mathCorrect++ }

      const { error } = await supabase.from('attempts').insert([{
        test_id: testId,
        question_id: q.id,
        selected_answer: userAns,
        is_correct: isCorrect,
        marked_for_review: !!marked[i],
        time_spent_seconds: seconds
      }])
      if (error) showToast('Warning: one attempt failed to save.', 'error')
    }

    const scaledScore = Math.round((correctCount / questions.length) * 1600)
    const rwScore = rwTotal > 0 ? Math.round((rwCorrect / rwTotal) * 800) : 0
    const mathScore = mathTotal > 0 ? Math.round((mathCorrect / mathTotal) * 800) : 0

    const { error: updateError } = await supabase.from('tests').update({
      status: 'completed', score: scaledScore, rw_score: rwScore, math_score: mathScore,
      last_attempt_at: new Date().toISOString()
    }).eq('id', testId)

    setSubmitting(false)
    if (updateError) { showToast('Failed to save score.', 'error'); return }
    showToast('Test submitted!')
    navigate(`/results/${testId}`)
  }

  if (questions.length === 0) return <div className="fixed inset-0 flex items-center justify-center bg-white text-slate-500">Loading test...</div>

  const q = questions[current]
  const isFR = q.question_type === 'free_response'
  const currentElim = eliminated[current] || []
  const choices = isFR ? [] : [
    { key: 'A', text: q.choice_a }, { key: 'B', text: q.choice_b },
    { key: 'C', text: q.choice_c }, { key: 'D', text: q.choice_d }
  ]

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-30">
      <style>{`.highlight-mark { padding: 1px 2px; }`}</style>

      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-[#dde6f5]">
        <div>
          <p className="font-bold text-slate-900 text-lg">{module}</p>
          <button className="text-sm text-slate-600 hover:underline">Directions ⌄</button>
        </div>
        <div className="text-center">
          <p className="font-mono font-bold text-xl text-slate-900">{formatTime(seconds)}</p>
          <button onClick={() => {}} className="bg-white border border-slate-300 rounded-full px-4 py-0.5 text-xs font-semibold mt-1">Hide</button>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setShowCalc(v => !v)} className="flex flex-col items-center text-xs font-semibold text-slate-700 hover:text-blue-600">
            <span className="text-lg">🖩</span>Calculator
          </button>
          <button onClick={exitTest} className="flex flex-col items-center text-xs font-semibold text-red-600 hover:text-red-700">
            <span className="text-lg">⏻</span>Exit
          </button>
        </div>
      </div>

      <div className="bg-[#1a2b6b] text-white text-center text-xs font-bold py-1.5 tracking-wide">THIS IS A TEST PREVIEW</div>

      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {q.passage_text ? (
          <>
            <div style={{ width: `${splitPct}%` }} className="overflow-y-auto p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Highlights & Notes</span>
                <div className="flex gap-1.5">
                  <button onClick={() => applyHighlight('#fef08a')} className="w-5 h-5 rounded-full bg-yellow-300 border border-white shadow hover:scale-110 transition-transform" />
                  <button onClick={() => applyHighlight('#bfdbfe')} className="w-5 h-5 rounded-full bg-blue-300 border border-white shadow hover:scale-110 transition-transform" />
                  <button onClick={() => applyHighlight('#fbcfe8')} className="w-5 h-5 rounded-full bg-pink-300 border border-white shadow hover:scale-110 transition-transform" />
                </div>
              </div>
              <p className="text-slate-900 leading-relaxed whitespace-pre-line select-text text-[16px]">{q.passage_text}</p>
            </div>
            <div
              onMouseDown={startSplitDrag}
              className="w-1.5 bg-slate-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center relative z-10"
            >
              <div className="w-4 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px]">⋮</div>
            </div>
          </>
        ) : null}

        <div style={{ width: q.passage_text ? `${100 - splitPct}%` : '100%' }} className="overflow-y-auto p-8 bg-white">
          <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-2">
            <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white font-bold rounded text-sm">{current + 1}</span>
            <button onClick={toggleMark} className={`flex items-center gap-1.5 text-sm font-semibold ${marked[current] ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'}`}>
              {marked[current] ? '🔖' : '🏷️'} Mark for Review
            </button>
            <span className="ml-auto text-xs font-bold border border-slate-300 rounded px-2 py-0.5">ABC ✕</span>
          </div>

          <p className="text-slate-900 font-medium mb-6 text-[16px] leading-relaxed">{q.question_text}</p>

          {isFR ? (
            <div>
              <input
                value={frResponses[current] || ''}
                onChange={e => setFR(e.target.value)}
                placeholder="Enter answer"
                className="w-40 border-2 border-slate-400 rounded-lg px-3 py-2 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-slate-500 mt-3">Answer Preview: <span className="font-bold">{frResponses[current] || '—'}</span></p>
            </div>
          ) : (
            <div className="space-y-3">
              {choices.map(c => {
                const isElim = currentElim.includes(c.key)
                const isSelected = answers[current] === c.key
                return (
                  <div key={c.key} className="flex items-center gap-2">
                    <button
                      onClick={() => !isElim && selectAnswer(c.key)}
                      disabled={isElim}
                      className={`flex-1 text-left flex items-center gap-3 border rounded-full px-4 py-3 transition-all ${
                        isElim ? 'opacity-40 line-through border-slate-200' :
                        isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold border-2 ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400 text-slate-600'
                      }`}>{c.key}</span>
                      <span className="text-sm text-slate-800">{c.text}</span>
                    </button>
                    <button onClick={() => toggleEliminate(c.key)} className="text-xs border border-slate-300 rounded-full w-8 h-8 flex items-center justify-center text-slate-400 hover:border-red-300 hover:text-red-500">
                      {c.key}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-[#dde6f5]">
        <span className="font-semibold text-slate-800 text-sm">You</span>
        <button onClick={() => setShowNav(true)} className="bg-slate-900 text-white rounded-full px-5 py-2 text-sm font-bold flex items-center gap-2">
          Question {current + 1} of {questions.length} ⌃
        </button>
        <div className="flex gap-3">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="bg-white border border-slate-300 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-40">Back</button>
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(c => c + 1)} className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-blue-700">Next</button>
          ) : (
            <button onClick={finishTest} disabled={submitting} className="bg-green-600 text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-green-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Finish'}
            </button>
          )}
        </div>
      </div>

      {showCalc && <ScientificCalculator onClose={() => setShowCalc(false)} />}
      {showNav && (
        <QuestionNav
          questions={questions}
          current={current}
          answers={isFR ? frResponses : answers}
          marked={marked}
          onJump={setCurrent}
          onClose={() => setShowNav(false)}
          onReview={() => setShowNav(false)}
        />
      )}
    </div>
  )
}