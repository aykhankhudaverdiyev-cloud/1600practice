import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'

export default function Results() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [attempts, setAttempts] = useState([])

  useEffect(() => { load() }, [testId])

  async function load() {
    const { data: t } = await supabase.from('tests').select('*').eq('id', testId).single()
    setTest(t)
    const { data: a } = await supabase.from('attempts').select('*, questions(*)').eq('test_id', testId).order('date', { ascending: false })
    setAttempts(a || [])
  }

  if (!test) return <div className="p-10 text-center text-slate-500">Loading results...</div>

  const total = attempts.length
  const correct = attempts.filter(a => a.is_correct).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8 animate-fade">
        <p className="text-blue-100 font-semibold text-sm uppercase tracking-wide">{test.name}</p>
        <div className="flex items-end gap-3 mt-2">
          <span className="text-6xl font-extrabold">{test.score}</span>
          <span className="text-2xl text-blue-200 mb-1">/ 1600</span>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold">Reading & Writing</p>
            <p className="text-2xl font-bold">{test.rw_score} <span className="text-sm text-blue-200">/ 800</span></p>
          </div>
          <div>
            <p className="text-blue-200 text-xs font-semibold">Math</p>
            <p className="text-2xl font-bold">{test.math_score} <span className="text-sm text-blue-200">/ 800</span></p>
          </div>
          <div>
            <p className="text-blue-200 text-xs font-semibold">Accuracy</p>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">Question Review</h2>
      <div className="space-y-3">
        {attempts.map(a => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm animate-fade">
            <div className="flex justify-between items-start">
              <span className={`${moduleColor(a.questions?.module)} text-xs font-bold px-3 py-1 rounded-full`}>{a.questions?.module}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {a.is_correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <p className="font-medium text-slate-900 mt-3">{a.questions?.question_text}</p>
            <p className="text-sm text-slate-500 mt-1">Your answer: {a.selected_answer || 'Skipped'} • Correct answer: {a.questions?.correct_answer}</p>
            {a.questions?.explanation && (
              <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm text-indigo-800">
                <span className="font-bold">Explanation: </span>{a.questions.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 shadow-md">
        ← Back to Dashboard
      </button>
    </div>
  )
}