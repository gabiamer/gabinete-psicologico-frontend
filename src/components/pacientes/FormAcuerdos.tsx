// src/components/pacientes/FormAcuerdos.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AntecedentesData, FormData } from '../../types/types';
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
  readOnly?: boolean;
}

export const FormAcuerdos: React.FC<Props> = ({
  formData,
  antecedentes,
  sintomatologias,
  handleChange,
  readOnly = false
}) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">16</span>
          <span className="section-text">Acuerdos y Compromisos</span>
        </div>

        <FormField label="Acuerdos establecidos con el paciente">
          <Textarea
            name="acuerdosEstablecidos"
            value={antecedentes.acuerdosEstablecidos}
            onChange={handleChange}
            rows={6}
            placeholder="Ej. El paciente se compromete a asistir semanalmente, realizar ejercicios de respiración..."
            readOnly={readOnly}
            disabled={readOnly}
            className="resize-y"
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
            <Input
              type="date"
              name="proximaSesionFecha"
              value={antecedentes.proximaSesionFecha}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>

          <FormField label="Hora de la próxima sesión">
            <Input
              type="time"
              name="proximaSesionHora"
              value={antecedentes.proximaSesionHora}
              onChange={handleChange}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      {/* RESUMEN */}
      {!readOnly && (
        <section className="form-section">
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              📊 Resumen de Evaluación Inicial
            </h3>

            <div className="grid gap-3 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Paciente:</span>
                <span>{formData.primerNombre} {formData.apellidoPaterno}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Edad:</span>
                <span>{formData.edad} años</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Semestre:</span>
                <span>{formData.semestre}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Puntuación Estrés:</span>
                <span className="font-semibold" style={{ color: interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').color }}>
                  {calcularTotal(sintomatologias.estres)} — {interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').texto}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Puntuación Ansiedad:</span>
                <span className="font-semibold" style={{ color: interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').color }}>
                  {calcularTotal(sintomatologias.ansiedad)} — {interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').texto}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">Puntuación Depresión:</span>
                <span className="font-semibold" style={{ color: interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').color }}>
                  {calcularTotal(sintomatologias.depresion)} — {interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').texto}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
