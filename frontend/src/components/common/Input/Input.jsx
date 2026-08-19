import React, { useId } from 'react';
import './Input.css';

export const Input = ({
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  error,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = useId();
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const Select = ({
  label,
  value = '',
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  required = false,
  className = '',
}) => {
  const selectId = useId();
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={selectId}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`input-field input-select ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  error,
  className = '',
}) => {
  const inputId = useId();
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="number-input">
        <button type="button" className="number-btn" onClick={decrement} disabled={value <= min} aria-label="Diminuir">-</button>
        <input
          id={inputId}
          type="number"
          className={`input-field number-field ${error ? 'input-error' : ''}`}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val >= min && val <= max) onChange(val);
          }}
          min={min}
          max={max}
          aria-invalid={error ? true : undefined}
        />
        <button type="button" className="number-btn" onClick={increment} disabled={value >= max} aria-label="Aumentar">+</button>
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const Toggle = ({
  label,
  options,
  value,
  onChange,
  className = '',
}) => (
  <div className={`input-group ${className}`}>
    {label && <label className="input-label">{label}</label>}
    <div className="toggle-group" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`toggle-btn ${value === opt ? 'toggle-active' : ''}`}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export const TextArea = ({
  label,
  value = '',
  onChange,
  placeholder = '',
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const textareaId = useId();
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={textareaId}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input-field input-textarea ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};