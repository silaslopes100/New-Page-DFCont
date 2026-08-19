import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../Button/Button';
import { NAV_LINKS, SERVICES_LINKS, NAV_SECTIONS, scrollToSection } from '../../../config/site';
import './Navbar.css';

const goToSection = (id) => (e) => {
  e.preventDefault();

  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  scrollToSection(id);
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS.hero);
  const observerRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS
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

  const closeMenus = useCallback(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return undefined;
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') closeMenus();
    };
    if (isMobileOpen) {
      document.addEventListener('keydown', closeOnEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, closeMenus]);

  const handleNavClick = (id) => (e) => {
    closeMenus();
    goToSection(id)(e);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Escape') setIsDropdownOpen(false);
  };

  return (
    <nav
      ref={navbarRef}
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      aria-label="Navegação principal"
    >
      <div className="navbar-container">
        <div className="navbar-glass glass-panel" aria-hidden="true" />

        <a href="#hero" onClick={handleNavClick(NAV_SECTIONS.hero)} className="navbar-logo">
          <img src="/logo.png" alt="DFCont Assessoria Contábil" className="logo-img" />
        </a>

        <div className={`navbar-menu ${isMobileOpen ? 'navbar-menu-open' : ''}`}>
          <div className="navbar-links">
            <div
              className="navbar-dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="navbar-link dropdown-trigger"
                onClick={toggleDropdown}
                onKeyDown={handleDropdownKeyDown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls="navbar-services-menu"
              >
                Serviços
                <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isDropdownOpen && (
                <div id="navbar-services-menu" className="dropdown-menu glass-panel" role="menu">
                  {SERVICES_LINKS.map((service) => (
                    <a
                      key={service.label}
                      href={`#${service.id}`}
                      onClick={handleNavClick(service.id)}
                      className="dropdown-item"
                      role="menuitem"
                    >
                      {service.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleNavClick(link.id)}
                className={`navbar-link ${activeSection === link.id ? 'navbar-link-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <Button variant="primary" size="medium" onClick={handleNavClick(NAV_SECTIONS.calculadora)}>
              Abra sua Empresa
            </Button>
          </div>
        </div>

        <button
          className={`hamburger ${isMobileOpen ? 'hamburger-active' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMobileOpen}
          aria-controls="navbar-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};