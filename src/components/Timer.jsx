import React from 'react';

/**
 * Timer — displays HH:MM:SS countdown.
 * Props:
 *   timeLeft : number (seconds remaining)
 *   warning  : boolean (turns red when low)
 */
function Timer({ timeLeft, warning }) {
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`exam-timer ${warning ? 'exam-timer--warning' : ''}`}>
      <span className="exam-timer-label">Time Left:</span>
      <span className="exam-timer-value">
        {h}:{m}:{s}
      </span>
    </div>
  );
}

export default Timer;
