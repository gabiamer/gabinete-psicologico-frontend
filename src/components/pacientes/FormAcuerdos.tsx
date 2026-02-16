// src/components/pacientes/FormAcuerdos.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { AntecedentesData, FormData } from '../../types/types';
import { calcularTotal, interpretarResultado } from '../../utils/calculos';

interface Props {
  formData: FormData;
  antecedentes: AntecedentesData;
  sintomatologias: {
    estres: number[];
    ansiedad: number[];
    depresion: number[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormAcuerdos: React.FC<Props> = ({
  formData,
  antecedentes,
  sintomatologias,
  handleChange
}) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">16</span>
          <span className="section-text">Acuerdos Establecidos</span>
        </div>

        <FormField label="Describa los acuerdos, compromisos y objetivos establecidos con el paciente">
          <textarea
            name="acuerdosEstablecidos"
            value={antecedentes.acuerdosEstablecidos}
            onChange={handleChange}
            className="textarea-academic"
            rows={6}
            placeholder="Ej. El paciente se compromete a asistir semanalmente, realizar ejercicios de respiración..."
          />
        </FormField>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">17</span>
          <span className="section-text">Próxima Sesión</span>
        </div>

        <div className="grid-2-cols">
          <FormField label="Fecha de la próxima sesión">
            <input
              type="date"
              name="proximaSesionFecha"
              value={antecedentes.proximaSesionFecha}
              onChange={handleChange}
              className="input-academic"
              min={new Date().toISOString().split('T')[0]}
            />
          </FormField>

          <FormField label="Hora de la próxima sesión">
            <input
              type="time"
              name="proximaSesionHora"
              value={antecedentes.proximaSesionHora}
              onChange={handleChange}
              className="input-academic"
            />
          </FormField>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="form-section" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
            Resumen de la Entrevista
          </h3>
        </div>

        <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Paciente:</span>
            <span>{formData.primerNombre} {formData.apellidoPaterno}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Edad:</span>
            <span>{formData.edad} años</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Semestre:</span>
            <span>{formData.semestre}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Estrés:</span>
            <span style={{ color: interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').color, fontWeight: '600' }}>
              {calcularTotal(sintomatologias.estres)} - {interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').texto}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Ansiedad:</span>
            <span style={{ color: interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').color, fontWeight: '600' }}>
              {calcularTotal(sintomatologias.ansiedad)} - {interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').texto}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Depresión:</span>
            <span style={{ color: interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').color, fontWeight: '600' }}>
              {calcularTotal(sintomatologias.depresion)} - {interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').texto}
            </span>
          </div>
        </div>
      </section>
    </>
  );
};