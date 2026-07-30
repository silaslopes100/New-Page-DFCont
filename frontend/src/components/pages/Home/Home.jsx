import React from 'react';
import { Hero } from '../../sections/Hero/Hero';
import { Calculator } from '../../sections/Calculator/Calculator';
import { Plans } from '../../sections/Plans/Plans';
import { Testimonials } from '../../sections/Testimonials/Testimonials';
import { FAQ } from '../../sections/FAQ/FAQ';
import { CTA } from '../../sections/CTA/CTA';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

export const Home = () => {
  useScrollAnimation();

  return (
    <main>
      <Hero />
      <Calculator />
      <Plans />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
};
