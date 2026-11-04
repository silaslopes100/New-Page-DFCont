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
    expect(screen.getAllByText(/Start|Smart|Smart Plus|Ouro/).length).toBeGreaterThan(0);
    expect(screen.getByText('Consulte')).toBeInTheDocument();
  });

  it('alterna para comércio e exibe os planos da planilha', () => {
    render(<Plans />);
    fireEvent.click(screen.getByRole('tab', { name: 'Empresas de Comércio' }));

    const comercioTab = screen.getByRole('tab', { name: 'Empresas de Comércio' });
    expect(comercioTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Start').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Smart').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Smart Plus').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ouro').length).toBeGreaterThan(0);
  });

  it('atualiza a tabela comparativa ao trocar de aba', () => {
    render(<Plans />);
    const table = () => screen.getByRole('table');
    expect(table().textContent).toContain('Start');
    expect(table().textContent).toContain('Conciliação de extrato bancário');

    fireEvent.click(screen.getByRole('tab', { name: 'Empresas de Comércio' }));
    expect(table().textContent).toContain('Smart Plus');
    expect(table().textContent).toContain('Ouro');
  });

  it('funciona por teclado com setas', () => {
    render(<Plans />);
    const servicoTab = screen.getByRole('tab', { name: 'Empresas de Serviço' });
    fireEvent.keyDown(servicoTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Empresas de Comércio' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Smart Plus').length).toBeGreaterThan(0);
  });

  it('expõe a seção de planos com o ID esperado', () => {
    render(<Plans />);
    expect(document.getElementById('planos')).toBeInTheDocument();
  });
});