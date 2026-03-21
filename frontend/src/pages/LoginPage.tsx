import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
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
          <button type="submit" className="login-btn">Sign In</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
