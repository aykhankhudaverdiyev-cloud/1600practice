import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showToast } from '../lib/toast'

export default function Dashboard() {
  const [tests, setTests] = useState([])
  const [tab, setTab] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { load() }, [])

  async function load() {
    const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false })
    if (error) { showToast('Failed to load tests: ' + error.message, 'error'); return }
    setTests(data || [])
  }

  async function deleteTest(id) {
    if (!confirm('Delete this test permanently?')) return
    await supabase.from('attempts').delete().eq('test_id', id)
    const { error } = await supabase.from('tests').delete().eq('id', id)
    if (error) { showToast('Delete failed: ' + error.message, 'error'); return }
    showToast('Test deleted')
    load()
  }

  const counts = {
    all: tests.length,
    not_started: tests.filter(t => t.status === 'not_started' || !t.status).length,
    in_progress: tests.filter(t => t.status === 'in_progress').length,
    completed: tests.filter(t => t.status === 'completed').length,
  }

  const filtered = tests.filter(t => {
    if (tab === 'all') return true
    if (tab === 'not_started') return t.status === 'not_started' || !t.status
    return t.status === tab
  })

  const avgScore = tests.filter(t => t.score).length > 0
    ? Math.round(tests.filter(t => t.score).reduce((sum, t) => sum + t.score, 0) / tests.filter(t => t.score).length)
    : null

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Your Practice Tests</h1>
      <p className="text-slate-500 mb-6">Consistency is key. Track every attempt, every score, every improvement.</p>

      {avgScore && (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 mb-6 text-white shadow-lg flex items-center gap-6 animate-fade">
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase">Average Score</p>
            <p className="text-3xl font-extrabold">{avgScore} <span className="text-base text-blue-200">/ 1600</span></p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase">Tests Completed</p>
            <p className="text-3xl font-extrabold">{counts.completed}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm flex-wrap">
          <TabBtn active={tab === 'all'} onClick={() => setTab('all')} label="All Papers" count={counts.all} />
          <TabBtn active={tab === 'not_started'} onClick={() => setTab('not_started')} label="Not Started" count={counts.not_started} />
          <TabBtn active={tab === 'in_progress'} onClick={() => setTab('in_progress')} label="In Progress" count={counts.in_progress} />
          <TabBtn active={tab === 'completed'} onClick={() => setTab('completed')} label="Completed" count={counts.completed} />
        </div>
        <button onClick={() => navigate('/builder')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 shadow-md shadow-blue-100">
          + Build New Test
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
          No tests in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} className="relative bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all animate-fade overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none" />
              <button onClick={() => deleteTest(t.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 z-10">🗑️</button>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mb-3">📄</div>
                <h3 className="font-bold text-slate-900">{t.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{t.question_ids?.length || 0} questions</p>

                <div className="mt-3">
                  {t.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">🏆 Completed</span>
                  ) : t.status === 'in_progress' ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold">🟡 In Progress</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold">⚪ Not Started</span>
                  )}
                </div>

                {t.status === 'completed' && (
                  <div className="bg-white/70 border border-slate-100 rounded-2xl p-3 mt-3">
                    <p className="text-xs text-slate-500">Final Score</p>
                    <p className="text-2xl font-extrabold text-slate-900">{t.score} <span className="text-xs text-slate-400">/ 1600</span></p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.round((t.score / 1600) * 100)}%` }} />
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span>Math: {t.math_score}</span>
                      <span>RW: {t.rw_score}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(t.status === 'completed' ? `/results/${t.id}` : `/practice/${t.id}`)}
                  className="mt-4 w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-md"
                >
                  {t.status === 'completed' ? 'View Results' : t.status === 'in_progress' ? 'Continue Test' : 'Start Test'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label, count }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
      active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      {label}
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
    </button>
  )
}