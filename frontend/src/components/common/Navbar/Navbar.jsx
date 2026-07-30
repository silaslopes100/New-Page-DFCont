import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../Button/Button';
import './Navbar.css';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/planos', label: 'Planos' },
    { path: '/como-funciona', label: 'Como Funciona' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/blog', label: 'Blog' },
    { path: '/contato', label: 'Contato' },
  ];

  const services = [
    { label: 'Abrir Empresa', path: '/planos' },
    { label: 'Trocar de Contador', path: '/planos' },
    { label: 'Assessoria Contábil', path: '/planos' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container glass-panel">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="DFCont Assessoria Contábil" className="logo-img" />
        </Link>

        <div className={`navbar-menu ${isMobileOpen ? 'navbar-menu-open' : ''}`}>
          <div className="navbar-links">
            <div
              className="navbar-dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="navbar-link dropdown-trigger">
                Serviços
                <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu glass-panel">
                  {services.map((service) => (
                    <Link key={service.label} to={service.path} className="dropdown-item">
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'navbar-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <Button variant="primary" size="medium" onClick={() => window.location.href = '/planos'}>
              Abra sua Empresa
            </Button>
          </div>
        </div>

        <button
          className={`hamburger ${isMobileOpen ? 'hamburger-active' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};
