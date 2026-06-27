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

/* ... davamı sənin App faylındakı kimi qalır, yalnız title yerləri yuxarıda çıxarılıb ... */
