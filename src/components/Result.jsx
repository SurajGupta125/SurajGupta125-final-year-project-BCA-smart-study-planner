import React from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizResult } from '../services/quizService';
import '../styles/quiz.css';

/**
 * Result page shown after quiz submission.
 * Props:
 *   subject       : string
 *   questions     : array of quiz questions
 *   answers       : { [questionIndex]: selectedOption }
 *   timeTaken     : seconds (optional)
 *   onRetry       : () => void — re-run same quiz
 *   onNewQuiz     : () => void — back to quiz setup
 */
function Result({ subject, questions, answers, timeTaken, onRetry, onNewQuiz }) {
  const navigate = useNavigate();

  const total = questions.length;
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getFeedback = () => {
    if (scorePercent >= 85) return { label: '🏆 Excellent!', cls: 'feedback-excellent', msg: "Outstanding performance! You've mastered this topic." };
    if (scorePercent >= 60) return { label: '👍 Good Job!', cls: 'feedback-good', msg: 'Great effort! Review the wrong answers to improve further.' };
    return { label: '📚 Keep Practising', cls: 'feedback-improve', msg: "Don't give up! Study the topic and try again." };
  };

  const feedback = getFeedback();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="result-page">
      {/* Score card */}
      <div className="result-card">
        <div className={`result-feedback-badge ${feedback.cls}`}>{feedback.label}</div>
        <p className="result-subject">Subject: <strong>{subject}</strong></p>

        {/* Donut-style score ring */}
        <div className="score-ring-wrap">
          <svg className="score-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke={scorePercent >= 85 ? '#4ade80' : scorePercent >= 60 ? '#facc15' : '#f87171'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - scorePercent / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="score-ring-label">
            <span className="score-percent">{scorePercent}%</span>
            <span className="score-sub">{correct}/{total} correct</span>
          </div>
        </div>

        <p className="feedback-msg">{feedback.msg}</p>

        {timeTaken !== undefined && (
          <p className="result-time">⏱ Time taken: <strong>{formatTime(timeTaken)}</strong></p>
        )}

        {/* Stats row */}
        <div className="result-stats">
          <div className="stat-box stat-total">
            <span className="stat-val">{total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-box stat-correct">
            <span className="stat-val">{correct}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-box stat-wrong">
            <span className="stat-val">{total - correct}</span>
            <span className="stat-label">Wrong</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="result-actions">
          <button className="result-btn retry-btn" onClick={onRetry}>🔁 Retry Quiz</button>
          <button className="result-btn new-btn" onClick={onNewQuiz}>➕ New Quiz</button>
          <button className="result-btn planner-btn" onClick={() => navigate('/planner')}>📅 Back to Planner</button>
        </div>
      </div>

      {/* Answer Review */}
      <div className="answer-review">
        <h3 className="review-title">📋 Answer Review</h3>
        {questions.map((q, i) => {
          const userAns = answers[i];
          const isCorrect = userAns === q.answer;
          return (
            <div key={i} className={`review-item ${isCorrect ? 'review-correct' : 'review-wrong'}`}>
              <div className="review-q-num">Q{i + 1}</div>
              <div className="review-content">
                <p className="review-question">{q.question}</p>
                <p className="review-your-ans">
                  Your answer: <span className={isCorrect ? 'ans-correct' : 'ans-wrong'}>
                    {userAns || '(no answer)'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="review-correct-ans">
                    Correct: <span className="ans-correct">{q.answer}</span>
                  </p>
                )}
              </div>
              <div className="review-icon">{isCorrect ? '✓' : '✗'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Result;
