import { useState, useEffect, useRef } from 'react'

export default function HighlightToolbar({ containerRef }) {
  const [toolbar, setToolbar] = useState(null)
  const savedRange = useRef(null)

  useEffect(() => {
    function handleSelection() {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || sel.toString().trim() === '') {
        setToolbar(null)
        return
      }
      const range = sel.getRangeAt(0)
      if (!containerRef.current || !containerRef.current.contains(range.commonAncestorContainer)) {
        setToolbar(null)
        return
      }
      const rect = range.getBoundingClientRect()
      savedRange.current = range.cloneRange()
      setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 50 })
    }

    document.addEventListener('selectionchange', handleSelection)
    return () => document.removeEventListener('selectionchange', handleSelection)
  }, [containerRef])

  function applyHighlight(color) {
    if (!savedRange.current) return
    const span = document.createElement('span')
    span.style.backgroundColor = color
    span.style.borderRadius = '2px'
    span.className = 'highlight-mark'
    try { savedRange.current.surroundContents(span) } catch (e) {}
    window.getSelection().removeAllRanges()
    setToolbar(null)
  }

  function removeHighlight() {
    if (!savedRange.current) return
    let node = savedRange.current.commonAncestorContainer
    while (node && node.nodeType !== 1) node = node.parentNode
    const markEl = node?.closest ? node.closest('.highlight-mark') : null
    if (markEl) {
      const parent = markEl.parentNode
      while (markEl.firstChild) parent.insertBefore(markEl.firstChild, markEl)
      parent.removeChild(markEl)
    }
    window.getSelection().removeAllRanges()
    setToolbar(null)
  }

  if (!toolbar) return null

  return (
    <div
      style={{ left: toolbar.x, top: toolbar.y, transform: 'translateX(-50%)' }}
      className="fixed z-50 bg-slate-900 rounded-full shadow-2xl flex items-center gap-1.5 px-2 py-1.5 animate-fade"
    >
      <button onClick={() => applyHighlight('#fde68a')} className="w-6 h-6 rounded-full bg-yellow-300 hover:scale-110 transition-transform border-2 border-slate-900" />
      <button onClick={() => applyHighlight('#bfdbfe')} className="w-6 h-6 rounded-full bg-blue-300 hover:scale-110 transition-transform border-2 border-slate-900" />
      <button onClick={() => applyHighlight('#f9a8d4')} className="w-6 h-6 rounded-full bg-pink-300 hover:scale-110 transition-transform border-2 border-slate-900" />
      <span className="w-px h-5 bg-white/20 mx-0.5" />
      <button onClick={removeHighlight} title="Remove highlight" className="text-white hover:text-red-400 text-sm px-1">🗑️</button>
    </div>
  )
}