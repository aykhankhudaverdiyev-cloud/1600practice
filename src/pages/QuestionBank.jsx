import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'

const MODULES = ['RW Module 1', 'RW Module 2', 'Math Module 1', 'Math Module 2']

export default function QuestionBank() {
  const [questions, setQuestions] = useState([])
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())

  function emptyForm() {
    return {
      module: MODULES[0], passage_text: '', question_text: '',
      choice_a: '', choice_b: '', choice_c: '', choice_d: '',
      correct_answer: 'A', difficulty: 'medium', explanation: ''
    }
  }

  useEffect(() => { fetchQuestions() }, [])

  async function fetchQuestions() {
    const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    if (!error) setQuestions(data)
  }

  async function saveQuestion() {
    if (!form.question_text || !form.choice_a || !form.choice_b) {
      alert('Please fill in at least the question text and choices A/B.')
      return
    }
    if (editingId) {
      await supabase.from('questions').update(form).eq('id', editingId)
    } else {
      await supabase.from('questions').insert([form])
    }
    setForm(emptyForm())
    setShowForm(false)
    setEditingId(null)
    fetchQuestions()
  }

  async function deleteQuestion(id) {
    if (confirm('Delete this question permanently?')) {
      await supabase.from('questions').delete().eq('id', id)
      fetchQuestions()
    }
  }

  function startEdit(q) {
    setForm(q)
    setEditingId(q.id)
    setShowForm(true)
  }

  const filtered = questions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase())
    const matchesModule = moduleFilter === 'All' || q.module === moduleFilter
    return matchesSearch && matchesModule
  })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 text-sm mt-1">{questions.length} questions</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm()); setEditingId(null); setShowForm(true) }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 shadow-md shadow-blue-100"
        >
          + Add Question
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white"
        >
          <option>All</option>
          {MODULES.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="border border-slate-200 rounded-2xl p-6 mb-6 bg-white shadow-lg animate-fade">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Question' : 'New Question'}</h3>
          <select value={form.module} onChange={e => setForm({ ...form, module: e.target.value })} className={inputCls}>
            {MODULES.map(m => <option key={m}>{m}</option>)}
          </select>
          <textarea placeholder="Passage (optional)" value={form.passage_text} onChange={e => setForm({ ...form, passage_text: e.target.value })} className={`${inputCls} min-h-24`} />
          <textarea placeholder="Question text" value={form.question_text} onChange={e => setForm({ ...form, question_text: e.target.value })} className={`${inputCls} min-h-16`} />
          <input placeholder="Choice A" value={form.choice_a} onChange={e => setForm({ ...form, choice_a: e.target.value })} className={inputCls} />
          <input placeholder="Choice B" value={form.choice_b} onChange={e => setForm({ ...form, choice_b: e.target.value })} className={inputCls} />
          <input placeholder="Choice C" value={form.choice_c} onChange={e => setForm({ ...form, choice_c: e.target.value })} className={inputCls} />
          <input placeholder="Choice D" value={form.choice_d} onChange={e => setForm({ ...form, choice_d: e.target.value })} className={inputCls} />
          <select value={form.correct_answer} onChange={e => setForm({ ...form, correct_answer: e.target.value })} className={inputCls}>
            <option value="A">Correct: A</option><option value="B">Correct: B</option>
            <option value="C">Correct: C</option><option value="D">Correct: D</option>
          </select>
          <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className={inputCls}>
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
          <textarea placeholder="Explanation (optional)" value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} className={`${inputCls} min-h-16`} />
          <div className="flex gap-3 mt-2">
            <button onClick={saveQuestion} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 shadow-md">Save Question</button>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="bg-slate-200 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
          No questions match. Add your first question above.
        </div>
      ) : filtered.map((q, i) => (
        <div key={q.id} className="border border-slate-200 rounded-2xl p-4 mb-3 bg-white flex justify-between items-start shadow-sm hover:shadow-md transition-shadow animate-fade">
          <div className="flex-1">
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className={`${moduleColor(q.module)} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>{q.module}</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Correct: {q.correct_answer}</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full capitalize">{q.difficulty}</span>
            </div>
            <p className="font-medium text-slate-900">{i + 1}. {q.question_text}</p>
            <p className="text-slate-500 text-sm mt-1">A: {q.choice_a} &nbsp; B: {q.choice_b} &nbsp; C: {q.choice_c} &nbsp; D: {q.choice_d}</p>
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <button onClick={() => startEdit(q)} className="border border-slate-300 rounded-xl px-3 py-1.5 hover:bg-slate-50 text-sm">✏️</button>
            <button onClick={() => deleteQuestion(q.id)} className="border border-slate-300 rounded-xl px-3 py-1.5 hover:bg-slate-50 text-sm">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  )
}

const inputCls = "w-full border border-slate-300 rounded-xl px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"