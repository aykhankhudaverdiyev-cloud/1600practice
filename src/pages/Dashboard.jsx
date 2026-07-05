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

  let filtered = tests.filter(t => {
    if (tab === 'all') return true
    if (tab === 'in_progress') return t.status === 'in_progress'
    if (tab === 'completed') return t.status === 'completed'
    return true
  })

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
          {filtered.map(t => (
            <div key={t.id} className="relative bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <button onClick={() => deleteTest(t.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 z-10 text-sm">🗑️</button>

              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">📄</div>
              <h3 className="font-bold text-slate-900 text-lg">{t.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.question_ids?.length || 0} questions</p>

              <div className="mt-3 mb-4">
                {t.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm font-bold">🏆 Completed</span>
                ) : t.status === 'in_progress' ? (
                  <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-bold">🟢 In Progress</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-400 text-sm font-bold">Not Started</span>
                )}
              </div>

              {t.status === 'completed' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-400 font-semibold">Final Score</p>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1 text-blue-600 font-bold">● Math</span>
                      <span className="flex items-center gap-1 text-pink-600 font-bold">● English</span>
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

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/practice/${t.id}`)}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5"
                >
                  ▶ Start Test
                </button>
                {t.status === 'completed' && (
                  <button
                    onClick={() => navigate(`/results/${t.id}`)}
                    className="flex-1 bg-white border border-slate-300 text-slate-800 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    📊 Analytics
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label, count, icon }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
      active ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      <span>{icon}</span>{label}
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-slate-100' : 'bg-slate-100'}`}>{count}</span>
    </button>
  )
}