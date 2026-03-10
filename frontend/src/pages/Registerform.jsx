import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from "../services/api";
// import { io } from 'socket.io-client';

const SOCKET_URL = `http://${import.meta.env.VITE_BACKEND_HOST || 'localhost'}:${import.meta.env.VITE_BACKEND_PORT || 5000}`;

function Registerform({ prefillEmail = '', onBack }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: prefillEmail, password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const socketRef = useRef(null);

  // useEffect(() => {
  //   socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
  //   return () => socketRef.current?.disconnect();
  // }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await login({ email: form.email, password: form.password });

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }

    setLoading(false);
    // const socket = socketRef.current;

    // socket.emit('auth:register', {
    //   username: form.username,
    //   email: form.email,
    //   password: form.password,
    // });

    // socket.once('auth:register:result', async (result) => {
    //   setLoading(false);
    //   if (result.success) {
    //     localStorage.setItem('token', result.token);
    //     localStorage.setItem('user', JSON.stringify(result.user));
    //     await login({ email: form.email, password: form.password });
    //   } else {
    //     setError(result.message || 'Registration failed.');
    //   }
    // });
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">✨</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join ChitChatCode and start chatting today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              id="reg-username"
              type="text"
              name="username"
              placeholder="cooldev123"
              value={form.username}
              onChange={handleChange}
              className="auth-input"
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="auth-error">
              <span className="auth-error-icon">⚠️</span> {error}
            </div>
          )}

          <button
            id="reg-submit"
            type="submit"
            className={`auth-btn auth-btn--register${loading ? ' auth-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? <span className="auth-btn-spinner" /> : 'Create Account'}
          </button>
        </form>

        {onBack && (
          <p className="auth-switch">
            Already have an account?{' '}
            <button id="go-to-login" className="auth-link" onClick={onBack}>
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Registerform;