import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import './CTA.css';

export const CTA = () => {
  return (
    <section className="cta section">
      <div className="container">
        <div className="cta-header animate-on-scroll">
          <h2>A hora de investir no sucesso da sua empresa é agora</h2>
          <p>
            Conte com a expertise da DFCont para cuidar da sua contabilidade 
            enquanto você foca no que realmente importa: fazer seu negócio crescer.
          </p>
          <div className="cta-actions">
            <Link to="/planos">
              <Button variant="primary" size="large">Abra sua empresa grátis</Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" size="large">Fale com um especialista</Button>
            </Link>
          </div>
        </div>

        <div className="cta-media-row animate-on-scroll">
          <div className="cta-chat-card glass-panel">
            <div className="cta-avatar">
              <img
                src="/diana.svg"
                alt="Diana Assistente DFCont"
                className="cta-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={(e) => {
                  const fallback = e.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = 'none';
                }}
              />
              <div className="cta-avatar-fallback" style={{ display: 'none' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                </svg>
              </div>
              <span className="cta-avatar-name">Diana Assistente DFCont</span>
            </div>
            <div className="cta-chat">
              <div className="cta-chat-bubble">Olá! Como posso ajudar?</div>
              <div className="cta-chat-bubble cta-chat-response">Quero abrir minha empresa</div>
              <div className="cta-chat-bubble">Vou te ajudar com isso! 😊</div>
            </div>
          </div>

          <div className="cta-video-card glass-panel">
            <video
              className="cta-video"
              src="/diana-video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        <div className="cta-footer animate-on-scroll">
          <p>Consultoria gratuita sem compromisso. Sua empresa merece o melhor.</p>
        </div>
      </div>
    </section>
  );
};
