import React, { useState } from 'react';
import { FiUser, FiSun, FiBook, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi';
import { STORAGE_KEY, WEAK_TOPIC_KEY } from '../hooks/usePlannerTasks';
import { useTheme } from '../context/ThemeContext';
import '../styles/settings.css';

const PREFS_KEY = 'smart-study-planner-prefs';

const DEFAULT_PREFS = {
  sessionDuration: 30,
  dailyGoalHours: 4,
};

function loadPrefs() {
  try {
    const data = localStorage.getItem(PREFS_KEY);
    return data ? { ...DEFAULT_PREFS, ...JSON.parse(data) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onCancel}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="settings-modal-title">{title}</h3>
        <p className="settings-modal-message">{message}</p>
        <div className="settings-modal-actions">
          <button type="button" className="settings-btn settings-btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="settings-btn settings-btn--danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profile, setProfile] = useState({ name: user.name || '', email: user.email || '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState(loadPrefs);
  const [weakSubject, setWeakSubject] = useState(() => {
    try {
      return localStorage.getItem(WEAK_TOPIC_KEY) || '';
    } catch {
      return '';
    }
  });
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });

  const handleSaveProfile = () => {
    const updated = { ...user, name: profile.name.trim(), email: profile.email.trim() };
    localStorage.setItem('user', JSON.stringify(updated));
    setIsEditingProfile(false);
  };

  const handleSavePrefs = () => {
    savePrefs(prefs);
    try {
      const trimmed = (weakSubject || '').trim();
      if (trimmed) {
        localStorage.setItem(WEAK_TOPIC_KEY, trimmed);
      } else {
        localStorage.removeItem(WEAK_TOPIC_KEY);
      }
    } catch {
      // ignore
    }
  };

  const handleClearTasks = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfirmModal({ open: false, action: null });
    window.location.reload();
  };

  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('smart-study-planner-analytics');
    localStorage.removeItem('smart-study-planner-gamification');
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(WEAK_TOPIC_KEY);
    setConfirmModal({ open: false, action: null });
    window.location.reload();
  };

  const openConfirm = (action) => {
    if (action === 'tasks') {
      setConfirmModal({
        open: true,
        action: 'tasks',
        title: 'Clear All Tasks',
        message: 'This will permanently delete all your planner tasks. This action cannot be undone.',
        onConfirm: handleClearTasks,
      });
    } else if (action === 'progress') {
      setConfirmModal({
        open: true,
        action: 'progress',
        title: 'Reset Study Progress',
        message: 'This will clear all tasks and reset your study progress. This action cannot be undone.',
        onConfirm: handleResetProgress,
      });
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-heading">Settings</h1>
        <p className="settings-subheading">Manage your profile and preferences.</p>

        {/* Profile Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiUser className="settings-card-icon" />
            <h2 className="settings-card-title">Profile Settings</h2>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                disabled={!isEditingProfile}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                disabled={!isEditingProfile}
                className="settings-input"
              />
            </div>
            <div className="settings-card-actions">
              {isEditingProfile ? (
                <button type="button" className="settings-btn settings-btn--primary" onClick={handleSaveProfile}>
                  <FiSave /> Save Changes
                </button>
              ) : (
                <button type="button" className="settings-btn settings-btn--secondary" onClick={() => setIsEditingProfile(true)}>
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiSun className="settings-card-icon" />
            <h2 className="settings-card-title">Appearance</h2>
          </div>
          <div className="settings-card-body">
            <div className="settings-toggle-row">
              <span className="settings-toggle-label">Dark Mode</span>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                className={`settings-toggle ${isDark ? 'settings-toggle--on' : ''}`}
                onClick={toggleTheme}
              >
                <span className="settings-toggle-thumb" />
              </button>
            </div>
            <p className="settings-hint">Theme preference is saved automatically.</p>
          </div>
        </div>

        {/* Study Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiBook className="settings-card-icon" />
            <h2 className="settings-card-title">Study Preferences</h2>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label htmlFor="session-duration">Default study session duration (minutes)</label>
              <input
                id="session-duration"
                type="number"
                min="5"
                max="120"
                step="5"
                value={prefs.sessionDuration}
                onChange={(e) => setPrefs((p) => ({ ...p, sessionDuration: Number(e.target.value) || 30 }))}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="daily-goal">Daily study goal (hours)</label>
              <input
                id="daily-goal"
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={prefs.dailyGoalHours}
                onChange={(e) => setPrefs((p) => ({ ...p, dailyGoalHours: Number(e.target.value) || 4 }))}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="weak-subject">Weak subject / topic (optional)</label>
              <input
                id="weak-subject"
                type="text"
                value={weakSubject}
                onChange={(e) => setWeakSubject(e.target.value)}
                className="settings-input"
                placeholder="e.g. Calculus, Organic Chemistry, React"
              />
            </div>
            <button type="button" className="settings-btn settings-btn--primary" onClick={handleSavePrefs}>
              <FiSave /> Save Preferences
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiTrash2 className="settings-card-icon" />
            <h2 className="settings-card-title">Data Management</h2>
          </div>
          <div className="settings-card-body">
            <div className="settings-danger-actions">
              <div className="settings-danger-item">
                <div>
                  <strong>Clear all planner tasks</strong>
                  <p className="settings-danger-desc">Remove all tasks from your study planner.</p>
                </div>
                <button type="button" className="settings-btn settings-btn--outline-danger" onClick={() => openConfirm('tasks')}>
                  Clear Tasks
                </button>
              </div>
              <div className="settings-danger-item">
                <div>
                  <strong>Reset study progress</strong>
                  <p className="settings-danger-desc">Clear tasks and reset all progress data.</p>
                </div>
                <button type="button" className="settings-btn settings-btn--outline-danger" onClick={() => openConfirm('progress')}>
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ open: false, action: null })}
      />
    </div>
  );
}

export default Settings;
