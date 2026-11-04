import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'Quanto custa o serviço de contabilidade?',
    answer: 'Nossos planos começam em R$ 197/mês. O Plano Ouro tem preço sob consulta. As opções e os recursos estão detalhados na seção de planos.',
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
    question: 'Quais recursos estão incluídos nos planos?',
    answer: 'Todos incluem abertura grátis, atendimento por chat e e-mail e plataforma de gestão de impostos. A emissão de notas está disponível a partir do Smart; o Smart Plus adiciona conta PJ e reunião mensal com especialista. O Ouro inclui também assessor dedicado, atendimento por telefone e conciliação de extrato bancário.',
  },
  {
    question: 'Como funciona o Plano Ouro?',
    answer: 'O Ouro reúne todos os recursos dos demais planos, com assessor dedicado, atendimento por telefone e conciliação de extrato bancário. O valor é informado sob consulta.',
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
