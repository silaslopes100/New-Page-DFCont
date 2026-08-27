import React, { useState } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Boaser Buga',
    role: 'Cliente',
    text: 'Quero agradecer á toda equipe da DFCont por ter me atendido mto bem....desde minha chegada algumas vezes no local, sem marcar HR. até minha saída. Sempre com gentileza e sorriso no rosto...oferecendo uma água...um café. Ao João Paulo ,Contador....obrigado pela disposição e esclarecimentos das dúvidas quando perguntado. Excelente profissional. Grato a todos....',
    rating: 5,
  },
  {
    id: 2,
    name: 'Manuel J S Filho Joaquim',
    role: 'Cliente',
    text: 'Boa tarde, a minha experiência foi muito boa, apesar de pedir orientações pela primeira vez, foi muito boa mesmo !! Nota 10.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Leonaldo Arruda',
    role: 'Cliente',
    text: 'Ótimo profissional com atendimento 5 estrelas, todo tipo de serviços contábeis e com qualidade. Só agradecer',
    rating: 5,
  },
  {
    id: 4,
    name: 'Elisabete Castro',
    role: 'Cliente',
    text: 'Precisei fazer minha declaração de Imposto de Renda referente ao ano de 2024 e, sem contador no momento, fui atendida pela DF Contabilidade. Desde o início, o atendimento foi ágil e transparente. O João foi extremamente solícito, tirando todas as minhas dúvidas com paciência e clareza. É comum ficarmos inseguros quando não conhecemos o serviço ou o profissional, mas minha experiência foi muito positiva. A DF Contabilidade demonstrou comprometimento e profissionalismo, sem enrolação. Recomendo o escritório a quem busca um serviço contábil sério, eficiente.',
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
            <span className="rating-score">5.0</span>
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
