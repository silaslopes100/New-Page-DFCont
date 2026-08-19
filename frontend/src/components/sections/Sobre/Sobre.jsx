import React from 'react';
import { Button } from '../../common/Button/Button';
import { NAV_SECTIONS } from '../../../config/site';
import './Sobre.css';

const values = [
  { icon: '🤝', title: 'Confiança', text: 'Construímos relações transparentes com nossos clientes.' },
  { icon: '💡', title: 'Inovação', text: 'Utilizamos tecnologia para oferecer serviços contábeis modernos.' },
  { icon: '🎯', title: 'Excelência', text: 'Buscamos o mais alto padrão de qualidade em cada serviço.' },
  { icon: '🤲', title: 'Compromisso', text: 'Dedicados ao sucesso e crescimento da sua empresa.' },
];

export const Sobre = () => {
  return (
    <section className="sobre section section-white" id="sobre">
      <div className="about-story">
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
              <a href={`#${NAV_SECTIONS.planos}`}>
                <Button variant="primary" size="large">Conheça nossos planos</Button>
              </a>
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
      </div>

      <div className="about-values">
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
      </div>
    </section>
  );
};
