import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiActivity, FiCheckCircle, FiClipboard, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { usePlannerTasks } from '../hooks/usePlannerTasks';
import StreakPointsWidget from '../components/StreakPointsWidget';
import Achievements from '../components/Achievements';
import GoalProgress from '../components/GoalProgress';
import PomodoroTimer from '../components/PomodoroTimer';
import CalendarPlanner from '../components/CalendarPlanner';
import StudyReminder from '../components/StudyReminder';
import ExportReport from '../components/ExportReport';
import AIStudyPlanner from '../components/AIStudyPlanner';
import StudyHeatmap from '../components/StudyHeatmap';
import StudyInsights from '../components/StudyInsights';
import './../styles/dashboard.css';
import './../styles/exam.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function Dashboard() {
  const { stats, flatTasks } = usePlannerTasks();
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem('user') || '{}').name || 'Student';

  const { weeklyGoal, completedHours, progressPct } = useMemo(() => {
    let goal = 10; // default fallback
    try {
      const prefsRaw = localStorage.getItem('smart-study-planner-prefs');
      const prefs = prefsRaw ? JSON.parse(prefsRaw) : null;
      const daily = Number(prefs?.dailyGoalHours);
      if (Number.isFinite(daily) && daily > 0) goal = daily * 7;
    } catch {
      // ignore
    }

    const completedMinutes = (flatTasks || [])
      .filter((t) => t?.completed)
      .reduce((sum, t) => sum + (Number(t?.minutes) > 0 ? Number(t.minutes) : 30), 0);

    const hours = Math.round((completedMinutes / 60) * 10) / 10;
    const progressPct = goal > 0 ? (hours / goal) * 100 : 0;
    return {
      weeklyGoal: Math.round(goal * 10) / 10,
      completedHours: hours,
      progressPct: Math.min(Math.max(progressPct, 0), 100),
    };
  }, [flatTasks]);

  // Get the most recent subject from planner tasks
  const plannerSubject = useMemo(() => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const found = tasks.find((t) => t.subject);
    return found?.subject || '';
  }, []);

  const recentExams = useMemo(() => {
    return JSON.parse(localStorage.getItem('exam_results') || '[]').slice(0, 2);
  }, []);

  const recentQuizzes = useMemo(() => {
    return JSON.parse(localStorage.getItem('quiz_results') || '[]').slice(0, 2);
  }, []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-hero">
          <div className="dash-avatar" aria-hidden="true">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="dash-hero-text">
            <div className="dash-greeting">{getGreeting()}, {userName}</div>
          </div>
          <Link to="/planner" className="dash-open-btn">
            Open Planner <FiArrowRight />
          </Link>
        </div>

        {/* ── 🎓 Exam Action Card ── */}
        <div className="dash-section dash-section--mini">
          <div className="dash-section-title"> Exam & Quiz</div>
          <div className="dash-exam-section">
            <p className="dash-exam-title">Ready to test yourself?</p>
            <div className="dash-exam-btn-row">
              <button
                className="dash-exam-btn dash-exam-btn--full"
                onClick={() => navigate('/exam', { state: { subject: plannerSubject } })}
              >
                Start Full Exam
              </button>
              <button
                className="dash-exam-btn dash-exam-btn--quiz"
                onClick={() => navigate('/quiz', { state: { subject: plannerSubject } })}
              >
                Start Quiz from Planner
              </button>
            </div>
            {plannerSubject && (
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0' }}>
                Subject detected from planner: <strong style={{ color: '#2563eb' }}>{plannerSubject}</strong>
              </p>
            )}

            {(recentExams.length > 0 || recentQuizzes.length > 0) && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>Recent Scores</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentExams.map((exam, idx) => (
                    <div key={`exam-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>Exam: {exam.subject}</span>
                      <span style={{ color: '#059669', fontWeight: 'bold' }}>{exam.score}%</span>
                    </div>
                  ))}
                  {recentQuizzes.map((quiz, idx) => (
                    <div key={`quiz-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '500', color: '#334155' }}>Quiz: {quiz.subject}</span>
                      <span style={{ color: '#059669', fontWeight: 'bold' }}>{quiz.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card dash-blue">
            <div className="dash-stat-top">
              <div className="dash-stat-title">Your Tasks</div>
              <div className="dash-stat-value">{stats.total}</div>
            </div>
            {/* <div className="dash-stat-icon"><FiClipboard /></div> */}
          </div>

          <div className="dash-stat-card dash-green">
            <div className="dash-stat-top">
              <div className="dash-stat-title">Completed Tasks</div>
              <div className="dash-stat-value">{stats.completed}</div>
            </div>
            {/* <div className="dash-stat-icon"><FiCheckCircle /></div> */}
          </div>

          <div className="dash-stat-card dash-amber">
            <div className="dash-stat-top">
              <div className="dash-stat-title">Productivity Score</div>
              <div className="dash-stat-value">{stats.productivity}%</div>
            </div>
            <div className="dash-meter" aria-hidden="true">
              <div className="dash-meter-fill" style={{ width: `${stats.productivity}%` }} />
            </div>
            {/* <div className="dash-stat-icon"><FiActivity /></div> */}
          </div>

          <div className="dash-stat-card dash-purple">
            <div className="dash-stat-top">
              <div className="dash-stat-title">Weak Topics</div>
              <div className="dash-stat-value dash-topic">{stats.weakTopic}</div>
            </div>
            {/* <div className="dash-stat-icon"><FiAlertTriangle /></div> */}
          </div>
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Goal Progress</div>
          <GoalProgress weeklyGoal={weeklyGoal} completedHours={completedHours} />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Streak & Points</div>
          <StreakPointsWidget />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Level & Achievements</div>
          <Achievements />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Pomodoro</div>
          <PomodoroTimer />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Study Reminder</div>
          <StudyReminder />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Export Study Report</div>
          <ExportReport
            totalStudyHours={completedHours}
            completedTasks={stats.completed}
            streakDays={stats.streakDays}
            goalProgressPercent={progressPct}
          />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">AI Study Planner</div>
          <AIStudyPlanner />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Smart Insights</div>
          <StudyInsights />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Study Heatmap</div>
          <StudyHeatmap />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Calendar Planner</div>
          <CalendarPlanner />
        </div>

        <div className="dash-section dash-section--mini">
          <div className="dash-section-title">Weekly Overview</div>
          <div className="dash-week-chart" aria-hidden="true">
            {stats.perDay.map((d) => {
              const height = d.total ? Math.max((d.completed / d.total) * 100, 8) : 0;
              return (
                <div key={d.day} className="dash-week-col">
                  <div className="dash-week-bar">
                    <div
                      className="dash-week-fill"
                      style={{ height: `${height}%`, opacity: d.total ? 1 : 0.2 }}
                    />
                  </div>
                  <div className="dash-week-label">{d.label}</div>
                </div>
              );
            })}
          </div>
          <div className="dash-week-meta">
            <span className="dash-badge">Active days this week: {stats.activeDays}</span>
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-title">Your Tasks</div>
          <div className="dash-big-cards">
            <div className="dash-big-card dash-blue">
              <div className="dash-big-head">
                <FiClipboard /> <span>Your Tasks</span>
              </div>
              <div className="dash-big-value">{stats.total}</div>
            </div>
            <div className="dash-big-card dash-green">
              <div className="dash-big-head">
                <FiCheckCircle /> <span>Completed Tasks</span>
              </div>
              <div className="dash-big-value">{stats.completed}</div>
            </div>
            <div className="dash-big-card dash-amber">
              <div className="dash-big-head">
                <FiActivity /> <span>Productivity Score</span>
              </div>
              <div className="dash-big-meter" aria-hidden="true">
                <div className="dash-big-meter-fill" style={{ width: `${stats.productivity}%` }} />
              </div>
            </div>
            <div className="dash-big-card dash-purple">
              <div className="dash-big-head">
                <FiAlertTriangle /> <span>Weak Topics</span>
              </div>
              <div className="dash-big-value dash-topic">{stats.weakTopic}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
