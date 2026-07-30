import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Button } from '../../common/Button/Button';
import { Link } from 'react-router-dom';
import './About.css';

export const About = () => {
  useScrollAnimation();

  const values = [
    { icon: '🤝', title: 'Confiança', text: 'Construímos relações transparentes com nossos clientes.' },
    { icon: '💡', title: 'Inovação', text: 'Utilizamos tecnologia para oferecer serviços contábeis modernos.' },
    { icon: '🎯', title: 'Excelência', text: 'Buscamos o mais alto padrão de qualidade em cada serviço.' },
    { icon: '🤲', title: 'Compromisso', text: 'Dedicados ao sucesso e crescimento da sua empresa.' },
  ];

  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="animate-on-load">Sobre a DFCont</h1>
          <p className="animate-on-load" style={{ animationDelay: '0.08s' }}>
            Excelência em assessoria contábil desde 2014
          </p>
        </div>
      </section>

      <section className="about-story section section-white">
        <div className="container">
          <div className="about-grid animate-on-scroll">
            <div className="about-text">
              <h2>Nossa História</h2>
              <p>
                A DFCont Assessoria Contábil nasceu da visão de oferecer serviços contábeis 
                de excelência para empresas de todos os portes. Com mais de 10 anos de mercado, 
                construímos uma sólida reputação baseada em confiança, competência e resultados.
              </p>
              <p>
                Hoje, atendemos mais de 500 empresas ativas em todo o Brasil, oferecendo soluções 
                completas em contabilidade digital, abertura de empresas, assessoria fiscal e 
                trabalhista, e planejamento tributário.
              </p>
              <Link to="/planos">
                <Button variant="primary" size="large">Conheça nossos planos</Button>
              </Link>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <span className="stat-number">+500</span>
                <span className="stat-label">Empresas ativas</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">+10</span>
                <span className="stat-label">Anos de mercado</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">98%</span>
                <span className="stat-label">Clientes satisfeitos</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">+50</span>
                <span className="stat-label">Cidades atendidas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Nossos Valores</h2>
            <p>Princípios que guiam cada ação da DFCont</p>
          </div>
          <div className="values-grid animate-stagger animate-on-scroll">
            {values.map((v) => (
              <div key={v.title} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
