const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";

export async function generateStudyTest({ mode, topic, difficulty, counts, context }) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Add it to .env and restart the dev server.");
  }

  const prompt = buildPrompt({ mode, topic, difficulty, counts, context });
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message || "Gemini could not generate the paper right now.";
    throw new Error(message);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return normalizeGeneratedTest(JSON.parse(text), { mode, topic, difficulty });
}

function buildPrompt({ mode, topic, difficulty, counts, context }) {
  const totalQuestions = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);

  return `Create a student practice test as strict JSON only.
Topic: ${topic || "General study practice"}
Mode: ${mode}
Difficulty: ${difficulty}
Context: ${context || "No extra context provided"}
Question counts: ${JSON.stringify(counts)}
Total questions requested: ${totalQuestions}

Return this exact shape:
{
  "title": "short paper title",
  "difficulty": "Easy | Medium | Hard | Mixed",
  "durationMinutes": 45,
  "totalMarks": 100,
  "questions": [
    {
      "id": 1,
      "type": "MCQ | Q&A | Fill in the Blanks | True / False",
      "question": "question text",
      "options": ["A option", "B option", "C option", "D option"],
      "answer": "correct answer",
      "explanation": "short reason",
      "marks": 2.5
    }
  ]
}

Keep options only for MCQ. For non-MCQ use an empty options array.`;
}

function normalizeGeneratedTest(test, fallback) {
  const questions = Array.isArray(test?.questions) ? test.questions : [];

  return {
    title: test?.title || `${fallback.topic || "Study"} Practice Paper`,
    mode: fallback.mode,
    difficulty: test?.difficulty || fallback.difficulty || "Medium",
    durationMinutes: Number(test?.durationMinutes || 45),
    totalMarks: Number(test?.totalMarks || 100),
    generatedAt: new Date().toISOString(),
    questions: questions.map((question, index) => ({
      id: question.id || index + 1,
      type: question.type || "MCQ",
      question: question.question || "Generated question",
      options: Array.isArray(question.options) ? question.options : [],
      answer: question.answer || "",
      explanation: question.explanation || "",
      marks: Number(question.marks || 2.5),
    })),
  };
}
