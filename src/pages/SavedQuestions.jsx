import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { moduleColor } from '../lib/colors'
import { showToast } from '../lib/toast'

export default function SavedQuestions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('attempts')
      .select('*, questions(*)')
      .eq('marked_for_review', true)
      .order('date', { ascending: false })
    setLoading(false)
    if (error) { showToast('Failed to load saved questions: ' + error.message, 'error'); return }
    setItems(data || [])
  }

  async function unsave(id) {
    const { error } = await supabase.from('attempts').update({ marked_for_review: false }).eq('id', id)
    if (error) { showToast('Failed to remove: ' + error.message, 'error'); return }
    showToast('Removed from saved')
    load()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Saved Questions</h1>
      <p className="text-slate-500 text-sm mb-6">Questions you marked for review during practice.</p>

      {loading ? (
        <div className="text-center text-slate-400 py-10">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
          No saved questions yet. Mark questions during practice to see them here.
        </div>
      ) : items.map(item => (
        <div key={item.id} className="border border-slate-200 rounded-2xl p-5 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow animate-fade">
          <div className="flex justify-between items-start">
            <span className={`${moduleColor(item.questions?.module)} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>{item.questions?.module}</span>
            <button onClick={() => unsave(item.id)} className="text-xs text-slate-400 hover:text-red-500 font-semibold">✕ Remove</button>
          </div>
          <p className="font-medium text-slate-900 mt-3">{item.questions?.question_text}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className={`font-semibold ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>
              Your answer: {item.selected_answer || 'Skipped'} {item.is_correct ? '✓' : '✗'}
            </span>
            <span className="text-slate-500">Correct: {item.questions?.correct_answer}</span>
          </div>
          {item.questions?.explanation && (
            <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm text-indigo-800">
              <span className="font-bold">Explanation: </span>{item.questions.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}