import { useState, useEffect } from 'react'
import { subscribeToast } from '../lib/toast'

export default function ToastHost() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    return subscribeToast(t => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500)
    })
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white animate-fade ${
            t.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-green-600'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}