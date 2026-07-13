import React from 'react';
import '../styles/quiz.css';

/**
 * QuestionCard — displays a single question with 4 selectable options.
 * Props:
 *   question        : { question, options, answer }
 *   questionNumber  : current 1-based index
 *   totalQuestions  : total count
 *   selectedOption  : currently selected option string or null
 *   onSelect        : (option) => void
 *   submitted       : boolean — show correct/wrong highlights
 */
function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
  submitted,
}) {
  if (!question) return null;

  const getOptionClass = (opt) => {
    let cls = 'quiz-option';
    if (submitted) {
      if (opt === question.answer) cls += ' correct';
      else if (opt === selectedOption) cls += ' wrong';
      else cls += ' dimmed';
    } else {
      if (opt === selectedOption) cls += ' selected';
    }
    return cls;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="question-card">
      {/* Progress bar */}
      <div className="question-progress-bar">
        <div
          className="question-progress-fill"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question header */}
      <div className="question-header">
        <span className="question-badge">Question {questionNumber} / {totalQuestions}</span>
      </div>

      {/* Question text */}
      <p className="question-text">{question.question}</p>

      {/* Options */}
      <div className="quiz-options">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={getOptionClass(opt)}
            onClick={() => !submitted && onSelect(opt)}
            disabled={submitted}
          >
            <span className="option-label">{optionLabels[idx]}</span>
            <span className="option-text">{opt}</span>
            {submitted && opt === question.answer && (
              <span className="option-tick">✓</span>
            )}
            {submitted && opt === selectedOption && opt !== question.answer && (
              <span className="option-cross">✗</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
