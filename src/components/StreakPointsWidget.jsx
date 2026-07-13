import React, { useMemo } from 'react';
import { FaFireAlt } from 'react-icons/fa';
import { useGamification } from '../hooks/useGamification';
import './../styles/gamification.css';

function levelBadgeClass(levelName) {
  switch (levelName) {
    case 'Intermediate':
      return 'gp-badge gp-badge--intermediate';
    case 'Advanced':
      return 'gp-badge gp-badge--advanced';
    default:
      return 'gp-badge gp-badge--beginner';
  }
}

function StreakPointsWidget({ compact = true }) {
  const { state, level, progress } = useGamification();

  const subtitle = useMemo(() => {
    if (progress.nextTarget == null) return 'Max level reached';
    const remaining = Math.max(progress.nextTarget - state.points, 0);
    return `${remaining} pts to next level`;
  }, [progress.nextTarget, state.points]);

  return (
    <div className={`gp-card ${compact ? 'gp-card--compact' : ''}`}>
      <div className="gp-top">
        <div className="gp-left">
          <div className="gp-icon" aria-hidden="true">
            <FaFireAlt />
          </div>
          <div className="gp-meta">
            <div className="gp-title">Study Streak</div>
            <div className="gp-subtitle">{state.streakDays} day{state.streakDays === 1 ? '' : 's'}</div>
          </div>
        </div>

        <span className={levelBadgeClass(level.name)}>{level.name}</span>
      </div>

      <div className="gp-points">
        <div className="gp-points-row">
          <div className="gp-points-label">Total Points</div>
          <div className="gp-points-value">{state.points}</div>
        </div>

        <div className="gp-bar" aria-hidden="true">
          <div className="gp-bar-fill" style={{ width: `${progress.percent}%` }} />
        </div>

        <div className="gp-foot">
          <span className="gp-foot-text">{subtitle}</span>
          <span className="gp-foot-text">Consistency bonus at 7 days</span>
        </div>
      </div>
    </div>
  );
}

export default StreakPointsWidget;

