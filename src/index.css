@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@import "tailwindcss";

:root {
  --primary: #4f46e5;
  --primary-light: #818cf8;
  --bg-dark: #0a0a1a;
  --bg-card: rgba(15, 15, 35, 0.7);
  --glass: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glow-blue: 0 0 30px rgba(79, 70, 229, 0.3);
  --glow-purple: 0 0 30px rgba(168, 85, 247, 0.3);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg-dark);
  color: #e2e8f0;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: rgba(99, 102, 241, 0.4);
  color: white;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 15, 35, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

.glass-card {
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.1), inset 0 0 40px rgba(99, 102, 241, 0.03);
  transform: translateY(-2px);
}

.glass-nav {
  background: rgba(10, 10, 26, 0.8);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-blue {
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-green {
  background: linear-gradient(135deg, #34d399, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glow-button {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 9999px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.glow-button::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(15px);
}

.glow-button:hover::before {
  opacity: 1;
}

.glow-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
}

.card-3d {
  perspective: 1000px;
}

.card-3d-inner {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-3d:hover .card-3d-inner {
  transform: rotateY(5deg) rotateX(3deg);
}

.floating {
  animation: floating 6s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.floating-slow {
  animation: floating 8s ease-in-out infinite;
}

.pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-400 { animation-delay: 0.4s; }
.animate-delay-500 { animation-delay: 0.5s; }

.stagger > * {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.1s; }
.stagger > *:nth-child(3) { animation-delay: 0.15s; }
.stagger > *:nth-child(4) { animation-delay: 0.2s; }
.stagger > *:nth-child(5) { animation-delay: 0.25s; }
.stagger > *:nth-child(6) { animation-delay: 0.3s; }

.grid-bg {
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.radial-fade {
  background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
}

.text-glow {
  text-shadow: 0 0 20px rgba(129, 140, 248, 0.5);
}

.shine {
  position: relative;
  overflow: hidden;
}

.shine::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    transparent 40%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 60%
  );
  animation: shine 8s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% { transform: translateX(-100%) rotate(25deg); }
  50% { transform: translateX(100%) rotate(25deg); }
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="search"],
select,
textarea {
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: #e2e8f0;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
}

.tooltip-3d {
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(0deg);
  transition: transform 0.3s ease;
}

.tooltip-3d:hover {
  transform: perspective(800px) rotateX(-5deg) translateZ(10px);
}

.progress-ring {
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
}

canvas {
  display: block;
}

/* ─── BorderGlow Component ─────────────────────────────────────────────────── */

.border-glow-card {
  --edge-proximity: 0;
  --cursor-angle: 45deg;
  --edge-sensitivity: 30;
  --color-sensitivity: calc(var(--edge-sensitivity) + 20);
  --border-radius: 20px;
  --glow-padding: 40px;
  --cone-spread: 25;

  position: relative;
  border-radius: var(--border-radius);
  isolation: isolate;
  transform: translate3d(0, 0, 0.01px);
  display: grid;
  border: 1px solid rgb(255 255 255 / 10%);
  background: var(--card-bg, rgba(15, 15, 35, 0.8));
  overflow: visible;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 2px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px,
    rgba(0, 0, 0, 0.1) 0px 8px 16px;
}

.border-glow-card::before,
.border-glow-card::after,
.border-glow-card > .edge-light {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.25s ease-out;
  z-index: -1;
}

.border-glow-card:not(:hover):not(.sweep-active)::before,
.border-glow-card:not(:hover):not(.sweep-active)::after,
.border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
}

.border-glow-card::before {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--card-bg, rgba(15, 15, 35, 0.8)) 0 100%) padding-box,
    linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
    var(--gradient-one, radial-gradient(at 80% 55%, #818cf8 0px, transparent 50%)) border-box,
    var(--gradient-two, radial-gradient(at 69% 34%, #a78bfa 0px, transparent 50%)) border-box,
    var(--gradient-three, radial-gradient(at 8% 6%, #c084fc 0px, transparent 50%)) border-box,
    var(--gradient-four, radial-gradient(at 41% 38%, #818cf8 0px, transparent 50%)) border-box,
    var(--gradient-five, radial-gradient(at 86% 85%, #a78bfa 0px, transparent 50%)) border-box,
    var(--gradient-six, radial-gradient(at 82% 18%, #c084fc 0px, transparent 50%)) border-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, #a78bfa 0px, transparent 50%)) border-box,
    var(--gradient-base, linear-gradient(#818cf8 0 100%)) border-box;

  opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center,
      black calc(var(--cone-spread) * 1%),
      transparent calc((var(--cone-spread) + 15) * 1%),
      transparent calc((100 - var(--cone-spread) - 15) * 1%),
      black calc((100 - var(--cone-spread)) * 1%)
    );
}

.border-glow-card::after {
  border: 1px solid transparent;
  background:
    var(--gradient-one, radial-gradient(at 80% 55%, #818cf8 0px, transparent 50%)) padding-box,
    var(--gradient-two, radial-gradient(at 69% 34%, #a78bfa 0px, transparent 50%)) padding-box,
    var(--gradient-three, radial-gradient(at 8% 6%, #c084fc 0px, transparent 50%)) padding-box,
    var(--gradient-four, radial-gradient(at 41% 38%, #818cf8 0px, transparent 50%)) padding-box,
    var(--gradient-five, radial-gradient(at 86% 85%, #a78bfa 0px, transparent 50%)) padding-box,
    var(--gradient-six, radial-gradient(at 82% 18%, #c084fc 0px, transparent 50%)) padding-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, #a78bfa 0px, transparent 50%)) padding-box,
    var(--gradient-base, linear-gradient(#818cf8 0 100%)) padding-box;

  mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

  mask-composite: subtract, add, add, add, add, add;
  opacity: calc(var(--fill-opacity, 0.5) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
  mix-blend-mode: soft-light;
}

.border-glow-card > .edge-light {
  inset: calc(var(--glow-padding) * -1);
  pointer-events: none;
  z-index: 1;

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );

  opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
  mix-blend-mode: plus-lighter;
}

.border-glow-card > .edge-light::before {
  content: "";
  position: absolute;
  inset: var(--glow-padding);
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--glow-color, hsl(250deg 80% 70% / 100%)),
    inset 0 0 1px 0 var(--glow-color-60, hsl(250deg 80% 70% / 60%)),
    inset 0 0 3px 0 var(--glow-color-50, hsl(250deg 80% 70% / 50%)),
    inset 0 0 6px 0 var(--glow-color-40, hsl(250deg 80% 70% / 40%)),
    inset 0 0 15px 0 var(--glow-color-30, hsl(250deg 80% 70% / 30%)),
    inset 0 0 25px 2px var(--glow-color-20, hsl(250deg 80% 70% / 20%)),
    inset 0 0 50px 2px var(--glow-color-10, hsl(250deg 80% 70% / 10%)),
    0 0 1px 0 var(--glow-color-60, hsl(250deg 80% 70% / 60%)),
    0 0 3px 0 var(--glow-color-50, hsl(250deg 80% 70% / 50%)),
    0 0 6px 0 var(--glow-color-40, hsl(250deg 80% 70% / 40%)),
    0 0 15px 0 var(--glow-color-30, hsl(250deg 80% 70% / 30%)),
    0 0 25px 2px var(--glow-color-20, hsl(250deg 80% 70% / 20%)),
    0 0 50px 2px var(--glow-color-10, hsl(250deg 80% 70% / 10%));
}

.border-glow-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: auto;
  z-index: 1;
}

/* ─── MagicRings Container ──────────────────────────────────────────────────── */

.magic-rings-container {
  width: 100%;
  height: 100%;
}
