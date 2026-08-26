import React, { useState } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Oliveira',
    role: 'CEO - Tech Solutions',
    text: 'A DFCont transformou a gestão financeira da minha empresa. O atendimento é excepcional e os profissionais são extremamente competentes.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ana Silva',
    role: 'Médica - Clínica Saúde',
    text: 'Desde que migrei para a DFCont, minha rotina contábil ficou muito mais simples. Recomendo para todos os profissionais da saúde.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Roberto Lima',
    role: 'Arquiteto - Lima Projetos',
    text: 'Contratei o plano Multibenefícios e valeu muito a pena. Economizo com benefícios e ainda tenho assessoria contábil de primeira.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Patricia Mendes',
    role: 'Advogada - Mendes & Associados',
    text: 'Profissionalismo e eficiência definem a DFCont. Resolvem tudo rapidamente e estão sempre disponíveis quando preciso.',
    rating: 5,
  },
];

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[activeIndex];

  return (
    <section
      className="testimonials section section-white"
      id="depoimentos"
      style={{ '--testimonials-bg-image': `url(${import.meta.env.BASE_URL}testimonials-bg.jpg)` }}
    >
      <div className="container">
        <div className="testimonials-header animate-on-scroll">
          <h2>Confira o que nossos clientes falam sobre nós</h2>
          <p>Somos reconhecidos pela nossa especialização em diversos segmentos.</p>
        </div>

        <div className="testimonials-ratings animate-on-scroll">
          <div className="rating-card glass-panel">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="rating-score">4.9</span>
            <span className="rating-source">Avaliação Google</span>
          </div>
          <div className="rating-card">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="rating-score">Excelente</span>
            <span className="rating-source">Reclame Aqui</span>
          </div>
        </div>

        <div className="testimonials-carousel animate-on-scroll">
          <button className="carousel-btn carousel-prev" onClick={prev} aria-label="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="testimonial-card glass-panel">
            <div className="testimonial-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= t.rating ? '#F59E0B' : '#E9E9E9'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="testimonial-text">"{t.text}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong className="testimonial-name">{t.name}</strong>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
          </div>

          <button className="carousel-btn carousel-next" onClick={next} aria-label="Próximo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="testimonials-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeIndex ? 'dot-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
