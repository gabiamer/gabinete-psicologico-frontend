// src/components/pacientes/FormAntecedentes.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { AntecedentesData } from '../../types/types';

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
          <span className="section-text">Situación Actual y Motivo</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <FormField label="¿Cuándo se sintió bien por última vez?" required={!readOnly}>
            <textarea
              name="ultimaVezBien"
              value={antecedentes.ultimaVezBien}
              onChange={handleChange}
              className="textarea-academic"
              placeholder="Describa..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Desarrollo de los síntomas" required={!readOnly}>
            <textarea
              name="desarrolloSintomas"
              value={antecedentes.desarrolloSintomas}
              onChange={handleChange}
              className="textarea-academic"
              placeholder="Describa..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Antecedentes Familiares">
            <textarea
              name="antecedentesFamiliares"
              value={antecedentes.antecedentesFamiliares}
              onChange={handleChange}
              className="textarea-academic"
              placeholder="Describa..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">06</span>
          <span className="section-text">Funciones Orgánicas</span>
        </div>
        <div className="grid-fields">
          <FormField label="Sueño">
            <input 
              name="sueno" 
              value={antecedentes.sueno} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Apetito">
            <input 
              name="apetito" 
              value={antecedentes.apetito} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Sed">
            <input 
              name="sed" 
              value={antecedentes.sed} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Defecación">
            <input 
              name="defecacion" 
              value={antecedentes.defecacion} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>
    </>
  );
};