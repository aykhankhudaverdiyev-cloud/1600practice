import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import QuestionBank from './pages/QuestionBank'
import TestBuilder from './pages/TestBuilder'
import Practice from './pages/Practice'
import Results from './pages/Results'
import SavedQuestions from './pages/SavedQuestions'
import StudyPlan from './pages/StudyPlan'
import ToastHost from './components/ToastHost'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <nav className="glass border-b border-slate-200 px-8 py-4 flex items-center gap-8 sticky top-0 z-20 shadow-sm">
          <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">1600 Practice</span>
          <div className="flex gap-2">
            <NavItem to="/" icon="🏠">Dashboard</NavItem>
            <NavItem to="/bank" icon="📚">Question Bank</NavItem>
            <NavItem to="/builder" icon="🛠️">Test Builder</NavItem>
            <NavItem to="/saved" icon="🔖">Saved</NavItem>
            <NavItem to="/plan" icon="🎯">Study Plan</NavItem>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bank" element={<QuestionBank />} />
          <Route path="/builder" element={<TestBuilder />} />
          <Route path="/practice/:testId" element={<Practice />} />
          <Route path="/results/:testId" element={<Results />} />
          <Route path="/saved" element={<SavedQuestions />} />
          <Route path="/plan" element={<StudyPlan />} />
        </Routes>
        <ToastHost />
      </div>
    </BrowserRouter>
  )
}

function NavItem({ to, children, icon }) {
  return (
    <NavLink to={to} end className={({ isActive }) =>
      `flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
    }>
      <span>{icon}</span>{children}
    </NavLink>
  )
}

export default App