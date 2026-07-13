import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card3D from '../components/Card3D';
import { useQuestions, useTests, showToast } from '../store';

export default function TestBuilder() {
  const navigate = useNavigate();
  const allQuestions = useQuestions();
  const { createTest, getUsedQuestionIds } = useTests();
  const usedIds = getUsedQuestionIds();
  // Filter out questions already used in other tests
  const questions = allQuestions.filter(q => !usedIds.has(q.id));
  const [name, setName] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const modules = ['All', ...new Set(questions.map(q => q.module))];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  const filtered = questions.filter(q => {
    if (selectedModule !== 'All' && q.module !== selectedModule) return false;
    if (selectedDiff !== 'All' && q.difficulty !== selectedDiff) return false;
    return true;
  });

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    const allFiltered = new Set(filtered.map(q => q.id));
    if (filtered.every(q => selectedIds.has(q.id))) {
      const next = new Set(selectedIds);
      allFiltered.forEach(id => next.delete(id));
      setSelectedIds(next);
    } else {
      setSelectedIds(new Set([...selectedIds, ...allFiltered]));
    }
  };

  const handleCreate = () => {
    if (!name.trim()) { showToast('Please enter a test name', 'error'); return; }
    if (selectedIds.size === 0) { showToast('Select at least one question', 'error'); return; }
    const test = createTest(name.trim(), [...selectedIds]);
    showToast(`Test "${name}" created with ${selectedIds.size} questions!`);
    navigate(`/practice/${test.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">
          <span className="gradient-text">Test</span> Builder
        </h1>
        <p className="text-white/40 text-sm mb-8">Create a custom practice test from the question bank.</p>
      </motion.div>

      {/* Test Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card3D className="p-6 mb-6">
          <label className="text-sm font-bold text-white/60 block mb-2">Test Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Practice Test #1"
            className="w-full"
          />
        </Card3D>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="glass-card px-1.5 py-1.5 flex gap-1 flex-wrap">
          {modules.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedModule === m
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="glass-card px-1.5 py-1.5 flex gap-1">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDiff(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedDiff === d
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Select All */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/30 font-medium">{filtered.length} questions available • {selectedIds.size} selected</p>
        <button onClick={selectAll} className="text-xs text-indigo-400 font-bold hover:text-indigo-300">
          {filtered.every(q => selectedIds.has(q.id)) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-8">
        {filtered.map((q, i) => {
          const selected = selectedIds.has(q.id);
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <div
                onClick={() => toggle(q.id)}
                className={`glass-card p-4 cursor-pointer flex items-start gap-4 transition-all ${
                  selected ? 'border-indigo-500/40 bg-indigo-500/5' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  selected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/20'
                }`}>
                  {selected && <span className="text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {q.module}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      q.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' :
                      q.difficulty === 'medium' ? 'text-amber-400 bg-amber-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.is_free_response ? 'text-cyan-300 bg-cyan-500/10' : 'text-white/20 bg-white/5'}`}>
                      {q.is_free_response ? 'Free Response' : 'Multiple Choice'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 truncate">{q.question_text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-6 flex justify-center"
      >
        <button
          onClick={handleCreate}
          disabled={selectedIds.size === 0 || !name.trim()}
          className="glow-button px-10 py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create Test with {selectedIds.size} Question{selectedIds.size !== 1 ? 's' : ''} →
        </button>
      </motion.div>
    </div>
  );
}
