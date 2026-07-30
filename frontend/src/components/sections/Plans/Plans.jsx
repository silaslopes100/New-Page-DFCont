import React, { useState } from 'react';
import { Button } from '../../common/Button/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../../common/Card/Card';
import './Plans.css';

const plansData = {
  servico: [
    {
      id: 'basico',
      name: 'Básico',
      price: 139,
      description: 'Ideal para quem está começando',
      features: ['Contabilidade completa', 'Certificado digital', 'Abertura grátis', 'Atendimento via chat e e-mail', 'Plataforma de notas fiscais'],
      highlight: false,
      badge: null,
    },
    {
      id: 'padrao',
      name: 'Padrão',
      price: 195,
      description: 'Mais benefícios para seu negócio',
      features: ['Tudo do Básico', 'Atendimento via WhatsApp', 'Conta PJ gratuita', 'Relatórios mensais', 'Suporte prioritário'],
      highlight: false,
      badge: 'Mais Popular',
    },
    {
      id: 'multibeneficios',
      name: 'Multibenefícios',
      price: 225,
      description: 'Melhor custo-benefício',
      features: ['Tudo do Padrão', '2 benefícios grátis (academia, psicologia, nutrição, seguro, odontológico)', 'Descontos exclusivos', 'Programa de fidelidade'],
      highlight: true,
      badge: 'Melhor Custo-Benefício',
    },
    {
      id: 'essencial',
      name: 'Experts Essencial',
      price: 395,
      description: 'Atendimento personalizado',
      features: ['Tudo do Padrão', 'Assessor dedicado', 'Atendimento via telefone', 'Emissão de notas pela equipe', 'Conciliação de extrato'],
      highlight: false,
      badge: null,
    },
  ],
  comercio: [
    {
      id: 'comercio_basico',
      name: 'Comércio Básico',
      price: 245,
      description: 'Solução completa para comércio',
      features: ['Contabilidade completa', 'Certificado digital', 'Abertura grátis', 'Atendimento via chat e e-mail', 'Plataforma de notas fiscais', 'Escrituração fiscal'],
      highlight: false,
      badge: null,
    },
    {
      id: 'comercio_avancado',
      name: 'Comércio Avançado',
      price: 479,
      description: 'Gestão fiscal avançada',
      features: ['Tudo do Comércio Básico', 'Atendimento via WhatsApp e telefone', 'Assessor dedicado', 'Conciliação bancária', 'Relatórios gerenciais', 'Suporte fiscal completo'],
      highlight: true,
      badge: 'Recomendado',
    },
  ],
};

export const Plans = () => {
  const [activeTab, setActiveTab] = useState('servico');
  const plans = plansData[activeTab];

  return (
    <section className="plans section" id="planos">
      <div className="container">
        <div className="plans-header animate-on-scroll">
          <h2>Conheça nossos planos</h2>
          <p>Soluções contábeis completas para todos os tamanhos de negócio.</p>
        </div>

        <div className="plans-tabs animate-on-scroll glass-panel">
          <button
            className={`plans-tab ${activeTab === 'servico' ? 'plans-tab-active' : ''}`}
            onClick={() => setActiveTab('servico')}
          >
            Empresas de Serviço
          </button>
          <button
            className={`plans-tab ${activeTab === 'comercio' ? 'plans-tab-active' : ''}`}
            onClick={() => setActiveTab('comercio')}
          >
            Empresas de Comércio
          </button>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div key={plan.id} className="animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card highlight={plan.highlight}>
                <CardHeader>
                  {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="plan-price-value">R$ {plan.price}</span>
                    <span className="plan-price-period">/mês</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </CardHeader>
                <CardBody>
                  <ul className="plan-features">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="plan-feature">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter>
                  <Button variant={plan.highlight ? 'primary' : 'outline'} size="large" className="btn-full">
                    Contratar {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        <div className="plans-features animate-on-scroll">
          <h3>Compare os recursos</h3>
          <div className="features-table-wrapper">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Recursos</th>
                  {plans.map((p) => <th key={p.id}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Contabilidade completa', servico: [true, true, true, true], comercio: [true, true] },
                  { label: 'Abertura grátis', servico: [true, true, true, true], comercio: [true, true] },
                  { label: 'Certificado digital', servico: [true, true, true, true], comercio: [true, true] },
                  { label: 'Atendimento via WhatsApp', servico: [false, true, true, true], comercio: [false, true] },
                  { label: 'Assessor dedicado', servico: [false, false, false, true], comercio: [false, true] },
                  { label: 'Benefícios', servico: [false, false, true, false], comercio: [false, false] },
                ].map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    {(activeTab === 'servico' ? row.servico : row.comercio).map((incl, i) => (
                      <td key={i} className={incl ? 'feature-incl' : 'feature-no-incl'}>
                        {incl ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#555"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
