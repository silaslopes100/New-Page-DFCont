import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import './Navbar.css';

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'planos', label: 'Planos' },
  { id: 'como-funciona', label: 'Como Funciona' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'blog', label: 'Blog' },
  { id: 'contato', label: 'Contato' },
];

const services = [
  { label: 'Abrir Empresa', id: 'planos' },
  { label: 'Trocar de Contador', id: 'planos' },
  { label: 'Assessoria Contábil', id: 'planos' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observerRef.current.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  const goToSection = (id) => (e) => {
    e.preventDefault();
    setIsMobileOpen(false);
    setIsDropdownOpen(false);

    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container glass-panel">
        <a href="#hero" onClick={goToSection('hero')} className="navbar-logo">
          <img src="/logo.png" alt="DFCont Assessoria Contábil" className="logo-img" />
        </a>

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
                    <a key={service.label} href={`#${service.id}`} onClick={goToSection(service.id)} className="dropdown-item">
                      {service.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={goToSection(link.id)}
                className={`navbar-link ${activeSection === link.id ? 'navbar-link-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <Button variant="primary" size="medium" onClick={goToSection('calculadora')}>
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
