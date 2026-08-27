import React, { useState } from 'react';
import { Button } from '../../common/Button/Button';
import { Input, Select, TextArea } from '../../common/Input/Input';
import { contactAPI } from '../../../services/api';
import { buildWhatsAppUrl } from '../../../config/site';
import { isValidEmail, isValidBrazilianPhone, normalizePhone, formatPhoneMask } from '../../../utils/validation';
import './Contact.css';

const contactOptions = [
  { value: 'duvida', label: 'Dúvida sobre planos' },
  { value: 'abrir', label: 'Quero abrir empresa' },
  { value: 'trocar', label: 'Quero trocar de contador' },
  { value: 'suporte', label: 'Suporte' },
  { value: 'outro', label: 'Outro assunto' },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Informe seu nome';
    if (!formData.email.trim()) nextErrors.email = 'Informe seu e-mail';
    else if (!isValidEmail(formData.email)) nextErrors.email = 'Informe um e-mail válido';
    if (formData.phone && !isValidBrazilianPhone(formData.phone)) {
      nextErrors.phone = 'Informe um telefone válido com DDD';
    }
    if (!formData.message.trim()) nextErrors.message = 'Digite sua mensagem';

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError('Preencha corretamente os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await contactAPI.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone ? normalizePhone(formData.phone) : null,
        message: formData.message.trim(),
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact section section-white" id="contato">
      <div className="container">
        <div className="contact-grid animate-on-scroll">
          <div className="contact-info">
            <h2>Entre em contato</h2>
            <p>Tire suas dúvidas ou solicite um orçamento personalizado.</p>

            <div className="contact-details">
              <div className="contact-detail">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <div>
                  <strong>Telefone / WhatsApp</strong>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-detail-link"
                  >
                    (11) 94527-7005
                  </a>
                </div>
              </div>
              <div className="contact-detail">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <div>
                  <strong>E-mail</strong>
                  <p>contato@dfcont.com.br</p>
                </div>
              </div>
              <div className="contact-detail">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <strong>Endereço</strong>
                  <p>R. Parapuã, 574 - Itaberaba, São Paulo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {success ? (
              <div className="contact-success">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="#22C55E">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <h3>Mensagem enviada com sucesso!</h3>
                <p>Em breve nossa equipe entrará em contato.</p>
                <Button variant="primary" onClick={() => setSuccess(false)}>
                  Enviar nova mensagem
                </Button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <Input
                  label="Nome"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  error={fieldErrors.name}
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                  error={fieldErrors.email}
                />
                <Input
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', formatPhoneMask(e.target.value))}
                  placeholder="(11) 94527-7005"
                  error={fieldErrors.phone}
                />
                <Select
                  label="Assunto"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  options={contactOptions}
                  placeholder="Selecione o assunto"
                />
                <TextArea
                  label="Mensagem"
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Digite sua mensagem..."
                  required
                  error={fieldErrors.message}
                />
                {error && <p className="form-error" role="alert">{error}</p>}
                <Button variant="primary" size="large" className="btn-full" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar mensagem'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};