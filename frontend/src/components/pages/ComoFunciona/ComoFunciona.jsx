import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Button } from '../../common/Button/Button';
import { Link } from 'react-router-dom';
import './ComoFunciona.css';

const steps = [
  {
    number: '01',
    title: 'Escolha seu plano',
    description: 'Selecione o plano ideal para sua empresa. Você pode usar nossa calculadora para descobrir qual plano se encaixa melhor nas suas necessidades.',
  },
  {
    number: '02',
    title: 'Envie seus documentos',
    description: 'Digitalize e envie os documentos necessários através da nossa plataforma segura. Nosso time analisa tudo em até 24 horas.',
  },
  {
    number: '03',
    title: 'Assinatura digital',
    description: 'Assine digitalmente todos os documentos necessários sem sair de casa. Utilizamos certificação digital com validade jurídica.',
  },
  {
    number: '04',
    title: 'Acompanhamento contínuo',
    description: 'Acompanhe toda a gestão contábil da sua empresa pelo nosso portal. Emissão de notas, obrigações fiscais e relatórios em tempo real.',
  },
];

export const ComoFunciona = () => {
  useScrollAnimation();

  return (
    <main className="como-funciona-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="animate-on-load">Como Funciona</h1>
          <p className="animate-on-load" style={{ animationDelay: '0.08s' }}>
            Simples, rápido e 100% digital. Veja como é fácil começar.
          </p>
        </div>
      </section>

      <section className="steps section section-white">
        <div className="container">
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div key={step.number} className="step-item animate-on-scroll">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-card animate-on-scroll">
            <h2>Pronto para começar?</h2>
            <p>Abra sua empresa em poucos minutos, sem burocracia.</p>
            <div className="cta-actions">
              <Link to="/planos">
                <Button variant="primary" size="large">Ver planos</Button>
              </Link>
              <Link to="/contato">
                <Button variant="secondary" size="large">Fale conosco</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
