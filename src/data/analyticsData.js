// // Sample analytics data for charts

// export const WEEKLY_STUDY_HOURS = [
//   { day: 'Mon', hours: 2 },
//   { day: 'Tue', hours: 3 },
//   { day: 'Wed', hours: 1.5 },
//   { day: 'Thu', hours: 4 },
//   { day: 'Fri', hours: 2 },
//   { day: 'Sat', hours: 3 },
//   { day: 'Sun', hours: 1 },
// ];

// export const SUBJECT_DISTRIBUTION = [
//   { name: 'JavaScript', value: 28, color: '#3b82f6' },
//   { name: 'Data Structures', value: 24, color: '#10b981' },
//   { name: 'Database', value: 22, color: '#f59e0b' },
//   { name: 'React', value: 26, color: '#8b5cf6' },
// ];

// export const PRODUCTIVITY_TREND = [
//   { week: 'Week 1', hours: 12 },
//   { week: 'Week 2', hours: 15 },
//   { week: 'Week 3', hours: 14 },
//   { week: 'Week 4', hours: 18 },
//   { week: 'Week 5', hours: 16 },
//   { week: 'Week 6', hours: 20 },
// ];

// export const ANALYTICS_SUMMARY = {
//   totalStudyHours: 16.5,
//   completedTasks: 24,
//   studyConsistency: 78,
// };


// 🔥 GET TASKS FROM LOCALSTORAGE
const getTasks = () => {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
};

// 🔥 WEEKLY STUDY HOURS (DYNAMIC)
export const getWeeklyStudyHours = () => {
  const tasks = getTasks();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const map = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  tasks.forEach((t) => {
    if (!t.__day) return;

    const day = t.__day.slice(0, 3);
    const duration = parseFloat(t.duration);

    if (!isNaN(duration) && map[day] !== undefined) {
      map[day] += duration;
    }
  });

  return days.map((d) => ({
    day: d,
    hours: map[d],
  }));
};

// 🔥 SUBJECT DISTRIBUTION
export const getSubjectDistribution = () => {
  const tasks = getTasks();

  const map = {};
  const colors = ["#4f8dfd", "#8b5cf6", "#f59e0b", "#10b981"];

  tasks.forEach((t) => {
    const sub = t.subject || "Other";
    map[sub] = (map[sub] || 0) + 1;
  });

  return Object.keys(map).map((k, i) => ({
    name: k,
    value: map[k],
    color: colors[i % colors.length],
  }));
};

// 🔥 SUMMARY
export const getSummary = () => {
  const tasks = getTasks();

  const totalStudyHours = tasks.reduce((sum, t) => {
    const d = parseFloat(t.duration);
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  const completedTasks = tasks.filter((t) => t.completed).length;

  return {
    totalStudyHours,
    completedTasks,
    studyConsistency: tasks.length
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0,
  };
};

// 🔥 PRODUCTIVITY TREND
export const getProductivityTrend = () => {
  const tasks = getTasks();

  const totalHours = tasks.reduce((sum, t) => {
    const d = parseFloat(t.duration);
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return weeks.map((w, i) => ({
    week: w,
    hours: Math.round((totalHours / 4) * (i + 1)),
  }));
};