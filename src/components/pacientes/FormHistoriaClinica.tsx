// src/components/pacientes/FormHistoriaClinica.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Textarea } from '@/components/ui/textarea';
import type { AntecedentesData } from '../../types/types';

interface Props {
  antecedentes: AntecedentesData;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export const FormHistoriaClinica: React.FC<Props> = ({
  antecedentes,
  handleChange,
  readOnly = false
}) => {
  return (
    <section className="form-section">
      <div className="section-title">
        <span className="section-number">15b</span>
        <span className="section-text">Historia Clínica</span>
      </div>

      <FormField label="Historia Clínica">
        <Textarea
          name="historiaClinica"
          value={antecedentes.historiaClinica || ''}
          onChange={handleChange}
          rows={12}
          placeholder="Escriba aquí la historia clínica del paciente..."
          readOnly={readOnly}
          disabled={readOnly}
          className="resize-y"
        />
      </FormField>
    </section>
  );
};
