import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import QuestionBank from './pages/QuestionBank'
import TestBuilder from './pages/TestBuilder'
import Practice from './pages/Practice'
import SavedQuestions from './pages/SavedQuestions'
import StudyPlan from './pages/StudyPlan'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-8 sticky top-0 z-20 shadow-sm">
          <span className="font-bold text-lg text-slate-900 tracking-tight">1600 Practice</span>
          <div className="flex gap-6">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/bank">Question Bank</NavItem>
            <NavItem to="/builder">Test Builder</NavItem>
            <NavItem to="/saved">Saved Questions</NavItem>
            <NavItem to="/plan">Study Plan</NavItem>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bank" element={<QuestionBank />} />
          <Route path="/builder" element={<TestBuilder />} />
          <Route path="/practice/:testId" element={<Practice />} />
          <Route path="/saved" element={<SavedQuestions />} />
          <Route path="/plan" element={<StudyPlan />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `text-sm font-semibold pb-1 border-b-2 transition-colors ${
          isActive ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default App