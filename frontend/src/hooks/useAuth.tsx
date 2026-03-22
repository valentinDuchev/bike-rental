import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import client from '../api/client';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token'),
  );
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem('username'),
  );

  const login = async (user: string, password: string) => {
    const res = await client.post('/auth/login', { username: user, password });
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('username', res.data.username);
    setIsLoggedIn(true);
    setUsername(res.data.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
