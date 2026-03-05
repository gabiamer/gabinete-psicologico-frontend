// src/components/pacientes/FormAntecedentes.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
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
          <div style={{ 
            marginBottom: '24px', 
            padding: '20px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: '8px',
            border: '2px solid #cbd5e1'
          }}>
            
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: '1.8' }}>
              <p>¿Cuál es el motivo de consulta?, ¿Cuándo comenzaron los síntomas o problemas?, 
                ¿Cuándo fue la última vez que se sintió bien?,¿Hay antecedentes familiares relevantes?,
                ¿Qué factores cree que han contribuido a la situación actual?
              </p>
            </ul>
            <p style={{ 
              margin: '16px 0 0 0', 
              fontSize: '13px', 
              color: '#64748b', 
              fontStyle: 'italic' 
            }}>
              * Estas preguntas son solo una guía. Redacte un párrafo narrativo que integre la información relevante.
            </p>
          </div>
        )}

        <FormField 
          label="Redacte el motivo de consulta y los antecedentes relevantes del paciente" 
          required={!readOnly}
        >
          <textarea
            name="motivoConsulta"
            value={antecedentes.motivoConsulta || ''}
            onChange={handleChange}
            className="textarea-academic"
            rows={12}
            placeholder="Escriba aquí un relato narrativo del motivo de consulta, incluyendo cuándo comenzaron los síntomas, cómo han evolucionado, antecedentes familiares relevantes, etc..."
            readOnly={readOnly}
            disabled={readOnly}
            style={{ fontSize: '15px', lineHeight: '1.6' }}
          />
        </FormField>
      </section>
    </>
  );
};