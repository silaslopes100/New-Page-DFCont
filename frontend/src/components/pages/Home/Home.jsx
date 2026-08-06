import React from 'react';
import { Hero } from '../../sections/Hero/Hero';
import { Calculator } from '../../sections/Calculator/Calculator';
import { Plans } from '../../sections/Plans/Plans';
import { ComoFunciona } from '../../sections/ComoFunciona/ComoFunciona';
import { Sobre } from '../../sections/Sobre/Sobre';
import { Testimonials } from '../../sections/Testimonials/Testimonials';
import { Blog } from '../../sections/Blog/Blog';
import { FAQ } from '../../sections/FAQ/FAQ';
import { Contact } from '../../sections/Contact/Contact';
import { CTA } from '../../sections/CTA/CTA';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

export const Home = () => {
  useScrollAnimation();

  return (
    <main>
      <Hero />
      <Calculator />
      <Plans />
      <ComoFunciona />
      <Sobre />
      <Testimonials />
      <Blog />
      <FAQ />
      <Contact />
      <CTA />
    </main>
  );
};
