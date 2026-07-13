const GENERIC_TOPICS = ['Introduction', 'Advanced', 'Projects'];

const KEYWORD_TOPIC_PATTERNS = [
  {
    keywords: ['node', 'node.js', 'backend', 'server', 'express'],
    topics: ['Basics', 'Modules', 'Express', 'API', 'Authentication'],
  },
  {
    keywords: ['react', 'frontend', 'ui'],
    topics: ['Components', 'Hooks', 'State', 'Routing'],
  },
  {
    keywords: ['python'],
    topics: ['Basics', 'Functions', 'OOP', 'Modules', 'Automation'],
  },
  {
    keywords: ['javascript', 'js', 'typescript', 'ts'],
    topics: ['Basics', 'ES6', 'Async/Await', 'DOM', 'APIs'],
  },
  {
    keywords: ['sql', 'database', 'db', 'mongodb', 'postgres', 'mysql'],
    topics: ['Basics', 'Schema Design', 'Queries', 'Optimization', 'Security'],
  },
];

export function normalizeSubject(subject) {
  return (subject || '').toString().trim().toLowerCase();
}

export function generateTopicsForSubject(subject, plannerTasks = []) {
  const normalized = normalizeSubject(subject);
  if (!normalized) return [];

  const fromPattern = KEYWORD_TOPIC_PATTERNS.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  )?.topics;

  const fromPlanner = Array.from(
    new Set(
      (plannerTasks || [])
        .filter((task) => normalizeSubject(task?.subject) === normalized)
        .map((task) => (task?.topic || '').toString().trim())
        .filter(Boolean)
    )
  );

  const combined = Array.from(new Set([...(fromPattern || []), ...fromPlanner]));
  return combined.length ? combined : GENERIC_TOPICS;
}


