import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calculator } from './Calculator';
import { calculatorAPI, leadAPI } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  calculatorAPI: { calculate: vi.fn() },
  leadAPI: { create: vi.fn() },
}));

const mockedCalculate = vi.mocked(calculatorAPI.calculate);
const mockedLead = vi.mocked(leadAPI.create);

const successCalc = {
  data: {
    recommended_plan: 'Padrão',
    monthly_price: 195,
    price: 195,
    benefits: ['Certificado digital', 'Conta PJ gratuita'],
    description: 'Plano mais popular',
  },
};

const selectActivity = () => {
  fireEvent.change(screen.getByLabelText(/Qual a atividade/), { target: { value: 'ti' } });
};

const fillLeadFields = () => {
  fireEvent.change(screen.getByLabelText(/Nome completo/), { target: { value: 'João Teste' } });
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'joao@teste.com' } });
  fireEvent.change(screen.getByLabelText(/Telefone/), { target: { value: '(11) 99999-9999' } });
  fireEvent.change(screen.getByLabelText(/Cidade/), { target: { value: 'São Paulo' } });
};

const fillRoutinePrefs = () => {
  fireEvent.change(screen.getByLabelText(/rotina da sua empresa/), { target: { value: 'sozinho' } });
  fireEvent.change(screen.getByLabelText(/ser atendido/), { target: { value: 'chat_email' } });
};

describe('Calculator flow', () => {
  beforeEach(() => {
    mockedCalculate.mockReset();
    mockedLead.mockReset();
    mockedCalculate.mockResolvedValue(successCalc);
    mockedLead.mockResolvedValue({ data: { id: 1, message: 'ok' } });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('bloqueia avanço sem atividade selecionada', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Selecione uma atividade');
    expect(screen.queryByLabelText(/Nome completo/)).not.toBeInTheDocument();
  });

  it('bloqueia avanço com e-mail inválido e telefone inválido', () => {
    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    fireEvent.change(screen.getByLabelText(/Nome completo/), { target: { value: 'João Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'nao-e-email' } });
    fireEvent.change(screen.getByLabelText(/Telefone/), { target: { value: '(11) 999' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByText('Informe um e-mail válido')).toBeInTheDocument();
    expect(screen.getByText('Informe um telefone válido com DDD')).toBeInTheDocument();
  });

  it('aplica máscara no telefone', () => {
    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    const phone = screen.getByLabelText(/Telefone/);
    fireEvent.change(phone, { target: { value: '11999999999' } });
    expect(phone.value).toBe('(11) 99999-9999');
  });

  it('calcula o plano e exibe o resultado com lead persistido', async () => {
    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillLeadFields();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillRoutinePrefs();
    fireEvent.click(screen.getByRole('button', { name: 'Calcular meu plano' }));

    await waitFor(() => expect(screen.getByText('Padrão')).toBeInTheDocument());
    expect(screen.getByText('R$ 195,00')).toBeInTheDocument();
    expect(screen.getByText('Certificado digital')).toBeInTheDocument();
    expect(mockedLead).toHaveBeenCalledTimes(1);
    const leadPayload = mockedLead.mock.calls[0][0];
    expect(leadPayload.name).toBe('João Teste');
    expect(leadPayload.email).toBe('joao@teste.com');
    expect(leadPayload.phone).toBe('11999999999');
    expect(leadPayload.origin).toBe('calculator');
    expect(leadPayload.toggle).toBe('abertura');
  });

  it('bloqueia duplicação de envio durante loading', async () => {
    let resolveCalc;
    mockedCalculate.mockReturnValue(new Promise((resolve) => { resolveCalc = resolve; }));

    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillLeadFields();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillRoutinePrefs();

    const button = screen.getByRole('button', { name: 'Calcular meu plano' });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Calculando...' })).toBeDisabled();
    resolveCalc(successCalc);
    await waitFor(() => expect(mockedCalculate).toHaveBeenCalledTimes(1));
  });

  it('exibe erro quando a API de cálculo falha', async () => {
    mockedCalculate.mockRejectedValue(new Error('Erro de conexão. Tente novamente.'));

    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillLeadFields();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillRoutinePrefs();
    fireEvent.click(screen.getByRole('button', { name: 'Calcular meu plano' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Erro de conexão. Tente novamente.')
    );
    expect(screen.queryByText(/Plano Recomendado/)).not.toBeInTheDocument();
  });

  it('mostra resultado mesmo com dados incompletos da API', async () => {
    mockedCalculate.mockResolvedValue({
      data: { recommended_plan: null, monthly_price: null, price: null, benefits: [], description: null },
    });

    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillLeadFields();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillRoutinePrefs();
    fireEvent.click(screen.getByRole('button', { name: 'Calcular meu plano' }));

    await waitFor(() => expect(screen.getByText('Plano personalizado')).toBeInTheDocument());
    expect(screen.getByText('Sem benefícios adicionais inclusos neste plano.')).toBeInTheDocument();
  });

  it('permite recalcular limpando o estado', async () => {
    render(<Calculator />);
    selectActivity();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillLeadFields();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fillRoutinePrefs();
    fireEvent.click(screen.getByRole('button', { name: 'Calcular meu plano' }));
    await waitFor(() => expect(screen.getByText('Padrão')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Recalcular' }));
    expect(screen.queryByText(/Plano Recomendado/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Qual a atividade/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
  });
});