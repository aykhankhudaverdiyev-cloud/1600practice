import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MODULES = ['RW Module 1', 'RW Module 2', 'Math Module 1', 'Math Module 2']

export default function TestBuilder() {
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState([])
  const [moduleFilter, setModuleFilter] = useState('All')
  const [testName, setTestName] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchQuestions() }, [])

  async function fetchQuestions() {
    const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    setQuestions(data || [])
  }

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function autoGenerate(count) {
    const pool = filtered.map(q => q.id)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setSelected(shuffled.slice(0, count))
  }

  async function createTest() {
    if (!testName.trim()) { alert('Please name your test.'); return }
    if (selected.length === 0) { alert('Select at least one question.'); return }
    const { data, error } = await supabase.from('tests').insert([{ name: testName, question_ids: selected, is_custom: true }]).select()
    if (!error && data) navigate(`/practice/${data[0].id}`)
  }

  const filtered = questions.filter(q => moduleFilter === 'All' || q.module === moduleFilter)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Test Builder</h1>
      <p className="text-slate-500 text-sm mb-6">Select questions manually or auto-generate a custom test.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <input
          placeholder="Test name (e.g. Reading Drill #1)"
          value={testName}
          onChange={e => setTestName(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mb-4 text-sm"
        />
        <div className="flex gap-3 items-center flex-wrap">
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option>All</option>
            {MODULES.map(m => <option key={m}>{m}</option>)}
          </select>
          <button onClick={() => autoGenerate(10)} className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Auto-pick 10</button>
          <button onClick={() => autoGenerate(27)} className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Auto-pick 27 (RW module)</button>
          <button onClick={() => setSelected([])} className="text-sm text-red-600 font-medium hover:underline ml-auto">Clear selection</button>
        </div>
        <p className="text-sm text-slate-500 mt-3">{selected.length} questions selected</p>
      </div>

      <div className="mb-6 max-h-96 overflow-y-auto border border-slate-200 rounded-xl bg-white">
        {filtered.map((q, i) => (
          <label key={q.id} className={`flex items-start gap-3 p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selected.includes(q.id) ? 'bg-blue-50' : ''}`}>
            <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} className="mt-1" />
            <div>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">{q.module}</span>
              <span className="text-sm text-slate-900">{i + 1}. {q.question_text}</span>
            </div>
          </label>
        ))}
        {filtered.length === 0 && <p className="p-6 text-center text-slate-500 text-sm">No questions available. Add some in Question Bank first.</p>}
      </div>

      <button onClick={createTest} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
        Create Test & Start Practicing
      </button>
    </div>
  )
}