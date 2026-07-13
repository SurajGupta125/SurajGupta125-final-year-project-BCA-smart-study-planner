import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/aiStudyPlanner.css';

function buildPlan(subjectRaw, daysRaw, hoursRaw) {
  const subject = subjectRaw?.trim() || 'Study';
  const days = Math.max(parseInt(daysRaw, 10) || 0, 1);
  const hours = Math.max(Number(hoursRaw) || 0, 0);

  const baseTopics = [
    `${subject} Basics`,
    `Core ${subject} Concepts`,
    `${subject} Practice`,
    `${subject} Advanced Topics`,
  ];

  const plan = [];

  if (days === 1) {
    plan.push({
      label: `Intensive overview & key concepts for ${subject}`,
      hours,
    });
  } else if (days === 2) {
    plan.push({ label: `${subject} Basics & fundamentals`, hours });
    plan.push({ label: `${subject} Practice + quick revision`, hours });
  } else {
    // For >=3 days, keep first few days structured and always end with revision.
    for (let i = 0; i < days; i += 1) {
      if (i === days - 1) {
        plan.push({ label: 'Revision and practice (mock questions, summaries)', hours });
      } else if (i < baseTopics.length) {
        plan.push({ label: baseTopics[i], hours });
      } else {
        plan.push({ label: `${subject} mixed practice & spaced revision`, hours });
      }
    }
  }

  return plan.map((item, idx) => ({
    day: idx + 1,
    label: item.label,
    hours: item.hours,
  }));
}

function AIStudyPlanner() {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [plan, setPlan] = useState([]);
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      // eslint-disable-next-line no-alert
      alert('Please enter a subject or topic.');
      return;
    }

    const d = parseInt(days, 10);
    const h = Number(hoursPerDay);

    if (!Number.isFinite(d) || d <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please enter a valid number of days (at least 1).');
      return;
    }

    if (!Number.isFinite(h) || h <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please enter valid study hours per day (greater than 0).');
      return;
    }

    const generated = buildPlan(subject, d, h);
    setPlan(generated);
  };

  const handleAddToPlanner = () => {
    if (!plan.length) return;
    
    // Get existing tasks from the correct key used by usePlannerTasks
    const STORAGE_KEY = 'smart-study-planner-tasks';
    const existingData = localStorage.getItem(STORAGE_KEY);
    const existingTasks = existingData ? JSON.parse(existingData) : {};
    
    // Determine the next upcoming days
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    
    plan.forEach((item, idx) => {
      const targetDayIndex = (todayIndex + idx) % 7;
      const dayName = dayNames[targetDayIndex];
      const timeSlot = '10:00 AM'; // using a valid time slot from plannerConfig.js
      const cellKey = `${dayName}|${timeSlot}`;
      
      if (!existingTasks[cellKey]) {
        existingTasks[cellKey] = [];
      }
      
      existingTasks[cellKey].push({
        id: Date.now() + idx,
        subject: subject,
        topic: item.label,
        priority: 'High',
        minutes: item.hours * 60,
        completed: false
      });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTasks));
    alert('Plan successfully added to your Planner!');
    navigate('/planner');
  };

  return (
    <div className="ai-card">
      <div className="ai-head">
        <div className="ai-title">AI Study Planner</div>
        <div className="ai-subtitle">
          Generate a focused, day-by-day plan for your next exam.
        </div>
      </div>

      <form className="ai-form" onSubmit={handleGenerate}>
        <div className="ai-field-group">
          <label className="ai-label" htmlFor="ai-subject">
            Subject / Topic
          </label>
          <input
            id="ai-subject"
            type="text"
            className="ai-input"
            placeholder="e.g. React, Physics, Algorithms"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="ai-row">
          <div className="ai-field-group">
            <label className="ai-label" htmlFor="ai-days">
              Days until exam
            </label>
            <input
              id="ai-days"
              type="number"
              min="1"
              className="ai-input"
              placeholder="e.g. 5"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <div className="ai-field-group">
            <label className="ai-label" htmlFor="ai-hours">
              Study hours per day
            </label>
            <input
              id="ai-hours"
              type="number"
              min="0.5"
              step="0.5"
              className="ai-input"
              placeholder="e.g. 2"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="ai-btn">
          Generate Study Plan
        </button>
      </form>

      {plan.length > 0 && (
        <div className="ai-plan">
          <div className="ai-plan-title">Generated Study Plan</div>
          <ul className="ai-plan-list">
            {plan.map((item) => (
              <li key={item.day} className="ai-plan-item">
                <span className="ai-plan-day">Day {item.day}:</span>
                <span className="ai-plan-text">{item.label}</span>
                {item.hours > 0 && (
                  <span className="ai-plan-hours"> · {item.hours} hrs</span>
                )}
              </li>
            ))}
          </ul>
          <button 
            type="button" 
            className="ai-btn" 
            style={{ marginTop: '16px', background: '#10b981' }} 
            onClick={handleAddToPlanner}
          >
            Add to Planner
          </button>
        </div>
      )}
    </div>
  );
}

export default AIStudyPlanner;

