import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import TestBuilder from './pages/TestBuilder';
import Practice from './pages/Practice';
import Results from './pages/Results';
import SavedQuestions from './pages/SavedQuestions';
import StudyPlan from './pages/StudyPlan';
import ToastHost from './components/ToastHost';
import Scene3D from './components/Scene3D';

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/bank', icon: '📚', label: 'Questions' },
  { to: '/builder', icon: '🛠️', label: 'Builder' },
  { to: '/saved', icon: '🔖', label: 'Saved' },
  { to: '/plan', icon: '🎯', label: 'Plan' },
];

function NavItemLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-white/40 hover:bg-white/5 hover:text-white/70'
        }`
      }
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bank" element={<QuestionBank />} />
          <Route path="/builder" element={<TestBuilder />} />
          <Route path="/practice/:testId" element={<Practice />} />
          <Route path="/results/:testId" element={<Results />} />
          <Route path="/saved" element={<SavedQuestions />} />
          <Route path="/plan" element={<StudyPlan />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isPractice = location.pathname.startsWith('/practice/');

  return (
    <div className="min-h-screen relative">
      {/* Persistent Background 3D Scene (subtle, behind everything) */}
      {!isPractice && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <Scene3D variant="background" />
        </div>
      )}

      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none grid-bg opacity-50" />

      {/* Navigation */}
      {!isPractice && (
        <nav className="glass-nav px-4 sm:px-8 py-3 flex items-center gap-4 sm:gap-6 sticky top-0 z-20">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <span className="text-white font-black text-xs">16</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline">
              <span className="gradient-text">1600</span>
              <span className="text-white/60 ml-1">Practice</span>
            </span>
          </NavLink>

          <div className="flex gap-1 ml-auto sm:ml-4">
            {navItems.map(item => (
              <NavItemLink key={item.to} {...item} />
            ))}
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="relative z-10">
        <AnimatedRoutes />
      </main>

      <ToastHost />

      {/* Footer */}
      {!isPractice && (
        <footer className="relative z-10 py-8 text-center border-t border-white/5">
          <p className="text-xs text-white/15 font-medium">
            1600 Practice — SAT Prep Platform • Built with 3D Web Technologies
          </p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
