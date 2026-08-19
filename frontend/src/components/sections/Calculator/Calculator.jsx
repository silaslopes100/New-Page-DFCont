import React, { useState } from 'react';
import { Button } from '../../common/Button/Button';
import { Input, Select, NumberInput, Toggle } from '../../common/Input/Input';
import { calculatorAPI, leadAPI } from '../../../services/api';
import { buildWhatsAppUrl } from '../../../config/site';
import { isValidEmail, isValidBrazilianPhone, normalizePhone, formatPhoneMask } from '../../../utils/validation';
import { formatBRL } from '../../../utils/format';
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
  name: '',
  email: '',
  phone: '',
  city: '',
  routine: '',
  contact: '',
  benefits: 'Não',
};

const initialErrors = {};

export const Calculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setError('');
    setWarning('');
  };

  const validateLeadFields = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Informe seu nome completo';
    if (!formData.email.trim()) nextErrors.email = 'Informe seu e-mail';
    else if (!isValidEmail(formData.email)) nextErrors.email = 'Informe um e-mail válido';
    if (!formData.phone.trim()) nextErrors.phone = 'Informe seu telefone/WhatsApp';
    else if (!isValidBrazilianPhone(formData.phone)) nextErrors.phone = 'Informe um telefone válido com DDD';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!formData.activity) {
      setError('Selecione uma atividade');
      return;
    }
    setStep(2);
  };

  const nextStepFromLead = () => {
    if (!validateLeadFields()) {
      setError('Preencha corretamente os campos obrigatórios');
      return;
    }
    setStep(3);
  };

  const calculatePlan = async () => {
    if (loading) return;
    if (!formData.routine) { setError('Selecione sua preferência de rotina'); return; }
    if (!formData.contact) { setError('Selecione sua preferência de contato'); return; }
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const leadPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: normalizePhone(formData.phone),
        city: formData.city.trim() || null,
        activity: formData.activity,
        origin: 'calculator',
        toggle: formData.toggle === 'Vou abrir empresa' ? 'abertura' : 'migracao',
        employees: formData.employees,
        routine: formData.routine,
        contact: formData.contact,
        benefits: formData.benefits === 'Sim',
      };
      const payload = {
        toggle: leadPayload.toggle,
        activity: formData.activity,
        employees: formData.employees,
        routine: formData.routine,
        contact: formData.contact,
        benefits: formData.benefits === 'Sim',
      };
      const [leadResult, calcResult] = await Promise.allSettled([
        leadAPI.create(leadPayload),
        calculatorAPI.calculate(payload),
      ]);

      if (calcResult.status === 'fulfilled') {
        setResult({
          ...calcResult.value.data,
          recommended_plan: calcResult.value.data.recommended_plan,
          monthly_price: calcResult.value.data.monthly_price ?? calcResult.value.data.price,
        });
        if (leadResult.status === 'rejected') {
          setWarning('Não foi possível registrar seu contato agora, mas seu plano foi calculado.');
        }
      } else if (leadResult.status === 'rejected') {
        setError(leadResult.reason.message || 'Erro ao calcular. Tente novamente.');
      } else {
        setError(calcResult.reason?.message || 'Erro ao calcular. Tente novamente.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao calcular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResult(null);
    setStep(1);
    setFormData(initialForm);
    setErrors(initialErrors);
    setError('');
    setWarning('');
  };

  const resultPrice = formatBRL(result?.monthly_price ?? result?.price);
  const hasBenefits = Array.isArray(result?.benefits) && result.benefits.length > 0;

  return (
    <section className="calculator section" id="calculadora">
      <div className="calculator-bg" aria-hidden="true" />
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
                error={errors.activity}
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
              <>
                {error && <p className="calculator-error" role="alert">{error}</p>}
                <Button variant="primary" size="large" className="btn-full" onClick={nextStep}>
                  Continuar
                </Button>
              </>
            )}

            {step >= 2 && (
              <>
                <Input
                  label="Nome completo"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Seu nome"
                  required
                  error={errors.name}
                />

                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                  error={errors.email}
                />

                <Input
                  label="Telefone / WhatsApp"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', formatPhoneMask(e.target.value))}
                  placeholder="(00) 00000-0000"
                  required
                  error={errors.phone}
                />

                <Input
                  label="Cidade"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Sua cidade"
                />
              </>
            )}

            {step === 2 && (
              <>
                {error && <p className="calculator-error" role="alert">{error}</p>}
                <Button variant="primary" size="large" className="btn-full" onClick={nextStepFromLead}>
                  Continuar
                </Button>
                <button className="calculator-back" onClick={() => setStep(1)}>
                  Voltar
                </button>
              </>
            )}

            {step >= 3 && (
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

                {error && <p className="calculator-error" role="alert">{error}</p>}
                {warning && <p className="calculator-warning" role="status">{warning}</p>}

                <Button
                  variant="primary"
                  size="large"
                  className="btn-full"
                  onClick={calculatePlan}
                  disabled={loading}
                >
                  {loading ? 'Calculando...' : 'Calcular meu plano'}
                </Button>

                <button className="calculator-back" onClick={() => setStep(2)}>
                  Voltar
                </button>
              </>
            )}
          </div>

          {result && (
            <div className="calculator-result-centered">
              <div className="result-card glass-panel">
                <div className="result-badge">Plano Recomendado</div>
                <h3 className="result-plan-name">{result.recommended_plan || 'Plano personalizado'}</h3>
                <div className="result-price">
                  <span className="result-price-value">{resultPrice || '—'}</span>
                  <span className="result-price-period">/mês</span>
                </div>
                {result.description && <p className="result-description">{result.description}</p>}
                {hasBenefits ? (
                  <div className="result-benefits">
                    <h4>Benefícios inclusos:</h4>
                    <ul>
                      {result.benefits.map((b, i) => (
                        <li key={i}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="result-description">Sem benefícios adicionais inclusos neste plano.</p>
                )}
                <a
                  href={buildWhatsAppUrl(`Olá, gostaria de contratar o plano ${result.recommended_plan || ''} da DFCont.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="large" className="btn-full">
                    Contratar Plano
                  </Button>
                </a>
                <button className="calculator-back" onClick={resetAll}>
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