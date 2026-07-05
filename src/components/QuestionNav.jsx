export default function QuestionNav({ questions, current, answers, marked, onJump, onClose, onReview }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-t-3xl shadow-2xl p-6 w-full max-w-2xl mb-16 animate-fade">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Section Questions</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 text-xl">✕</button>
        </div>
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-slate-900 rounded-full inline-block" />Current</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-dashed border-slate-400 rounded inline-block" />Unanswered</span>
          <span className="flex items-center gap-1">🔖 For Review</span>
        </div>
        <div className="grid grid-cols-8 gap-2 mb-5">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => { onJump(i); onClose() }}
              className={`relative h-11 rounded-lg font-bold text-sm border-2 transition-colors ${
                i === current ? 'border-slate-900 bg-slate-900 text-white' :
                answers[i] ? 'border-slate-300 bg-slate-50 text-slate-700' :
                'border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {i + 1}
              {marked[i] && <span className="absolute -top-1.5 -right-1.5 text-[10px]">🔖</span>}
            </button>
          ))}
        </div>
        <button onClick={onReview} className="w-full border-2 border-blue-600 text-blue-600 rounded-full py-2.5 font-bold text-sm hover:bg-blue-50">
          Go to Review Page
        </button>
      </div>
    </div>
  )
}