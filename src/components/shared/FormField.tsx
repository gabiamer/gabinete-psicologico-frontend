// src/components/shared/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, children }) => (
  <div className="field-group">
    <label className="field-label">
      {label}
      {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
    </label>
    {children}
  </div>
);