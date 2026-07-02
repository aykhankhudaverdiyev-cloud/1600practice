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
    explanation:
      "“Triggered” best fits because the decrease in biodiversity can be directly tied to the presence of humans.",
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
      `"All day long [the soldiers] rode through the canyon, up and down the steep, round hills, dirty and bald as a man's head, hill after hill in endless succession."`,
      `"[The soldiers] entered the streets of Juchipila as the church bells rang, loud and joyfully, with that peculiar tone that thrills every mountaineer."`,
      `"Juchipila rose in the distance, white, bathed in sunlight, shining in the midst of a thick forest at the foot of a proud, lofty mountain."`,
      `"The sierra is clad in gala colors. Over its inaccessible peaks the opalescent fog settles like a snowy veil on the forehead of a bride."`,
    ],
    correctAnswer:
      `"Juchipila rose in the distance, white, bathed in sunlight, shining in the midst of a thick forest at the foot of a proud, lofty mountain."`,
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
    stem: `Which choice best describes the function of the underlined sentence in the text as a whole?`,
    passage: `The Times [a British newspaper], replying to some foreign strictures on the dress, looks, and behavior of the English abroad, urges that the English ideal is that everyone should be free to do and to look just as he likes.
But culture indefatigably tries, not to make what each raw person may like the rule by which he fashions himself; but to draw ever nearer to a sense of what is indeed beautiful, graceful, and becoming, and to get the raw person to like that.`,
    underlinedText:
      "The Times [a British newspaper], replying to some foreign strictures on the dress, looks, and behavior of the English abroad, urges that the English ideal is that everyone should be free to do and to look just as he likes.",
    passageImageUrl: "",
    options: [
      "It suggests that opinions regarding culture change over time.",
      "It asserts that the English are not as well known for their sense of taste as they ought to be.",
      "It details an example that supports the author’s primary claim.",
      "It presents an opinion with which the author disagrees.",
    ],
    optionImageUrls: ["", "", "", ""],
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
  passage: "",
  underlinedText: "",
  passageImageUrl: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  optionAImageUrl: "",
  optionBImageUrl: "",
  optionCImageUrl: "",
  optionDImageUrl: "",
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

function getQuestionLabel(question) {
  const text = (question?.stem || "").replace(/\s+/g, " ").trim();
  if (!text) return `Question #${question?.id ?? ""}`;
  return text.length > 72 ? `${text.slice(0, 72)}…` : text;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderPassageContent(question) {
  const rawText = question?.passage || question?.stem || "";
  const underlinedText = question?.underlinedText?.trim();

  if (!underlinedText || !rawText.includes(underlinedText)) {
    return rawText;
  }

  const parts = rawText.split(new RegExp(`(${escapeRegExp(underlinedText)})`, "g"));

  return parts.map((part, index) =>
    part === underlinedText ? (
      <span key={`under-${index}`} className="passage-underline">
        {part}
      </span>
    ) : (
      <span key={`plain-${index}`}>{part}</span>
    )
  );
}

function getQuestionPrompt(question) {
  const stem = (question?.stem || "").trim();
  if (!stem) return "Question";
  const parts = stem.split("\n\n");
  return parts[parts.length - 1]?.trim() || stem;
}

function getPassageOnly(question) {
  if (question?.passage?.trim()) return question.passage.trim();

  const stem = (question?.stem || "").trim();
  if (!stem) return "";

  const parts = stem.split("\n\n");
  if (parts.length <= 1) return stem;
  return parts.slice(0, -1).join("\n\n").trim();
}

function countAnsweredQuestions(questions, answers) {
  return questions.reduce((count, question) => {
    const value = answers?.[question.id];
    if (value === undefined || value === null || String(value).trim() === "") return count;
    return count + 1;
  }, 0);
}

function App() {
  const [activeTab, setActiveTab] = usePersistentState("sat_active_tab_v1", "question-bank");
  const [questions, setQuestions] = usePersistentState("sat_questions_v1", seedQuestions);
  const [tests, setTests] = usePersistentState("sat_tests_v1", seedTests);
  const [savedQuestions, setSavedQuestions] = usePersistentState(
    "sat_saved_questions_v1",
    seedSavedQuestions
  );
  const [historyItems, setHistoryItems] = usePersistentState("sat_history_v1", seedHistory);

  const [search, setSearch] = usePersistentState("sat_search_v1", "");
  const [selectedModule, setSelectedModule] = usePersistentState(
    "sat_selected_module_v1",
    "All Modules"
  );
  const [selectedDifficulty, setSelectedDifficulty] = usePersistentState(
    "sat_selected_difficulty_v1",
    "All Levels"
  );

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
  const [showResultScreen, setShowResultScreen] = usePersistentState(
    "sat_show_result_screen_v1",
    false
  );
  const [showBreakScreen, setShowBreakScreen] = usePersistentState(
    "sat_show_break_screen_v1",
    false
  );
  const [showReviewPage, setShowReviewPage] = usePersistentState(
    "sat_show_review_page_v1",
    false
  );
  const [reviewFilter, setReviewFilter] = usePersistentState("sat_review_filter_v1", "all");
  const [selectedReviewQuestionId, setSelectedReviewQuestionId] = usePersistentState(
    "sat_selected_review_question_id_v1",
    null
  );

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
      const matchesSearch = q.stem.toLowerCase().includes(search.toLowerCase());
      const matchesModule = selectedModule === "All Modules" || q.module === selectedModule;
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

    const optionImageUrls = isMCQ
      ? [
          form.optionAImageUrl.trim(),
          form.optionBImageUrl.trim(),
          form.optionCImageUrl.trim(),
          form.optionDImageUrl.trim(),
        ]
      : [];

    const selectedIndex = Number(form.correctOptionIndex);

    return {
      module: form.module,
      difficulty: form.difficulty,
      type: form.type,
      stem: form.stem.trim(),
      passage: form.passage.trim(),
      underlinedText: form.underlinedText.trim(),
      passageImageUrl: form.passageImageUrl.trim(),
      options: isMCQ ? options.filter(Boolean) : [],
      optionImageUrls: isMCQ ? optionImageUrls.slice(0, options.length) : [],
      correctAnswer: isMCQ
        ? options[selectedIndex] || ""
        : form.freeResponseAnswers
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      explanation: form.explanation.trim(),
    };
  };

  const validateQuestionPayload = (payload) => {
    if (!payload.stem) return "Question text is required.";
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
      module: question.module,
      difficulty: question.difficulty,
      type: question.type,
      stem: question.stem || "",
      passage: question.passage || "",
      underlinedText: question.underlinedText || "",
      passageImageUrl: question.passageImageUrl || "",
      optionA: question.options?.[0] || "",
      optionB: question.options?.[1] || "",
      optionC: question.options?.[2] || "",
      optionD: question.options?.[3] || "",
      optionAImageUrl: question.optionImageUrls?.[0] || "",
      optionBImageUrl: question.optionImageUrls?.[1] || "",
      optionCImageUrl: question.optionImageUrls?.[2] || "",
      optionDImageUrl: question.optionImageUrls?.[3] || "",
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
        label: getQuestionLabel(question),
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
        status: "In Progress",
        reviewPassword: startForm.sessionPassword.trim(),
        startedAt: new Date().toLocaleString(),
        currentModule: moduleOrder[0],
        currentQuestionIndex: 0,
        progressLabel: `0 / ${moduleOrder.reduce(
          (sum, moduleName) => sum + (built[moduleName] || []).length,
          0
        )}`,
        savedAt: "",
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

  const saveCurrentProgress = () => {
    if (!examSession) return;

    const answeredCount = examSession.moduleOrder.reduce((sum, moduleName) => {
      const moduleQuestions = examSession.sections[moduleName] || [];
      return sum + countAnsweredQuestions(moduleQuestions, examSession.answers);
    }, 0);

    const totalCount = examSession.moduleOrder.reduce((sum, moduleName) => {
      return sum + (examSession.sections[moduleName] || []).length;
    }, 0);

    setHistoryItems((prev) =>
      prev.map((item) =>
        item.id === examSession.sessionId
          ? {
              ...item,
              status: "In Progress",
              score: item.score || 0,
              currentModule: examSession.currentModule,
              currentQuestionIndex: examIndex,
              progressLabel: `${answeredCount} / ${totalCount}`,
              savedAt: new Date().toLocaleString(),
            }
          : item
      )
    );

    setActiveTab("dashboard");
    setShowBreakScreen(false);
    setShowResultScreen(false);
    setShowReviewPage(false);
    setShowCalculator(false);
    setShowReference(false);
    setHighlightToolbar({ visible: false, x: 0, y: 0 });
    setActiveHighlightDelete({ visible: false, x: 0, y: 0, node: null });
    alert("Progress saved.");
  };

  const continueSavedSession = (historyId) => {
    const historyItem = historyItems.find((item) => item.id === historyId);
    if (!historyItem || !examSession || examSession.sessionId !== historyId) {
      alert("Saved session data was not found in local storage.");
      return;
    }

    const currentModule = historyItem.currentModule || examSession.currentModule;
    const nextIndex =
      typeof historyItem.currentQuestionIndex === "number"
        ? historyItem.currentQuestionIndex
        : 0;

    setExamSession((prev) =>
      prev
        ? {
            ...prev,
            currentModule,
          }
        : prev
    );

    setExamIndex(nextIndex);
    setShowBreakScreen(false);
    setShowResultScreen(false);
    setShowReviewPage(false);
    setActiveTab("dashboard");
    setShowCalculator(false);
    setShowReference(false);
    setModuleTransition({
      title: currentModule,
      subtitle: "Continuing your saved session",
    });
  };
    const handleAnswerChange = (questionId, value) => {
    if (!examSession) return;
    setExamSession((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  };

  const toggleMarkForReview = (questionId) => {
    if (!examSession) return;
    setExamSession((prev) => ({
      ...prev,
      marked: { ...prev.marked, [questionId]: !prev.marked[questionId] },
    }));
  };

  const toggleOptionElimination = (questionId, option) => {
    if (!examSession) return;
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
    if (!examSession) return;
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

  const applyHighlightFromToolbar = (mode = "yellow") => {
    if (!savedSelectionRef.current) return;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionRef.current);

    try {
      const wrapper = document.createElement("span");
      wrapper.className =
        mode === "underline"
          ? "highlight-chip underline-mark"
          : `highlight-chip ${mode}`;

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
    return currentIndex >= 0 && currentIndex + 1 < session.moduleOrder.length
      ? session.moduleOrder[currentIndex + 1]
      : null;
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
    if (!examSession) return;
    const nextModule = getNextModuleAfter(examSession, "RW Module 2");
    if (!nextModule) {
      setShowBreakScreen(false);
      return;
    }
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
          ? {
              ...item,
              score: totalScore,
              status: "Completed",
            }
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
    return Array.isArray(question.correctAnswer)
      ? question.correctAnswer.map((item) => normalizeText(item)).includes(normalizeText(userAnswer))
      : false;
  };

  const getAllSessionQuestions = () => {
    if (!examSession) return [];
    return examSession.moduleOrder.flatMap(
      (moduleName) => examSession.sections[moduleName] || []
    );
  };

  const getFilteredReviewQuestions = () => {
    const all = getAllSessionQuestions();
    if (reviewFilter === "correct") return all.filter((q) => isQuestionCorrect(q));
    if (reviewFilter === "wrong")
      return all.filter((q) => {
        const userAnswer = examSession?.answers[q.id];
        return userAnswer !== undefined && userAnswer !== "" && !isQuestionCorrect(q);
      });
    if (reviewFilter === "unanswered")
      return all.filter((q) => {
        const userAnswer = examSession?.answers[q.id];
        return userAnswer === undefined || userAnswer === "";
      });
    if (reviewFilter === "marked")
      return all.filter((q) => examSession?.marked[q.id]);
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
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{editingId ? "Edit question" : "Create question"}</p>
          <h2>{editingId ? "Update SAT question" : "New SAT question"}</h2>
        </div>
        <div>
          {editingId ? (
            <button className="ghost-btn" onClick={resetQuestionForm}>
              Cancel editing
            </button>
          ) : null}
        </div>
      </div>

      <form className="question-form" onSubmit={handleSubmit}>
        <div className="grid two">
          <div>
            <label>Question type</label>
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option>Multiple Choice</option>
              <option>Free Response</option>
            </select>
          </div>
          <div>
            <label>Module</label>
            <select
              value={form.module}
              onChange={(e) => handleChange("module", e.target.value)}
            >
              <option>RW Module 1</option>
              <option>RW Module 2</option>
              <option>Math Module 1</option>
              <option>Math Module 2</option>
            </select>
          </div>
        </div>

        <div className="grid two">
          <div>
            <label>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label>Question passage text</label>
          <textarea
            rows={6}
            value={form.stem}
            onChange={(e) => handleChange("stem", e.target.value)}
          />
        </div>

        <div>
          <label>Passage (optional)</label>
          <textarea
            rows={8}
            value={form.passage}
            onChange={(e) => handleChange("passage", e.target.value)}
            placeholder="Paste the full passage here"
          />
        </div>

        <div className="grid two">
          <div>
            <label>Underlined text inside passage (optional)</label>
            <input
              value={form.underlinedText}
              onChange={(e) => handleChange("underlinedText", e.target.value)}
              placeholder="Paste the exact text that should appear underlined"
            />
          </div>
          <div>
            <label>Passage image URL (optional)</label>
            <input
              value={form.passageImageUrl}
              onChange={(e) => handleChange("passageImageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {form.type === "Multiple Choice" ? (
          <>
            <div className="grid two">
              <div>
                <label>Choice A</label>
                <input
                  value={form.optionA}
                  onChange={(e) => handleChange("optionA", e.target.value)}
                />
              </div>
              <div>
                <label>Choice B</label>
                <input
                  value={form.optionB}
                  onChange={(e) => handleChange("optionB", e.target.value)}
                />
              </div>
            </div>
            <div className="grid two">
              <div>
                <label>Choice C</label>
                <input
                  value={form.optionC}
                  onChange={(e) => handleChange("optionC", e.target.value)}
                />
              </div>
              <div>
                <label>Choice D</label>
                <input
                  value={form.optionD}
                  onChange={(e) => handleChange("optionD", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>Correct option</label>
              <select
                value={form.correctOptionIndex}
                onChange={(e) => handleChange("correctOptionIndex", e.target.value)}
              >
                <option value="">Select the correct option</option>
                {[form.optionA, form.optionB, form.optionC, form.optionD].map(
                  (option, index) => (
                    <option key={index} value={index} disabled={!option.trim()}>
                      {String.fromCharCode(65 + index)}. {option || ""}
                    </option>
                  )
                )}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label>Accepted answers</label>
            <input
              value={form.freeResponseAnswers}
              onChange={(e) => handleChange("freeResponseAnswers", e.target.value)}
              placeholder="List acceptable answers separated by commas"
            />
          </div>
        )}

        <div>
          <label>Explanation (optional)</label>
          <textarea
            rows={4}
            value={form.explanation}
            onChange={(e) => handleChange("explanation", e.target.value)}
          />
        </div>

        <div className="button-row">
          <button className="primary-btn" type="submit">
            {editingId ? "Save changes" : "Add question"}
          </button>
          <button className="ghost-btn" type="button" onClick={resetQuestionForm}>
            Reset form
          </button>
        </div>
      </form>
    </section>
  );

  const renderQuestionLibrary = () => (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Library</p>
          <h2>Stored questions</h2>
        </div>
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
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            {moduleOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficultyOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="question-list">
        {filteredQuestions.map((question) => (
          <article className="question-card" key={question.id}>
            <div className="card-top">
              <div>
                <h3>{getQuestionLabel(question)}</h3>
                <p className="muted">{question.stem}</p>
              </div>
              <div className="badges">
                <span className="badge module">{question.module}</span>
                <span className="badge difficulty">{question.difficulty}</span>
                <span className="badge type">{question.type}</span>
              </div>
            </div>
            <div className="button-row">
              <button className="ghost-btn" onClick={() => handleEditClick(question)}>
                Edit
              </button>
              <button className="ghost-btn" onClick={() => handleSaveQuestion(question)}>
                Save question
              </button>
              <button
                className="danger-btn"
                onClick={() => handleDeleteClick(question.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderModuleBuilder = (moduleName) => {
    const selectedIds = testForm.moduleQuestions[moduleName] || [];
    const moduleBank = questions.filter((q) => q.module === moduleName);

    return (
      <div className="module-builder-card" key={moduleName}>
        <div className="module-builder-header">
          <h3>{moduleName}</h3>
          <p className="muted">
            {selectedIds.length} questions in order
          </p>
        </div>

        <div className="module-builder-grid">
          <div>
            <p className="sidebar-title">Question bank for this module</p>
            <div className="builder-question-list">
              {moduleBank.map((question) => {
                const alreadySelected = selectedIds.includes(question.id);
                return (
                  <div
                    key={question.id}
                    className={
                      alreadySelected ? "builder-item selected-builder-item" : "builder-item"
                    }
                  >
                    <div className="builder-item-copy">
                      <strong>{getQuestionLabel(question)}</strong>
                      <p>{question.stem}</p>
                      <small>
                        {question.type} • {question.difficulty}
                      </small>
                    </div>
                    <button
                      type="button"
                      className={
                        alreadySelected
                          ? "ghost-btn small-btn disabled-btn"
                          : "ghost-btn small-btn"
                      }
                      onClick={() =>
                        addQuestionToCustomModule(moduleName, question.id)
                      }
                      disabled={alreadySelected}
                    >
                      {alreadySelected ? "Selected" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="sidebar-title">Selected order</p>
            <div className="builder-selected-list">
              {selectedIds.length ? (
                selectedIds.map((id, index) => {
                  const q = questions.find((item) => item.id === id);
                  if (!q) return null;
                  return (
                    <div className="selected-row" key={`${moduleName}-${index}-${id}`}>
                      <div className="builder-item-copy">
                        <strong>
                          {index + 1}. {getQuestionLabel(q)}
                        </strong>
                        <p>{q.stem}</p>
                        <small>{q.type}</small>
                      </div>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="ghost-btn small-btn"
                          onClick={() =>
                            moveQuestionWithinCustomModule(moduleName, index, -1)
                          }
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="ghost-btn small-btn"
                          onClick={() =>
                            moveQuestionWithinCustomModule(moduleName, index, 1)
                          }
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="danger-btn small-btn"
                          onClick={() =>
                            removeQuestionFromCustomModule(moduleName, index)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="muted">No questions selected yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomTests = () => (
    <section className="panel full-height-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Custom tests</p>
          <h2>Build your own SAT set</h2>
        </div>
        <p className="muted">
          Choose modules, arrange questions, and lock the test with a password.
        </p>
      </div>

      <form className="question-form" onSubmit={handleCreateTest}>
        <div className="grid two">
          <div>
            <label>Custom test name</label>
            <input
              value={testForm.name}
              onChange={(e) => handleTestFormChange("name", e.target.value)}
              placeholder="e.g., RW Drill #1"
            />
          </div>
          <div>
            <label>Test password</label>
            <input
              value={testForm.password}
              onChange={(e) => handleTestFormChange("password", e.target.value)}
              placeholder="Password to delete / verify"
            />
          </div>
        </div>

        <div>
          <label>Active modules</label>
          <div className="toggle-grid">
            {orderedModules.map((moduleName) => (
              <button
                key={moduleName}
                type="button"
                className={
                  testForm.activeModules.includes(moduleName)
                    ? "toggle-chip active"
                    : "toggle-chip"
                }
                onClick={() => toggleCustomModule(moduleName)}
              >
                {moduleName}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-modules-stack">
          {testForm.activeModules.map((moduleName) => renderModuleBuilder(moduleName))}
        </div>

        <div className="button-row top-gap">
          <button className="primary-btn" type="submit">
            Save custom test
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setTestForm(emptyTestForm)}
          >
            Reset
          </button>
        </div>
      </form>

      <hr style={{ margin: "24px 0", borderColor: "var(--border)" }} />

      <div>
        <p className="sidebar-title">Saved custom tests</p>
        <div className="question-list">
          {tests
            .filter((t) => t.mode === "Custom Test")
            .map((test) => (
              <article className="question-card" key={test.id}>
                <div className="card-top">
                  <div>
                    <h3>{test.name}</h3>
                    <p className="muted">Password: {test.password}</p>
                  </div>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => openStartModal(test.name)}
                  >
                    Start this test
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => handleDeleteTest(test.id)}
                  >
                    Delete test
                  </button>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );

  const renderSavedQuestions = () => (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Saved questions</p>
          <h2>Flagged for later review</h2>
        </div>
      </div>
      <div className="question-list">
        {savedQuestions.length ? (
          savedQuestions.map((item) => {
            const question = questions.find((q) => q.id === item.questionId);
            if (!question) return null;
            return (
              <article className="question-card" key={item.id}>
                <div className="card-top">
                  <div>
                    <h3>{item.label}</h3>
                    <p className="muted">{question.stem}</p>
                  </div>
                  <div className="badges">
                    <span className="badge module">{item.module}</span>
                    <span className="badge difficulty">{item.difficulty}</span>
                  </div>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => handleRemoveSavedQuestion(item.id)}
                  >
                    Remove from saved
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <p className="muted">No saved questions yet.</p>
        )}
      </div>
    </section>
  );

  const renderDashboard = () => (
    <section className="panel full-height-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Exam modes</p>
          <h2>Practice SAT exam</h2>
        </div>
        <p className="muted">
          Choose a full-length test or focus on specific modules before test day.
        </p>
      </div>

      <div className="dashboard-grid">
        {dashboardModes.map((mode) => (
          <div className="mode-card" key={mode}>
            <strong>{mode}</strong>
            <p className="muted">
              {mode === "Randomized Full Length Test"
                ? "Balanced RW and Math modules with official timing."
                : mode.includes("RW")
                ? "Reading & Writing focus."
                : mode.includes("Math")
                ? "Math-only practice."
                : "Custom test built from your own question set."}
            </p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => openStartModal(mode)}
            >
              Start {mode.includes("Randomized") ? "exam" : "session"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderHistory = () => (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">History</p>
          <h2>Past exam sessions</h2>
        </div>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Full name</th>
              <th>Test mode</th>
              <th>Status</th>
              <th>Score</th>
              <th>Started at</th>
              <th>Last saved</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr key={item.id}>
                <td>{item.fullName}</td>
                <td>{item.testName}</td>
                <td>{item.status}</td>
                <td>{item.score}</td>
                <td>{item.startedAt}</td>
                <td>{item.savedAt || "—"}</td>
                <td>{item.progressLabel || "—"}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="ghost-btn small-btn"
                      onClick={() =>
                        openPasswordModal({ kind: "review-history", id: item.id })
                      }
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="ghost-btn small-btn"
                      onClick={() => continueSavedSession(item.id)}
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      className="danger-btn small-btn"
                      onClick={() =>
                        openPasswordModal({ kind: "delete-history", id: item.id })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!historyItems.length && (
              <tr>
                <td colSpan={8} className="muted">
                  No exam history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderExamSidebar = () => {
    if (!examSession) return null;
    const moduleQuestions = examSession.sections[currentModuleName] || [];
    return (
      <aside className="exam-sidebar">
        <p className="sidebar-title">Question navigation</p>
        <div className="question-menu">
          {moduleQuestions.map((q, index) => {
            const isActive = index === examIndex;
            const answered = !!examSession.answers[q.id];
            const marked = !!examSession.marked[q.id];
            const classNames = [
              "question-jump",
              isActive && "active",
              answered && "answered",
              marked && "marked",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={q.id}
                type="button"
                className={classNames}
                onClick={() => setExamIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="exam-side-stats">
          <span>Module: {currentModuleName}</span>
          <span>
            Answered:{" "}
            {moduleQuestions.reduce(
              (count, q) =>
                examSession.answers[q.id] ? count + 1 : count,
              0
            )}{" "}
            / {moduleQuestions.length}
          </span>
        </div>
      </aside>
    );
  };

  const renderExamMain = () => {
    if (!currentQuestion) {
      return (
        <div className="exam-main">
          <p className="muted">No questions loaded for this module.</p>
        </div>
      );
    }

    const options = currentQuestion.options || [];
    const userAnswer = examSession?.answers[currentQuestion.id] || "";
    const eliminated = examSession?.eliminated[currentQuestion.id] || [];

    const basePassage = getPassageOnly(currentQuestion);
    const questionPrompt = getQuestionPrompt(currentQuestion);

    const isMarked = !!examSession?.marked[currentQuestion.id];
    const isSavedLocal = !!examSession?.savedDuringExam[currentQuestion.id];

    return (
      <div className="exam-main">
        <div className="exam-passage" ref={passageRef} onMouseUp={handlePassageMouseUp}>
          {currentQuestion.passageImageUrl ? (
            <div className="passage-image-wrap">
              <img
                src={currentQuestion.passageImageUrl}
                alt="Passage visual"
                className="passage-image"
              />
            </div>
          ) : null}
          {renderPassageContent({
            passage: basePassage,
            underlinedText: currentQuestion.underlinedText,
          })}
        </div>

        <h3>{questionPrompt}</h3>

        <div
          className="exam-options"
          onClick={handleHighlightClick}
        >
          {options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = normalizeText(userAnswer) === normalizeText(option);
            const isEliminated = eliminated.includes(option);

            const classNames = [
              "exam-option",
              isSelected && "selected",
              isEliminated && "eliminated",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div className={classNames} key={option}>
                <button
                  type="button"
                  className="option-main"
                  onClick={() => handleAnswerChange(currentQuestion.id, option)}
                >
                  <div className="option-content">
                    <div className="option-text-line">
                      <strong>{letter}.</strong> {option}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="option-eliminate"
                  onClick={() =>
                    toggleOptionElimination(currentQuestion.id, option)
                  }
                >
                  {isEliminated ? "Restore" : "Eliminate"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="button-row top-gap">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => toggleMarkForReview(currentQuestion.id)}
          >
            {isMarked ? "Unmark" : "Mark for review"}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => toggleSavedDuringExam(currentQuestion)}
          >
            {isSavedLocal ? "Unsave" : "Save question"}
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={submitCurrentModule}
          >
            Submit module
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={saveCurrentProgress}
          >
            Save progress & exit
          </button>
        </div>
      </div>
    );
  };

  const renderResultScreen = () => {
    if (!examSession?.finalSummary) return null;
    const {
      rwCorrect,
      mathCorrect,
      rwTotal,
      mathTotal,
      readingAndWritingScore,
      mathScore,
      totalScore,
    } = examSession.finalSummary;

    return (
      <section className="panel result-screen fade-in-screen">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Results</p>
            <h2>Your SAT practice performance</h2>
          </div>
        </div>

        <div className="result-grid">
          <div className="result-box">
            <span>Total scaled score</span>
            <strong>{totalScore}</strong>
          </div>
          <div className="result-box">
            <span>Reading & Writing</span>
            <strong>
              {readingAndWritingScore} ({rwCorrect}/{rwTotal} correct)
            </strong>
          </div>
          <div className="result-box">
            <span>Math</span>
            <strong>
              {mathScore} ({mathCorrect}/{mathTotal} correct)
            </strong>
          </div>
        </div>

        <div className="button-row top-gap">
          <button
            type="button"
            className="primary-btn"
            onClick={() => setShowReviewPage(true)}
          >
            Review questions
          </button>
          <button type="button" className="ghost-btn" onClick={exitExam}>
            Exit exam
          </button>
        </div>
      </section>
    );
  };

  const renderReviewPage = () => {
    if (!examSession?.reviewReady) {
      return (
        <section className="panel">
          <p className="muted">No completed exam to review yet.</p>
        </section>
      );
    }

    const filtered = getFilteredReviewQuestions();
    const activeReviewQuestion =
      filtered.find((q) => q.id === selectedReviewQuestionId) || filtered[0] || null;

    return (
      <section className="panel review-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Review</p>
            <h2>Analyze your performance</h2>
          </div>
        </div>

        <div className="review-toolbar">
          {["all", "correct", "wrong", "unanswered", "marked"].map((key) => (
            <button
              key={key}
              type="button"
              className={
                reviewFilter === key ? "toggle-chip active" : "toggle-chip"
              }
              onClick={() => setReviewFilter(key)}
            >
              {key === "all"
                ? "All questions"
                : key === "correct"
                ? "Correct"
                : key === "wrong"
                ? "Incorrect"
                : key === "unanswered"
                ? "Unanswered"
                : "Marked"}
            </button>
          ))}
        </div>

        <div className="review-layout">
          <aside className="review-sidebar">
            <p className="sidebar-title">Review navigation</p>
            <div>
              {filtered.map((q) => {
                const userAnswer = examSession?.answers[q.id];
                const correct = isQuestionCorrect(q);
                const statusClass =
                  userAnswer === undefined || userAnswer === ""
                    ? "unanswered"
                    : correct
                    ? "correct"
                    : "wrong";

                const classNames = [
                  "review-jump",
                  statusClass,
                  selectedReviewQuestionId === q.id && "active",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={q.id}
                    type="button"
                    className={classNames}
                    onClick={() => setSelectedReviewQuestionId(q.id)}
                  >
                    <span>{getQuestionLabel(q)}</span>
                    <small>
                      {q.module} • {q.difficulty}
                    </small>
                  </button>
                );
              })}
            </div>
            {!filtered.length && (
              <div className="empty-flagged">
                <p className="muted">No questions match this filter.</p>
              </div>
            )}
          </aside>

          <div className="review-main">
            {activeReviewQuestion ? (
              <>
                <div className="exam-passage">
                  {renderPassageContent(activeReviewQuestion)}
                </div>
                <h3>{getQuestionPrompt(activeReviewQuestion)}</h3>
                <div className="exam-options">
                  {(activeReviewQuestion.options || []).map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const userAnswer = examSession?.answers[activeReviewQuestion.id];
                    const correct = normalizeText(option) ===
                      normalizeText(activeReviewQuestion.correctAnswer);
                    const selected =
                      normalizeText(option) === normalizeText(userAnswer);
                    const classNames = [
                      "exam-option",
                      correct && "correct-review",
                      selected && "selected-review",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <div className={classNames} key={option}>
                        <button className="option-main no-pointer" type="button">
                          <strong>{letter}.</strong> {option}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="muted" style={{ marginTop: "18px" }}>
                  Explanation: {activeReviewQuestion.explanation || "—"}
                </p>
              </>
            ) : (
              <p className="muted">Select a question from the sidebar to review.</p>
            )}
          </div>
        </div>

        <div className="button-row top-gap">
          <button type="button" className="ghost-btn" onClick={exitExam}>
            Exit review
          </button>
        </div>
      </section>
    );
  };

  const renderFloatingCalculator = () => {
    if (!showCalculator) return null;
    return (
      <div
        className="floating-calculator"
        style={{
          left: calculatorRect.x,
          top: calculatorRect.y,
          width: calculatorRect.width,
          height: calculatorRect.height,
        }}
      >
        <div
          className="floating-calculator-header"
          onMouseDown={startDragCalculator}
        >
          <div className="floating-calculator-title">SAT Calculator</div>
          <div className="floating-calculator-actions">
            <button
              type="button"
              className="calc-icon-btn"
              onClick={shrinkCalculator}
            >
              −
            </button>
            <button
              type="button"
              className="calc-icon-btn"
              onClick={expandCalculator}
            >
              +
            </button>
            <button
              type="button"
              className="calc-icon-btn"
              onClick={() => setShowCalculator(false)}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="floating-calculator-body">
          <iframe
            title="SAT calculator"
            className="calculator-frame"
            src="https://www.desmos.com/scientific"
          />
        </div>
        <div
          className="calculator-resize-handle"
          onMouseDown={startResizeCalculator}
        />
      </div>
    );
  };

  const renderThemeToggle = () => (
    <div className="theme-switch">
      <button
        type="button"
        className={theme === "light" ? "toggle-chip active" : "toggle-chip"}
        onClick={() => setTheme("light")}
      >
        Light
      </button>
      <button
        type="button"
        className={theme === "dark" ? "toggle-chip active" : "toggle-chip"}
        onClick={() => setTheme("dark")}
      >
        Dark
      </button>
    </div>
  );

  const renderExamHeader = () => (
    <header className="exam-header">
      <div>
        <p className="eyebrow">Current module</p>
        <h2>{currentModuleName || "No module"}</h2>
      </div>
      <div className="exam-tools">
        <div className="timer-box">{formatTime(currentTimeLeft)}</div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShowCalculator((prev) => !prev)}
        >
          {showCalculator ? "Hide calculator" : "Show calculator"}
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShowReference((prev) => !prev)}
        >
          {showReference ? "Hide reference" : "Reference formulas"}
        </button>
      </div>
    </header>
  );

  const renderReferencePanel = () => {
    if (!showReference) return null;
    return (
      <div className="tool-panel">
        <p className="sidebar-title">Reference formulas</p>
        <ul className="reference-list">
          {referenceFormulas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderExamShell = () => {
    if (!examSession) {
      return (
        <section className="panel">
          <p className="muted">No active exam session. Start a test from the dashboard.</p>
        </section>
      );
    }

    if (showBreakScreen) {
      return (
        <section className="panel break-panel">
          <p className="eyebrow">Scheduled break</p>
          <h2>Take a short break before Math modules</h2>
          <div className="break-timer">
            {formatTime(examSession.breakTimeLeft)}
          </div>
          <p className="muted">
            When the timer reaches zero, your Math module will automatically start.
          </p>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => resumeAfterBreak()}
          >
            Skip break and continue now
          </button>
        </section>
      );
    }

    return (
      <section className="panel exam-shell">
        {renderExamHeader()}
        {renderReferencePanel()}
        <div className="exam-layout">
          {renderExamSidebar()}
          {renderExamMain()}
        </div>
        {renderFloatingCalculator()}
        {moduleTransition && (
          <div className="module-transition-overlay">
            <div className="module-transition-card">
              <p className="eyebrow">Module transition</p>
              <h3>{moduleTransition.title}</h3>
              <p>{moduleTransition.subtitle}</p>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal-card">
          <p className="eyebrow">Protected action</p>
          <h3>Enter password</h3>
          <p className="modal-text">
            This action requires the correct password before it can proceed.
          </p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
          />
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-row top-gap">
            <button
              type="button"
              className="primary-btn"
              onClick={confirmPasswordAction}
            >
              Confirm
            </button>
            <button type="button" className="ghost-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStartModal = () => {
    if (!startModalOpen) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal-card">
          <p className="eyebrow">Start exam</p>
          <h3>{startMode || "Choose mode"}</h3>
          <p className="modal-text">
            Enter your full name and session password so your results and review access
            can be saved.
          </p>
          <div className="question-form">
            <div>
              <label>Full name</label>
              <input
                value={startForm.fullName}
                onChange={(e) =>
                  setStartForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label>Session password</label>
              <input
                type="password"
                value={startForm.sessionPassword}
                onChange={(e) =>
                  setStartForm((prev) => ({
                    ...prev,
                    sessionPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="button-row top-gap">
            <button
              type="button"
              className="primary-btn"
              onClick={handleStartTest}
            >
              Start exam
            </button>
            <button type="button" className="ghost-btn" onClick={closeStartModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-head">
        <p className="eyebrow">SAT Practice Studio</p>
        <h1>1600 Practice</h1>
        <p className="muted">
          Build your own SAT questions, assemble custom tests, and take realistic
          practice exams with full timing and review.
        </p>
        {renderThemeToggle()}
      </div>

      <div className="sidebar-tabs">
        <button
          type="button"
          className={activeTab === "question-bank" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("question-bank")}
        >
          Question builder
        </button>
        <button
          type="button"
          className={activeTab === "library" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("library")}
        >
          Question library
        </button>
        <button
          type="button"
          className={activeTab === "custom-tests" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("custom-tests")}
        >
          Custom tests
        </button>
        <button
          type="button"
          className={activeTab === "saved" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("saved")}
        >
          Saved questions
        </button>
        <button
          type="button"
          className={activeTab === "dashboard" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("dashboard")}
        >
          Exam dashboard
        </button>
        <button
          type="button"
          className={activeTab === "history" ? "side-tab active" : "side-tab"}
          onClick={() => setActiveTab("history")}
        >
          History & results
        </button>
      </div>

      <div className="stats-card">
        <div>
          <span>Total questions</span>
          <strong>{questions.length}</strong>
        </div>
        <div>
          <span>Custom tests</span>
          <strong>{tests.filter((t) => t.mode === "Custom Test").length}</strong>
        </div>
      </div>
    </aside>
  );

  const renderMainContent = () => {
    if (showResultScreen) return renderResultScreen();
    if (showReviewPage) return renderReviewPage();
    if (examSession && (activeTab === "dashboard" || activeTab === "history")) {
      // When exam is active and user is on dashboard/history, still show exam shell
      return renderExamShell();
    }

    if (activeTab === "question-bank") return renderQuestionBank();
    if (activeTab === "library") return renderQuestionLibrary();
    if (activeTab === "custom-tests") return renderCustomTests();
    if (activeTab === "saved") return renderSavedQuestions();
    if (activeTab === "dashboard") return renderDashboard();
    if (activeTab === "history") return renderHistory();
    return renderQuestionBank();
  };

  return (
    <div className={examSession ? "app-shell exam-mode" : "app-shell"}>
      {!examSession && renderSidebar()}
      <main className={examSession ? "exam-main-content only-exam-main" : "main-content"}>
        {renderMainContent()}
      </main>
      {renderModal()}
      {renderStartModal()}
    </div>
  );
}

export default App;
