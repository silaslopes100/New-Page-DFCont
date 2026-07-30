import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Plans } from '../../sections/Plans/Plans';
import { FAQ } from '../../sections/FAQ/FAQ';
import { CTA } from '../../sections/CTA/CTA';
import './PlansPage.css';

export const PlansPage = () => {
  useScrollAnimation();

  return (
    <main className="plans-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="animate-on-load">Nossos Planos</h1>
          <p className="animate-on-load" style={{ animationDelay: '0.08s' }}>
            Escolha o plano ideal para sua empresa e aproveite todos os benefícios
          </p>
        </div>
      </section>

      <Plans />
      <FAQ />
      <CTA />
    </main>
  );
};
