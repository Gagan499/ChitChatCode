import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Registerform from './Registerform';
import { loginUser } from "../services/api";
// import { io } from 'socket.io-client';

const SOCKET_URL = `http://${import.meta.env.VITE_BACKEND_HOST || 'localhost'}:${import.meta.env.VITE_BACKEND_PORT || 5000}`;

function Loginform() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState('');
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
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await loginUser({
        email: form.email,
        password: form.password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await login(user);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 404) {
        // user not found → show register page
        setPrefillEmail(form.email);
        setShowRegister(true);
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }
    }

    setLoading(false);

    // const socket = socketRef.current;

    // socket.emit('auth:login', { email: form.email, password: form.password });

    // socket.once('auth:login:result', async (result) => {
    //   setLoading(false);
    //   if (result.success) {
    //     // Persist token + user via AuthContext
    //     localStorage.setItem('token', result.token);
    //     localStorage.setItem('user', JSON.stringify(result.user));
    //     await login({ email: form.email, password: form.password });
    //   } else if (result.notFound) {
    //     // Not in DB → go to register with pre-filled email
    //     setPrefillEmail(form.email);
    //     setShowRegister(true);
    //   } else {
    //     setError(result.message || 'Login failed.');
    //   }
    // });
  };

  if (showRegister) {
    return <Registerform prefillEmail={prefillEmail} onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-logo">
          <span className="auth-logo-icon">💬</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to ChitChatCode</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              id="login-email"
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
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="auth-error">
              <span className="auth-error-icon">⚠️</span> {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className={`auth-btn${loading ? ' auth-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button
            id="go-to-register"
            className="auth-link"
            onClick={() => setShowRegister(true)}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

export default Loginform;