import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionPalette from '../components/QuestionPalette';
import Timer from '../components/Timer';
import { getQuestions, shuffleArray } from '../data/questionBank';
import '../styles/exam.css';

/* ─── Setup Screen ─── */
function ExamSetup({ initialSubject, onStart }) {
  const [subject, setSubject] = useState(initialSubject);
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(30);
  const [numQuestions, setNumQuestions] = useState(60);
  const [customQuestions, setCustomQuestions] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const parsed = [];
      
      rows.forEach((row, idx) => {
        if (idx === 0 && row.toLowerCase().includes('question')) return; // skip header
        // Simple regex to split by comma but ignore commas inside quotes
        const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/(^"|"$)/g, '').trim());
        if (parts.length >= 6) {
          parsed.push({
            question: parts[0],
            options: [parts[1], parts[2], parts[3], parts[4]],
            answer: parts[5]
          });
        }
      });
      
      if (parsed.length > 0) {
        setCustomQuestions(parsed);
        setNumQuestions(parsed.length);
        setSubject(file.name.replace('.csv', '').toUpperCase());
        alert(`Successfully loaded ${parsed.length} questions from CSV!`);
      } else {
        alert('Could not parse questions. Ensure format: Question, OptionA, OptionB, OptionC, OptionD, Answer');
      }
    };
    reader.readAsText(file);
  };

  const diffOptions = [
    { key: 'easy', label: '🟢 Easy', desc: 'Fundamental concepts' },
    { key: 'medium', label: '🟡 Medium', desc: 'Application level' },
    { key: 'hard', label: '🔴 Hard', desc: 'Advanced problems' },
  ];

  return (
    <div className="exam-setup-page">
      <div className="exam-setup-card">
        <div className="exam-setup-logo">📝</div>
        <h1 className="exam-setup-title">CET Exam Simulator</h1>
        <div className="exam-setup-section">
          <label className="exam-setup-label">Subject</label>
          <input
            type="text"
            className="exam-dur-input"
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px' }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject (e.g., Maths, Physics, Chemistry)"
          />
        </div>

        <div className="exam-setup-section">
          <label className="exam-setup-label">Select Difficulty</label>
          <div className="exam-diff-grid">
            {diffOptions.map((d) => (
              <button
                key={d.key}
                className={`exam-diff-card ${difficulty === d.key ? 'active' : ''}`}
                onClick={() => setDifficulty(d.key)}
              >
                <span className="exam-diff-label">{d.label}</span>
                <span className="exam-diff-desc">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="exam-setup-section">
          <label className="exam-setup-label">⏱ Exam Duration (minutes)</label>
          <div className="exam-duration-row">
            {[15, 30, 45, 60].map((t) => (
              <button
                key={t}
                className={`exam-dur-btn ${duration === t ? 'active' : ''}`}
                onClick={() => setDuration(t)}
              >
                {t} min
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              className="exam-dur-input"
            />
          </div>
        </div>

        <div className="exam-setup-section">
          <label className="exam-setup-label"> Number of Questions</label>
          <div className="exam-duration-row">
            {[10, 30, 60, 100].map((n) => (
              <button
                key={n}
                className={`exam-dur-btn ${numQuestions === n ? 'active' : ''}`}
                onClick={() => setNumQuestions(n)}
              >
                {n}
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="200"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Number(e.target.value)))}
              className="exam-dur-input"
            />
          </div>
        </div>

        <div className="exam-setup-section">
          <label className="exam-setup-label">📁 Upload Custom CSV (Optional)</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ 
              marginTop: '8px', 
              width: '100%', 
              padding: '10px', 
              background: '#f8fafc', 
              border: '1px dashed #cbd5e1', 
              borderRadius: '8px' 
            }}
          />
          <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>
            Format: Question, Option A, Option B, Option C, Option D, Correct Answer
          </small>
        </div>

        <div className="exam-setup-info">
          <div className="exam-info-row">
            <span> Subject</span><strong>{subject}</strong>
          </div>
          <div className="exam-info-row">
            <span> Difficulty</span><strong style={{ textTransform: 'capitalize' }}>{difficulty}</strong>
          </div>
          <div className="exam-info-row">
            <span>Duration</span><strong>{duration} minutes</strong>
          </div>
          <div className="exam-info-row">
            <span> Questions</span><strong>{numQuestions}</strong>
          </div>
        </div>

        <button
          className="exam-start-btn"
          onClick={() => onStart({ subject, difficulty, duration, numQuestions, customQuestions })}
          disabled={!subject || subject.trim() === ''}
          style={{ opacity: (!subject || subject.trim() === '') ? 0.5 : 1, cursor: (!subject || subject.trim() === '') ? 'not-allowed' : 'pointer' }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

/* ─── Main Exam Page ─── */
function Exam() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialSubject =
    location.state?.subject ||
    new URLSearchParams(location.search).get('subject') ||
    '';

  const [subject, setSubject] = useState(initialSubject);
  const [phase, setPhase] = useState('setup'); // 'setup' | 'exam' | 'submitted'
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});     // { idx: selectedOption }
  const [visited, setVisited] = useState(new Set());
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [config, setConfig] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const submitExamRef = useRef(null);

  // ── Prevent accidental refresh during exam ──
  useEffect(() => {
    if (phase !== 'exam') return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);


  useEffect(() => {
    if (phase !== 'exam') {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (submitExamRef.current) submitExamRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [phase]);
  // ── Start exam ──
  const handleStart = ({ subject: selectedSubject, difficulty, duration, numQuestions, customQuestions }) => {
    setSubject(selectedSubject);
    let raw = [];
    
    if (customQuestions && customQuestions.length > 0) {
      raw = customQuestions;
    } else {
      raw = getQuestions(selectedSubject, difficulty);
    }

    // Repeat questions if we don't have enough to meet the numQuestions requirement
    if (raw.length > 0) {
      while (raw.length < numQuestions) {
        raw = raw.concat(raw);
      }
    }
    raw = raw.slice(0, numQuestions);

    const q = shuffleArray(raw).map((item) => ({
      ...item,
      options: shuffleArray(item.options),
    }));
    setConfig({ difficulty, duration });
    setQuestions(q);
    setAnswers({});
    setVisited(new Set([0]));
    setMarkedForReview(new Set());
    setCurrent(0);
    setTimeLeft(duration * 60);
    startTimeRef.current = Date.now();
    setPhase('exam');
  };

  // ── Submit ──
  const submitExam = useCallback(() => {
    clearInterval(timerRef.current);
    const elapsed = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const total = questions.length;
    const attempted = Object.keys(answers).length;
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    const wrong = attempted - correct;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const result = {
      subject,
      difficulty: config?.difficulty,
      total,
      attempted,
      correct,
      wrong,
      score,
      timeTaken: elapsed,
      date: new Date().toISOString(),
      questions,
      answers,
    };

    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('exam_results') || '[]');
    history.unshift(result);
    localStorage.setItem('exam_results', JSON.stringify(history.slice(0, 30)));

    setPhase('submitted');
    navigate('/exam-result', { state: result });
  }, [answers, config, navigate, questions, subject]);

  useEffect(() => {
    submitExamRef.current = submitExam;
  }, [submitExam]);

  // ── Navigation handlers ──
  const markVisited = (idx) => setVisited((prev) => new Set(prev).add(idx));

  const goTo = (idx) => {
    markVisited(idx);
    setCurrent(idx);
  };

  const handleNext = () => {
    if (current < questions.length - 1) goTo(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) goTo(current - 1);
  };

  const handleSelect = (opt) => {
    setAnswers((prev) => ({ ...prev, [current]: opt }));
    markVisited(current);
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[current];
      return next;
    });
  };

  const handleMarkForReview = () => {
    markVisited(current);
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current);
      else next.add(current);
      return next;
    });
    if (current < questions.length - 1) goTo(current + 1);
  };

  const handleSaveAndNext = () => {
    if (current === questions.length - 1) {
      setShowConfirm(true);
    } else {
      handleNext();
    }
  };

  // ── Render ──
  if (phase === 'setup') {
    return (
      <div className="exam-page-bg">
        <button className="exam-back-link" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <ExamSetup initialSubject={initialSubject} onStart={handleStart} />
      </div>
    );
  }

  const q = questions[current];
  const timerWarning = timeLeft <= 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="exam-page-bg exam-active">
      {/* ── TOP BAR ── */}
      <header className="exam-topbar">
        <div className="exam-topbar-left">
          <div className="exam-topbar-title"> CET Exam</div>
          <div className="exam-topbar-subject">{subject}</div>
        </div>

        <Timer timeLeft={timeLeft} warning={timerWarning} />

        <div className="exam-topbar-right">
          <span className="exam-progress-text">
            {answeredCount} / {questions.length} answered
          </span>
          <button
            className="exam-submit-topbtn"
            onClick={() => setShowConfirm(true)}
          >
            Submit Exam
          </button>
        </div>
      </header>

      <div className="exam-body">
        {/* ── LEFT: Question Area ── */}
        <main className="exam-main">
          {/* Question meta */}
          <div className="exam-q-meta">
            <span className="exam-q-num">Question {current + 1} of {questions.length}</span>
            {markedForReview.has(current) && (
              <span className="exam-q-review-tag"> Marked for Review</span>
            )}
          </div>

          {/* Question text */}
          <div className="exam-q-text">{q?.question}</div>

          {/* Options */}
          <div className="exam-options">
            {q?.options.map((opt, idx) => {
              const labels = ['A', 'B', 'C', 'D'];
              const isSelected = answers[current] === opt;
              return (
                <label
                  key={idx}
                  className={`exam-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  <span className="exam-option-label">{labels[idx]}</span>
                  <span className="exam-option-text">{opt}</span>
                  <input
                    type="radio"
                    name={`question-${current}`}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleSelect(opt)}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="exam-actions">
            <button
              className="exam-btn exam-btn--outline"
              onClick={handleMarkForReview}
            >
              {markedForReview.has(current) ? ' Unmark Review' : ' Mark for Review'}
            </button>
            <button
              className="exam-btn exam-btn--ghost"
              onClick={handleClearResponse}
              disabled={answers[current] === undefined}
            >
              Clear Response
            </button>
            <div style={{ flex: 1 }} />
            <button
              className="exam-btn exam-btn--secondary"
              onClick={handlePrev}
              disabled={current === 0}
            >
              ← Previous
            </button>
            <button
              className="exam-btn exam-btn--primary"
              onClick={handleSaveAndNext}
            >
              {current === questions.length - 1 ? 'Finish Exam' : 'Save & Next →'}
            </button>
          </div>
        </main>

        {/* ── RIGHT: Palette ── */}
        <QuestionPalette
          total={questions.length}
          current={current}
          answers={answers}
          visited={visited}
          markedForReview={markedForReview}
          onGoto={goTo}
        />
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {showConfirm && (
        <div className="exam-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="exam-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="exam-modal-title"> Submit Exam?</h3>
            <div className="exam-modal-stats">
              <div className="exam-modal-stat">
                <span>Total Questions</span>
                <strong>{questions.length}</strong>
              </div>
              <div className="exam-modal-stat">
                <span>Answered</span>
                <strong className="text-green">{answeredCount}</strong>
              </div>
              <div className="exam-modal-stat">
                <span>Not Answered</span>
                <strong className="text-red">{questions.length - answeredCount}</strong>
              </div>
              <div className="exam-modal-stat">
                <span>Marked for Review</span>
                <strong className="text-purple">{markedForReview.size}</strong>
              </div>
            </div>
            <p className="exam-modal-warn">
              Once submitted, you cannot change your answers.
            </p>
            <div className="exam-modal-actions">
              <button
                className="exam-btn exam-btn--ghost"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="exam-btn exam-btn--danger"
                onClick={submitExam}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;
