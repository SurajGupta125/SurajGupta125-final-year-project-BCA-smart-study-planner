import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Result from '../components/Result';
import { generateQuiz, saveQuizResult } from '../services/quizService';
import '../styles/quiz.css';

/* ─────────────── Setup Screen ─────────────── */
function QuizSetup({ subject, onStart }) {
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [duration, setDuration] = useState(10); // minutes
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleOpts, setShuffleOpts] = useState(true);

  const diffColors = { Low: '#4ade80', Medium: '#facc15', High: '#f87171' };

  return (
    <div className="quiz-setup-page">
      <div className="quiz-setup-card">
        <div className="setup-icon">🎯</div>
        <h2 className="setup-title">AI Quiz Generator</h2>
        <p className="setup-subject-badge">{subject}</p>

        {/* Difficulty */}
        <div className="setup-section">
          <label className="setup-label">Difficulty</label>
          <div className="diff-pills">
            {['Low', 'Medium', 'High'].map((d) => (
              <button
                key={d}
                className={`diff-pill ${difficulty === d ? 'active' : ''}`}
                style={difficulty === d ? { background: diffColors[d], color: '#0f172a' } : {}}
                onClick={() => setDifficulty(d)}
              >
                {d === 'Low' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Number of questions */}
        <div className="setup-section">
          <label className="setup-label">Number of Questions</label>
          <div className="num-pills">
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                className={`num-pill ${numQuestions === n ? 'active' : ''}`}
                onClick={() => setNumQuestions(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="setup-section">
          <label className="setup-label">⏱ Duration (minutes)</label>
          <div className="duration-input-row">
            <input
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              className="duration-input"
            />
            <span className="duration-unit">min</span>
          </div>
        </div>

        {/* Shuffle toggles */}
        <div className="setup-section setup-toggles">
          <label className="toggle-item">
            <input type="checkbox" checked={shuffleQ} onChange={(e) => setShuffleQ(e.target.checked)} />
            <span>Shuffle Questions</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={shuffleOpts} onChange={(e) => setShuffleOpts(e.target.checked)} />
            <span>Shuffle Options</span>
          </label>
        </div>

        <button
          className="start-quiz-btn"
          onClick={() => onStart({ difficulty, numQuestions, duration, shuffleQ, shuffleOpts })}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Main Quiz Page ─────────────── */
function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // Subject comes from navigation state or query param
  const subject = location.state?.subject || new URLSearchParams(location.search).get('subject') || 'General Knowledge';

  const [phase, setPhase] = useState('setup'); // 'setup' | 'loading' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ── Timer logic ──
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleSubmitQuiz = useCallback(
    (finalAnswers) => {
      stopTimer();
      const elapsed = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
      setTimeTaken(elapsed);
      setAnswers(finalAnswers || answers);
      setSubmitted(true);
      setPhase('result');

      // Save result
      const q = questions;
      const a = finalAnswers || answers;
      const correct = q.filter((qu, i) => a[i] === qu.answer).length;
      saveQuizResult({
        subject,
        difficulty: config?.difficulty || 'Medium',
        total: q.length,
        correct,
        score: Math.round((correct / q.length) * 100),
        timeTaken: elapsed,
      });
    },
    [answers, config, questions, stopTimer, subject]
  );

 useEffect(() => {
  if (phase === 'quiz' && timeLeft > 0) {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          handleSubmitQuiz(answers);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }

  return () => {
    stopTimer();
  };
}, [phase, timeLeft, answers, handleSubmitQuiz, stopTimer]);

  // ── Start quiz ──
  const handleStart = async ({ difficulty, numQuestions, duration, shuffleQ, shuffleOpts }) => {
    setConfig({ difficulty, numQuestions, duration, shuffleQ, shuffleOpts });
    setPhase('loading');
    setError('');
    try {
      const qs = await generateQuiz({
        subject,
        difficulty,
        numQuestions,
        shuffleQuestions: shuffleQ,
        shuffleOptions: shuffleOpts,
      });
      if (!qs || qs.length === 0) throw new Error('No questions returned.');
      setQuestions(qs);
      setAnswers({});
      setCurrentIdx(0);
      setSubmitted(false);
      setTimeLeft(duration * 60);
      startTimeRef.current = Date.now();
      setPhase('quiz');
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
      setPhase('setup');
    }
  };

  // ── Select answer ──
  const handleSelect = (opt) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: opt }));
  };

  // ── Navigation ──
  const goNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
  };
  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  // ── Format time ──
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerWarning = timeLeft > 0 && timeLeft <= 30;

  // ─────────── RENDER ───────────

  if (phase === 'setup') {
    return (
      <div className="quiz-page-wrapper">
        <button className="quiz-back-btn" onClick={() => navigate('/planner')}>← Back to Planner</button>
        {error && <div className="quiz-error">{error}</div>}
        <QuizSetup subject={subject} onStart={handleStart} />
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="quiz-page-wrapper quiz-loading-page">
        <div className="loading-spinner" />
        <p className="loading-text">🤖 AI is generating your quiz...</p>
        <p className="loading-sub">Crafting questions for <strong>{subject}</strong></p>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="quiz-page-wrapper">
        <button className="quiz-back-btn" onClick={() => navigate('/planner')}>← Back to Planner</button>
        <Result
          subject={subject}
          questions={questions}
          answers={answers}
          timeTaken={timeTaken}
          onRetry={() => {
            setAnswers({});
            setCurrentIdx(0);
            setSubmitted(false);
            setTimeLeft(config.duration * 60);
            startTimeRef.current = Date.now();
            setPhase('quiz');
          }}
          onNewQuiz={() => {
            setPhase('setup');
            setQuestions([]);
            setAnswers({});
          }}
        />
      </div>
    );
  }

  // ── Quiz in progress ──
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-top-bar">
        <button className="quiz-back-btn" onClick={() => navigate('/planner')}>← Planner</button>

        <div className="quiz-subject-tag">{subject}</div>

        {/* Timer */}
        <div className={`quiz-timer ${timerWarning ? 'timer-warning' : ''}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="quiz-meta-row">
        <span className={`difficulty-badge diff-${config?.difficulty?.toLowerCase()}`}>
          {config?.difficulty} Difficulty
        </span>
        <span className="progress-text">{answeredCount}/{questions.length} answered</span>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQ}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        selectedOption={answers[currentIdx] || null}
        onSelect={handleSelect}
        submitted={false}
      />

      {/* Navigation */}
      <div className="quiz-nav-row">
        <button
          className="quiz-nav-btn prev-btn"
          onClick={goPrev}
          disabled={currentIdx === 0}
        >
          ← Previous
        </button>

        {/* Question dot indicators */}
        <div className="quiz-dot-row">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`quiz-dot ${i === currentIdx ? 'active' : ''} ${answers[i] ? 'answered' : ''}`}
              onClick={() => setCurrentIdx(i)}
            />
          ))}
        </div>

        {isLast ? (
          <button
            className="quiz-nav-btn submit-btn"
            onClick={() => handleSubmitQuiz(answers)}
          >
            Submit Quiz ✓
          </button>
        ) : (
          <button
            className="quiz-nav-btn next-btn"
            onClick={goNext}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
