import React, { useMemo } from 'react';
import { useGamification } from '../hooks/useGamification';
import './../styles/gamification.css';

function mapPointsToLevel(points) {
  const p = Number(points) || 0;
  if (p >= 600) {
    return {
      name: 'Study Pro',
      min: 600,
      max: 1000,
      badgeClass: 'ach-badge ach-badge--pro',
    };
  }
  if (p >= 301) {
    return {
      name: 'Focus Master',
      min: 301,
      max: 600,
      badgeClass: 'ach-badge ach-badge--focus',
    };
  }
  if (p >= 101) {
    return {
      name: 'Learner',
      min: 101,
      max: 300,
      badgeClass: 'ach-badge ach-badge--learner',
    };
  }
  return {
    name: 'Beginner',
    min: 0,
    max: 100,
    badgeClass: 'ach-badge ach-badge--beginner',
  };
}

function Achievements() {
  const { state } = useGamification();
  const points = Number(state.points) || 0;

  const { level, progressPercent, pointsToNext } = useMemo(() => {
    const mapped = mapPointsToLevel(points);
    const range = Math.max(mapped.max - mapped.min || 1, 1);
    const inLevel = Math.min(Math.max(points - mapped.min, 0), range);
    const percent = Math.round((inLevel / range) * 100);
    const remaining = points >= mapped.max ? 0 : mapped.max - points;
    return {
      level: mapped,
      progressPercent: percent,
      pointsToNext: remaining,
    };
  }, [points]);

  return (
    <div className="ach-card">
      <div className="ach-top">
        <div className="ach-left">
          <div className="ach-icon" aria-hidden="true">
            🏅
          </div>
          <div className="ach-meta">
            <div className="ach-title">Achievements</div>
            <div className="ach-subtitle">Keep studying to unlock higher levels.</div>
          </div>
        </div>
        <span className={level.badgeClass}>{level.name}</span>
      </div>

      <div className="ach-points">
        <div className="ach-points-row">
          <div className="ach-points-label">Total Points</div>
          <div className="ach-points-value">{points}</div>
        </div>

        <div className="ach-bar" aria-hidden="true">
          <div className="ach-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="ach-foot">
          {pointsToNext > 0 ? (
            <span className="ach-foot-text">
              {pointsToNext} pts to reach the next level.
            </span>
          ) : (
            <span className="ach-foot-text">You&apos;ve reached the top tier. Amazing work!</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Achievements;

