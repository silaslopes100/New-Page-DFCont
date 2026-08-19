import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidBrazilianPhone,
  normalizePhone,
  formatPhoneMask,
} from './validation';

describe('isValidEmail', () => {
  it('aceita e-mails válidos', () => {
    expect(isValidEmail('joao@teste.com')).toBe(true);
    expect(isValidEmail('joao.silva+tag@sub.dominio.com.br')).toBe(true);
    expect(isValidEmail('joao@dfcont.com.br')).toBe(true);
  });

  it('rejeita e-mails inválidos', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('nao-e-email')).toBe(false);
    expect(isValidEmail('joao@')).toBe(false);
    expect(isValidEmail('joao@teste')).toBe(false);
    expect(isValidEmail('joao@teste.c')).toBe(false);
  });
});

describe('normalizePhone', () => {
  it('remove máscara e mantém apenas dígitos', () => {
    expect(normalizePhone('(11) 99999-9999')).toBe('11999999999');
    expect(normalizePhone('11 99999-9999')).toBe('11999999999');
    expect(normalizePhone('abc123')).toBe('123');
  });
});

describe('isValidBrazilianPhone', () => {
  it('aceita telefones com 10 ou 11 dígitos', () => {
    expect(isValidBrazilianPhone('(11) 99999-9999')).toBe(true);
    expect(isValidBrazilianPhone('11999999999')).toBe(true);
    expect(isValidBrazilianPhone('(11) 4527-7005')).toBe(true);
  });

  it('rejeita telefones incompletos', () => {
    expect(isValidBrazilianPhone('')).toBe(false);
    expect(isValidBrazilianPhone('(11) 999')).toBe(false);
    expect(isValidBrazilianPhone('(11) 4527')).toBe(false);
    expect(isValidBrazilianPhone('1234567890123')).toBe(false);
  });
});

describe('formatPhoneMask', () => {
  it('aplica máscara progressiva', () => {
    expect(formatPhoneMask('11')).toBe('(11');
    expect(formatPhoneMask('1194527')).toBe('(11) 9452-7');
    expect(formatPhoneMask('1194527700')).toBe('(11) 9452-7700');
    expect(formatPhoneMask('11945277005')).toBe('(11) 94527-7005');
  });

  it('limita a 11 dígitos e ignora não numéricos', () => {
    expect(formatPhoneMask('119452770051234')).toBe('(11) 94527-7005');
    expect(formatPhoneMask('(11) 99999-9999')).toBe('(11) 99999-9999');
  });
});