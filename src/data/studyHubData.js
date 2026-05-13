import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileQuestion,
  FileText,
  Flame,
  GraduationCap,
  Layers3,
  Lightbulb,
  LineChart,
  Medal,
  NotebookTabs,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  WandSparkles,
} from "lucide-react";

export const features = [
  {
    icon: WandSparkles,
    title: "AI Generated Tests",
    body: "Create exam-style papers from a topic or uploaded chapter PDF in seconds.",
    tone: "purple",
  },
  {
    icon: FileQuestion,
    title: "Multiple Question Types",
    body: "Mix MCQs, Q&A, true/false, fill-ups, and case-study style prompts.",
    tone: "yellow",
  },
  {
    icon: Brain,
    title: "Deep Explanations",
    body: "Review every answer with correct reasoning and AI tutor support.",
    tone: "green",
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    body: "Track weak topics, accuracy, skipped questions, and improvement trends.",
    tone: "pink",
  },
  {
    icon: ShieldCheck,
    title: "Exam Pattern Mode",
    body: "Deep Mode studies past papers and builds a test around real patterns.",
    tone: "blue",
  },
];

export const benefits = [
  {
    icon: Clock3,
    title: "Save preparation time",
    body: "No more building practice papers manually before each study session.",
  },
  {
    icon: Target,
    title: "Study what matters",
    body: "AI highlights repeated concepts, chapter importance, and likely marks.",
  },
  {
    icon: Lightbulb,
    title: "Understand mistakes",
    body: "Every wrong answer becomes a mini lesson with context and reasoning.",
  },
];

export const dashboardStats = [
  { label: "Tests Created", value: "12", icon: ClipboardList, tone: "green" },
  { label: "Avg. Score", value: "85%", icon: Trophy, tone: "yellow" },
  { label: "Questions Solved", value: "240", icon: CheckCircle2, tone: "pink" },
  { label: "Study Streak", value: "18", icon: Flame, tone: "blue" },
];

export const recentTests = [
  {
    title: "Photosynthesis in Plants",
    meta: "20 MCQ - 10 Q&A - Medium",
    score: "85%",
    time: "2h ago",
    icon: BookOpen,
    tone: "green",
  },
  {
    title: "Cell Structure and Function",
    meta: "15 MCQ - 10 Fill - Hard",
    score: "72%",
    time: "Yesterday",
    icon: Layers3,
    tone: "purple",
  },
  {
    title: "Linear Equations",
    meta: "20 MCQ - 10 True/False - Easy",
    score: "90%",
    time: "2 days ago",
    icon: NotebookTabs,
    tone: "pink",
  },
];

export const deepInsights = [
  {
    icon: BarChart3,
    title: "Pattern Detection",
    body: "AI maps section structure, repeated formats, and mark weight from past papers.",
  },
  {
    icon: Star,
    title: "Important Topics",
    body: "Ranks chapters by recurrence, marks share, and recent exam trend.",
  },
  {
    icon: Medal,
    title: "Marks Distribution",
    body: "Balances MCQ, Q&A, and long-form items around expected paper format.",
  },
  {
    icon: GraduationCap,
    title: "Auto Difficulty",
    body: "Difficulty is adjusted from previous year question complexity.",
  },
];

export const sections = [
  { label: "MCQ", count: 20, answered: 7 },
  { label: "Q&A", count: 10, answered: 0 },
  { label: "Fill in the Blanks", count: 10, answered: 0 },
  { label: "True / False", count: 10, answered: 0 },
];

export const testQuestion = {
  number: 7,
  total: 40,
  type: "MCQ",
  title: "Which of the following is the correct IUPAC name of the compound CH3 - CH2 - CH2 - COOH?",
  marks: "+2.5",
  negative: "-0.625",
  options: [
    { key: "A", label: "Butanoic acid", selected: true },
    { key: "B", label: "Propanoic acid" },
    { key: "C", label: "Pentanoic acid" },
    { key: "D", label: "Ethanoic acid" },
  ],
};

export const reviewStats = [
  { label: "Total Marks", value: "100", tone: "green" },
  { label: "Obtained Marks", value: "78.5 / 100", tone: "yellow" },
  { label: "Percentage", value: "78.5%", tone: "blue" },
  { label: "Correct Answers", value: "31 / 40", tone: "green" },
  { label: "Incorrect Answers", value: "7 / 40", tone: "pink" },
];

export const sectionPerformance = [
  { label: "MCQ (20)", value: "17 / 20", width: "85%" },
  { label: "Q&A (10)", value: "8 / 10", width: "80%" },
  { label: "Fill in the Blanks (10)", value: "7 / 10", width: "70%" },
  { label: "True / False (10)", value: "9 / 10", width: "90%" },
];

export const questionReviews = [
  {
    id: "Q.1",
    type: "MCQ",
    status: "correct",
    question: "Which of the following is the correct IUPAC name of CH3 - CH2 - CH2 - COOH?",
    marks: "+2.5 Marks",
  },
  {
    id: "Q.7",
    type: "MCQ",
    status: "incorrect",
    question: "The pKa value of acetic acid is approximately: A) 1.76 B) 3.75 C) 4.76 D) 5.76",
    marks: "0 Marks",
  },
  {
    id: "Q.12",
    type: "Fill in the Blanks",
    status: "correct",
    question: "The general formula of alkane is ________.",
    marks: "+2.5 Marks",
  },
  {
    id: "Q.18",
    type: "True / False",
    status: "skipped",
    question: "Glucose is a monosaccharide.",
    marks: "Skipped",
  },
];

export const answerKey = [
  {
    q: "Q.1",
    answer: "Butanoic acid",
    reason: "The carboxyl carbon is counted in the longest chain, giving four carbons.",
  },
  {
    q: "Q.7",
    answer: "4.76",
    reason: "Acetic acid is a weak acid with pKa near 4.76 at standard conditions.",
  },
  {
    q: "Q.12",
    answer: "CnH2n+2",
    reason: "Alkanes are saturated hydrocarbons with single bonds only.",
  },
];

export const reportActions = [
  "Weak-topic report",
  "Chapter-wise revision map",
  "Repeated concept tracker",
  "Next-test recommendations",
];

export const IconFileText = FileText;
export const IconSparkles = Sparkles;
