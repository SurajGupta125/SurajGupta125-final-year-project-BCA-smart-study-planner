import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiPause, FiPlay, FiRefreshCw } from 'react-icons/fi';
import './../styles/pomodoro.css';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatMMSS(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${pad2(mm)}:${pad2(ss)}`;
}

function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);

  const intervalRef = useRef(null);

  const totalSeconds =
    mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;

  const progressPct = useMemo(() => {
    const done = totalSeconds - secondsLeft;
    const pct =
      totalSeconds > 0
        ? (done / totalSeconds) * 100
        : 0;

    return Math.min(Math.max(pct, 0), 100);
  }, [secondsLeft, totalSeconds]);

  const label =
    mode === 'focus'
      ? 'Focus Time'
      : 'Break Time';

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    clearTimer();

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) =>
        Math.max(prev - 1, 0)
      );
    }, 1000);

    return () => clearTimer();
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;

    try {
      const audio = new Audio(
        'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
      );

      audio.play();
    } catch (e) {
      console.log(
        'Audio playback prevented by browser policies'
      );
    }

    if (mode === 'focus') {
      setMode('break');
      setSecondsLeft(BREAK_SECONDS);
      setIsRunning(true);
      return;
    }

    if (mode === 'break') {
      setMode('focus');
      setSecondsLeft(FOCUS_SECONDS);
      setIsRunning(false);
    }
  }, [mode, secondsLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(FOCUS_SECONDS);
  };

  return (
    <div className="pomo-card">
      <div className="pomo-head">
        <div className="pomo-title">
          Pomodoro Timer
        </div>

        <div
          className={`pomo-chip ${
            mode === 'focus'
              ? 'pomo-chip--focus'
              : 'pomo-chip--break'
          }`}
        >
          {label}
        </div>
      </div>

      <div
        className={`pomo-ring ${
          mode === 'focus'
            ? 'pomo-ring--focus'
            : 'pomo-ring--break'
        }`}
        style={{
          '--pomo-progress': `${progressPct}%`,
        }}
        aria-label={`${label} timer`}
      >
        <div className="pomo-time">
          {formatMMSS(secondsLeft)}
        </div>

        <div className="pomo-sub">
          {mode === 'focus'
            ? '25:00 focus'
            : '05:00 break'}
        </div>
      </div>

      <div className="pomo-actions">
        {!isRunning ? (
          <button
            type="button"
            className="pomo-btn pomo-btn--primary"
            onClick={handleStart}
          >
            <FiPlay /> Start
          </button>
        ) : (
          <button
            type="button"
            className="pomo-btn pomo-btn--secondary"
            onClick={handlePause}
          >
            <FiPause /> Pause
          </button>
        )}

        <button
          type="button"
          className="pomo-btn pomo-btn--ghost"
          onClick={handleReset}
        >
          <FiRefreshCw /> Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;