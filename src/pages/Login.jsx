import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import './../styles/auth.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');

  const handleSocialLogin = (provider) => {
    const socialUser = {
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`
    };
    localStorage.setItem('user', JSON.stringify(socialUser));
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
      navigate('/dashboard');
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-frame">
        <div className="auth-card auth-card--figma">
          <h1 className="auth-title">Welcome to Smart Study Planner</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <div className="auth-row auth-row--end">
              <button
                type="button"
                className="auth-link"
                onClick={() => alert('Forgot password flow not implemented in this demo.')}
              >
                Forgot Password?
              </button>
            </div>

            <div className="auth-row auth-row--two">
              <button
                type="button"
                className={`auth-pill ${role === 'Student' ? 'active' : ''}`}
                onClick={() => setRole('Student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`auth-pill auth-pill--danger ${role === 'Admin' ? 'active' : ''}`}
                onClick={() => setRole('Admin')}
              >
                Admin
              </button>
            </div>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-row auth-row--two">
              <button type="submit" className="auth-action auth-action--primary">
                Login
              </button>
              <Link to="/signup" className="auth-action auth-action--danger">
                Sign Up
              </Link>
            </div>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-social">
              <button
                type="button"
                className="auth-social-btn"
                onClick={() => handleSocialLogin('Google')}
              >
                Login with <FaGoogle className="auth-social-icon" />
              </button>
              <button
                type="button"
                className="auth-social-icon-btn"
                aria-label="Login with Facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebookF />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
