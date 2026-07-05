export default function CircularProgress({ value, max, size = 160, label, sub }) {
  const pct = Math.min(100, (value / max) * 100)
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <p className="font-bold text-slate-900 mb-3">{label}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth="12" fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#0f172a" strokeWidth="12" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">{value}</span>
          <span className="text-xs text-slate-400">/ {max}</span>
        </div>
      </div>
      {sub && <p className="text-sm text-slate-500 mt-3 text-center max-w-[180px]">{sub}</p>}
    </div>
  )
}