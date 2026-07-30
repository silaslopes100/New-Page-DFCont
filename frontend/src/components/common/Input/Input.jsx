import React from 'react';
import './Input.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  className = '',
  ...props
}) => (
  <div className={`input-group ${className}`}>
    {label && (
      <label className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
    )}
    <input
      className={`input-field ${error ? 'input-error' : ''}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
    />
    {error && <span className="input-error-text">{error}</span>}
  </div>
);

export const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  required = false,
  className = '',
}) => (
  <div className={`input-group ${className}`}>
    {label && (
      <label className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
    )}
    <select
      className={`input-field input-select ${error ? 'input-error' : ''}`}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="input-error-text">{error}</span>}
  </div>
);

export const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  error,
  className = '',
}) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="number-input">
        <button type="button" className="number-btn" onClick={decrement} disabled={value <= min}>-</button>
        <input
          type="number"
          className={`input-field number-field ${error ? 'input-error' : ''}`}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val >= min && val <= max) onChange(val);
          }}
          min={min}
          max={max}
        />
        <button type="button" className="number-btn" onClick={increment} disabled={value >= max}>+</button>
      </div>
      {error && <span className="input-error-text">{error}</span>}
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
    <div className="toggle-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`toggle-btn ${value === opt ? 'toggle-active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  rows = 4,
  className = '',
}) => (
  <div className={`input-group ${className}`}>
    {label && (
      <label className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
    )}
    <textarea
      className={`input-field input-textarea ${error ? 'input-error' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      {...props}
    />
    {error && <span className="input-error-text">{error}</span>}
  </div>
);
