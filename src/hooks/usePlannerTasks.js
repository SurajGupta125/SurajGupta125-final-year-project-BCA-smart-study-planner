import { useEffect, useMemo, useState } from 'react';

export const STORAGE_KEY = 'smart-study-planner-tasks';
export const WEAK_TOPIC_KEY = 'smart-study-planner-weak-topic';
export const TASK_LIST_KEY = 'smart-study-planner-task-list';

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveTaskList(flatTasks) {
  const list = (flatTasks || [])
    .map((task) => ({
      subject: (task?.subject || '').toString().trim(),
      topic: (task?.topic || '').toString().trim(),
      time: (task?.__time || '').toString().trim(),
    }))
    .filter((task) => task.subject || task.topic || task.time);
  localStorage.setItem(TASK_LIST_KEY, JSON.stringify(list));
}

export function flattenTasks(byCell) {
  const rows = [];
  Object.entries(byCell || {}).forEach(([key, arr]) => {
    if (!Array.isArray(arr)) return;
    const [day, time] = key.split('|');
    arr.forEach((task) => {
      if (!task || typeof task !== 'object') return;
      rows.push({ ...task, __day: day, __time: time });
    });
  });
  return rows;
}

function guessWeakTopic(incompleteTasks) {
  const candidate = incompleteTasks
    .map((t) => (t?.subject || t?.name || '').trim())
    .filter(Boolean)
    .map((s) => s.split(/[:\-|]/)[0]?.trim())
    .find(Boolean);
  return candidate || '';
}

const ORDERED_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function usePlannerTasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const flatTasks = useMemo(() => flattenTasks(tasks), [tasks]);

  useEffect(() => {
    saveTasks(tasks);
    saveTaskList(flatTasks);
    window.dispatchEvent(new Event('planner-tasks-updated'));
  }, [tasks, flatTasks]);

  const stats = useMemo(() => {
    const total = flatTasks.length;
    const completed = flatTasks.filter((t) => t?.completed).length;
    const productivity = total ? Math.round((completed / total) * 100) : 0;

    let weakTopic = '';
    try {
      const stored = (localStorage.getItem(WEAK_TOPIC_KEY) || '').trim();
      if (stored) {
        weakTopic = stored;
      } else {
        weakTopic = guessWeakTopic(flatTasks.filter((t) => !t?.completed));
      }
    } catch {
      weakTopic = guessWeakTopic(flatTasks.filter((t) => !t?.completed));
    }

    if (!weakTopic) {
      weakTopic = 'No weak topic selected yet';
    }

    const perDayMap = {};
    flatTasks.forEach((t) => {
      const day = t.__day || 'Unknown';
      if (!perDayMap[day]) {
        perDayMap[day] = { total: 0, completed: 0 };
      }
      perDayMap[day].total += 1;
      if (t.completed) perDayMap[day].completed += 1;
    });

    const perDay = ORDERED_DAYS.map((day) => ({
      day,
      label: day.slice(0, 3),
      total: perDayMap[day]?.total || 0,
      completed: perDayMap[day]?.completed || 0,
    }));

    const activeDays = perDay.filter((d) => d.completed > 0).length;

    return { total, completed, productivity, weakTopic, perDay, activeDays };
  }, [flatTasks]);

  return { tasks, setTasks, flatTasks, stats };
}

