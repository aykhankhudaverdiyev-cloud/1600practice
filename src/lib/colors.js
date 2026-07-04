export function moduleColor(mod) {
  if (mod?.includes('RW Module 1')) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
  if (mod?.includes('RW Module 2')) return 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
  if (mod?.includes('Math Module 1')) return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
  if (mod?.includes('Math Module 2')) return 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
  return 'bg-slate-500 text-white'
}