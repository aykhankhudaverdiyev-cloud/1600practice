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
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 mb-8">Your SAT prep overview, all in one place.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard label="Questions" value={stats.questions} icon="📘" gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard label="Custom Tests" value={stats.tests} icon="🧪" gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard label="Saved" value={stats.saved} icon="🔖" gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard label="Attempts" value={stats.attempts} icon="✍️" gradient="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon="🎯" gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Your Practice Tests</h2>
        <button onClick={() => navigate('/builder')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 shadow-md shadow-blue-100">
          + Build New Test
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
          No tests yet. Head to Test Builder to create your first custom test.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tests.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all animate-fade">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mb-3">
                📄
              </div>
              <h3 className="font-bold text-slate-900">{t.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{t.question_ids?.length || 0} questions</p>
              <button
                onClick={() => navigate(`/practice/${t.id}`)}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-md shadow-blue-100"
              >
                Start Test →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, gradient, icon }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow ${gradient} animate-fade`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-white mt-2">{value}</p>
    </div>
  )
}