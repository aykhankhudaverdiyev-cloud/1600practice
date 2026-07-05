import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showToast } from '../lib/toast'

export default function Dashboard() {
  const [tests, setTests] = useState([])
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('newest')
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
    in_progress: tests.filter(t => t.status === 'in_progress').length,
    completed: tests.filter(t => t.status === 'completed').length,
  }

  let filtered = tests.filter(t => tab === 'all' ? true : t.status === tab)
  filtered = [...filtered].sort((a, b) =>
    sort === 'newest' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at)
  )

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Your Practice Papers</h1>
      <p className="text-slate-500 mb-6">Hone your skills with your custom tests. Consistency is key to success.</p>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm flex-wrap">
          <TabBtn active={tab === 'all'} onClick={() => setTab('all')} label="All Papers" count={counts.all} icon="▽" />
          <TabBtn active={tab === 'in_progress'} onClick={() => setTab('in_progress')} label="In Progress" count={counts.in_progress} icon="⟲" />
          <TabBtn active={tab === 'completed'} onClick={() => setTab('completed')} label="Completed" count={counts.completed} icon="🏆" />
        </div>
        <button onClick={() => navigate('/builder')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 shadow-md shadow-blue-100">
          + Build New Test
        </button>
      </div>

      <div className="mb-6">
        <select value={sort} onChange={e => setSort(e.target.value)} className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm">
          <option value="newest">Sort: Newest to Oldest</option>
          <option value="oldest">Sort: Oldest to Newest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
          No tests in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(t => {
            const isCompleted = t.status === 'completed'
            const isInProgress = t.status === 'in_progress'
            return (
              <div
                key={t.id}
                className={`relative rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all overflow-hidden border-2 ${
                  isCompleted ? 'bg-gradient-to-br from-green-50 to-white border-green-200' :
                  isInProgress ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200' :
                  'bg-white border-slate-200'
                }`}
              >
                <button onClick={() => deleteTest(t.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 z-10 text-sm">🗑️</button>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isCompleted ? 'bg-green-100' : isInProgress ? 'bg-amber-100' : 'bg-slate-100'
                }`}>📄</div>
                <h3 className="font-bold text-slate-900 text-lg">{t.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.question_ids?.length || 0} questions</p>

                <div className="mt-3 mb-4">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-green-700 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">🏆 Completed</span>
                  ) : isInProgress ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 text-sm font-bold bg-amber-100 px-3 py-1 rounded-full">🟡 In Progress</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 text-sm font-bold bg-slate-100 px-3 py-1 rounded-full">⚪ Not Started</span>
                  )}
                </div>

                {isCompleted && (
                  <div className="bg-white border border-green-100 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-slate-400 font-semibold">Final Score</p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-blue-600 font-bold">● Math</span>
                        <span className="text-pink-600 font-bold">● English</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-extrabold text-slate-900">{t.score} <span className="text-sm text-slate-400 font-semibold">/1600</span></p>
                      <div className="text-right text-sm font-bold">
                        <span className="text-blue-600">{t.math_score}</span><span className="text-slate-300">/800</span>
                        <span className="mx-1" />
                        <span className="text-pink-600">{t.rw_score}</span><span className="text-slate-300">/800</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.round((t.score / 1600) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {isInProgress && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 mb-4 text-sm text-amber-800 font-medium">
                    Up to date. Pick up where you left off.
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/practice/${t.id}`)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-white ${
                      isCompleted ? 'bg-slate-700 hover:bg-slate-600' : isInProgress ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    ▶ {isCompleted ? 'Retake Test' : isInProgress ? 'Continue Test' : 'Start Test'}
                  </button>
                  {isCompleted && (
                    <button
                      onClick={() => navigate(`/results/${t.id}`)}
                      className="flex-1 bg-white border border-slate-300 text-slate-800 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      📊 Analytics
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label, count, icon }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
      active ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      <span>{icon}</span>{label}
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
    </button>
  )
}