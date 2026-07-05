let listeners = []

export function showToast(message, type = 'success') {
  listeners.forEach(fn => fn({ message, type, id: Date.now() }))
}

export function subscribeToast(fn) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}