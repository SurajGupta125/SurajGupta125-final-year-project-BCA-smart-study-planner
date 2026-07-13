import { useCallback, useEffect, useState } from 'react';
import { TASK_LIST_KEY } from './usePlannerTasks';

export const ACTIVE_RESOURCE_KEY = 'smart-study-planner-active-resource';

function readTasksFromStorage() {
  try {
    const raw = localStorage.getItem(TASK_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function getUniqueSubjects(tasks) {
  const set = new Set();
  tasks.forEach((task) => {
    const subject = (task?.subject || '').toString().trim();
    if (subject) set.add(subject);
  });
  return Array.from(set);
}

export function usePlannerSubjects() {
  const [subjects, setSubjects] = useState(() => getUniqueSubjects(readTasksFromStorage()));

  const refreshSubjects = useCallback(() => {
    setSubjects(getUniqueSubjects(readTasksFromStorage()));
  }, []);

  useEffect(() => {
    refreshSubjects();
    window.addEventListener('storage', refreshSubjects);
    window.addEventListener('focus', refreshSubjects);
    window.addEventListener('planner-tasks-updated', refreshSubjects);
    return () => {
      window.removeEventListener('storage', refreshSubjects);
      window.removeEventListener('focus', refreshSubjects);
      window.removeEventListener('planner-tasks-updated', refreshSubjects);
    };
  }, [refreshSubjects]);

  const setLatestSelection = useCallback((subject, topic) => {
    try {
      localStorage.setItem(
        ACTIVE_RESOURCE_KEY,
        JSON.stringify({
          subject: (subject || '').toString().trim(),
          topic: (topic || '').toString().trim(),
        })
      );
    } catch {
      // ignore storage errors
    }
  }, []);

  return { subjects, refreshSubjects, setLatestSelection };
}

