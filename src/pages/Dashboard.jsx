import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ questions: 0, tests: 0, saved: 0, attempts: 0, accuracy: 0 })
  const [tests, setTests] = useState([])
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { count: qCount } = await supabase.from('questions').select('*', { count: 'exact', head: true })
    const { data: testData } = await supabase.from('tests').select('*').order('created_at', { ascending: false })
    const { count: savedCount } = await supabase.from('attempts').select('*', { count: 'exact', head: true }).eq('marked_for_review', true)
    const { data: attemptData } = await supabase.from('attempts').select('is_correct')

    const total = attemptData?.length || 0
    const correct = attemptData?.filter(a => a.is_correct).length || 0
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    setStats({ questions: qCount || 0, tests: testData?.length || 0, saved: savedCount || 0, attempts: total, accuracy })
    setTests(testData || [])
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 mb-8">Your SAT prep overview, all in one place.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard label="Questions" value={stats.questions} />
        <StatCard label="Custom Tests" value={stats.tests} />
        <StatCard label="Saved Questions" value={stats.saved} />
        <StatCard label="Attempts" value={stats.attempts} />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} highlight />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Your Practice Tests</h2>
        <button onClick={() => navigate('/builder')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          + Build New Test
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          No tests yet. Head to Test Builder to create your first custom test.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tests.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900">{t.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{t.question_ids?.length || 0} questions</p>
              <button
                onClick={() => navigate(`/practice/${t.id}`)}
                className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}>
      <p className={`text-xs font-medium ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}