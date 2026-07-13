import React, { useMemo } from 'react';
import { usePlannerTasks } from '../hooks/usePlannerTasks';
import './../styles/studyHeatmap.css';

const DAYS_TO_SHOW = 30;

function buildDailyStats(flatTasks) {
  // Aggregate minutes and completed tasks per weekday (Monday, Tuesday, ...)
  const minutesByWeekday = {};
  const completedByWeekday = {};

  (flatTasks || []).forEach((t) => {
    const dayLabel = t.__day || '';
    if (!dayLabel) return;

    const key = dayLabel;
    if (!minutesByWeekday[key]) {
      minutesByWeekday[key] = 0;
      completedByWeekday[key] = 0;
    }

    const minutes = Number(t?.minutes) > 0 ? Number(t.minutes) : 30;
    minutesByWeekday[key] += minutes;
    if (t.completed) {
      completedByWeekday[key] += 1;
    }
  });

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (DAYS_TO_SHOW - 1));

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayFromDateLabel = (date) => weekdays[date.getDay()];

  const days = [];
  for (let i = 0; i < DAYS_TO_SHOW; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const weekdayLabel = weekdayFromDateLabel(d);
    const minutes = minutesByWeekday[weekdayLabel] || 0;
    const completed = completedByWeekday[weekdayLabel] || 0;
    const hours = minutes / 60;

    let level = 0;
    if (hours > 0 && hours <= 1) level = 1;
    else if (hours > 1 && hours <= 2) level = 2;
    else if (hours > 2 && hours <= 3) level = 3;
    else if (hours > 3) level = 4;

    days.push({
      date: d,
      dateKey: d.toISOString().slice(0, 10),
      weekday: weekdayLabel,
      hours,
      completed,
      level,
    });
  }

  // Group into weeks for a GitHub-like grid (columns = weeks, rows = days of week)
  const weeks = [];
  const ROW_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days.forEach((day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = {};
    }
    weeks[weekIndex][day.weekday] = day;
  });

  return { weeks, rowOrder: ROW_ORDER };
}

function StudyHeatmap() {
  const { flatTasks } = usePlannerTasks();

  const { weeks, rowOrder } = useMemo(() => buildDailyStats(flatTasks), [flatTasks]);

  return (
    <div className="heat-card">
      <div className="heat-head">
        <div className="heat-title">Study Heatmap (Last 30 days)</div>
        <div className="heat-subtitle">
          Darker squares mean more focused study time on that day.
        </div>
      </div>

      <div className="heat-legend">
        <span className="heat-legend-label">Less</span>
        <div className="heat-legend-scale">
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span key={lvl} className={`heat-legend-cell heat-level-${lvl}`} />
          ))}
        </div>
        <span className="heat-legend-label">More</span>
      </div>

      <div className="heat-grid" aria-label="Study activity heatmap for the last 30 days">
        <div className="heat-row-labels" aria-hidden="true">
          {rowOrder.map((label) => (
            <span key={label} className="heat-row-label">
              {label[0]}
            </span>
          ))}
        </div>
        <div className="heat-weeks">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="heat-week-column">
              {rowOrder.map((weekday) => {
                const cell = week[weekday];
                const level = cell ? cell.level : 0;
                const dateStr = cell
                  ? cell.date.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';
                const hoursStr = cell ? cell.hours.toFixed(1) : '0.0';
                const tooltip = cell
                  ? `${dateStr}\nStudy time: ${hoursStr} hrs\nCompleted tasks: ${cell.completed}`
                  : 'No study recorded';

                return (
                  <div
                    key={`${wIdx}-${weekday}`}
                    className={`heat-cell heat-level-${level}`}
                    title={tooltip}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyHeatmap;

