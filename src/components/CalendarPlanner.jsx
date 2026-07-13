import React, { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './../styles/calendarPlanner.css';

const STORAGE_KEY = 'smart-study-planner-calendar';

function toISODate(value) {
  const d = value instanceof Date ? value : new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadCalendarTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCalendarTasks(tasksByDate) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByDate));
}

function CalendarPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState(() => loadCalendarTasks());
  const [text, setText] = useState('');

  const selectedKey = useMemo(() => toISODate(selectedDate), [selectedDate]);
  const tasks = tasksByDate[selectedKey] || [];

  const hasTasksSet = useMemo(() => {
    return new Set(Object.keys(tasksByDate).filter((k) => (tasksByDate[k] || []).length > 0));
  }, [tasksByDate]);

  const handleAdd = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    const next = {
      ...tasksByDate,
      [selectedKey]: [...(tasksByDate[selectedKey] || []), { id: Date.now(), text: value }],
    };
    setTasksByDate(next);
    saveCalendarTasks(next);
    setText('');
  };

  const handleDelete = (taskId) => {
    const nextList = (tasksByDate[selectedKey] || []).filter((t) => t.id !== taskId);
    const next = { ...tasksByDate, [selectedKey]: nextList };
    setTasksByDate(next);
    saveCalendarTasks(next);
  };

  return (
    <div className="cal-card">
      <div className="cal-head">
        <div className="cal-title">Calendar Planner</div>
        <div className="cal-subtitle">Click a date to add tasks or notes</div>
      </div>

      <div className="cal-layout">
        <div className="cal-calendar-wrap">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            calendarType="gregory"
            tileClassName={({ date }) => (toISODate(date) === selectedKey ? 'cal-selected' : '')}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;
              const key = toISODate(date);
              const count = (tasksByDate[key] || []).length;
              if (!count) return null;
              return <div className="cal-dot" aria-hidden="true" />;
            }}
          />
        </div>

        <div className="cal-side">
          <div className="cal-side-head">
            <div className="cal-date">{selectedKey}</div>
            <div className="cal-count">{tasks.length} item{tasks.length === 1 ? '' : 's'}</div>
          </div>

          <form className="cal-form" onSubmit={handleAdd}>
            <input
              className="cal-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task or note..."
            />
            <button type="submit" className="cal-add-btn">
              Add
            </button>
          </form>

          <div className="cal-list">
            {tasks.length === 0 ? (
              <div className="cal-empty">No tasks for this date yet.</div>
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="cal-item">
                  <div className="cal-item-text">{t.text}</div>
                  <button type="button" className="cal-del-btn" onClick={() => handleDelete(t.id)}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cal-foot">
            <span className="cal-foot-note">
              Dates with tasks are marked with a dot.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPlanner;

