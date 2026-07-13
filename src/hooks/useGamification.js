// import { useEffect, useMemo, useState } from 'react';

// const KEY = 'smart-study-planner-gamification';

// const DEFAULT_STATE = {
//   points: 0,
//   streakDays: 0,
//   lastActiveDate: null, // YYYY-MM-DD
//   totalCompletedTasks: 0,
// };

// function toISODateLocal(d = new Date()) {
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

// function addDays(isoDate, delta) {
//   const [y, m, d] = isoDate.split('-').map(Number);
//   const dt = new Date(y, m - 1, d);
//   dt.setDate(dt.getDate() + delta);
//   return toISODateLocal(dt);
// }

// function loadState() {
//   try {
//     const raw = localStorage.getItem(KEY);
//     return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
//   } catch {
//     return DEFAULT_STATE;
//   }
// }

// function saveState(state) {
//   localStorage.setItem(KEY, JSON.stringify(state));
// }

// function normalizeStreak(state) {
//   if (!state.lastActiveDate) return state;
//   const today = toISODateLocal();
//   const yesterday = addDays(today, -1);

//   // If user missed at least one full day since last activity, streak resets to 0.
//   // Example: lastActiveDate <= day-before-yesterday.
//   if (state.lastActiveDate !== today && state.lastActiveDate !== yesterday) {
//     return { ...state, streakDays: 0 };
//   }
//   return state;
// }

// function getLevel(points) {
//   if (points >= 500) return { name: 'Advanced', min: 500, max: 1000 };
//   if (points >= 200) return { name: 'Intermediate', min: 200, max: 500 };
//   return { name: 'Beginner', min: 0, max: 200 };
// }

// export function useGamification() {
//   const [state, setState] = useState(() => normalizeStreak(loadState()));

//   useEffect(() => {
//     saveState(state);
//   }, [state]);

//   // Also normalize streak when the day changes (best-effort, when component mounts/updates).
//   useEffect(() => {
//     const next = normalizeStreak(state);
//     if (next.streakDays !== state.streakDays) setState(next);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const level = useMemo(() => getLevel(state.points), [state.points]);

//   const progress = useMemo(() => {
//     const range = Math.max(level.max - level.min, 1);
//     const inLevel = Math.min(Math.max(state.points - level.min, 0), range);
//     const percent = Math.round((inLevel / range) * 100);
//     const nextTarget = state.points >= level.max ? null : level.max;
//     return { percent, nextTarget };
//   }, [level.max, level.min, state.points]);

//   const recordStudyActivity = () => {
//     const today = toISODateLocal();
//     setState((prev) => {
//       const normalized = normalizeStreak(prev);
//       if (normalized.lastActiveDate === today) {
//         return normalized; // already counted today
//       }

//       const yesterday = addDays(today, -1);
//       const nextStreak =
//         normalized.lastActiveDate === yesterday ? (normalized.streakDays || 0) + 1 : 1;

//       let nextPoints = normalized.points;
//       // 7-day streak bonus (every time you reach a multiple of 7)
//       if (nextStreak > 0 && nextStreak % 7 === 0) {
//         nextPoints += 50;
//       }

//       return {
//         ...normalized,
//         streakDays: nextStreak,
//         lastActiveDate: today,
//         points: nextPoints,
//       };
//     });
//   };

//   const recordTaskCompletions = (count = 1) => {
//     const n = Number(count) || 0;
//     if (n <= 0) return;

//     // Completing tasks implies user studied today.
//     recordStudyActivity();

//     setState((prev) => {
//       const normalized = normalizeStreak(prev);
//       const nextCompleted = (normalized.totalCompletedTasks || 0) + n;
//       let nextPoints = (normalized.points || 0) + n * 10;

//       // Bonus +20 for every 5 tasks completed (cumulative milestones)
//       const prevMilestones = Math.floor((normalized.totalCompletedTasks || 0) / 5);
//       const nextMilestones = Math.floor(nextCompleted / 5);
//       const newlyReached = nextMilestones - prevMilestones;
//       if (newlyReached > 0) {
//         nextPoints += newlyReached * 20;
//       }

//       return {
//         ...normalized,
//         totalCompletedTasks: nextCompleted,
//         points: nextPoints,
//       };
//     });
//   };

//   const resetGamification = () => {
//     setState(DEFAULT_STATE);
//   };

//   return { state, level, progress, recordTaskCompletions, recordStudyActivity, resetGamification };
// }

import { useEffect, useMemo, useState } from 'react';

const KEY = 'smart-study-planner-gamification';

const DEFAULT_STATE = {
  points: 0,
  streakDays: 0,
  lastActiveDate: null,
  totalCompletedTasks: 0,
};

function toISODateLocal(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(isoDate, delta) {
  const [y, m, d] = isoDate.split('-').map(Number);

  const dt = new Date(y, m - 1, d);

  dt.setDate(dt.getDate() + delta);

  return toISODateLocal(dt);
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);

    return raw
      ? { ...DEFAULT_STATE, ...JSON.parse(raw) }
      : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function normalizeStreak(state) {
  if (!state.lastActiveDate) {
    return state;
  }

  const today = toISODateLocal();
  const yesterday = addDays(today, -1);

  if (
    state.lastActiveDate !== today &&
    state.lastActiveDate !== yesterday
  ) {
    return {
      ...state,
      streakDays: 0,
    };
  }

  return state;
}

function getLevel(points) {
  if (points >= 500) {
    return {
      name: 'Advanced',
      min: 500,
      max: 1000,
    };
  }

  if (points >= 200) {
    return {
      name: 'Intermediate',
      min: 200,
      max: 500,
    };
  }

  return {
    name: 'Beginner',
    min: 0,
    max: 200,
  };
}

export function useGamification() {
  const [state, setState] = useState(() =>
    normalizeStreak(loadState())
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const next = normalizeStreak(state);

    if (next.streakDays !== state.streakDays) {
      setState(next);
    }
  }, [state]);

  const level = useMemo(() => {
    return getLevel(state.points);
  }, [state.points]);

  const progress = useMemo(() => {
    const range = Math.max(
      level.max - level.min,
      1
    );

    const inLevel = Math.min(
      Math.max(state.points - level.min, 0),
      range
    );

    const percent = Math.round(
      (inLevel / range) * 100
    );

    const nextTarget =
      state.points >= level.max
        ? null
        : level.max;

    return {
      percent,
      nextTarget,
    };
  }, [
    level.max,
    level.min,
    state.points,
  ]);

  const recordStudyActivity = () => {
    const today = toISODateLocal();

    setState((prev) => {
      const normalized =
        normalizeStreak(prev);

      if (
        normalized.lastActiveDate ===
        today
      ) {
        return normalized;
      }

      const yesterday = addDays(
        today,
        -1
      );

      const nextStreak =
        normalized.lastActiveDate ===
        yesterday
          ? (normalized.streakDays || 0) + 1
          : 1;

      let nextPoints = normalized.points;

      if (
        nextStreak > 0 &&
        nextStreak % 7 === 0
      ) {
        nextPoints += 50;
      }

      return {
        ...normalized,
        streakDays: nextStreak,
        lastActiveDate: today,
        points: nextPoints,
      };
    });
  };

  const recordTaskCompletions = (
    count = 1
  ) => {
    const n = Number(count) || 0;

    if (n <= 0) {
      return;
    }

    recordStudyActivity();

    setState((prev) => {
      const normalized =
        normalizeStreak(prev);

      const nextCompleted =
        (normalized.totalCompletedTasks ||
          0) + n;

      let nextPoints =
        (normalized.points || 0) + n * 10;

      const prevMilestones = Math.floor(
        (normalized.totalCompletedTasks ||
          0) / 5
      );

      const nextMilestones =
        Math.floor(nextCompleted / 5);

      const newlyReached =
        nextMilestones - prevMilestones;

      if (newlyReached > 0) {
        nextPoints += newlyReached * 20;
      }

      return {
        ...normalized,
        totalCompletedTasks:
          nextCompleted,
        points: nextPoints,
      };
    });
  };

  const resetGamification = () => {
    setState(DEFAULT_STATE);
  };

  return {
    state,
    level,
    progress,
    recordTaskCompletions,
    recordStudyActivity,
    resetGamification,
  };
}
