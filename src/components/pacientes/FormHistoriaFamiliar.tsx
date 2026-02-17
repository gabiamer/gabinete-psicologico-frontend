// src/components/pacientes/FormHistoriaFamiliar.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { AntecedentesData } from '../../types/types';

interface Props {
  antecedentes: AntecedentesData;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export const FormHistoriaFamiliar: React.FC<Props> = ({ antecedentes, handleChange, readOnly = false }) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">07</span>
          <span className="section-text">Historia Familiar</span>
        </div>
        <div className="grid-2-cols">
          <FormField label="¿Con quién vive?">
            <input 
              name="conQuienVive" 
              value={antecedentes.conQuienVive} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Persona de referencia">
            <input 
              name="personaReferencia" 
              value={antecedentes.personaReferencia} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Celular de referencia">
            <input 
              name="celularReferencia" 
              value={antecedentes.celularReferencia} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">08</span>
          <span className="section-text">Datos del Padre</span>
        </div>
        <div className="grid-2-cols">
          <FormField label="Nombre">
            <input 
              name="nombrePadre" 
              value={antecedentes.nombrePadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Escolaridad u ocupación">
            <input 
              name="ocupacionPadre" 
              value={antecedentes.ocupacionPadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="¿Padece alguna enfermedad?">
            <input 
              name="enfermedadPadre" 
              value={antecedentes.enfermedadPadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Relación padre-paciente">
            <input 
              name="relacionPadre" 
              value={antecedentes.relacionPadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">09</span>
          <span className="section-text">Datos de la Madre</span>
        </div>
        <div className="grid-2-cols">
          <FormField label="Nombre">
            <input 
              name="nombreMadre" 
              value={antecedentes.nombreMadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Escolaridad u ocupación">
            <input 
              name="ocupacionMadre" 
              value={antecedentes.ocupacionMadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="¿Padece alguna enfermedad?">
            <input 
              name="enfermedadMadre" 
              value={antecedentes.enfermedadMadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Relación madre-paciente">
            <input 
              name="relacionMadre" 
              value={antecedentes.relacionMadre} 
              onChange={handleChange} 
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">10</span>
          <span className="section-text">Hermanos</span>
        </div>
        <div className="grid-2-cols">
          <FormField label="Número de hermanos">
            <input
              type="number"
              name="numeroHermanos"
              min="0"
              value={antecedentes.numeroHermanos}
              onChange={handleChange}
              className="input-academic"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
          <FormField label="Relato de la relación con los hermanos">
            <input 
              name="relatoHermanos" 
              value={antecedentes.relatoHermanos} 
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