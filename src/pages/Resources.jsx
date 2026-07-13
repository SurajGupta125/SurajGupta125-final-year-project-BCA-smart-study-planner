import React, { useEffect, useMemo, useState } from "react";
import {
  fetchYouTubeVideos,
  generateMockVideos,
} from "../services/youtubeService";
import "../styles/resources.css";

const ALL_TOPICS = "All Topics";
const TASKS_KEY = "tasks";

const normalize = (t) => (t || "").toLowerCase().trim();

export default function Resources() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load tasks
  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
      setTasks(data);
    };

    load();
    window.addEventListener("planner-tasks-updated", load);

    return () => {
      window.removeEventListener("planner-tasks-updated", load);
    };
  }, []);

  // 🔹 Subjects
  const subjects = useMemo(() => {
    return [...new Set(tasks.map((t) => t.subject))];
  }, [tasks]);

  // 🔹 Topics
  const topics = useMemo(() => {
    if (!subject) return [ALL_TOPICS];

    const filtered = tasks.filter(
      (t) => normalize(t.subject) === normalize(subject)
    );

    const uniqueTopics = [...new Set(filtered.map((t) => t.topic))];

    return [ALL_TOPICS, ...uniqueTopics];
  }, [tasks, subject]);

  // 🔹 Auto select subject
  useEffect(() => {
    if (subjects.length) {
      setSubject(subjects[0]);
    } else {
      setSubject("");
      setVideos([]);
    }
  }, [subjects]);

  // 🔹 Fetch videos
  useEffect(() => {
    if (!subject) return;

    const loadVideos = async () => {
      setLoading(true);

      try {
        const data = await fetchYouTubeVideos(subject, topic);
        setVideos(data);
      } catch {
        const fallback = generateMockVideos(subject, topic);
        setVideos(fallback);
      }

      setLoading(false);
    };

    loadVideos();
  }, [subject, topic]);

  // 🔴 Empty state
  if (!tasks.length) {
    return (
      <div className="resources-empty">
        <p>Please add tasks in Planner</p>
      </div>
    );
  }

  return (
    <div className="resources-page">
      <div className="resources-container">

        <h1 className="resources-heading">Resource Recommendation</h1>
        <p className="resources-subheading">
          Learn smarter with curated videos based on your planner
        </p>

        {/* 🔥 Filters */}
        <div className="resources-filters">

          <div className="filter-group">
            <label className="filter-label">Subject</label>
            <select
              className="filter-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Topic</label>
            <select
              className="filter-select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* 🔹 Results */}
        <div className="resources-grid">
          {loading ? (
            <p>Loading...</p>
          ) : (
            videos.map((v) => (
              <div className="resource-card" key={v.id}>
                <div className="resource-card-inner">

                  <h4 className="resource-title">{v.title}</h4>
                  <p className="resource-duration">{v.channel}</p>

                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="resource-open-btn">
                      Watch Video
                    </button>
                  </a>

                </div>
              </div>
            ))
          )}
        </div>

        {!loading && videos.length === 0 && (
          <div className="resources-empty">
            <p>No videos found</p>
          </div>
        )}

      </div>
    </div>
  );
}