import { useState, useCallback, useSyncExternalStore } from 'react';

export interface Question {
  id: string;
  module: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  passage_text?: string;
  options: { key: string; text: string }[];
  correct_answer: string;
  correct_value?: string;
  is_free_response?: boolean;
  explanation: string;
  skill: string;
  is_custom?: boolean;
  created_at?: string;
}

export interface Test {
  id: string;
  name: string;
  question_ids: string[];
  score?: number;
  rw_score?: number;
  math_score?: number;
  completed: boolean;
  created_at: string;
  time_taken?: number;
}

export interface Attempt {
  id: string;
  test_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  marked_for_review: boolean;
  date: string;
}

const BUILT_IN_QUESTIONS: Question[] = [
  // ─── Reading & Writing ─────────────────────────────────────────────────────
  {
    id: 'rw1', module: 'RW Module 1', difficulty: 'medium',
    question_text: 'Which choice best completes the text with the most logical and precise word or phrase?',
    passage_text: 'The discovery of high-temperature superconductors in 1986 was a major breakthrough in physics. Prior to this discovery, scientists believed that superconductivity could only occur at temperatures near absolute zero. The new materials, however, exhibited superconductivity at temperatures that were _______ higher than previously thought possible.',
    options: [{ key: 'A', text: 'marginally' }, { key: 'B', text: 'substantially' }, { key: 'C', text: 'superficially' }, { key: 'D', text: 'temporarily' }],
    correct_answer: 'B', explanation: '"Substantially" means to a great degree, fitting the context of a major breakthrough.', skill: 'Words in Context',
  },
  {
    id: 'rw2', module: 'RW Module 1', difficulty: 'easy',
    question_text: 'What is the main purpose of the passage?',
    passage_text: "The monarch butterfly's annual migration spans thousands of miles, from Canada to central Mexico. Unlike birds, individual butterflies make this journey only once. The butterflies that return north in spring are actually the grandchildren or great-grandchildren of those that traveled south. Scientists remain puzzled by how these insects navigate to a destination they have never visited.",
    options: [{ key: 'A', text: 'To explain the economic impact of butterfly conservation' }, { key: 'B', text: 'To describe an extraordinary natural phenomenon' }, { key: 'C', text: 'To argue for increased funding for entomology research' }, { key: 'D', text: 'To compare butterfly and bird migration patterns' }],
    correct_answer: 'B', explanation: 'The passage describes the remarkable migration of monarch butterflies.', skill: 'Central Ideas',
  },
  {
    id: 'rw3', module: 'RW Module 1', difficulty: 'hard',
    question_text: 'Which choice most effectively uses relevant information from the passage to accomplish the stated goal?',
    passage_text: "Archaeologist Sarah Chen has spent two decades studying ancient Mesopotamian trade networks. Her research reveals that sophisticated commerce existed far earlier than previously documented. Using chemical analysis of pottery fragments, Chen has traced trade routes spanning over 1,000 miles, connecting settlements that were once thought to be isolated communities.",
    options: [{ key: 'A', text: "Chen's work proves that ancient peoples were more intelligent than modern humans." }, { key: 'B', text: 'Chen has challenged traditional views by providing evidence of extensive early trade networks.' }, { key: 'C', text: 'Chen believes that pottery is the most important archaeological artifact.' }, { key: 'D', text: "Chen's research is funded by a major university." }],
    correct_answer: 'B', explanation: "Option B accurately summarizes Chen's contribution.", skill: 'Command of Evidence',
  },
  {
    id: 'rw4', module: 'RW Module 2', difficulty: 'medium',
    question_text: 'Which choice most logically completes the text?',
    passage_text: "Researchers studying coral reefs have found that some coral species can adapt to warmer water temperatures over time. However, this adaptation occurs over generations and requires relatively gradual temperature changes. The rapid pace of current ocean warming therefore _______",
    options: [{ key: 'A', text: 'suggests that all coral species will thrive in warmer waters.' }, { key: 'B', text: 'indicates that coral reefs face no significant threats.' }, { key: 'C', text: "poses a challenge that exceeds most corals' adaptive capacity." }, { key: 'D', text: 'proves that coral adaptation is impossible.' }],
    correct_answer: 'C', explanation: 'The passage establishes that adaptation requires gradual change, and current warming is rapid.', skill: 'Inferences',
  },
  {
    id: 'rw5', module: 'RW Module 2', difficulty: 'easy',
    question_text: 'Which choice best states the function of the underlined sentence in the overall structure of the text?',
    passage_text: 'Jazz music evolved in the early 20th century from a blend of African American musical traditions. Musicians in New Orleans combined elements of blues, ragtime, and brass band music. __This fusion created a uniquely American art form that would influence virtually every genre of popular music that followed.__ Today, jazz continues to evolve, incorporating elements from hip-hop, electronic music, and world music traditions.\n\n_Note: The underlined sentence is referenced in the question below._',
    options: [{ key: 'A', text: 'It introduces a counterargument to the main claim.' }, { key: 'B', text: 'It provides a transition from the historical origins to the broader cultural impact.' }, { key: 'C', text: 'It offers a specific example to support a general claim.' }, { key: 'D', text: 'It presents a conclusion that contradicts earlier statements.' }],
    correct_answer: 'B', explanation: 'The underlined sentence bridges the historical origins and the modern evolution.', skill: 'Text Structure',
  },
  {
    id: 'rw6', module: 'RW Module 1', difficulty: 'medium',
    question_text: 'Which choice provides the best evidence for the claim that deep-sea organisms have unique adaptations?',
    passage_text: "The deep ocean remains one of Earth's least explored frontiers. Below 1,000 meters, sunlight cannot penetrate, and organisms must survive in perpetual darkness. Many deep-sea creatures have evolved bioluminescence — the ability to produce their own light through chemical reactions. Some species use this light to attract prey, while others use it to communicate with potential mates or to startle predators.",
    options: [{ key: 'A', text: 'The deep ocean is largely unexplored.' }, { key: 'B', text: 'Sunlight cannot reach below 1,000 meters.' }, { key: 'C', text: 'Many creatures produce their own light through bioluminescence.' }, { key: 'D', text: 'The deep ocean is a frontier.' }],
    correct_answer: 'C', explanation: 'Bioluminescence is a specific, unique adaptation that directly supports the claim.', skill: 'Command of Evidence',
  },
  // ─── Math — Multiple Choice ────────────────────────────────────────────────
  {
    id: 'math1', module: 'Math Module 1', difficulty: 'easy',
    question_text: 'If 3x + 7 = 22, what is the value of x?',
    options: [{ key: 'A', text: '3' }, { key: 'B', text: '5' }, { key: 'C', text: '7' }, { key: 'D', text: '10' }],
    correct_answer: 'B', explanation: '3x + 7 = 22 → 3x = 15 → x = 5', skill: 'Linear Equations',
  },
  {
    id: 'math2', module: 'Math Module 1', difficulty: 'medium',
    question_text: 'A circle in the xy-plane has its center at (3, -2) and passes through the point (7, 1). What is the radius of the circle?',
    options: [{ key: 'A', text: '3' }, { key: 'B', text: '4' }, { key: 'C', text: '5' }, { key: 'D', text: '7' }],
    correct_answer: 'C', explanation: 'r = √((7-3)² + (1-(-2))²) = √(16 + 9) = √25 = 5', skill: 'Geometry',
  },
  {
    id: 'math3', module: 'Math Module 1', difficulty: 'hard',
    question_text: 'The function f(x) = 2x³ - 3x² - 12x + 5 has a local maximum at which x-value?',
    options: [{ key: 'A', text: 'x = -1' }, { key: 'B', text: 'x = 0' }, { key: 'C', text: 'x = 1' }, { key: 'D', text: 'x = 2' }],
    correct_answer: 'A', explanation: "f'(x) = 6x² - 6x - 12 = 6(x-2)(x+1). At x = -1: f''(-1) = -18 < 0, local max.", skill: 'Advanced Math',
  },
  {
    id: 'math4', module: 'Math Module 2', difficulty: 'medium',
    question_text: 'In a survey of 200 students, 120 play sports and 90 play music. If 50 students play both, how many students play neither sports nor music?',
    options: [{ key: 'A', text: '20' }, { key: 'B', text: '30' }, { key: 'C', text: '40' }, { key: 'D', text: '50' }],
    correct_answer: 'C', explanation: 'At least one = 120 + 90 - 50 = 160. Neither = 200 - 160 = 40.', skill: 'Problem Solving',
  },
  {
    id: 'math5', module: 'Math Module 2', difficulty: 'easy',
    question_text: 'What is the slope of the line passing through points (2, 5) and (6, 13)?',
    options: [{ key: 'A', text: '1' }, { key: 'B', text: '2' }, { key: 'C', text: '3' }, { key: 'D', text: '4' }],
    correct_answer: 'B', explanation: 'Slope = (13 - 5) / (6 - 2) = 8 / 4 = 2', skill: 'Linear Equations',
  },
  {
    id: 'math6', module: 'Math Module 2', difficulty: 'hard',
    question_text: 'If the system of equations 2x + ky = 6 and kx + 8y = 12 has no solution, what is the value of k?',
    options: [{ key: 'A', text: '2' }, { key: 'B', text: '4' }, { key: 'C', text: '-4' }, { key: 'D', text: '±4' }],
    correct_answer: 'D', explanation: '2/k = k/8 → k² = 16 → k = ±4.', skill: 'Systems of Equations',
  },
  // ─── Math — Free Response (Student-Produced Response) ──────────────────────
  {
    id: 'math_fr1', module: 'Math Module 2', difficulty: 'medium', is_free_response: true,
    question_text: 'If 2(x + 3) = 5x - 9, what is the value of x?',
    options: [], correct_answer: '', correct_value: '5',
    explanation: '2x + 6 = 5x - 9 → 6 + 9 = 5x - 2x → 15 = 3x → x = 5', skill: 'Linear Equations',
  },
  {
    id: 'math_fr2', module: 'Math Module 1', difficulty: 'hard', is_free_response: true,
    question_text: 'A right triangle has legs of length 5 and 12. What is the length of the hypotenuse?',
    options: [], correct_answer: '', correct_value: '13',
    explanation: '√(5² + 12²) = √(25 + 144) = √169 = 13', skill: 'Geometry',
  },
  {
    id: 'math_fr3', module: 'Math Module 1', difficulty: 'easy', is_free_response: true,
    question_text: 'What is the value of 3² + 4²?',
    options: [], correct_answer: '', correct_value: '25',
    explanation: '3² + 4² = 9 + 16 = 25', skill: 'Problem Solving',
  },
  {
    id: 'math_fr4', module: 'Math Module 2', difficulty: 'hard', is_free_response: true,
    question_text: 'The area of a square is 144 square units. What is the perimeter of the square?',
    options: [], correct_answer: '', correct_value: '48',
    explanation: 'Side = √144 = 12. Perimeter = 4 × 12 = 48.', skill: 'Geometry',
  },
  {
    id: 'math_fr5', module: 'Math Module 1', difficulty: 'medium', is_free_response: true,
    question_text: 'If f(x) = 3x - 7, what is the value of f(4)?',
    options: [], correct_answer: '', correct_value: '5',
    explanation: 'f(4) = 3(4) - 7 = 12 - 7 = 5', skill: 'Algebra',
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
function getFromStorage<T>(key: string, fallback: T): T {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function saveToStorage<T>(key: string, data: T): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error(e); }
}

type Listener = () => void;

class QuestionStore {
  private questions: Question[];
  private listeners: Set<Listener> = new Set();
  constructor() {
    const custom = getFromStorage<Question[]>('sat_custom_questions', []);
    this.questions = [...BUILT_IN_QUESTIONS, ...custom];
  }
  private emit() { this.listeners.forEach(l => l()); }
  private persist() { saveToStorage('sat_custom_questions', this.questions.filter(q => q.is_custom)); }
  getSnapshot = (): Question[] => this.questions;
  subscribe = (listener: Listener) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  addQuestion(q: Omit<Question, 'id' | 'is_custom' | 'created_at'>) {
    const newQ: Question = { ...q, id: 'custom_' + generateId(), is_custom: true, created_at: new Date().toISOString() };
    this.questions = [...this.questions, newQ]; this.persist(); this.emit(); return newQ;
  }
  updateQuestion(id: string, updates: Partial<Omit<Question, 'id'>>) {
    this.questions = this.questions.map(q => q.id === id ? { ...q, ...updates } : q);
    this.persist(); this.emit();
  }
  deleteQuestion(id: string) { this.questions = this.questions.filter(q => q.id !== id); this.persist(); this.emit(); }
  getById(id: string): Question | undefined { return this.questions.find(q => q.id === id); }
  duplicateQuestion(id: string) {
    const o = this.getById(id); if (!o) return;
    const c: Question = { ...o, id: 'custom_' + generateId(), question_text: o.question_text + ' (Copy)', is_custom: true, created_at: new Date().toISOString() };
    this.questions = [...this.questions, c]; this.persist(); this.emit(); return c;
  }
}

const questionStore = new QuestionStore();

export function useQuestions() { return useSyncExternalStore(questionStore.subscribe, questionStore.getSnapshot); }
export function useQuestionActions() {
  return {
    addQuestion: (q: Omit<Question, 'id' | 'is_custom' | 'created_at'>) => questionStore.addQuestion(q),
    updateQuestion: (id: string, u: Partial<Omit<Question, 'id'>>) => questionStore.updateQuestion(id, u),
    deleteQuestion: (id: string) => questionStore.deleteQuestion(id),
    duplicateQuestion: (id: string) => questionStore.duplicateQuestion(id),
  };
}
export function getQuestionById(id: string): Question | undefined { return questionStore.getById(id); }

// ─── Tests ───────────────────────────────────────────────────────────────────

export function useTests() {
  const [tests, setTests] = useState<Test[]>(() => getFromStorage('sat_tests', []));
  const saveTests = useCallback((t: Test[]) => { setTests(t); saveToStorage('sat_tests', t); }, []);

  const createTest = useCallback((name: string, questionIds: string[]) => {
    const test: Test = { id: generateId(), name, question_ids: questionIds, completed: false, created_at: new Date().toISOString() };
    saveTests([...tests, test]); return test;
  }, [tests, saveTests]);

  const completeTest = useCallback((testId: string, score: number, rwScore: number, mathScore: number, timeTaken?: number) => {
    saveTests(tests.map(t => t.id === testId ? { ...t, completed: true, score, rw_score: rwScore, math_score: mathScore, time_taken: timeTaken } : t));
  }, [tests, saveTests]);

  const resetTest = useCallback((testId: string) => {
    saveTests(tests.map(t => t.id === testId ? { ...t, completed: false, score: undefined, rw_score: undefined, math_score: undefined, time_taken: undefined } : t));
  }, [tests, saveTests]);

  const deleteTest = useCallback((testId: string) => { saveTests(tests.filter(t => t.id !== testId)); }, [tests, saveTests]);

  // Get all question IDs used across all tests
  const getUsedQuestionIds = useCallback((): Set<string> => {
    const used = new Set<string>();
    tests.forEach(t => t.question_ids.forEach(id => used.add(id)));
    return used;
  }, [tests]);

  return { tests, createTest, completeTest, resetTest, deleteTest, getUsedQuestionIds };
}

// ─── Attempts ────────────────────────────────────────────────────────────────

export function useAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>(() => getFromStorage('sat_attempts', []));
  const saveAttempts = useCallback((a: Attempt[]) => { setAttempts(a); saveToStorage('sat_attempts', a); }, []);

  const submitAttempts = useCallback((newAttempts: Omit<Attempt, 'id' | 'date'>[]) => {
    const testId = newAttempts[0]?.test_id;
    const filtered = testId ? attempts.filter(a => a.test_id !== testId) : attempts;
    const withIds = newAttempts.map(a => ({ ...a, id: generateId(), date: new Date().toISOString() }));
    saveAttempts([...filtered, ...withIds]); return withIds;
  }, [attempts, saveAttempts]);

  const toggleReview = useCallback((attemptId: string) => {
    saveAttempts(attempts.map(a => a.id === attemptId ? { ...a, marked_for_review: !a.marked_for_review } : a));
  }, [attempts, saveAttempts]);

  const getTestAttempts = useCallback((testId: string) => attempts.filter(a => a.test_id === testId), [attempts]);
  const getSavedQuestions = useCallback(() => attempts.filter(a => a.marked_for_review), [attempts]);
  const clearTestAttempts = useCallback((testId: string) => { saveAttempts(attempts.filter(a => a.test_id !== testId)); }, [attempts, saveAttempts]);

  return { attempts, submitAttempts, toggleReview, getTestAttempts, getSavedQuestions, clearTestAttempts };
}

// ─── Toast ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error';
interface Toast { id: string; message: string; type: ToastType; }
let toastListeners: Array<(t: Toast) => void> = [];
export function subscribeToast(l: (t: Toast) => void) { toastListeners.push(l); return () => { toastListeners = toastListeners.filter(x => x !== l); }; }
export function showToast(message: string, type: ToastType = 'success') { toastListeners.forEach(l => l({ id: generateId(), message, type })); }

export { BUILT_IN_QUESTIONS as SAMPLE_QUESTIONS };
