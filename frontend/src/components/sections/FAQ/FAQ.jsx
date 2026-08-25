import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'Quanto custa o serviço de contabilidade?',
    answer: 'Nossos planos começam a partir de R$ 197/mês para empresas de serviço e R$ 245/mês para comércio. O valor exato depende do perfil da sua empresa, número de sócios e serviços adicionais contratados.',
  },
  {
    question: 'Preciso ir até o escritório para abrir minha empresa?',
    answer: 'Não! Todo o processo é 100% digital. Você faz tudo pelo nosso plataforma online, sem precisar sair de casa. Desde a documentação até a assinatura digital.',
  },
  {
    question: 'Como funciona a troca de contador?',
    answer: 'O processo é simples e rápido. Nossa equipe cuida de toda a burocracia para transferir sua contabilidade para a DFCont. Você não precisa se preocupar com nada, nós resolvemos tudo.',
  },
  {
    question: 'Quais documentos preciso para abrir minha empresa?',
    answer: 'Documentos básicos como RG, CPF, comprovante de residência dos sócios e informações sobre a atividade que será exercida. Nossa equipe orienta você em cada etapa.',
  },
  {
    question: 'O certificado digital está incluso nos planos?',
    answer: 'Sim! Nosso plano Multibenefícios inclui certificado digital gratuitamente, válido para uso em todas as operações fiscais e bancárias.',
  },
  {
    question: 'Posso contratar benefícios mesmo sendo MEI?',
    answer: 'Sim! Nosso plano Multibenefícios está disponível para diversos portes de empresa, incluindo MEI, e oferece benefícios como academia, seguro, odontológico e muito mais.',
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className={`faq-item glass-panel ${isOpen ? 'faq-item-open' : ''}`}>
    <button className="faq-question" onClick={onClick}>
      <span>{question}</span>
      <svg
        className="faq-arrow"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
    <div className="faq-answer">
      <p>{answer}</p>
    </div>
  </div>
);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq section section-white" id="faq">
      <div className="container">
        <div className="faq-header animate-on-scroll">
          <h2>Perguntas Frequentes</h2>
          <p>Tire suas dúvidas sobre nossos serviços de contabilidade.</p>
        </div>
        <div className="faq-list animate-on-scroll">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
