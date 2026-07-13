/**
 * Quiz Service — calls our backend /generate-quiz endpoint.
 * Falls back to mock data if backend is unreachable (no API key configured).
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate quiz questions via backend API.
 * @param {string} subject
 * @param {'Low'|'Medium'|'High'} difficulty
 * @param {number} numQuestions
 * @param {boolean} shuffleQuestions
 * @param {boolean} shuffleOptions
 * @returns {Promise<Array>}
 */
export async function generateQuiz({ subject, difficulty, numQuestions, shuffleQuestions, shuffleOptions }) {
  try {
    const res = await fetch(`${BACKEND_URL}/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, difficulty, numQuestions }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }

    const data = await res.json();
    let questions = data.questions || [];

    // Shuffle options per question if requested
    if (shuffleOptions) {
      questions = questions.map((q) => {
        const opts = shuffleArray(q.options);
        return { ...q, options: opts };
      });
    }

    // Shuffle question order if requested
    if (shuffleQuestions) {
      questions = shuffleArray(questions);
    }

    return questions;
  } catch (err) {
    console.warn('[quizService] Backend unreachable, using mock data:', err.message);
    return getMockQuestions(subject, difficulty, numQuestions, shuffleQuestions, shuffleOptions);
  }
}

/**
 * Mock fallback questions when backend is unavailable
 */
function getMockQuestions(subject, difficulty, numQuestions, shuffleQuestions, shuffleOptions) {
  const bank = [
    {
      question: `What is a core concept in ${subject}?`,
      options: ['Abstraction', 'Iteration', 'Recursion', 'Polymorphism'],
      answer: 'Abstraction',
    },
    {
      question: `Which of the following best describes ${subject}?`,
      options: ['A field of study', 'A programming language', 'An operating system', 'A database'],
      answer: 'A field of study',
    },
    {
      question: `What is the difficulty level of this quiz?`,
      options: ['Low', 'Medium', 'High', 'Expert'],
      answer: difficulty,
    },
    {
      question: `In ${subject}, what does "theory" refer to?`,
      options: ['A proven fact', 'A systematic framework', 'A random guess', 'An experiment'],
      answer: 'A systematic framework',
    },
    {
      question: `Which skill is most important when studying ${subject}?`,
      options: ['Memorization', 'Critical thinking', 'Speed reading', 'Guessing'],
      answer: 'Critical thinking',
    },
    {
      question: `How many hours per week should one study ${subject} for best results?`,
      options: ['1-2 hours', '3-5 hours', '6-8 hours', '10+ hours'],
      answer: '3-5 hours',
    },
    {
      question: `What is the best way to test your knowledge of ${subject}?`,
      options: ['Re-reading notes', 'Practice quizzes', 'Watching videos', 'Sleeping on it'],
      answer: 'Practice quizzes',
    },
    {
      question: `Which resource is most valuable for learning ${subject}?`,
      options: ['Textbooks', 'Online courses', 'Study groups', 'All of the above'],
      answer: 'All of the above',
    },
    {
      question: `What does "mastery" mean in ${subject}?`,
      options: [
        'Knowing all terms',
        'Applying concepts in new situations',
        'Finishing a course',
        'Getting 100% on a test',
      ],
      answer: 'Applying concepts in new situations',
    },
    {
      question: `Why is practice important in ${subject}?`,
      options: [
        'It builds long-term memory',
        'It impresses teachers',
        'It is required by law',
        'It wastes time',
      ],
      answer: 'It builds long-term memory',
    },
  ];

  let questions = bank.slice(0, Math.min(numQuestions || 5, bank.length));

  if (shuffleOptions) {
    questions = questions.map((q) => {
      const opts = shuffleArray(q.options);
      return { ...q, options: opts };
    });
  }

  if (shuffleQuestions) {
    questions = shuffleArray(questions);
  }

  return questions;
}

/**
 * Save quiz result to localStorage
 */
export function saveQuizResult(result) {
  const key = 'quiz_results';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift({ ...result, date: new Date().toISOString() });
  // Keep only last 50 results
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
}

/**
 * Get all saved quiz results
 */
export function getQuizResults() {
  return JSON.parse(localStorage.getItem('quiz_results') || '[]');
}
