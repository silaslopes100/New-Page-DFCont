import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Plans } from './Plans';

vi.mock('../../common/Button/Button', () => ({
  Button: ({ children, variant, className }) => (
    <button type="button" data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

describe('Plans tabs', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renderiza a aba de serviços ativa por padrão', () => {
    render(<Plans />);
    const servicoTab = screen.getByRole('tab', { name: 'Empresas de Serviço' });
    const comercioTab = screen.getByRole('tab', { name: 'Empresas de Comércio' });
    expect(servicoTab).toHaveAttribute('aria-selected', 'true');
    expect(comercioTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getAllByText(/Básico|Padrão|Multibenefícios|Experts Essencial/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Comércio Avançado')).not.toBeInTheDocument();
  });

  it('alterna para comércio e exibe somente planos de comércio', () => {
    render(<Plans />);
    fireEvent.click(screen.getByRole('tab', { name: 'Empresas de Comércio' }));

    const comercioTab = screen.getByRole('tab', { name: 'Empresas de Comércio' });
    expect(comercioTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Comércio Básico').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Comércio Avançado').length).toBeGreaterThan(0);
    expect(screen.queryByText('Multibenefícios')).not.toBeInTheDocument();
    expect(screen.queryByText('Experts Essencial')).not.toBeInTheDocument();
  });

  it('atualiza a tabela comparativa ao trocar de aba', () => {
    render(<Plans />);
    const table = () => screen.getByRole('table');
    expect(table().textContent).toContain('Básico');
    expect(table().textContent).not.toContain('Comércio');

    fireEvent.click(screen.getByRole('tab', { name: 'Empresas de Comércio' }));
    expect(table().textContent).toContain('Comércio Básico');
    expect(table().textContent).not.toContain('Multibenefícios');
  });

  it('funciona por teclado com setas', () => {
    render(<Plans />);
    const servicoTab = screen.getByRole('tab', { name: 'Empresas de Serviço' });
    fireEvent.keyDown(servicoTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Empresas de Comércio' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Comércio Avançado').length).toBeGreaterThan(0);
  });

  it('expõe a seção de planos com o ID esperado', () => {
    render(<Plans />);
    expect(document.getElementById('planos')).toBeInTheDocument();
  });
});