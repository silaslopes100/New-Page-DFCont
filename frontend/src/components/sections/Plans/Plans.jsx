import React, { useRef, useState } from 'react';
import { Button } from '../../common/Button/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../../common/Card/Card';
import { buildWhatsAppUrl } from '../../../config/site';
import './Plans.css';

const TABS = [
  { id: 'servico', label: 'Empresas de Serviço' },
  { id: 'comercio', label: 'Empresas de Comércio' },
];

const plansData = {
  servico: [
    {
      id: 'basico',
      name: 'Básico',
      price: 197,
      description: 'Ideal para quem está começando',
      features: ['Abertura grátis', 'Atendimento via chat e e-mail', 'Plataforma de notas fiscais'],
      highlight: false,
      badge: null,
    },
    {
      id: 'padrao',
      name: 'Padrão',
      price: 253,
      description: 'Mais benefícios para seu negócio',
      features: ['Tudo do Básico', 'Contabilidade completa', 'Atendimento via WhatsApp', 'Conta PJ gratuita', 'Relatórios mensais', 'Suporte prioritário'],
      highlight: false,
      badge: 'Mais Popular',
    },
    {
      id: 'multibeneficios',
      name: 'Multibenefícios',
      price: 297,
      description: 'Melhor custo-benefício',
      features: ['Tudo do Padrão', 'Certificado digital', '2 benefícios grátis (academia, psicologia, nutrição, seguro, odontológico)', 'Descontos exclusivos', 'Programa de fidelidade'],
      highlight: true,
      badge: 'Melhor Custo-Benefício',
    },
    {
      id: 'essencial',
      name: 'Experts Essencial',
      price: 453,
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

const comparisonRows = [
  { label: 'Contabilidade completa', servico: [false, true, true, true], comercio: [true, true] },
  { label: 'Abertura grátis', servico: [true, true, true, true], comercio: [true, true] },
  { label: 'Certificado digital', servico: [false, false, true, true], comercio: [true, true] },
  { label: 'Atendimento via WhatsApp', servico: [false, true, true, true], comercio: [false, true] },
  { label: 'Assessor dedicado', servico: [false, false, false, true], comercio: [false, true] },
  { label: 'Benefícios', servico: [false, false, true, false], comercio: [false, false] },
];

export const Plans = () => {
  const [activeTab, setActiveTab] = useState('servico');
  const tabRefs = useRef({});
  const plans = plansData[activeTab] || plansData.servico;

  const activateTab = (tabId) => {
    if (plansData[tabId]) setActiveTab(tabId);
  };

  const handleTabKeyDown = (e, tabId) => {
    const currentIndex = TABS.findIndex((t) => t.id === tabId);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = TABS.length - 1;
    else return;

    e.preventDefault();
    const nextTab = TABS[nextIndex];
    activateTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <section className="plans section" id="planos">
      <div className="plans-bg" aria-hidden="true" />
      <div className="container">
        <div className="plans-header animate-on-scroll">
          <h2>Conheça nossos planos</h2>
          <p>Soluções contábeis completas para todos os tamanhos de negócio.</p>
        </div>

        <div
          className="plans-tabs animate-on-scroll glass-panel"
          role="tablist"
          aria-label="Categorias de planos"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[tab.id] = el; }}
              className={`plans-tab ${activeTab === tab.id ? 'plans-tab-active' : ''}`}
              onClick={() => activateTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              role="tab"
              id={`plans-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`plans-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="plans-grid"
          role="tabpanel"
          id={`plans-panel-${activeTab}`}
          aria-labelledby={`plans-tab-${activeTab}`}
        >
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
                  <a
                    href={buildWhatsAppUrl(`Olá, gostaria de contratar o plano ${plan.name} (R$ ${plan.price}/mês) da DFCont.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-full-link"
                  >
                    <Button variant={plan.highlight ? 'primary' : 'outline'} size="large" className="btn-full">
                      Contratar {plan.name}
                    </Button>
                  </a>
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
                  <th scope="col">Recursos</th>
                  {plans.map((p) => <th scope="col" key={p.id}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
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