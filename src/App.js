import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Quiz from './pages/Quiz';
import Exam from './pages/Exam';
import ExamResult from './pages/ExamResult';
import Resources from './pages/Resources';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Chatbot from './components/Chatbot';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Student Dashboard" />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Study Planner" />
                <Planner />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Resource Recommendation" />
                <Resources />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Analytics" />
                <Analytics />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Settings" />
                <Settings />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="AI Quiz" />
                <Quiz />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="CET Exam" />
                <Exam />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-result"
          element={
            <ProtectedRoute>
              <>
                <Navbar title="Exam Result" />
                <ExamResult />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
