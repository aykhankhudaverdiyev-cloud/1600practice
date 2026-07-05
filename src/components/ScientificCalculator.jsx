import { useState, useRef } from 'react'

export default function ScientificCalculator({ onClose }) {
  const [display, setDisplay] = useState('')
  const [pos, setPos] = useState({ x: 400, y: 120 })
  const [size, setSize] = useState({ w: 320, h: 420 })

  function startDrag(e) {
    const startX = e.clientX, startY = e.clientY
    const origin = { ...pos }
    function move(ev) {
      setPos({ x: origin.x + (ev.clientX - startX), y: origin.y + (ev.clientY - startY) })
    }
    function up() { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  function startResize(e) {
    e.stopPropagation()
    const startX = e.clientX, startY = e.clientY
    const origin = { ...size }
    function move(ev) {
      setSize({ w: Math.max(260, origin.w + (ev.clientX - startX)), h: Math.max(320, origin.h + (ev.clientY - startY)) })
    }
    function up() { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  function press(val) {
    if (val === 'C') { setDisplay(''); return }
    if (val === '⌫') { setDisplay(d => d.slice(0, -1)); return }
    if (val === '=') {
      try { setDisplay(String(eval(display.replace(/π/g, 'Math.PI').replace(/√/g, 'Math.sqrt')))) } catch { setDisplay('Error') }
      return
    }
    setDisplay(d => d + val)
  }

  const keys = ['7','8','9','/','sin(','4','5','6','*','cos(','1','2','3','-','tan(','0','.','π','+','√(','(',')','C','⌫','=']

  return (
    <div
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
      className="fixed z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      <div onMouseDown={startDrag} className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-2 flex items-center justify-between cursor-move select-none">
        <span className="text-sm font-bold">Scientific Calculator</span>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">✕</button>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <input value={display} readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 mb-2 text-right font-mono text-lg bg-slate-50" />
        <div className="grid grid-cols-5 gap-1.5 flex-1">
          {keys.map(k => (
            <button
              key={k}
              onClick={() => press(k)}
              className={`rounded-lg text-sm font-semibold transition-colors ${
                k === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                ['C','⌫'].includes(k) ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div onMouseDown={startResize} className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize text-slate-400">◢</div>
    </div>
  )
}