import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/nav.css';

function Navbar() {
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-top">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>BikeRental</Link>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={closeMenu}
          >
            Calculator
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/admin"
                className={location.pathname === '/admin' ? 'active' : ''}
                onClick={closeMenu}
              >
                Manage
              </Link>
              <Link
                to="/docs"
                className={location.pathname === '/docs' ? 'active' : ''}
                onClick={closeMenu}
              >
                Docs
              </Link>
              <span className="navbar-user">{username}</span>
              <button onClick={() => { logout(); closeMenu(); }}>Log out</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
