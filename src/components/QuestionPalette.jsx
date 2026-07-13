import React from 'react';

/**
 * QuestionPalette — Right sidebar showing color-coded question status.
 * Status:
 *  not-visited  → Gray
 *  answered     → Green
 *  not-answered → Red (visited but no answer selected)
 *  review       → Purple
 */
function QuestionPalette({ total, current, answers, visited, markedForReview, onGoto }) {
  const getStatus = (idx) => {
    if (markedForReview.has(idx)) return 'review';
    if (answers[idx] !== undefined) return 'answered';
    if (visited.has(idx)) return 'not-answered';
    return 'not-visited';
  };

  const legend = [
    { cls: 'not-visited', label: 'Not Visited' },
    { cls: 'answered', label: 'Answered' },
    { cls: 'not-answered', label: 'Not Answered' },
    { cls: 'review', label: 'Marked for Review' },
  ];

  const counts = {
    'not-visited': 0,
    answered: 0,
    'not-answered': 0,
    review: 0,
  };
  for (let i = 0; i < total; i++) counts[getStatus(i)]++;

  return (
    <aside className="palette-sidebar">
      <div className="palette-header">Question Palette</div>

      {/* Legend */}
      <div className="palette-legend">
        {legend.map((l) => (
          <div key={l.cls} className="palette-legend-item">
            <span className={`palette-dot ${l.cls}`}>{counts[l.cls]}</span>
            <span className="palette-legend-label">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Grid of question numbers */}
      <div className="palette-grid">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className={`palette-btn ${getStatus(i)} ${i === current ? 'palette-current' : ''}`}
            onClick={() => onGoto(i)}
            title={`Question ${i + 1} — ${getStatus(i).replace('-', ' ')}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default QuestionPalette;
