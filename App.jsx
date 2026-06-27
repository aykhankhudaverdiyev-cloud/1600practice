import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

function safeStorageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => safeStorageGet(key, initialValue));
  useEffect(() => {
    safeStorageSet(key, value);
  }, [key, value]);
  return [value, setValue];
}

const QUESTION_PASSWORD = "sat123";
const TEST_PASSWORD = "builder123";

const seedQuestions = [
  {
    id: 1,
    module: "RW Module 1",
    difficulty: "Easy",
    type: "Multiple Choice",
    stem: "Which choice completes the text with the most logical and precise word?",
    options: ["abandon", "cultivate", "erase", "postpone"],
    correctAnswer: "cultivate",
    explanation: "‘Cultivate’ best fits the context of growing plants in an organized way.",
  },
  {
    id: 2,
    module: "RW Module 2",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: "Which choice best states the central claim of the passage?",
    options: [
      "Small policy changes often fail without local coordination.",
      "Climate policy has no measurable effect.",
      "Researchers should avoid local case studies.",
      "International treaties always solve emissions problems.",
    ],
    correctAnswer: "Small policy changes often fail without local coordination.",
    explanation: "The passage emphasizes that local coordination determines impact.",
  },
  {
    id: 3,
    module: "Math Module 1",
    difficulty: "Medium",
    type: "Free Response",
    stem: "If 2x + 5 = 17, what is the value of x?",
    options: [],
    correctAnswer: ["6", "6.0"],
    explanation: "Subtract 5 from both sides, then divide by 2.",
  },
  {
    id: 4,
    module: "Math Module 2",
    difficulty: "Hard",
    type: "Multiple Choice",
    stem: "Which expression is equivalent to (x + 2)(x - 2)?",
    options: ["x² + 4", "x² - 4", "2x² - 4", "x² - 2x - 4"],
    correctAnswer: "x² - 4",
    explanation: "Use the difference of squares identity.",
  },
  {
    id: 5,
    module: "RW Module 1",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `The arrival of humans to the Americas is thought to have _____ a sudden decrease in biodiversity throughout the continents. Although the extinction of species like the toxodon was likely the result of a combination of factors, from decreasing food sources to habitat destruction, most of these factors can be directly tied to the presence of humans.\n\nWhich choice completes the text with the most logical and precise word or phrase?`,
    options: ["followed", "prolonged", "counteracted", "triggered"],
    correctAnswer: "triggered",
    explanation: "“Triggered” best fits because the decrease in biodiversity can be directly tied to the presence of humans.",
  },
  {
    id: 6,
    module: "RW Module 1",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `Diego Velázquez was the leading artist in the court of King Philip IV of Spain during the seventeenth century, but his influence was hardly _____ Spain: realist and impressionist painters around the world employed his techniques and echoed elements of his style.\n\nWhich choice completes the text with the most logical and precise word or phrase?`,
    options: ["derived from", "recognized in", "confined to", "repressed by"],
    correctAnswer: "confined to",
    explanation: "Painters around the world used his techniques, so his influence was not limited to Spain.",
  },
  {
    id: 7,
    module: "RW Module 1",
    difficulty: "Easy",
    type: "Multiple Choice",
    stem: `The Al-Fattah Al-Aleem Mosque in the New Administrative Capital, Egypt, is a massive mosque that can accommodate approximately 17,000 people at once, making it an _____ sight to behold.\n\nWhich choice completes the text with the most logical and precise word or phrase?`,
    options: ["idealized", "intricate", "illusory", "imposing"],
    correctAnswer: "imposing",
    explanation: "“Imposing” matches a massive structure that is striking to look at.",
  },
  {
    id: 8,
    module: "RW Module 1",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `The way in which individual elements are balanced within a photographic image tends to affect how viewers perceive it: symmetry tends to give the elements equal importance, asymmetry emphasizes differences, and radial balance (organizing the elements around a central point) emphasizes the center over the periphery. What a photograph conveys is therefore largely _____ how it is balanced.\n\nWhich choice completes the text with the most logical and precise word or phrase?`,
    options: ["inhibited by", "contingent on", "obligated to", "reserved for"],
    correctAnswer: "contingent on",
    explanation: "The meaning depends on balance, so “contingent on” is best.",
  },
  {
    id: 9,
    module: "RW Module 1",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `Like the 1945 play it reimagines—Federico García Lorca’s The House of Bernarda Alba—Marcus Gardley’s 2014 play The House That Will Not Stand prominently features women. In both plays, the all-female cast ____ an array of female characters, including a strong mother and several daughters dealing with individual struggles.\n\nWhich choice completes the text with the most logical and precise word or phrase?`,
    options: ["engulfs", "encourages", "comprises", "provokes"],
    correctAnswer: "comprises",
    explanation: "“Comprises” correctly means consists of or includes.",
  },
  {
    id: 10,
    module: "RW Module 2",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `The Underdogs is a 1915 novel by Mariano Azuela, originally written in Spanish. In the novel, the town of Juchipila is depicted as a striking sight for a group of soldiers as they view it from afar:\n\nWhich quotation from a translation of The Underdogs most effectively illustrates the claim?`,
    options: [
      "\"All day long [the soldiers] rode through the canyon, up and down the steep, round hills, dirty and bald as a man's head, hill after hill in endless succession.\"",
      "\"[The soldiers] entered the streets of Juchipila as the church bells rang, loud and joyfully, with that peculiar tone that thrills every mountaineer.\"",
      "\"Juchipila rose in the distance, white, bathed in sunlight, shining in the midst of a thick forest at the foot of a proud, lofty mountain.\"",
      "\"The sierra is clad in gala colors. Over its inaccessible peaks the opalescent fog settles like a snowy veil on the forehead of a bride.\"",
    ],
    correctAnswer:
      "\"Juchipila rose in the distance, white, bathed in sunlight, shining in the midst of a thick forest at the foot of a proud, lofty mountain.\"",
    explanation: "This quotation shows Juchipila as a striking sight from afar.",
  },
  {
    id: 11,
    module: "RW Module 2",
    difficulty: "Medium",
    type: "Multiple Choice",
    stem: `The following text is adapted from Daniel Defoe's 1704 nonfiction book The Storm.\n\nThe sermon is a sound of words spoken to the ear, and prepared only for present meditation and extends no farther than the strength of memory can convey it; a book printed is a record, remaining in every man's possession, always ready to renew its acquaintance with his memory, and always ready to be produced as an authority or voucher to any reports he makes out of it, and conveys its contents for ages to come, to the eternity of mortal time, when the author is forgotten in his grave.\n\nWhich choice best states the main idea of the text?`,
    options: [
      "People are less likely to forget a message when they hear it spoken aloud than they are when they read it in print.",
      "Unless a spoken message is delivered by a confident orator, it may be ignored.",
      "Most authors have little hope of being remembered well past their lifetimes.",
      "Words committed to print have a greater permanence than messages that are merely spoken aloud.",
    ],
    correctAnswer:
      "Words committed to print have a greater permanence than messages that are merely spoken aloud.",
    explanation: "The text contrasts temporary spoken sermons with enduring printed books.",
  },
  {
    id: 12,
    module: "RW Module 2",
    difficulty: "Hard",
    type: "Multiple Choice",
    stem: `The Times [a British newspaper], replying to some foreign strictures on the dress, looks, and behavior of the English abroad, urges that the English ideal is that everyone should be free to do and to look just as he likes.\nBut culture indefatigably tries, not to make what each raw person may like the rule by which he fashions himself; but to draw ever nearer to a sense of what is indeed beautiful, graceful, and becoming, and to get the raw person to like that.\n\nWhich choice best describes the function of the underlined sentence in the text as a whole?`,
    options: [
      "It suggests that opinions regarding culture change over time.",
      "It asserts that the English are not as well known for their sense of taste as they ought to be.",
      "It details an example that supports the author’s primary claim.",
      "It presents an opinion with which the author disagrees.",
    ],
    correctAnswer: "It presents an opinion with which the author disagrees.",
    explanation:
      "The first sentence gives The Times’s view, which the author then contrasts with his own idea of culture.",
  },
];

const seedTests = [
  {
    id: 1,
    name: "RW Grammar Drill Set",
    mode: "Custom Test",
    password: TEST_PASSWORD,
    moduleQuestions: {
      "RW Module 1": [1],
      "RW Module 2": [],
      "Math Module 1": [],
      "Math Module 2": [],
    },
  },
];

const seedSavedQuestions = [];
const seedHistory = [];

const moduleOptions = [
  "All Modules",
  "RW Module 1",
  "RW Module 2",
  "Math Module 1",
  "Math Module 2",
];

const difficultyOptions = ["All Levels", "Easy", "Medium", "Hard"];

const dashboardModes = [
  "Randomized Full Length Test",
  "Only RW Module 1",
  "Only RW Module 2",
  "Only Math Module 1",
  "Only Math Module 2",
  "RW Module 1 & 2",
  "Math Module 1 & 2",
  "Custom Tests",
];

const orderedModules = ["RW Module 1", "RW Module 2", "Math Module 1", "Math Module 2"];

const referenceFormulas = [
  "Triangle area: A = 1/2 bh",
  "Rectangle area: A = lw",
  "Circle area: A = πr²",
  "Circle circumference: C = 2πr",
  "Rectangular prism volume: V = lwh",
  "Cylinder volume: V = πr²h",
  "Pythagorean theorem: c² = a² + b²",
  "Special right triangles: 45-45-90 and 30-60-90",
];

const moduleTimeMap = {
  "RW Module 1": 32 * 60,
  "RW Module 2": 32 * 60,
  "Math Module 1": 35 * 60,
  "Math Module 2": 35 * 60,
};

const moduleQuestionTargets = {
  "RW Module 1": 27,
  "RW Module 2": 27,
  "Math Module 1": 22,
  "Math Module 2": 22,
};

const emptyForm = {
  module: "RW Module 1",
  difficulty: "Easy",
  type: "Multiple Choice",
  stem: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOptionIndex: "",
  freeResponseAnswers: "",
  explanation: "",
};

const emptyTestForm = {
  name: "",
  password: "",
  activeModules: [],
  moduleQuestions: {
    "RW Module 1": [],
    "RW Module 2": [],
    "Math Module 1": [],
    "Math Module 2": [],
  },
};

const emptyStartForm = {
  fullName: "",
  sessionPassword: "",
};

function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function normalizeText(value) {
  return (value || "").toString().trim().toLowerCase();
}

function scaledSectionScore(correct, total) {
  if (!total) return 0;
  const ratio = correct / total;
  return Math.round(200 + ratio * 600);
}

function scoreSection(questions, answers) {
  let correct = 0;
  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    if (q.type === "Multiple Choice") {
      if (normalizeText(userAnswer) === normalizeText(q.correctAnswer)) correct += 1;
    } else if (
      Array.isArray(q.correctAnswer) &&
      q.correctAnswer.map((item) => normalizeText(item)).includes(normalizeText(userAnswer))
    ) {
      correct += 1;
    }
  });
  return correct;
}

function randomPick(source, count) {
  const cloned = [...source];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned.slice(0, count);
}

function getModuleFlow(sectionMap) {
  return orderedModules.filter((moduleName) => (sectionMap[moduleName] || []).length > 0);
}

function buildModeQuestions(mode, questions, tests) {
  const byModule = (module) => questions.filter((q) => q.module === module);

  if (mode === "Randomized Full Length Test") {
    const built = {};
    for (const moduleName of orderedModules) {
      const pool = byModule(moduleName);
      const target = moduleQuestionTargets[moduleName];
      if (pool.length < target) {
        return {
          error: `There are not enough questions to start a full-length test. ${moduleName} requires ${target} questions, but only ${pool.length} are available.`,
        };
      }
      built[moduleName] = randomPick(pool, target);
    }
    return built;
  }

  if (mode === "RW Module 1 & 2") {
    return {
      "RW Module 1": byModule("RW Module 1"),
      "RW Module 2": byModule("RW Module 2"),
      "Math Module 1": [],
      "Math Module 2": [],
    };
  }

  if (mode === "Math Module 1 & 2") {
    return {
      "RW Module 1": [],
      "RW Module 2": [],
      "Math Module 1": byModule("Math Module 1"),
      "Math Module 2": byModule("Math Module 2"),
    };
  }

  if (mode === "Only RW Module 1") {
    return {
      "RW Module 1": byModule("RW Module 1"),
      "RW Module 2": [],
      "Math Module 1": [],
      "Math Module 2": [],
    };
  }

  if (mode === "Only RW Module 2") {
    return {
      "RW Module 1": [],
      "RW Module 2": byModule("RW Module 2"),
      "Math Module 1": [],
      "Math Module 2": [],
    };
  }

  if (mode === "Only Math Module 1") {
    return {
      "RW Module 1": [],
      "RW Module 2": [],
      "Math Module 1": byModule("Math Module 1"),
      "Math Module 2": [],
    };
  }

  if (mode === "Only Math Module 2") {
    return {
      "RW Module 1": [],
      "RW Module 2": [],
      "Math Module 1": [],
      "Math Module 2": byModule("Math Module 2"),
    };
  }

  const matchedCustomTest = tests.find(
    (test) => test.mode === "Custom Test" && test.name === mode
  );

  if (mode === "Custom Tests" || matchedCustomTest) {
    const selectedTest =
      matchedCustomTest ||
      tests.find((test) => test.mode === "Custom Test") ||
      null;

    if (!selectedTest) {
      return {
        "RW Module 1": [],
        "RW Module 2": [],
        "Math Module 1": [],
        "Math Module 2": [],
      };
    }

    const map = {};
    orderedModules.forEach((moduleName) => {
      const ids = selectedTest.moduleQuestions[moduleName] || [];
      map[moduleName] = ids
        .map((id) => questions.find((q) => q.id === id))
        .filter(Boolean);
    });

    return map;
  }

  return {
    "RW Module 1": [],
    "RW Module 2": [],
    "Math Module 1": [],
    "Math Module 2": [],
  };
}

function unwrapHighlights(container) {
  if (!container) return;
  const marks = container.querySelectorAll("span.highlight-chip");
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
    parent.normalize();
  });
}

function App() {
  const [activeTab, setActiveTab] = usePersistentState("sat_active_tab_v1", "question-bank");
  const [questions, setQuestions] = usePersistentState("sat_questions_v1", seedQuestions);
  const [tests, setTests] = usePersistentState("sat_tests_v1", seedTests);
  const [savedQuestions, setSavedQuestions] = usePersistentState("sat_saved_questions_v1", seedSavedQuestions);
  const [historyItems, setHistoryItems] = usePersistentState("sat_history_v1", seedHistory);

  const [search, setSearch] = usePersistentState("sat_search_v1", "");
  const [selectedModule, setSelectedModule] = usePersistentState("sat_selected_module_v1", "All Modules");
  const [selectedDifficulty, setSelectedDifficulty] = usePersistentState("sat_selected_difficulty_v1", "All Levels");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [testForm, setTestForm] = useState(emptyTestForm);

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [startModalOpen, setStartModalOpen] = useState(false);
  const [startMode, setStartMode] = useState("");
  const [startForm, setStartForm] = useState(emptyStartForm);

  const [theme, setTheme] = usePersistentState("sat_theme_v1", "light");

  const [examSession, setExamSession] = usePersistentState("sat_exam_session_v1", null);
  const [examIndex, setExamIndex] = usePersistentState("sat_exam_index_v1", 0);
  const [showResultScreen, setShowResultScreen] = usePersistentState("sat_show_result_screen_v1", false);
  const [showBreakScreen, setShowBreakScreen] = usePersistentState("sat_show_break_screen_v1", false);
  const [showReviewPage, setShowReviewPage] = usePersistentState("sat_show_review_page_v1", false);
  const [reviewFilter, setReviewFilter] = usePersistentState("sat_review_filter_v1", "all");
  const [selectedReviewQuestionId, setSelectedReviewQuestionId] = usePersistentState("sat_selected_review_question_id_v1", null);

  const [showCalculator, setShowCalculator] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [moduleTransition, setModuleTransition] = useState(null);

  const [calculatorRect, setCalculatorRect] = useState({
    x: window.innerWidth > 900 ? 80 : 20,
    y: window.innerWidth > 900 ? 120 : 90,
    width: window.innerWidth > 900 ? 620 : 340,
    height: window.innerWidth > 900 ? 460 : 320,
  });

  const [highlightToolbar, setHighlightToolbar] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [activeHighlightDelete, setActiveHighlightDelete] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const dragState = useRef(null);
  const resizeState = useRef(null);
  const passageRef = useRef(null);
  const savedSelectionRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleMove = (e) => {
      if (dragState.current) {
        const { offsetX, offsetY } = dragState.current;
        setCalculatorRect((prev) => ({
          ...prev,
          x: Math.max(10, e.clientX - offsetX),
          y: Math.max(10, e.clientY - offsetY),
        }));
      }

      if (resizeState.current) {
        const { startX, startY, startWidth, startHeight } = resizeState.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        setCalculatorRect((prev) => ({
          ...prev,
          width: Math.max(320, startWidth + dx),
          height: Math.max(240, startHeight + dy),
        }));
      }
    };

    const handleUp = () => {
      dragState.current = null;
      resizeState.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  useEffect(() => {
    if (!examSession || showResultScreen || showBreakScreen || showReviewPage) return;

    const timer = setInterval(() => {
      setExamSession((prev) => {
        if (!prev) return prev;
        const moduleKey = prev.currentModule;
        const currentValue = prev.moduleTimers[moduleKey];

        if (currentValue <= 1) {
          clearInterval(timer);
          handleModuleCompletionFromState(prev);
          return prev;
        }

        return {
          ...prev,
          moduleTimers: {
            ...prev.moduleTimers,
            [moduleKey]: currentValue - 1,
          },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examSession, showResultScreen, showBreakScreen, showReviewPage]);

  useEffect(() => {
    if (!showBreakScreen) return;

    const timer = setInterval(() => {
      setExamSession((prev) => {
        if (!prev) return prev;
        if (prev.breakTimeLeft <= 1) {
          clearInterval(timer);
          return {
            ...prev,
            breakTimeLeft: 0,
          };
        }
        return {
          ...prev,
          breakTimeLeft: prev.breakTimeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBreakScreen]);

  useEffect(() => {
    if (!examSession || !showBreakScreen) return;
    if (examSession.breakTimeLeft === 0) {
      resumeAfterBreak();
    }
  }, [examSession, showBreakScreen]);

  useEffect(() => {
    if (!moduleTransition) return;
    const timeout = setTimeout(() => setModuleTransition(null), 1800);
    return () => clearTimeout(timeout);
  }, [moduleTransition]);

  useEffect(() => {
    if (!passageRef.current) return;
    unwrapHighlights(passageRef.current);
    setHighlightToolbar({ visible: false, x: 0, y: 0 });
    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
  }, [examIndex, examSession?.currentModule]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (!target.closest(".highlight-floating-toolbar")) {
        setHighlightToolbar((prev) => ({ ...prev, visible: false }));
      }

      if (!target.closest(".highlight-delete-pop") && !target.closest(".highlight-chip")) {
        setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.stem.toLowerCase().includes(search.toLowerCase());
      const matchesModule =
        selectedModule === "All Modules" || q.module === selectedModule;
      const matchesDifficulty =
        selectedDifficulty === "All Levels" || q.difficulty === selectedDifficulty;
      return matchesSearch && matchesModule && matchesDifficulty;
    });
  }, [questions, search, selectedModule, selectedDifficulty]);

  const currentQuestions = examSession
    ? examSession.sections[examSession.currentModule]
    : [];

  const currentQuestion = currentQuestions?.[examIndex] || null;
  const currentModuleName = examSession?.currentModule || "";
  const currentTimeLeft = examSession?.moduleTimers?.[currentModuleName] ?? 0;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetQuestionForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const buildQuestionPayload = () => {
    const isMCQ = form.type === "Multiple Choice";
    const options = isMCQ
      ? [form.optionA, form.optionB, form.optionC, form.optionD].map((item) => item.trim())
      : [];

    const selectedIndex = Number(form.correctOptionIndex);

    return {
      title: form.title.trim(),
      module: form.module,
      difficulty: form.difficulty,
      type: form.type,
      stem: form.stem.trim(),
      options: isMCQ ? options.filter(Boolean) : [],
      correctAnswer: isMCQ
        ? options[selectedIndex] || ""
        : form.freeResponseAnswers.split(",").map((item) => item.trim()).filter(Boolean),
      explanation: form.explanation.trim(),
    };
  };

  const validateQuestionPayload = (payload) => {
    if (!payload.title || !payload.stem) return "Title and question text are required.";
    if (payload.type === "Multiple Choice") {
      if (payload.options.length < 4 || payload.options.some((item) => !item.trim())) {
        return "Please fill all four answer choices.";
      }
      if (!payload.correctAnswer) return "Please select the correct option.";
    } else if (!payload.correctAnswer.length) {
      return "Please enter at least one acceptable free-response answer.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = buildQuestionPayload();
    const validationMessage = validateQuestionPayload(payload);
    if (validationMessage) return alert(validationMessage);

    if (editingId) {
      openPasswordModal({ kind: "edit-question", payload, id: editingId });
      return;
    }

    setQuestions((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    resetQuestionForm();
  };

  const handleEditClick = (question) => {
    setEditingId(question.id);
    setActiveTab("question-bank");
    setForm({
      title: question.title,
      module: question.module,
      difficulty: question.difficulty,
      type: question.type,
      stem: question.stem,
      optionA: question.options?.[0] || "",
      optionB: question.options?.[1] || "",
      optionC: question.options?.[2] || "",
      optionD: question.options?.[3] || "",
      correctOptionIndex: Array.isArray(question.correctAnswer)
        ? ""
        : String(question.options?.findIndex((opt) => opt === question.correctAnswer)),
      freeResponseAnswers: Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(", ")
        : "",
      explanation: question.explanation || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPasswordModal = (action) => {
    setPendingAction(action);
    setPasswordInput("");
    setErrorMessage("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPendingAction(null);
    setPasswordInput("");
    setErrorMessage("");
  };

  const confirmPasswordAction = () => {
    if (!pendingAction) return;
    let expectedPassword = "";

    if (pendingAction.kind === "edit-question" || pendingAction.kind === "delete-question") {
      expectedPassword = QUESTION_PASSWORD;
    }
    if (pendingAction.kind === "delete-test") {
      const test = tests.find((item) => item.id === pendingAction.id);
      expectedPassword = test?.password || "";
    }
    if (pendingAction.kind === "delete-history" || pendingAction.kind === "review-history") {
      const historyItem = historyItems.find((item) => item.id === pendingAction.id);
      expectedPassword = historyItem?.reviewPassword || "";
    }

    if (passwordInput !== expectedPassword) {
      setErrorMessage("Incorrect password. Please try again.");
      return;
    }

    if (pendingAction.kind === "edit-question") {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === pendingAction.id ? { ...question, ...pendingAction.payload } : question
        )
      );
      resetQuestionForm();
    }
    if (pendingAction.kind === "delete-question") {
      setQuestions((prev) => prev.filter((question) => question.id !== pendingAction.id));
    }
    if (pendingAction.kind === "delete-test") {
      setTests((prev) => prev.filter((test) => test.id !== pendingAction.id));
    }
    if (pendingAction.kind === "delete-history") {
      setHistoryItems((prev) => prev.filter((item) => item.id !== pendingAction.id));
    }
    if (pendingAction.kind === "review-history") {
      alert("Review access granted.");
    }

    closeModal();
  };

  const handleDeleteClick = (questionId) => {
    openPasswordModal({ kind: "delete-question", id: questionId });
  };

  const handleTestFormChange = (field, value) => {
    setTestForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCustomModule = (module) => {
    setTestForm((prev) => {
      const exists = prev.activeModules.includes(module);
      return {
        ...prev,
        activeModules: exists
          ? prev.activeModules.filter((item) => item !== module)
          : [...prev.activeModules, module],
      };
    });
  };

  const addQuestionToCustomModule = (moduleName, questionId) => {
    setTestForm((prev) => {
      if (prev.moduleQuestions[moduleName].includes(questionId)) return prev;
      return {
        ...prev,
        moduleQuestions: {
          ...prev.moduleQuestions,
          [moduleName]: [...prev.moduleQuestions[moduleName], questionId],
        },
      };
    });
  };

  const removeQuestionFromCustomModule = (moduleName, index) => {
    setTestForm((prev) => {
      const next = [...prev.moduleQuestions[moduleName]];
      next.splice(index, 1);
      return {
        ...prev,
        moduleQuestions: {
          ...prev.moduleQuestions,
          [moduleName]: next,
        },
      };
    });
  };

  const moveQuestionWithinCustomModule = (moduleName, index, direction) => {
    setTestForm((prev) => {
      const next = [...prev.moduleQuestions[moduleName]];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return {
        ...prev,
        moduleQuestions: {
          ...prev.moduleQuestions,
          [moduleName]: next,
        },
      };
    });
  };

  const handleCreateTest = (e) => {
    e.preventDefault();

    if (!testForm.name.trim()) return alert("Please enter a test name.");
    if (!testForm.password.trim()) return alert("Please set a password for this test.");
    if (!testForm.activeModules.length) return alert("Please select at least one module.");

    const totalSelected = orderedModules.reduce(
      (sum, moduleName) => sum + testForm.moduleQuestions[moduleName].length,
      0
    );

    if (!totalSelected) {
      return alert("Please add at least one question to your custom test.");
    }

    const finalModuleQuestions = {};
    orderedModules.forEach((moduleName) => {
      finalModuleQuestions[moduleName] = testForm.moduleQuestions[moduleName];
    });

    setTests((prev) => [
      {
        id: Date.now(),
        name: testForm.name.trim(),
        mode: "Custom Test",
        password: testForm.password.trim(),
        moduleQuestions: finalModuleQuestions,
      },
      ...prev,
    ]);

    setTestForm(emptyTestForm);
  };

  const handleDeleteTest = (id) => openPasswordModal({ kind: "delete-test", id });

  const handleSaveQuestion = (question) => {
    const exists = savedQuestions.some((item) => item.questionId === question.id);
    if (exists) return alert("This question is already in Saved Questions.");

    setSavedQuestions((prev) => [
      {
        id: Date.now(),
        questionId: question.id,
        title: question.title,
        savedBy: "Global user save",
        module: question.module,
        difficulty: question.difficulty,
      },
      ...prev,
    ]);
  };

  const handleRemoveSavedQuestion = (id) => {
    setSavedQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  const openStartModal = (mode) => {
    setStartMode(mode);
    setStartForm(emptyStartForm);
    setStartModalOpen(true);
  };

  const closeStartModal = () => {
    setStartModalOpen(false);
    setStartForm(emptyStartForm);
    setStartMode("");
  };

  const handleStartTest = () => {
    if (!startForm.fullName.trim()) return alert("Please enter full name.");
    if (!startForm.sessionPassword.trim()) return alert("Please set a session password.");

    const built = buildModeQuestions(startMode, questions, tests);

    if (built.error) return alert(built.error);

    const moduleOrder = getModuleFlow(built);

    if (!moduleOrder.length) {
      return alert("This test has no usable questions yet. Please add questions first.");
    }

    const sessionId = Date.now();
    const timerMap = {};
    moduleOrder.forEach((moduleName) => {
      timerMap[moduleName] = moduleTimeMap[moduleName];
    });

    const freshSession = {
      sessionId,
      fullName: startForm.fullName.trim(),
      mode: startMode,
      reviewPassword: startForm.sessionPassword.trim(),
      sections: built,
      moduleOrder,
      currentModule: moduleOrder[0],
      moduleTimers: timerMap,
      breakTimeLeft: 10 * 60,
      answers: {},
      marked: {},
      eliminated: {},
      savedDuringExam: {},
      finalSummary: null,
      reviewReady: false,
    };

    setHistoryItems((prev) => [
      {
        id: sessionId,
        fullName: startForm.fullName.trim(),
        testName: startMode,
        score: 0,
        status: "Started",
        reviewPassword: startForm.sessionPassword.trim(),
        startedAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    setExamSession(freshSession);
    setExamIndex(0);
    setShowBreakScreen(false);
    setShowResultScreen(false);
    setShowReviewPage(false);
    setReviewFilter("all");
    setSelectedReviewQuestionId(null);
    setShowCalculator(false);
    setShowReference(false);
    setModuleTransition({
      title: moduleOrder[0],
      subtitle: "Your exam is starting",
    });
    closeStartModal();
  };

  const handleAnswerChange = (questionId, value) => {
    setExamSession((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  };

  const toggleMarkForReview = (questionId) => {
    setExamSession((prev) => ({
      ...prev,
      marked: { ...prev.marked, [questionId]: !prev.marked[questionId] },
    }));
  };

  const toggleOptionElimination = (questionId, option) => {
    setExamSession((prev) => {
      const current = prev.eliminated[questionId] || [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return {
        ...prev,
        eliminated: { ...prev.eliminated, [questionId]: next },
      };
    });
  };

  const toggleSavedDuringExam = (question) => {
    setExamSession((prev) => ({
      ...prev,
      savedDuringExam: {
        ...prev.savedDuringExam,
        [question.id]: !prev.savedDuringExam[question.id],
      },
    }));
  };

  const showSelectionToolbar = () => {
    if (!passageRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setHighlightToolbar({ visible: false, x: 0, y: 0 });
      return;
    }

    const range = selection.getRangeAt(0);
    if (!passageRef.current.contains(range.commonAncestorContainer)) {
      setHighlightToolbar({ visible: false, x: 0, y: 0 });
      return;
    }

    savedSelectionRef.current = range.cloneRange();
    const rect = range.getBoundingClientRect();

    setHighlightToolbar({
      visible: true,
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY - 14,
    });

    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
  };

  const applyHighlightFromToolbar = () => {
    if (!savedSelectionRef.current) return;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionRef.current);

    try {
      const wrapper = document.createElement("span");
      wrapper.className = "highlight-chip yellow";
      savedSelectionRef.current.surroundContents(wrapper);
    } catch {
      selection.removeAllRanges();
    }

    selection.removeAllRanges();
    savedSelectionRef.current = null;
    setHighlightToolbar({ visible: false, x: 0, y: 0 });
  };

  const handlePassageMouseUp = () => {
    setTimeout(showSelectionToolbar, 10);
  };

  const handleHighlightClick = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const chip = target.closest(".highlight-chip");
    if (!chip) {
      setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
      return;
    }

    const rect = chip.getBoundingClientRect();
    setActiveHighlightDelete({
      visible: true,
      x: rect.right + window.scrollX - 6,
      y: rect.top + window.scrollY - 10,
      node: chip,
    });
  };

  const removeActiveHighlight = () => {
    const chip = activeHighlightDelete.node;
    if (!chip) return;
    const parent = chip.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(chip.textContent || ""), chip);
    parent.normalize();
    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
  };

  const getNextModuleAfter = (session, moduleName) => {
    const currentIndex = session.moduleOrder.indexOf(moduleName);
    return currentIndex >= 0 ? session.moduleOrder[currentIndex + 1] || null : null;
  };

  const moveToModule = (nextModule) => {
    if (!nextModule) return;
    setModuleTransition({
      title: nextModule,
      subtitle: "Get ready for the next module",
    });
    setExamSession((prev) =>
      prev
        ? {
            ...prev,
            currentModule: nextModule,
          }
        : prev
    );
    setExamIndex(0);
    setShowCalculator(false);
    setShowReference(false);
    setHighlightToolbar({ visible: false, x: 0, y: 0 });
    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
  };

  const handleModuleCompletionFromState = (sessionState) => {
    const currentModule = sessionState.currentModule;
    const nextModule = getNextModuleAfter(sessionState, currentModule);

    if (currentModule === "RW Module 2" && nextModule && nextModule.startsWith("Math")) {
      setExamSession((prev) =>
        prev
          ? {
              ...prev,
              moduleTimers: {
                ...prev.moduleTimers,
                [currentModule]: 0,
              },
            }
          : prev
      );
      setShowBreakScreen(true);
      return;
    }

    if (nextModule) {
      setExamSession((prev) =>
        prev
          ? {
              ...prev,
              currentModule: nextModule,
              moduleTimers: {
                ...prev.moduleTimers,
                [currentModule]: 0,
              },
            }
          : prev
      );
      setModuleTransition({
        title: nextModule,
        subtitle: `${currentModule} completed`,
      });
      setExamIndex(0);
      setShowCalculator(false);
      setShowReference(false);
      setHighlightToolbar({ visible: false, x: 0, y: 0 });
      setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
      return;
    }

    finishExamFromState(sessionState);
  };

  const submitCurrentModule = () => {
    if (!examSession) return;
    handleModuleCompletionFromState(examSession);
  };

  const resumeAfterBreak = () => {
    const nextModule = getNextModuleAfter(examSession, "RW Module 2");
    if (!nextModule) return;
    setShowBreakScreen(false);
    moveToModule(nextModule);
  };

  const finishExamFromState = (sessionState) => {
    const rwQuestions = [
      ...(sessionState.sections["RW Module 1"] || []),
      ...(sessionState.sections["RW Module 2"] || []),
    ];
    const mathQuestions = [
      ...(sessionState.sections["Math Module 1"] || []),
      ...(sessionState.sections["Math Module 2"] || []),
    ];

    const rwCorrect = scoreSection(rwQuestions, sessionState.answers);
    const mathCorrect = scoreSection(mathQuestions, sessionState.answers);

    const readingAndWritingScore = rwQuestions.length
      ? scaledSectionScore(rwCorrect, rwQuestions.length)
      : 0;

    const mathScore = mathQuestions.length
      ? scaledSectionScore(mathCorrect, mathQuestions.length)
      : 0;

    const totalScore = readingAndWritingScore + mathScore;

    setExamSession((prev) =>
      prev
        ? {
            ...prev,
            reviewReady: true,
            finalSummary: {
              rwCorrect,
              mathCorrect,
              rwTotal: rwQuestions.length,
              mathTotal: mathQuestions.length,
              readingAndWritingScore,
              mathScore,
              totalScore,
            },
          }
        : prev
    );

    setHistoryItems((prev) =>
      prev.map((item) =>
        item.id === sessionState.sessionId
          ? { ...item, score: totalScore, status: "Completed" }
          : item
      )
    );

    setTimeout(() => {
      setShowResultScreen(true);
      setShowBreakScreen(false);
      setShowCalculator(false);
      setShowReference(false);
      setHighlightToolbar({ visible: false, x: 0, y: 0 });
      setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
    }, 450);
  };

  const exitExam = () => {
    setExamSession(null);
    setShowResultScreen(false);
    setShowBreakScreen(false);
    setShowReviewPage(false);
    setReviewFilter("all");
    setSelectedReviewQuestionId(null);
    setExamIndex(0);
    setShowCalculator(false);
    setShowReference(false);
    setHighlightToolbar({ visible: false, x: 0, y: 0 });
    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
  };

  const isQuestionCorrect = (question) => {
    if (!examSession) return false;
    const userAnswer = examSession.answers[question.id];

    if (question.type === "Multiple Choice") {
      return normalizeText(userAnswer) === normalizeText(question.correctAnswer);
    }

    return (
      Array.isArray(question.correctAnswer) &&
      question.correctAnswer.map((item) => normalizeText(item)).includes(normalizeText(userAnswer))
    );
  };

  const getAllSessionQuestions = () => {
    if (!examSession) return [];
    return examSession.moduleOrder.flatMap((moduleName) => examSession.sections[moduleName] || []);
  };

  const getFilteredReviewQuestions = () => {
    const all = getAllSessionQuestions();

    if (reviewFilter === "correct") return all.filter((q) => isQuestionCorrect(q));
    if (reviewFilter === "wrong") {
      return all.filter((q) => {
        const userAnswer = examSession?.answers[q.id];
        return userAnswer !== undefined && userAnswer !== "" && !isQuestionCorrect(q);
      });
    }
    if (reviewFilter === "unanswered") {
      return all.filter((q) => {
        const userAnswer = examSession?.answers[q.id];
        return userAnswer === undefined || userAnswer === "";
      });
    }
    if (reviewFilter === "marked") return all.filter((q) => examSession?.marked[q.id]);
    return all;
  };

  const startDragCalculator = (e) => {
    dragState.current = {
      offsetX: e.clientX - calculatorRect.x,
      offsetY: e.clientY - calculatorRect.y,
    };
  };

  const startResizeCalculator = (e) => {
    e.stopPropagation();
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: calculatorRect.width,
      startHeight: calculatorRect.height,
    };
  };

  const shrinkCalculator = () => {
    setCalculatorRect((prev) => ({
      ...prev,
      width: Math.max(360, prev.width - 120),
      height: Math.max(260, prev.height - 100),
    }));
  };

  const expandCalculator = () => {
    setCalculatorRect((prev) => ({
      ...prev,
      width: Math.min(window.innerWidth - 40, prev.width + 120),
      height: Math.min(window.innerHeight - 40, prev.height + 100),
    }));
  };

  const renderQuestionBank = () => (
    <>
      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{editingId ? "Edit question" : "Create question"}</p>
            <h2>{editingId ? "Update SAT question" : "New SAT question"}</h2>
          </div>
          {editingId ? <button className="ghost-btn" onClick={resetQuestionForm}>Cancel editing</button> : null}
        </div>

        <form className="question-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div>
              <label>Question title</label>
              <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
            </div>
            <div>
              <label>Question type</label>
              <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
                <option>Multiple Choice</option>
                <option>Free Response</option>
              </select>
            </div>
          </div>

          <div className="grid two">
            <div>
              <label>Module</label>
              <select value={form.module} onChange={(e) => handleChange("module", e.target.value)}>
                <option>RW Module 1</option>
                <option>RW Module 2</option>
                <option>Math Module 1</option>
                <option>Math Module 2</option>
              </select>
            </div>
            <div>
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={(e) => handleChange("difficulty", e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label>Question / passage text</label>
            <textarea rows="6" value={form.stem} onChange={(e) => handleChange("stem", e.target.value)} />
          </div>

          {form.type === "Multiple Choice" ? (
            <>
              <div className="grid two">
                <div><label>Choice A</label><input value={form.optionA} onChange={(e) => handleChange("optionA", e.target.value)} /></div>
                <div><label>Choice B</label><input value={form.optionB} onChange={(e) => handleChange("optionB", e.target.value)} /></div>
              </div>
              <div className="grid two">
                <div><label>Choice C</label><input value={form.optionC} onChange={(e) => handleChange("optionC", e.target.value)} /></div>
                <div><label>Choice D</label><input value={form.optionD} onChange={(e) => handleChange("optionD", e.target.value)} /></div>
              </div>
              <div>
                <label>Correct option</label>
                <select
                  value={form.correctOptionIndex}
                  onChange={(e) => handleChange("correctOptionIndex", e.target.value)}
                >
                  <option value="">Select the correct option</option>
                  {[form.optionA, form.optionB, form.optionC, form.optionD].map((option, index) => (
                    <option key={index} value={index} disabled={!option.trim()}>
                      {String.fromCharCode(65 + index)} {option ? `— ${option}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label>Accepted answers</label>
              <input value={form.freeResponseAnswers} onChange={(e) => handleChange("freeResponseAnswers", e.target.value)} />
            </div>
          )}

          <div>
            <label>Explanation (optional)</label>
            <textarea rows="4" value={form.explanation} onChange={(e) => handleChange("explanation", e.target.value)} />
          </div>

          <div className="button-row">
            <button className="primary-btn" type="submit">{editingId ? "Save changes" : "Add question"}</button>
            <button className="ghost-btn" type="button" onClick={resetQuestionForm}>Reset form</button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div><p className="eyebrow">Library</p><h2>Stored questions</h2></div>
          <span className="pill">{filteredQuestions.length} shown</span>
        </div>

        <div className="bank-filter-bar">
          <div>
            <label>Search by fragment</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type part of the question..."
            />
          </div>
          <div>
            <label>Filter by module</label>
            <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
              {moduleOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label>Filter by difficulty</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              {difficultyOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="question-list">
          {filteredQuestions.map((question) => (
            <article className="question-card" key={question.id}>
              <div className="card-top">
                <div>
                  <h3>{question.title}</h3>
                  <p className="muted">{question.stem}</p>
                </div>
                <div className="badges">
                  <span className="badge module">{question.module}</span>
                  <span className="badge difficulty">{question.difficulty}</span>
                  <span className="badge type">{question.type}</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="ghost-btn" onClick={() => handleEditClick(question)}>Edit</button>
                <button className="ghost-btn" onClick={() => handleSaveQuestion(question)}>Save question</button>
                <button className="danger-btn" onClick={() => handleDeleteClick(question.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const renderModuleBuilder = (moduleName) => {
    const selectedIds = testForm.moduleQuestions[moduleName];
    const moduleBank = questions.filter((q) => q.module === moduleName);

    return (
      <div className="module-builder-card" key={moduleName}>
        <div className="module-builder-header">
          <div>
            <h3>{moduleName}</h3>
            <p className="muted">{selectedIds.length} question(s) in order</p>
          </div>
        </div>

        <div className="module-builder-grid">
          <div className="module-builder-bank">
            <p className="sidebar-title">Question bank for this module</p>
            <div className="builder-question-list">
              {moduleBank.map((question) => {
                const alreadySelected = selectedIds.includes(question.id);
                return (
                  <div
                    key={question.id}
                    className={alreadySelected ? "builder-item selected-builder-item" : "builder-item"}
                  >
                    <div className="builder-item-copy">
                      <strong>{question.title}</strong>
                      <p>{question.stem}</p>
                      <small>{question.type} • {question.difficulty}</small>
                    </div>
                    <button
                      type="button"
                      className={alreadySelected ? "ghost-btn small-btn disabled-btn" : "ghost-btn small-btn"}
                      onClick={() => addQuestionToCustomModule(moduleName, question.id)}
                      disabled={alreadySelected}
                    >
                      {alreadySelected ? "Selected" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="module-builder-selected">
            <p className="sidebar-title">Selected order</p>
            <div className="builder-selected-list">
              {selectedIds.length ? (
                selectedIds.map((id, index) => {
                  const q = questions.find((item) => item.id === id);
                  if (!q) return null;
                  return (
                    <div className="selected-row" key={`${moduleName}-${index}-${id}`}>
                      <div className="builder-item-copy">
                        <strong>{index + 1}. {q.title}</strong>
                        <p>{q.stem}</p>
                        <small>{q.type}</small>
                      </div>
                      <div className="row-actions">
                        <button type="button" className="ghost-btn small-btn" onClick={() => moveQuestionWithinCustomModule(moduleName, index, -1)}>↑</button>
                        <button type="button" className="ghost-btn small-btn" onClick={() => moveQuestionWithinCustomModule(moduleName, index, 1)}>↓</button>
                        <button type="button" className="danger-btn small-btn" onClick={() => removeQuestionFromCustomModule(moduleName, index)}>Remove</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-flagged">
                  <p className="muted">No questions added to this module yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestBuilder = () => (
    <>
      <section className="panel">
        <div className="section-heading">
          <div><p className="eyebrow">Builder</p><h2>Create custom test</h2></div>
        </div>

        <form className="question-form" onSubmit={handleCreateTest}>
          <div className="grid two">
            <div>
              <label>Test name</label>
              <input value={testForm.name} onChange={(e) => handleTestFormChange("name", e.target.value)} />
            </div>
            <div>
              <label>Test password</label>
              <input value={testForm.password} onChange={(e) => handleTestFormChange("password", e.target.value)} />
            </div>
          </div>

          <div>
            <label>Select modules for this custom test</label>
            <div className="toggle-grid">
              {orderedModules.map((module) => (
                <button
                  key={module}
                  type="button"
                  className={testForm.activeModules.includes(module) ? "toggle-chip active" : "toggle-chip"}
                  onClick={() => toggleCustomModule(module)}
                >
                  {module}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-modules-stack">
            {testForm.activeModules.map((moduleName) => renderModuleBuilder(moduleName))}
          </div>

          <button className="primary-btn" type="submit">Create custom test</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div><p className="eyebrow">Saved tests</p><h2>Custom tests</h2></div>
          <span className="pill">{tests.length} total</span>
        </div>

        <div className="question-list">
          {tests.map((test) => {
            const count = orderedModules.reduce(
              (sum, moduleName) => sum + (test.moduleQuestions?.[moduleName]?.length || 0),
              0
            );

            return (
              <article className="question-card" key={test.id}>
                <div className="card-top">
                  <div>
                    <h3>{test.name}</h3>
                    <p className="muted">{count} ordered question(s) selected</p>
                  </div>
                  <div className="badges"><span className="badge type">{test.mode}</span></div>
                </div>

                <div className="card-actions">
                  <button className="ghost-btn" onClick={() => openStartModal(test.name)}>Start</button>
                  <button className="danger-btn" onClick={() => handleDeleteTest(test.id)}>Delete test</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );

  const renderDashboard = () => (
    <section className="panel">
      <div className="section-heading">
        <div><p className="eyebrow">Dashboard</p><h2>Practice modes</h2></div>
      </div>

      <div className="dashboard-grid">
        {dashboardModes.map((item) => (
          <div className="mode-card" key={item}>
            <h3>{item}</h3>
            <p>Start a new SAT practice flow from this mode.</p>
            <button className="ghost-btn" onClick={() => openStartModal(item)}>Start test</button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSavedQuestions = () => (
    <section className="panel">
      <div className="section-heading">
        <div><p className="eyebrow">Saved questions</p><h2>Global saved list</h2></div>
        <span className="pill">{savedQuestions.length} saved</span>
      </div>

      <div className="question-list">
        {savedQuestions.map((item) => (
          <article className="question-card" key={item.id}>
            <div className="card-top">
              <div>
                <h3>{item.title}</h3>
                <p className="muted">Saved by: {item.savedBy}</p>
              </div>
              <div className="badges">
                <span className="badge module">{item.module}</span>
                <span className="badge difficulty">{item.difficulty}</span>
              </div>
            </div>

            <div className="card-actions">
              <button className="ghost-btn" onClick={() => handleRemoveSavedQuestion(item.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderHistory = () => (
    <section className="panel">
      <div className="section-heading">
        <div><p className="eyebrow">History</p><h2>Public test history</h2></div>
        <span className="pill">{historyItems.length} records</span>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Test</th>
              <th>Score</th>
              <th>Status</th>
              <th>Started</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr key={item.id}>
                <td>{item.fullName}</td>
                <td>{item.testName}</td>
                <td>{item.score}/1600</td>
                <td>{item.status}</td>
                <td>{item.startedAt}</td>
                <td>
                  <div className="table-actions">
                    <button className="ghost-btn small-btn" onClick={() => openPasswordModal({ kind: "review-history", id: item.id })}>Review</button>
                    <button className="danger-btn small-btn" onClick={() => openPasswordModal({ kind: "delete-history", id: item.id })}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderExam = () => {
    if (!examSession) return null;

    if (showBreakScreen) {
      return (
        <section className="panel break-panel full-height-panel">
          <p className="eyebrow">Break</p>
          <h2>10-minute break</h2>
          <div className="break-timer">{formatTime(examSession.breakTimeLeft)}</div>
          <div className="button-row center-row">
            <button className="primary-btn" onClick={resumeAfterBreak}>Continue to Math</button>
          </div>
        </section>
      );
    }

    if (showReviewPage && examSession?.reviewReady) {
      const reviewQuestions = getFilteredReviewQuestions();
      const selectedQuestion =
        reviewQuestions.find((q) => q.id === selectedReviewQuestionId) || reviewQuestions[0];

      return (
        <section className="panel review-shell full-height-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Review page</p>
              <h2>Question-by-question review</h2>
            </div>
            <span className="pill">{reviewQuestions.length} shown</span>
          </div>

          <div className="review-toolbar">
            <button className={reviewFilter === "all" ? "toggle-chip active" : "toggle-chip"} onClick={() => setReviewFilter("all")}>All</button>
            <button className={reviewFilter === "correct" ? "toggle-chip active" : "toggle-chip"} onClick={() => setReviewFilter("correct")}>Correct</button>
            <button className={reviewFilter === "wrong" ? "toggle-chip active" : "toggle-chip"} onClick={() => setReviewFilter("wrong")}>Wrong</button>
            <button className={reviewFilter === "unanswered" ? "toggle-chip active" : "toggle-chip"} onClick={() => setReviewFilter("unanswered")}>Unanswered</button>
            <button className={reviewFilter === "marked" ? "toggle-chip active" : "toggle-chip"} onClick={() => setReviewFilter("marked")}>Marked</button>
          </div>

          <div className="review-layout">
            <aside className="review-sidebar">
              {reviewQuestions.map((q, index) => {
                const userAnswer = examSession.answers[q.id];
                const correct = isQuestionCorrect(q);
                const unanswered = userAnswer === undefined || userAnswer === "";

                return (
                  <button
                    key={q.id}
                    className={
                      selectedQuestion?.id === q.id
                        ? "review-jump active"
                        : unanswered
                        ? "review-jump unanswered"
                        : correct
                        ? "review-jump correct"
                        : "review-jump wrong"
                    }
                    onClick={() => setSelectedReviewQuestionId(q.id)}
                  >
                    <span>Q{index + 1}</span>
                    <small>{q.module}</small>
                  </button>
                );
              })}
            </aside>

            <div className="review-main">
              {selectedQuestion ? (
                <>
                  <div className="card-top">
                    <div>
                      <h3>Question review</h3>
                      <p className="muted">{selectedQuestion.module}</p>
                    </div>
                    <div className="badges">
                      <span className={isQuestionCorrect(selectedQuestion) ? "badge success" : "badge danger"}>
                        {isQuestionCorrect(selectedQuestion) ? "Correct" : "Not correct"}
                      </span>
                    </div>
                  </div>

                  <div className="exam-passage">
                    <p>{selectedQuestion.stem}</p>
                  </div>

                  {selectedQuestion.type === "Multiple Choice" ? (
                    <div className="exam-options">
                      {selectedQuestion.options.map((option, idx) => {
                        const isCorrectOption = option === selectedQuestion.correctAnswer;
                        const isUserOption = examSession.answers[selectedQuestion.id] === option;

                        return (
                          <div
                            key={option}
                            className={
                              isCorrectOption
                                ? "exam-option correct-review"
                                : isUserOption
                                ? "exam-option selected-review"
                                : "exam-option"
                            }
                          >
                            <div className="option-main no-pointer">
                              <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="result-grid">
                      <div className="result-box">
                        <span>Your answer</span>
                        <strong>{examSession.answers[selectedQuestion.id] || "No answer"}</strong>
                      </div>
                      <div className="result-box">
                        <span>Accepted answers</span>
                        <strong>{selectedQuestion.correctAnswer.join(", ")}</strong>
                      </div>
                    </div>
                  )}

                  <div className="result-grid top-gap">
                    <div className="result-box">
                      <span>Your answer</span>
                      <strong>{examSession.answers[selectedQuestion.id] || "No answer"}</strong>
                    </div>
                    <div className="result-box">
                      <span>Correct answer</span>
                      <strong>
                        {Array.isArray(selectedQuestion.correctAnswer)
                          ? selectedQuestion.correctAnswer.join(", ")
                          : selectedQuestion.correctAnswer}
                      </strong>
                    </div>
                    <div className="result-box">
                      <span>Marked</span>
                      <strong>{examSession.marked[selectedQuestion.id] ? "Yes" : "No"}</strong>
                    </div>
                  </div>

                  <div className="tool-panel top-gap">
                    <p className="sidebar-title">Explanation</p>
                    <p className="muted">
                      {selectedQuestion.explanation || "No explanation added for this question yet."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-flagged">
                  <p className="muted">No questions in this filter.</p>
                </div>
              )}

              <div className="button-row top-gap">
                <button className="ghost-btn" onClick={() => setShowReviewPage(false)}>
                  Back to result summary
                </button>
                <button className="primary-btn" onClick={exitExam}>
                  Exit review
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (showResultScreen && examSession.finalSummary) {
      const s = examSession.finalSummary;
      const totalQuestions = s.rwTotal + s.mathTotal;
      const totalCorrect = s.rwCorrect + s.mathCorrect;
      const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      return (
        <section className="panel result-screen full-height-panel fade-in-screen">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{examSession.mode}</h2>
            </div>
            <span className="pill">Completed</span>
          </div>

          <div className="result-grid">
            <div className="result-box"><span>Total score</span><strong>{s.totalScore}/1600</strong></div>
            <div className="result-box"><span>Reading and Writing score</span><strong>{s.readingAndWritingScore}/800</strong></div>
            <div className="result-box"><span>Math score</span><strong>{s.mathScore}/800</strong></div>
          </div>

          <div className="result-grid">
            <div className="result-box"><span>Accuracy</span><strong>{accuracy}%</strong></div>
            <div className="result-box"><span>Reading and Writing correct</span><strong>{s.rwCorrect} / {s.rwTotal}</strong></div>
            <div className="result-box"><span>Math correct</span><strong>{s.mathCorrect} / {s.mathTotal}</strong></div>
          </div>

          <div className="button-row top-gap">
            <button
              className="primary-btn"
              onClick={() => {
                setShowReviewPage(true);
                const first = getAllSessionQuestions()[0];
                setSelectedReviewQuestionId(first?.id || null);
              }}
            >
              Open review page
            </button>
            <button className="ghost-btn" onClick={exitExam}>Close session</button>
          </div>
        </section>
      );
    }

    if (!currentQuestion) return null;

    const isMathModule = currentModuleName.includes("Math");
    const actualCurrentIndex = currentQuestions.findIndex((q) => q.id === currentQuestion.id);
    const isLastQuestion = actualCurrentIndex === currentQuestions.length - 1;

    return (
      <section className="panel exam-shell full-height-panel fade-in-screen">
        {moduleTransition ? (
          <div className="module-transition-overlay">
            <div className="module-transition-card">
              <p className="eyebrow">Module transition</p>
              <h3>{moduleTransition.title}</h3>
              <p>{moduleTransition.subtitle}</p>
            </div>
          </div>
        ) : null}

        <div className="exam-header">
          <div>
            <p className="eyebrow">Testing session</p>
            <h2>{examSession.mode}</h2>
            <p className="muted">
              {currentModuleName} • {actualCurrentIndex + 1}/{currentQuestions.length}
            </p>
          </div>

          <div className="exam-tools">
            <div className="timer-box">{formatTime(currentTimeLeft)}</div>
            {isMathModule ? (
              <>
                <button className="ghost-btn small-btn" onClick={() => setShowCalculator((prev) => !prev)}>
                  {showCalculator ? "Hide Desmos" : "Open Desmos"}
                </button>
                <button className="ghost-btn small-btn" onClick={() => setShowReference((prev) => !prev)}>
                  Reference
                </button>
              </>
            ) : null}
          </div>
        </div>

        {showReference && isMathModule ? (
          <div className="tool-panel">
            <p className="sidebar-title">Math reference sheet</p>
            <ul className="reference-list">
              {referenceFormulas.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ) : null}

        <div className="exam-layout">
          <aside className="exam-sidebar">
            <p className="sidebar-title">Question Menu</p>
            <div className="question-menu">
              {currentQuestions.map((q, idx) => {
                const isMarked = examSession.marked[q.id];
                const isAnswered = examSession.answers[q.id] !== undefined && examSession.answers[q.id] !== "";

                return (
                  <button
                    key={q.id}
                    className={
                      examIndex === idx
                        ? "question-jump active"
                        : isMarked
                        ? "question-jump marked"
                        : isAnswered
                        ? "question-jump answered"
                        : "question-jump"
                    }
                    onClick={() => setExamIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="exam-side-stats">
              <p>Current module: {currentModuleName}</p>
              <p>Answered: {currentQuestions.filter((q) => examSession.answers[q.id] !== undefined && examSession.answers[q.id] !== "").length}</p>
              <p>Marked: {currentQuestions.filter((q) => examSession.marked[q.id]).length}</p>
            </div>
          </aside>

          <div className="exam-main">
            <div className="card-top">
              <div>
                <h3>Question {actualCurrentIndex + 1}</h3>
                <p className="muted">{currentModuleName}</p>
              </div>
              <div className="card-actions compact">
                <button className="ghost-btn small-btn" onClick={() => toggleMarkForReview(currentQuestion.id)}>
                  {examSession.marked[currentQuestion.id] ? "Unmark" : "Mark for review"}
                </button>
                <button className="ghost-btn small-btn" onClick={() => toggleSavedDuringExam(currentQuestion)}>
                  {examSession.savedDuringExam[currentQuestion.id] ? "Unsave" : "Save"}
                </button>
              </div>
            </div>

            <div
              ref={passageRef}
              className="exam-passage"
              onMouseUp={handlePassageMouseUp}
              onClick={handleHighlightClick}
            >
              {currentQuestion.stem}
            </div>

            {currentQuestion.type === "Multiple Choice" ? (
              <div className="exam-options">
                {currentQuestion.options.map((option, idx) => {
                  const selected = examSession.answers[currentQuestion.id] === option;
                  const eliminated = (examSession.eliminated[currentQuestion.id] || []).includes(option);

                  return (
                    <div
                      key={option}
                      className={
                        selected
                          ? "exam-option selected"
                          : eliminated
                          ? "exam-option eliminated"
                          : "exam-option"
                      }
                    >
                      <button className="option-main" onClick={() => handleAnswerChange(currentQuestion.id, option)}>
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                      </button>
                      <button className="option-eliminate" onClick={() => toggleOptionElimination(currentQuestion.id, option)}>
                        {eliminated ? "Undo" : "Eliminate"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <label>Your answer</label>
                <input
                  type="text"
                  placeholder="Type your numeric answer"
                  value={examSession.answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              </div>
            )}

            <div className="button-row top-gap">
              <button className="ghost-btn" onClick={() => setExamIndex((prev) => Math.max(prev - 1, 0))} disabled={examIndex === 0}>
                Previous
              </button>
              {isLastQuestion ? (
                <button className="primary-btn" onClick={submitCurrentModule}>
                  Submit Module
                </button>
              ) : (
                <button className="primary-btn" onClick={() => setExamIndex((prev) => Math.min(prev + 1, currentQuestions.length - 1))}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {highlightToolbar.visible ? (
          <div
            className="highlight-floating-toolbar"
            style={{
              left: highlightToolbar.x,
              top: highlightToolbar.y,
            }}
          >
            <button className="highlight-swatch yellow" onClick={applyHighlightFromToolbar} aria-label="Apply yellow highlight" />
          </div>
        ) : null}

        {activeHighlightDelete.visible ? (
          <div
            className="highlight-delete-pop"
            style={{
              left: activeHighlightDelete.x,
              top: activeHighlightDelete.y,
            }}
          >
            <button className="trash-btn" onClick={removeActiveHighlight} aria-label="Remove highlight">
              🗑
            </button>
          </div>
        ) : null}

        {showCalculator && isMathModule ? (
          <div
            className="floating-calculator"
            style={{
              left: calculatorRect.x,
              top: calculatorRect.y,
              width: calculatorRect.width,
              height: calculatorRect.height,
            }}
          >
            <div className="floating-calculator-header" onMouseDown={startDragCalculator}>
              <div className="floating-calculator-title">Calculator</div>
              <div className="floating-calculator-actions">
                <button className="calc-icon-btn" onClick={shrinkCalculator}>－</button>
                <button className="calc-icon-btn" onClick={expandCalculator}>＋</button>
                <button className="calc-icon-btn" onClick={() => setShowCalculator(false)}>✕</button>
              </div>
            </div>
            <div className="floating-calculator-body">
              <iframe
                title="Desmos Graphing Calculator"
                src="https://www.desmos.com/calculator?lang=en"
                className="calculator-frame"
                allow="fullscreen"
              />
            </div>
            <div className="calculator-resize-handle" onMouseDown={startResizeCalculator} />
          </div>
        ) : null}
      </section>
    );
  };

  const isExamLikeScreen = !!examSession;

  return (
    <div className={isExamLikeScreen ? "app-shell exam-mode" : "app-shell"}>
      {!isExamLikeScreen ? (
        <aside className="sidebar">
          <div className="sidebar-head">
            <div>
              <p className="eyebrow">SAT Platform</p>
              <h1>Question Bank</h1>
              <p className="muted">Add, search, organize, save, and start SAT practice flows.</p>
            </div>

            <div className="theme-switch">
              <button className={theme === "light" ? "toggle-chip active" : "toggle-chip"} onClick={() => setTheme("light")}>
                Light
              </button>
              <button className={theme === "dark" ? "toggle-chip active" : "toggle-chip"} onClick={() => setTheme("dark")}>
                Dark
              </button>
            </div>
          </div>

          <div className="sidebar-tabs">
            <button className={activeTab === "question-bank" ? "side-tab active" : "side-tab"} onClick={() => setActiveTab("question-bank")}>Question Bank</button>
            <button className={activeTab === "test-builder" ? "side-tab active" : "side-tab"} onClick={() => setActiveTab("test-builder")}>Test Builder</button>
            <button className={activeTab === "dashboard" ? "side-tab active" : "side-tab"} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
            <button className={activeTab === "saved-questions" ? "side-tab active" : "side-tab"} onClick={() => setActiveTab("saved-questions")}>Saved Questions</button>
            <button className={activeTab === "history" ? "side-tab active" : "side-tab"} onClick={() => setActiveTab("history")}>History</button>
          </div>

          <div className="stats-card"><span>Total questions</span><strong>{questions.length}</strong></div>
          <div className="stats-card"><span>Custom tests</span><strong>{tests.length}</strong></div>
          <div className="stats-card"><span>Saved questions</span><strong>{savedQuestions.length}</strong></div>
        </aside>
      ) : null}

      <main className={isExamLikeScreen ? "main-content exam-main-content only-exam-main" : "main-content"}>
        {isExamLikeScreen ? (
          renderExam()
        ) : (
          <>
            {activeTab === "question-bank" && renderQuestionBank()}
            {activeTab === "test-builder" && renderTestBuilder()}
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "saved-questions" && renderSavedQuestions()}
            {activeTab === "history" && renderHistory()}
          </>
        )}
      </main>

      {modalOpen ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="eyebrow">Password required</p>
            <h3>Confirm protected action</h3>
            <p className="muted modal-text">Enter the correct password to continue.</p>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
            <div className="button-row">
              <button className="primary-btn" onClick={confirmPasswordAction}>Confirm</button>
              <button className="ghost-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}

      {startModalOpen ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="eyebrow">Start test</p>
            <h3>{startMode}</h3>
            <p className="muted modal-text">Enter your full name and set a session password.</p>

            <div className="question-form">
              <div>
                <label>Full name</label>
                <input value={startForm.fullName} onChange={(e) => setStartForm((prev) => ({ ...prev, fullName: e.target.value }))} />
              </div>
              <div>
                <label>Session password</label>
                <input
                  type="password"
                  value={startForm.sessionPassword}
                  onChange={(e) => setStartForm((prev) => ({ ...prev, sessionPassword: e.target.value }))}
                />
              </div>
              <div className="button-row">
                <button className="primary-btn" onClick={handleStartTest}>Create session</button>
                <button className="ghost-btn" onClick={closeStartModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
