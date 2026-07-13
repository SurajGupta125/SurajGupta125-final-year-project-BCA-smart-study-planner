import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import './../styles/auth.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    if (users.some((u) => u.email === email)) {
      alert('An account with this email already exists.');
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-frame">
        <div className="auth-card auth-card--figma">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join Smart Study Planner</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />

            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <div className="auth-row auth-row--two">
              <button type="submit" className="auth-action auth-action--primary">
                Sign Up
              </button>
              <Link to="/login" className="auth-action auth-action--danger">
                Login
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
                Sign Up with <FaGoogle className="auth-social-icon" />
              </button>
              <button
                type="button"
                className="auth-social-icon-btn"
                aria-label="Sign Up with Facebook"
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

export default Signup;
