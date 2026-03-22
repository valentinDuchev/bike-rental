import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ServerStatusProvider } from './hooks/useServerStatus';
import Navbar from './components/Navbar';
import ServerBanner from './components/ServerBanner';
import CalculatorPage from './pages/CalculatorPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DocsPage from './pages/DocsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ServerStatusProvider>
          <ServerBanner />
          <Navbar />
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docs"
              element={
                <ProtectedRoute>
                  <DocsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="bottom-right" />
        </ServerStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
