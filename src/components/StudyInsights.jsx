import React, { useMemo } from 'react';
import { FiTrendingUp, FiTarget, FiAward, FiClock } from 'react-icons/fi';
import { usePlannerTasks } from '../hooks/usePlannerTasks';
import { useGamification } from '../hooks/useGamification';
import './../styles/studyInsights.css';

function computeWeeklyHours(flatTasks) {
  const completedMinutes = (flatTasks || [])
    .filter((t) => t?.completed)
    .reduce((sum, t) => sum + (Number(t?.minutes) > 0 ? Number(t.minutes) : 30), 0);
  return Math.round((completedMinutes / 60) * 10) / 10;
}

function computeWeeklyGoalAndProgress(flatTasks) {
  let goal = 10; // default fallback (hours)
  try {
    const prefsRaw = localStorage.getItem('smart-study-planner-prefs');
    const prefs = prefsRaw ? JSON.parse(prefsRaw) : null;
    const daily = Number(prefs?.dailyGoalHours);
    if (Number.isFinite(daily) && daily > 0) goal = daily * 7;
  } catch {
    // ignore
  }

  const completedHours = computeWeeklyHours(flatTasks);
  const pct = goal > 0 ? (completedHours / goal) * 100 : 0;

  return {
    weeklyGoal: Math.round(goal * 10) / 10,
    completedHours,
    goalProgressPct: Math.min(Math.max(pct, 0), 100),
  };
}

function deriveBestDayAndPattern(stats) {
  const perDay = stats?.perDay || [];
  if (!perDay.length) return { bestDay: null, productivePattern: null };

  let bestDay = null;
  let bestCompleted = -1;
  perDay.forEach((d) => {
    if (d.completed > bestCompleted) {
      bestCompleted = d.completed;
      bestDay = d.day;
    }
  });

  const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekendNames = ['Saturday', 'Sunday'];

  const weekdayCompleted = perDay
    .filter((d) => weekdayNames.includes(d.day))
    .reduce((sum, d) => sum + d.completed, 0);
  const weekendCompleted = perDay
    .filter((d) => weekendNames.includes(d.day))
    .reduce((sum, d) => sum + d.completed, 0);

  let productivePattern = null;
  if (weekdayCompleted === 0 && weekendCompleted === 0) {
    productivePattern = null;
  } else if (weekdayCompleted >= weekendCompleted * 1.2) {
    productivePattern = 'weekdays';
  } else if (weekendCompleted >= weekdayCompleted * 1.2) {
    productivePattern = 'weekends';
  } else {
    productivePattern = 'balanced';
  }

  return { bestDay, productivePattern };
}

function StudyInsights() {
  const { stats, flatTasks } = usePlannerTasks();
  const { state } = useGamification();

  const { weeklyGoal, completedHours, goalProgressPct } = useMemo(
    () => computeWeeklyGoalAndProgress(flatTasks),
    [flatTasks],
  );

  const { bestDay, productivePattern } = useMemo(
    () => deriveBestDayAndPattern(stats),
    [stats],
  );

  const streakDays = Number(state.streakDays) || 0;

  const insights = useMemo(() => {
    const list = [];

    if (productivePattern === 'weekdays') {
      list.push({
        icon: <FiTrendingUp />,
        text: 'You are most productive on weekdays.',
      });
    } else if (productivePattern === 'weekends') {
      list.push({
        icon: <FiTrendingUp />,
        text: 'You are most productive on weekends.',
      });
    } else if (productivePattern === 'balanced') {
      list.push({
        icon: <FiTrendingUp />,
        text: 'Your productivity is balanced across weekdays and weekends.',
      });
    }

    if (bestDay) {
      list.push({
        icon: <FiAward />,
        text: `Your most productive day is ${bestDay}.`,
      });
    }

    if (completedHours > 0) {
      list.push({
        icon: <FiClock />,
        text: `You studied approximately ${completedHours.toFixed(1)} hours this week.`,
      });
    }

    if (weeklyGoal > 0) {
      list.push({
        icon: <FiTarget />,
        text: `You completed about ${Math.round(goalProgressPct)}% of your weekly study goal.`,
      });
    }

    if (streakDays > 0) {
      list.push({
        icon: <FiTrendingUp />,
        text: `Your current study streak is ${streakDays} day${
          streakDays === 1 ? '' : 's'
        } — keep it going!`,
      });
    } else {
      list.push({
        icon: <FiTrendingUp />,
        text: 'Start a new streak by completing at least one study session today.',
      });
    }

    return list;
  }, [productivePattern, bestDay, completedHours, weeklyGoal, goalProgressPct, streakDays]);

  return (
    <div className="insights-card">
      <div className="insights-head">
        <div className="insights-title">Smart Insights</div>
        <div className="insights-subtitle">
          Quick highlights from your recent study patterns.
        </div>
      </div>

      <ul className="insights-list">
        {insights.map((item, idx) => (
          <li key={idx} className="insights-item">
            <span className="insights-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="insights-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudyInsights;

