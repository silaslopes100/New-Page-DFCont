import { describe, it, expect } from 'vitest';
import {
  WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  NAV_SECTIONS,
  NAV_LINKS,
  SERVICES_LINKS,
  scrollToSection,
} from './site';

describe('WhatsApp', () => {
  it('usa o número oficial da DFCont', () => {
    expect(WHATSAPP_NUMBER).toBe('5511945277005');
  });

  it('monta a URL oficial com mensagem padrão', () => {
    const url = buildWhatsAppUrl();
    expect(url.startsWith('https://wa.me/5511945277005?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(
      'Olá, gostaria de falar com um especialista da DFCont.'
    );
  });

  it('monta a URL com mensagem customizada codificada', () => {
    const url = buildWhatsAppUrl('Quero contratar o plano Padrão');
    expect(url.startsWith('https://wa.me/5511945277005?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Quero contratar o plano Padrão');
  });
});

describe('NAV_SECTIONS', () => {
  it('cobre todas as âncoras da one page', () => {
    expect(NAV_SECTIONS.hero).toBe('hero');
    expect(NAV_SECTIONS.sobre).toBe('sobre');
    expect(NAV_SECTIONS.comoFunciona).toBe('como-funciona');
    expect(NAV_SECTIONS.planos).toBe('planos');
    expect(NAV_SECTIONS.blog).toBe('blog');
    expect(NAV_SECTIONS.contato).toBe('contato');
    expect(NAV_SECTIONS.calculadora).toBe('calculadora');
    expect(NAV_SECTIONS.depoimentos).toBe('depoimentos');
    expect(NAV_SECTIONS.cta).toBe('cta');
    expect(NAV_SECTIONS.faq).toBe('faq');
  });
});

describe('NAV_LINKS e SERVICES_LINKS', () => {
  it('tem links de navegação com id e label', () => {
    NAV_LINKS.forEach((link) => {
      expect(link.id).toBeTruthy();
      expect(link.label).toBeTruthy();
    });
    expect(NAV_LINKS.some((l) => l.id === NAV_SECTIONS.planos)).toBe(true);
    expect(NAV_LINKS.some((l) => l.id === NAV_SECTIONS.contato)).toBe(true);
  });

  it('tem links de serviços válidos', () => {
    SERVICES_LINKS.forEach((service) => {
      expect(service.id).toBeTruthy();
      expect(service.label).toBeTruthy();
    });
    expect(SERVICES_LINKS.length).toBeGreaterThan(0);
  });
});

describe('scrollToSection', () => {
  it('rola até a seção existente', () => {
    const el = document.createElement('section');
    el.id = 'planos';
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);
    scrollToSection('planos');
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('não falha para seção inexistente', () => {
    expect(() => scrollToSection('nao-existe')).not.toThrow();
  });
});