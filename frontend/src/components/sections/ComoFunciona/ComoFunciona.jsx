import React from 'react';
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
  return (
    <section
      className="como-funciona section section-white"
      id="como-funciona"
      style={{ '--como-funciona-bg-image': `url(${import.meta.env.BASE_URL}como-funciona.jpg)` }}
    >
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2>Como Funciona</h2>
          <p>Simples, rápido e 100% digital. Veja como é fácil começar.</p>
        </div>

        <div className="steps-timeline">
          {steps.map((step) => (
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
  );
};
