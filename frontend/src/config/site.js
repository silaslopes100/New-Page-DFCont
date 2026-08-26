export const WHATSAPP_NUMBER = '5511945277005';
export const WHATSAPP_DEFAULT_MESSAGE = 'Olá, gostaria de falar com um especialista da DFCont.';

export const buildWhatsAppUrl = (message = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const NAV_SECTIONS = {
  hero: 'hero',
  sobre: 'sobre',
  comoFunciona: 'como-funciona',
  planos: 'planos',
  contato: 'contato',
  calculadora: 'calculadora',
  depoimentos: 'depoimentos',
  cta: 'cta',
  faq: 'faq',
};

export const NAV_LINKS = [
  { id: NAV_SECTIONS.sobre, label: 'Sobre Nós' },
  { id: NAV_SECTIONS.comoFunciona, label: 'Como Funciona' },
  { id: NAV_SECTIONS.planos, label: 'Planos' },
  { id: NAV_SECTIONS.depoimentos, label: 'Depoimentos' },
  { id: NAV_SECTIONS.contato, label: 'Contato' },
];

export const SERVICES_LINKS = [
  { id: NAV_SECTIONS.planos, label: 'Abrir Empresa' },
  { id: NAV_SECTIONS.planos, label: 'Trocar de Contador' },
  { id: NAV_SECTIONS.planos, label: 'Assessoria Contábil' },
  { id: NAV_SECTIONS.planos, label: 'Contabilidade Digital' },
];

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};