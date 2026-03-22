import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useServerStatus } from '../hooks/useServerStatus';
import '../styles/login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const serverStatus = useServerStatus();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="login-page">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="login-btn"
            disabled={serverStatus === 'loading' || submitting}
          >
            {submitting ? 'Signing in...' : serverStatus === 'loading' ? 'Waiting for server...' : 'Sign In'}
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
