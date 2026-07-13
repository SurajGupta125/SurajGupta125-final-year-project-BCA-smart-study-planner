import React, { useEffect, useMemo, useState } from 'react';
import './../styles/studyReminder.css';

const STORAGE_KEY = 'smart-study-planner-reminder-time';

function parseTimeToNextDate(timeStr) {
  if (!timeStr) return null;
  const [hh, mm] = timeStr.split(':').map((v) => Number(v));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;

  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

function formatNextReminder(target) {
  if (!target) return 'No reminder set';

  const now = new Date();
  const isToday =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();

  const dayLabel = isToday ? 'Today' : 'Tomorrow';
  const timeLabel = target.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dayLabel} at ${timeLabel}`;
}

function StudyReminder() {
  const [timeInput, setTimeInput] = useState('');
  const [savedTime, setSavedTime] = useState('');

  const nextReminderDate = useMemo(() => parseTimeToNextDate(savedTime), [savedTime]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedTime(stored);
        setTimeInput(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!savedTime) return undefined;

    const target = parseTimeToNextDate(savedTime);
    if (!target) return undefined;

    const now = new Date();
    const delay = target.getTime() - now.getTime();
    if (delay <= 0) return undefined;

    const id = setTimeout(() => {
      try {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            // eslint-disable-next-line no-new
            new Notification('Time to Study', {
              body: 'Your scheduled study session is starting now.',
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                // eslint-disable-next-line no-new
                new Notification('Time to Study', {
                  body: 'Your scheduled study session is starting now.',
                });
              } else {
                // eslint-disable-next-line no-alert
                alert('Time to Study');
              }
            });
          } else {
            // eslint-disable-next-line no-alert
            alert('Time to Study');
          }
        } else {
          // eslint-disable-next-line no-alert
          alert('Time to Study');
        }
      } catch {
        // eslint-disable-next-line no-alert
        alert('Time to Study');
      }
    }, delay);

    return () => clearTimeout(id);
  }, [savedTime]);

  const handleSetReminder = (e) => {
    e.preventDefault();
    if (!timeInput) {
      // eslint-disable-next-line no-alert
      alert('Please choose a time for your reminder.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, timeInput);
      setSavedTime(timeInput);
    } catch {
      // eslint-disable-next-line no-alert
      alert('Unable to save reminder. Please check your browser settings.');
    }
  };

  return (
    <div className="reminder-card">
      <div className="reminder-head">
        <div className="reminder-title">Study Reminder</div>
        <div className="reminder-subtitle">Set a daily time to get a gentle nudge.</div>
      </div>

      <form className="reminder-form" onSubmit={handleSetReminder}>
        <label className="reminder-label" htmlFor="study-reminder-time">
          Reminder time
        </label>
        <div className="reminder-row">
          <input
            id="study-reminder-time"
            type="time"
            className="reminder-time-input"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
          <button type="submit" className="reminder-btn">
            Set Reminder
          </button>
        </div>
      </form>

      <div className="reminder-next">
        <span className="reminder-next-label">Next reminder:</span>
        <span className="reminder-next-value">
          {formatNextReminder(nextReminderDate)}
        </span>
      </div>
    </div>
  );
}

export default StudyReminder;

