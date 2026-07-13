import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import './styles/planner.css';
import './styles/settings.css';
import './styles/gamification.css';
import './styles/pomodoro.css';
import './styles/calendarPlanner.css';

// Apply saved theme before first paint
if (localStorage.getItem('smart-study-planner-theme') === 'dark') {
  document.documentElement.classList.add('theme-dark');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
