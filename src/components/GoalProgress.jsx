import React, { useMemo } from 'react';
import './../styles/goalProgress.css';

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function formatHours(n) {
  const val = Number(n) || 0;
  return Number.isInteger(val) ? `${val}` : `${val.toFixed(1)}`;
}

function GoalProgress({ weeklyGoal, completedHours }) {
  const safeGoal = Math.max(Number(weeklyGoal) || 0, 0);
  const safeCompleted = Math.max(Number(completedHours) || 0, 0);

  const { progress, remaining } = useMemo(() => {
    const remainingHours = Math.max(safeGoal - safeCompleted, 0);
    const pct = safeGoal > 0 ? (safeCompleted / safeGoal) * 100 : 0;
    return { progress: clamp(pct, 0, 100), remaining: remainingHours };
  }, [safeCompleted, safeGoal]);

  return (
    <div className="goal-card">
      <div className="goal-head">
        <div className="goal-title">Weekly Goal Progress</div>
        <div className="goal-percent">{Math.round(progress)}%</div>
      </div>

      <div className="goal-bar" aria-hidden="true">
        <div className="goal-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="goal-stats">
        <div className="goal-stat">
          <div className="goal-stat-label">Weekly Goal</div>
          <div className="goal-stat-value">{formatHours(safeGoal)} hrs</div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">Completed</div>
          <div className="goal-stat-value">{formatHours(safeCompleted)} hrs</div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">Remaining</div>
          <div className="goal-stat-value">{formatHours(remaining)} hrs</div>
        </div>
      </div>
    </div>
  );
}

export default GoalProgress;

