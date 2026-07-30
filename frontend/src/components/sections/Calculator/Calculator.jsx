import React, { useState } from 'react';
import { Button } from '../../common/Button/Button';
import { Select, NumberInput, Toggle } from '../../common/Input/Input';
import { calculatorAPI } from '../../../services/api';
import './Calculator.css';

const activityOptions = [
  { value: 'pj_empresa', label: 'PJ em uma empresa' },
  { value: 'ti', label: 'Serviços de TI' },
  { value: 'adm', label: 'Serviços Administrativos' },
  { value: 'medicina', label: 'Medicina' },
  { value: 'psicologia', label: 'Psicologia e outros saúde' },
  { value: 'marketing', label: 'Marketing / Publicidade' },
  { value: 'engenharia', label: 'Engenharia / Arquitetura' },
  { value: 'educacao', label: 'Educação / Cursos' },
  { value: 'advocacia', label: 'Advocacia' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'comercial', label: 'Representação Comercial' },
  { value: 'comercio', label: 'Comércio' },
  { value: 'outros', label: 'Minha atividade não está na lista' },
];

const routineOptions = [
  { value: 'sozinho', label: 'Sozinho, através da plataforma' },
  { value: 'assessor', label: 'Com ajuda de um assessor (adicional)' },
];

const contactOptions = [
  { value: 'chat_email', label: 'Via chat e e-mail' },
  { value: 'chat_email_whats', label: 'Via chat, e-mail e WhatsApp' },
  { value: 'completo', label: 'Via chat, e-mail, WhatsApp e telefone' },
];

const initialForm = {
  toggle: 'Vou abrir empresa',
  activity: '',
  employees: 0,
  routine: '',
  contact: '',
  benefits: 'Não',
};

export const Calculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const nextStep = () => {
    if (!formData.activity) { setError('Selecione uma atividade'); return; }
    setStep(2);
  };

  const calculatePlan = async () => {
    if (!formData.routine) { setError('Selecione sua preferência de rotina'); return; }
    if (!formData.contact) { setError('Selecione sua preferência de contato'); return; }
    setLoading(true);
    setError('');

    try {
      const payload = {
        toggle: formData.toggle === 'Vou abrir empresa' ? 'abertura' : 'migracao',
        activity: formData.activity,
        employees: formData.employees,
        routine: formData.routine,
        contact: formData.contact,
        benefits: formData.benefits === 'Sim',
      };
      const response = await calculatorAPI.calculate(payload);
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao calcular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="calculator section" id="calculadora">
      <div className="container">
        <div className="calculator-header animate-on-scroll">
          <h2>Descubra o plano ideal para sua empresa</h2>
          <p>Responda às perguntas abaixo e encontraremos a solução perfeita para você.</p>
        </div>

        <div className="calculator-centered animate-on-scroll">
          <div className="calculator-form glass-panel">
            <Toggle
              label="Você vai:"
              options={['Vou abrir empresa', 'Vou trocar de contador']}
              value={formData.toggle}
              onChange={(val) => updateField('toggle', val)}
            />

            {step >= 1 && (
              <Select
                label="Qual a atividade que você exercerá?"
                value={formData.activity}
                onChange={(e) => updateField('activity', e.target.value)}
                options={activityOptions}
                placeholder="Selecione sua atividade"
                required
              />
            )}

            {step >= 1 && (
              <NumberInput
                label="Quantos sócios ou funcionários sua empresa terá?"
                value={formData.employees}
                onChange={(val) => updateField('employees', val)}
                min={0}
                max={100}
              />
            )}

            {step === 1 && (
              <Button variant="primary" size="large" className="btn-full" onClick={nextStep}>
                Continuar
              </Button>
            )}

            {step >= 2 && (
              <>
                <Select
                  label="Como você prefere cuidar da rotina da sua empresa?"
                  value={formData.routine}
                  onChange={(e) => updateField('routine', e.target.value)}
                  options={routineOptions}
                  placeholder="Selecione"
                  required
                />

                <Select
                  label="Como você prefere ser atendido?"
                  value={formData.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  options={contactOptions}
                  placeholder="Selecione"
                  required
                />

                <Toggle
                  label="Gostaria de ter benefícios?"
                  options={['Sim', 'Não']}
                  value={formData.benefits}
                  onChange={(val) => updateField('benefits', val)}
                />

                {error && <p className="calculator-error">{error}</p>}

                <Button
                  variant="primary"
                  size="large"
                  className="btn-full"
                  onClick={calculatePlan}
                  disabled={loading}
                >
                  {loading ? 'Calculando...' : 'Calcular meu plano'}
                </Button>

                <button className="calculator-back" onClick={() => setStep(1)}>
                  Voltar
                </button>
              </>
            )}
          </div>

          {result && (
            <div className="calculator-result-centered">
              <div className="result-card glass-panel">
                <div className="result-badge">Plano Recomendado</div>
                <h3 className="result-plan-name">{result.recommended_plan}</h3>
                <div className="result-price">
                  <span className="result-price-value">R$ {result.monthly_price?.toFixed(2) || result.price?.toFixed(2)}</span>
                  <span className="result-price-period">/mês</span>
                </div>
                <p className="result-description">{result.description}</p>
                <div className="result-benefits">
                  <h4>Benefícios inclusos:</h4>
                  <ul>
                    {(result.benefits || []).map((b, i) => (
                      <li key={i}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="primary" size="large" className="btn-full">
                  Contratar Plano
                </Button>
                <button className="calculator-back" onClick={() => { setResult(null); setStep(1); setFormData(initialForm); }}>
                  Recalcular
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
