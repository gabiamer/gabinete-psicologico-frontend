// src/components/pacientes/FormAntecedentes.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Textarea } from '@/components/ui/textarea';
import type { AntecedentesData } from '../../types/types';

interface Props {
  antecedentes: AntecedentesData;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export const FormAntecedentes: React.FC<Props> = ({ antecedentes, handleChange, readOnly = false }) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">05</span>
          <span className="section-text">Motivo y Antecedentes de Consulta</span>
        </div>

        {!readOnly && (
          <div className="mb-6 p-5 bg-muted rounded-lg border border-border">
            <p className="text-muted-foreground leading-relaxed">
              ¿Cuál es el motivo de consulta?, ¿Cuándo comenzaron los síntomas o problemas?,
              ¿Cuándo fue la última vez que se sintió bien?, ¿Hay antecedentes familiares relevantes?,
              ¿Qué factores cree que han contribuido a la situación actual?
            </p>
            <p className="mt-3 text-xs text-muted-foreground italic">
              * Estas preguntas son solo una guía. Redacte un párrafo narrativo que integre la información relevante.
            </p>
          </div>
        )}

        <FormField
          label="Redacte el motivo de consulta y los antecedentes relevantes del paciente"
          required={!readOnly}
        >
          <Textarea
            name="motivoConsulta"
            value={antecedentes.motivoConsulta || ''}
            onChange={handleChange}
            rows={12}
            placeholder="Escriba aquí un relato narrativo del motivo de consulta, incluyendo cuándo comenzaron los síntomas, cómo han evolucionado, antecedentes familiares relevantes, etc..."
            readOnly={readOnly}
            disabled={readOnly}
            className="text-base leading-relaxed resize-y"
          />
        </FormField>
      </section>
    </>
  );
};
