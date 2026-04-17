import React, { useState } from 'react';
import './Style.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" className="auth-input" required />
          )}
          <input type="email" placeholder="Email" className="auth-input" required />
          <input type="password" placeholder="Password" className="auth-input" required />
          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="auth-toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;