
import React, { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import PlannerGrid from "../components/PlannerGrid";
import { usePlannerTasks } from "../hooks/usePlannerTasks";
import { useGamification } from "../hooks/useGamification";
import { DAYS, TIME_SLOTS } from "../config/plannerConfig";
import "./../styles/planner.css";

function Planner() {
  const userName =
    JSON.parse(localStorage.getItem("user") || "{}").name || "Student";

  const { tasks, setTasks, flatTasks } = usePlannerTasks();
  const { recordTaskCompletions } = useGamification();

  const [selectedCell, setSelectedCell] = useState({
    day: null,
    time: null,
  });

  const [view, setView] = useState("Week");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const allTasks = flatTasks;

  // 🔥 ✅ FINAL SYNC (FIXED)
  useEffect(() => {
    // ❌ OLD: only subject/topic
    // ✅ NEW: full task save (important for analytics)

    const formattedTasks = flatTasks.map((t, index) => ({
      id: index,

      subject: t.subject || t.name || "",
      topic: t.topic || "",
      priority: t.priority || "Low",

      __day: t.__day,       // ✅ REQUIRED
      __time: t.__time,     // optional

      minutes: t.minutes || 0,
      duration: t.duration || (t.minutes ? t.minutes / 60 : 0), // ✅ HOURS

      completed: t.completed || false,
    }));

    localStorage.setItem("tasks", JSON.stringify(formattedTasks));

    // 🔔 notify analytics
    window.dispatchEvent(new Event("planner-tasks-updated"));
  }, [flatTasks]);

  // 🔥 CLEAR ALL
  const handleClearAllTasks = () => {
    if (window.confirm("Are you sure? All tasks will be deleted!")) {
      setTasks({});
      localStorage.removeItem("tasks");
      window.dispatchEvent(new Event("planner-tasks-updated"));
    }
  };

  // 🔹 Subject filter
  const subjectOptions = useMemo(() => {
    const set = new Set();
    allTasks.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set);
  }, [allTasks]);

  // 🔹 Sidebar filter
  const sidebarTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allTasks.filter((t) => {
      const text = `${t?.subject || ""} ${t?.topic || ""}`.toLowerCase();

      if (q && !text.includes(q)) return false;
      if (
        subjectFilter !== "All Subjects" &&
        t.subject !== subjectFilter
      )
        return false;
      if (
        priorityFilter !== "All Priorities" &&
        t.priority !== priorityFilter
      )
        return false;

      return true;
    });
  }, [allTasks, search, subjectFilter, priorityFilter]);

  // 🔹 Today's upcoming
  const todayUpcoming = useMemo(() => {
    const now = new Date();
    const todayName = DAYS[(now.getDay() + 6) % 7];

    const tasksToday = allTasks.filter(
      (t) => t.__day === todayName && !t.completed
    );

    if (!tasksToday.length) return null;

    const slotTask = TIME_SLOTS.map((slot) => ({
      slot,
      tasks: tasksToday.filter((t) => t.__time === slot),
    })).find((entry) => entry.tasks.length > 0);

    if (!slotTask) return null;

    const primary = slotTask.tasks[0];

    return {
      time: slotTask.slot,
      subject: primary.subject || "Task",
      topic: primary.topic || "",
    };
  }, [allTasks]);

  return (
    <div className="planner-shell">

      {/* 🔹 Sidebar */}
      <aside className="planner-sidebar">
        <div className="sidebar-card">

          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {userName.slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-sub">Student</div>
            </div>

            <FiChevronDown />
          </div>

          {/* Subject Filter */}
          <button
            className="sidebar-select"
            onClick={() => {
              if (!subjectOptions.length) return;
              const all = ["All Subjects", ...subjectOptions];
              const idx = all.indexOf(subjectFilter);
              setSubjectFilter(all[(idx + 1) % all.length]);
            }}
          >
            {subjectFilter} <FiChevronDown />
          </button>

          {/* Priority */}
          <button
            className="sidebar-select"
            onClick={() => {
              const options = ["All Priorities", "Low", "Medium", "High"];
              const idx = options.indexOf(priorityFilter);
              setPriorityFilter(options[(idx + 1) % options.length]);
            }}
          >
            {priorityFilter} <FiChevronDown />
          </button>

          {/* Search */}
          <div className="sidebar-search">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>

          {/* Clear */}
          <button className="clear-btn" onClick={handleClearAllTasks}>
            Clear All Tasks
          </button>
        </div>

        {/* Task List */}
        <div className="sidebar-list">
          <div>Your Tasks ({sidebarTasks.length})</div>

          {sidebarTasks.map((t, i) => (
            <button
              key={i}
              className={`sidebar-task ${t.completed ? "done" : ""}`}
              onClick={() =>
                setSelectedCell({ day: t.__day, time: t.__time })
              }
            >
              <div>{t.subject}</div>
              <small>
                {t.topic} • {t.__day}
              </small>
            </button>
          ))}

          {sidebarTasks.length === 0 && <p>No tasks found</p>}
        </div>
      </aside>

      {/* 🔹 Main */}
      <main className="planner-main">
        <div className="planner-top-controls">
          <h2>
            {view} View
            {todayUpcoming && (
              <span>
                {" "} | Upcoming: {todayUpcoming.subject}
                {todayUpcoming.topic && ` - ${todayUpcoming.topic}`}
                {" "}at {todayUpcoming.time}
              </span>
            )}
          </h2>

          <div>
            <button
              onClick={() => setView("Week")}
              className={view === "Week" ? "active" : ""}
            >
              Weekly
            </button>

            <button
              onClick={() => setView("Monthly")}
              className={view === "Monthly" ? "active" : ""}
            >
              Monthly
            </button>
          </div>
        </div>

        <PlannerGrid
          tasks={tasks}
          setTasks={setTasks}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          onTasksCompleted={(n) => recordTaskCompletions(n)}
        />
      </main>
    </div>
  );
}

export default Planner;