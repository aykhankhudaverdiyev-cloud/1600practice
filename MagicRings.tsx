interface CircularProgress3DProps {
  value: number;
  max: number;
  size?: number;
  label: string;
  color?: string;
}

export default function CircularProgress3D({ value, max, size = 160, label, color = '#818cf8' }: CircularProgress3DProps) {
  const pct = Math.min(100, (value / max) * 100);
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <p className="font-bold text-white/80 mb-3 text-sm tracking-wide uppercase">{label}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 progress-ring">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white" style={{ textShadow: `0 0 20px ${color}60` }}>
            {value}
          </span>
          <span className="text-xs text-white/30">/ {max}</span>
        </div>
      </div>
    </div>
  );
}
