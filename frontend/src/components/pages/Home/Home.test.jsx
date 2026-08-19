import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Home } from './Home';

vi.mock('../../sections/Hero/Hero', () => ({
  Hero: () => <div id="hero">Hero mockado</div>,
}));

vi.mock('../../../hooks/useScrollAnimation', () => ({
  useScrollAnimation: () => {},
}));

describe('Home', () => {
  it('renderiza todas as seções da one page', () => {
    render(<Home />);

    expect(screen.getByText('Hero mockado')).toBeInTheDocument();
    expect(screen.getByText('Descubra o plano ideal para sua empresa')).toBeInTheDocument();
    expect(screen.getAllByText('Conheça nossos planos').length).toBeGreaterThan(0);
    expect(screen.getByText('Entre em contato')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /clientes falam sobre nós/i })).toBeInTheDocument();
  });

  it('expõe as âncoras esperadas da one page', () => {
    render(<Home />);

    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('calculadora')).toBeInTheDocument();
    expect(document.getElementById('planos')).toBeInTheDocument();
    expect(document.getElementById('contato')).toBeInTheDocument();
  });
});