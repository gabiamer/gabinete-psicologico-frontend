// src/components/pacientes/FormHistoriaFamiliar.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Input } from '@/components/ui/input';
import type { AntecedentesData } from '../../types/types';

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
            <Input name="conQuienVive" value={antecedentes.conQuienVive} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Persona de referencia">
            <Input name="personaReferencia" value={antecedentes.personaReferencia} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Celular de referencia">
            <Input name="celularReferencia" value={antecedentes.celularReferencia} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
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
            <Input name="nombrePadre" value={antecedentes.nombrePadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Escolaridad u ocupación">
            <Input name="ocupacionPadre" value={antecedentes.ocupacionPadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="¿Padece alguna enfermedad?">
            <Input name="enfermedadPadre" value={antecedentes.enfermedadPadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Relación padre-paciente">
            <Input name="relacionPadre" value={antecedentes.relacionPadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
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
            <Input name="nombreMadre" value={antecedentes.nombreMadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Escolaridad u ocupación">
            <Input name="ocupacionMadre" value={antecedentes.ocupacionMadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="¿Padece alguna enfermedad?">
            <Input name="enfermedadMadre" value={antecedentes.enfermedadMadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Relación madre-paciente">
            <Input name="relacionMadre" value={antecedentes.relacionMadre} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
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
            <Input type="number" name="numeroHermanos" min={0} value={antecedentes.numeroHermanos} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
          <FormField label="Relato de la relación con los hermanos">
            <Input name="relatoHermanos" value={antecedentes.relatoHermanos} onChange={handleChange} readOnly={readOnly} disabled={readOnly} />
          </FormField>
        </div>
      </section>
    </>
  );
};
