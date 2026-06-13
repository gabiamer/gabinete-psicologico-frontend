// src/components/pacientes/FormUniversidad.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AntecedentesData } from '../../types/types';

interface Props {
  antecedentes: AntecedentesData;
  setAntecedentes: React.Dispatch<React.SetStateAction<AntecedentesData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export const FormUniversidad: React.FC<Props> = ({
  antecedentes,
  setAntecedentes,
  handleChange,
  readOnly = false
}) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">14</span>
          <span className="section-text">Relato de Socialización y Conducta en la Universidad</span>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="¿Ha cambiado de carrera?">
            {readOnly ? (
              <Input value={antecedentes.cambioCarreras} readOnly disabled />
            ) : (
              <div className="flex gap-6 mt-2">
                {['Si', 'No'].map((val) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                    <input
                      type="radio"
                      name="cambioCarreras"
                      value={val}
                      checked={antecedentes.cambioCarreras === val}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[color:var(--accent)]"
                    />
                    <span>{val === 'Si' ? 'Sí' : 'No'}</span>
                  </label>
                ))}
              </div>
            )}
          </FormField>

          {antecedentes.cambioCarreras === 'Si' && (
            <FormField label="Motivos del cambio">
              <Textarea
                name="motivosCambio"
                value={antecedentes.motivosCambio}
                onChange={handleChange}
                rows={3}
                placeholder="Describa los motivos del cambio de carrera..."
                readOnly={readOnly}
                disabled={readOnly}
              />
            </FormField>
          )}

          <FormField label="Relato general sobre la vida universitaria">
            <Textarea
              name="relatoUniversidad"
              value={antecedentes.relatoUniversidad}
              onChange={handleChange}
              rows={5}
              placeholder="Describa su experiencia..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>

      {/* HÁBITOS */}
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">15</span>
          <span className="section-text">Hábitos y Otros Aspectos</span>
        </div>

        {!readOnly && (
          <div className="mb-8 p-5 bg-muted rounded-lg border border-border">
            <p className="text-foreground font-semibold mb-3">
              Indique la frecuencia de consumo para cada sustancia:
            </p>
            <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-center text-muted-foreground">
              {['0: Nunca', '1: Muy poco', '2: Poco', '3: Ocasional', '4: Frecuente', '5: Muy frecuente'].map(txt => (
                <div key={txt}>{txt}</div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {['Alcohol', 'Tabaco', 'Drogas'].map((sustancia) => {
            const key = sustancia.toLowerCase();
            return (
              <div key={key}>
                <FormField label={`Consumo de ${key}`}>
                  <Input
                    name={`consumo${sustancia}`}
                    value={antecedentes[`consumo${sustancia}` as keyof AntecedentesData] as string}
                    onChange={handleChange}
                    placeholder="Describa el tipo y detalles"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </FormField>
                <div className="mt-3">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Frecuencia de consumo de {key}
                  </label>
                  {readOnly ? (
                    <Input
                      type="text"
                      value={antecedentes[`frecuencia${sustancia}` as keyof AntecedentesData] as string}
                      readOnly
                      disabled
                      className="mt-2"
                    />
                  ) : (
                    <div className="flex gap-4 mt-2">
                      {[0, 1, 2, 3, 4, 5].map(valor => (
                        <label key={valor} className="flex items-center gap-1.5 cursor-pointer font-semibold text-sm">
                          <input
                            type="radio"
                            name={`frecuencia${sustancia}`}
                            value={valor}
                            checked={antecedentes[`frecuencia${sustancia}` as keyof AntecedentesData] === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, [`frecuencia${sustancia}`]: parseInt(e.target.value) }))}
                            className="w-4 h-4 accent-[color:var(--accent)]"
                          />
                          <span>{valor}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <FormField label="Relato si alguna vez fue acusado, detenido o arrestado">
            <Textarea
              name="relatoAcusacionDetencion"
              value={antecedentes.relatoAcusacionDetencion}
              onChange={handleChange}
              rows={4}
              placeholder="Describa cualquier situación legal..."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </FormField>
        </div>
      </section>
    </>
  );
};
