import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/exam.css';

function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const [showReview, setShowReview] = useState(false);

  if (!result) {
    return (
      <div className="exam-result-page">
        <div className="exam-result-card">
          <p>No result data found.</p>
          <Link to="/dashboard" className="exam-btn exam-btn--primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { subject, difficulty, total, attempted, correct, wrong, score, timeTaken, questions, answers } = result;

  const getFeedback = () => {
    if (score >= 85) return { icon: '🏆', label: 'Excellent!', cls: 'result-excellent', msg: "Outstanding! You're exam ready." };
    if (score >= 60) return { icon: '👍', label: 'Good Job!', cls: 'result-good', msg: 'Good performance. Review your mistakes.' };
    if (score >= 40) return { icon: '📚', label: 'Average', cls: 'result-average', msg: 'Keep practising. You can do better!' };
    return { icon: '💪', label: 'Needs Improvement', cls: 'result-poor', msg: 'Study harder and attempt again.' };
  };

  const feedback = getFeedback();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="exam-result-page">
      {/* ── Result Card ── */}
      <div className="exam-result-card">
        {/* Header */}
        <div className={`result-feedback-header ${feedback.cls}`}>
          <span className="result-feedback-icon">{feedback.icon}</span>
          <div>
            <div className="result-feedback-label">{feedback.label}</div>
            <div className="result-feedback-msg">{feedback.msg}</div>
          </div>
        </div>

        <div className="result-subject-row">
          <span>Subject: <strong>{subject}</strong></span>
          <span>Difficulty: <strong style={{ textTransform: 'capitalize' }}>{difficulty}</strong></span>
          {timeTaken > 0 && <span>Time: <strong>{formatTime(timeTaken)}</strong></span>}
        </div>

        {/* Score Ring */}
        <div className="result-score-wrap">
          <svg className="result-score-ring" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="58"
              fill="none"
              stroke={score >= 85 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - score / 100)}`}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
            />
          </svg>
          <div className="result-score-label">
            <span className="result-score-pct">{score}%</span>
            <span className="result-score-sub">Score</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="result-stats-grid">
          <div className="result-stat-item stat-total">
            <span className="rstat-val">{total}</span>
            <span className="rstat-label">Total</span>
          </div>
          <div className="result-stat-item stat-attempted">
            <span className="rstat-val">{attempted}</span>
            <span className="rstat-label">Attempted</span>
          </div>
          <div className="result-stat-item stat-correct">
            <span className="rstat-val">{correct}</span>
            <span className="rstat-label">Correct</span>
          </div>
          <div className="result-stat-item stat-wrong">
            <span className="rstat-val">{wrong}</span>
            <span className="rstat-label">Wrong</span>
          </div>
          <div className="result-stat-item stat-skipped">
            <span className="rstat-val">{total - attempted}</span>
            <span className="rstat-label">Skipped</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-action-row">
          <button
            className="exam-btn exam-btn--outline"
            onClick={() => setShowReview((v) => !v)}
          >
            {showReview ? '🙈 Hide Answers' : '📋 Show Correct Answers'}
          </button>
          <button
            className="exam-btn exam-btn--secondary"
            onClick={() => navigate('/exam', { state: { subject } })}
          >
            🔁 Retry Exam
          </button>
          <button
            className="exam-btn exam-btn--primary"
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </button>
        </div>
      </div>

      {/* ── Answer Review ── */}
      {showReview && questions && (
        <div className="exam-review-section">
          <h3 className="exam-review-title">📋 Answer Review</h3>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.answer;
            const isSkipped = userAns === undefined;
            return (
              <div
                key={i}
                className={`exam-review-item ${isCorrect ? 'review-correct' : isSkipped ? 'review-skipped' : 'review-wrong'}`}
              >
                <div className="exam-review-num">Q{i + 1}</div>
                <div className="exam-review-content">
                  <p className="exam-review-q">{q.question}</p>
                  <p className="exam-review-your">
                    Your answer:{' '}
                    <strong className={isCorrect ? 'ans-ok' : isSkipped ? 'ans-skip' : 'ans-no'}>
                      {userAns || 'Not Answered'}
                    </strong>
                  </p>
                  {!isCorrect && (
                    <p className="exam-review-correct">
                      Correct: <strong className="ans-ok">{q.answer}</strong>
                    </p>
                  )}
                </div>
                <div className="exam-review-icon">
                  {isCorrect ? '✓' : isSkipped ? '—' : '✗'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExamResult;
