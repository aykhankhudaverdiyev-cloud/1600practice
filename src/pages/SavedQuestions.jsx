import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SavedQuestions() {
  const [items, setItems] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('attempts')
      .select('*, questions(*)')
      .eq('marked_for_review', true)
      .order('date', { ascending: false })
    setItems(data || [])
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Saved Questions</h1>
      <p className="text-slate-500 text-sm mb-6">Questions you marked for review during practice.</p>

      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          No saved questions yet. Mark questions during practice to see them here.
        </div>
      ) : items.map(item => (
        <div key={item.id} className="border border-slate-200 rounded-xl p-4 mb-3 bg-white shadow-sm">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">{item.questions?.module}</span>
          <p className="font-medium text-slate-900 mt-2">{item.questions?.question_text}</p>
          <p className="text-sm text-slate-500 mt-1">Your answer: {item.selected_answer || 'Skipped'} • Correct: {item.questions?.correct_answer}</p>
        </div>
      ))}
    </div>
  )
}