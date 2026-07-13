import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiCheckSquare, FiPlusSquare, FiZap } from 'react-icons/fi';
import TaskModal from './TaskModal';
import ResourceModal from './ResourceModal';
import { DAYS, TIME_SLOTS, DAY_COLORS } from '../config/plannerConfig';
import { usePlannerSubjects } from '../hooks/usePlannerSubjects';
import './../styles/planner.css';

function getCellKey(day, time) {
  return `${day}|${time}`;
}

function parseTaskLabel(task) {
  if (!task) return { subject: '', topic: '' };
  if (task.subject || task.topic) return { subject: task.subject || '', topic: task.topic || '' };
  const raw = (task.name || '').toString();
  const parts = raw.split(/[:\-|]/);
  const subject = (parts[0] || raw).trim();
  const topic = (parts.slice(1).join('-') || '').trim();
  return { subject, topic };
}

function PlannerGrid({ tasks = {}, setTasks, selectedCell, setSelectedCell, onTasksCompleted }) {
  const navigate = useNavigate();
  const [localSelected, setLocalSelected] = useState({ day: null, time: null });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const { setLatestSelection } = usePlannerSubjects();

  const selected = selectedCell || localSelected;
  const updateSelected = setSelectedCell || setLocalSelected;

  const weekHeaders = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const diffToMonday = (day + 6) % 7; // 0 for Mon
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    const abbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return DAYS.map((_, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      return `${d.getDate()} ${abbr[idx]}`;
    });
  }, []);

  const handleCellClick = (day, time) => {
    updateSelected({ day, time });
  };

  const handleAddTask = () => {
    if (selected.day && selected.time) {
      setTaskModalOpen(true);
    } else {
      alert('Please select a day and time slot first by clicking a cell in the grid.');
    }
  };

  const handleSaveTask = (taskInput) => {
    if (!setTasks) return;
    const key = getCellKey(selected.day, selected.time);
    const cellTasks = tasks[key] || [];
    const payload =
      typeof taskInput === 'string'
        ? { id: Date.now(), name: taskInput, completed: false }
        : { id: Date.now(), completed: false, ...taskInput };
    setTasks({ ...tasks, [key]: [...cellTasks, payload] });

    setLatestSelection(payload.subject, payload.topic);
  };

  const handleMarkCompleted = () => {
    if (!setTasks) return;
    if (!selected.day || !selected.time) {
      alert('Please select a cell that contains a task.');
      return;
    }
    const key = getCellKey(selected.day, selected.time);
    const cellTasks = tasks[key] || [];
    const hasIncomplete = cellTasks.some((t) => !t.completed);
    if (!hasIncomplete) {
      alert('No incomplete tasks in this cell.');
      return;
    }
    const newlyCompleted = cellTasks.filter((t) => !t.completed).length;
    setTasks({ ...tasks, [key]: cellTasks.map((t) => (t.completed ? t : { ...t, completed: true })) });
    if (newlyCompleted > 0 && typeof onTasksCompleted === 'function') {
      onTasksCompleted(newlyCompleted);
    }
  };

  const handleToggleTaskCompleted = (day, time, taskId) => {
    if (!setTasks) return;
    const key = getCellKey(day, time);
    const existing = tasks[key] || [];
    const target = existing.find((t) => t.id === taskId);
    const willComplete = target ? !target.completed : false;
    const cellTasks = existing.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setTasks({ ...tasks, [key]: cellTasks });
    if (willComplete && typeof onTasksCompleted === 'function') {
      onTasksCompleted(1);
    }
  };

  const handleResourceSubmit = (message) => {
    console.log('Resource request:', message);
    alert('Resource request submitted: ' + message);
  };

  const getCellTasks = (day, time) => {
    return tasks[getCellKey(day, time)] || [];
  };

  // Get subject from the selected cell (first task's subject)
  const getSelectedSubject = () => {
    if (!selected.day || !selected.time) return null;
    const cellTasks = getCellTasks(selected.day, selected.time);
    if (cellTasks.length === 0) return null;
    const label = parseTaskLabel(cellTasks[0]);
    return label.subject || null;
  };

  const handleStartQuiz = () => {
    const subject = getSelectedSubject();
    if (!subject) {
      alert('Please select a cell with a task to start the quiz, or a cell that has a subject.');
      return;
    }
    navigate('/quiz', { state: { subject } });
  };

  const isSelected = (day, time) =>
    selected.day === day && selected.time === time;

  return (
    <div className="planner-grid-wrap">
      <div className="planner-container planner-container--grid">
        <div className="planner-grid">
          <div className="grid-corner grid-corner--cap">
            <div className="grid-corner-chip">Time</div>
          </div>
          {DAYS.map((day, idx) => (
            <div key={day} className="grid-header-cell">
              <div className="grid-header-text">{weekHeaders[idx]}</div>
            </div>
          ))}
          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              <div className="grid-time-cell">{time}</div>
              {DAYS.map((day) => {
                const cellTasks = getCellTasks(day, time);
                const selectedActive = isSelected(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`grid-cell ${selectedActive ? 'selected' : ''}`}
                    onClick={() => handleCellClick(day, time)}
                  >
                    <div className="cell-tasks">
                      {cellTasks.map((task) => {
                        const label = parseTaskLabel(task);
                        const tooltip = `${label.subject || 'Task'}${label.topic ? ` – ${label.topic}` : ''}${
                          task.minutes ? ` (${task.minutes} min)` : ''
                        }${task.priority ? ` [${task.priority}]` : ''}`;
                        return (
                          <div
                            key={task.id}
                            className={`task-content task-content--figma ${DAY_COLORS[day] || ''} ${
                              task.completed ? 'completed' : ''
                            }`}
                            title={tooltip}
                          >
                            <div className="task-left">
                              <div className="task-mini-icon" aria-hidden="true" />
                              <div className="task-lines">
                                <div className="task-subject">{label.subject || 'Task'}</div>
                                {label.topic ? <div className="task-topic">{label.topic}</div> : null}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="task-check-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTaskCompleted(day, time, task.id);
                              }}
                              aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                            >
                              {task.completed ? <FiCheck className="task-check-icon" /> : null}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="planner-bottom-bar planner-bottom-bar--figma">
        <button type="button" className="bottom-action bottom-action--blue" onClick={handleAddTask}>
          <FiPlusSquare /> Add New Task
        </button>
        <button
          type="button"
          className="bottom-action bottom-action--amber"
          onClick={() => setResourceModalOpen(true)}
        >
          <FiZap /> Request Resources
        </button>
        <button type="button" className="bottom-action bottom-action--green" onClick={handleMarkCompleted}>
          <FiCheckSquare /> Mark Task Complete
        </button>
        <button type="button" className="bottom-action bottom-action--quiz" onClick={handleStartQuiz}>
          🧠 Start Quiz
        </button>
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        selectedDay={selected.day}
        selectedTime={selected.time}
        onSave={handleSaveTask}
      />
      <ResourceModal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        onSubmit={handleResourceSubmit}
      />
    </div>
  );
}

export default PlannerGrid;
