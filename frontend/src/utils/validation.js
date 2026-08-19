const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value) => EMAIL_REGEX.test(String(value).trim());

export const normalizePhone = (value) => String(value || '').replace(/\D/g, '');

export const isValidBrazilianPhone = (value) => {
  const digits = normalizePhone(value);
  return digits.length === 10 || digits.length === 11;
};

export const formatPhoneMask = (value) => {
  const digits = normalizePhone(value).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
};