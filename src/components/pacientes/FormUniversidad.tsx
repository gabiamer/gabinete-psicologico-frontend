// src/components/pacientes/FormUniversidad.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { AntecedentesData, FormData } from '../../types/types';

interface Props {
  formData: FormData;
  antecedentes: AntecedentesData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setAntecedentes: React.Dispatch<React.SetStateAction<AntecedentesData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormUniversidad: React.FC<Props> = ({
  formData,
  antecedentes,
  setFormData,
  setAntecedentes,
  handleChange
}) => {
  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">14</span>
          <span className="section-text">Relato de Socialización y Conducta en la Universidad</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FormField label="Semestre actual">
            <input
              type="number"
              value={formData.semestre}
              onChange={(e) => setFormData(prev => ({ ...prev, semestre: parseInt(e.target.value) || 1 }))}
              className="input-academic"
              min="1"
              max="14"
            />
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Se puede actualizar si es necesario
            </p>
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { name: 'nivelSatisfaccion', label: 'Nivel de satisfacción' },
              { name: 'rendimiento', label: 'Rendimiento' },
              { name: 'estresUniversitario', label: 'Estrés' },
              { name: 'interaccionSocial', label: 'Interacción social' }
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="field-label">{label}</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  {[
                    { valor: -2, label: '--' },
                    { valor: -1, label: '-' },
                    { valor: 1, label: '+' },
                    { valor: 2, label: '++' }
                  ].map(({ valor, label: lbl }) => (
                    <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={name}
                        value={valor}
                        checked={antecedentes[name as keyof AntecedentesData] === valor}
                        onChange={(e) => setAntecedentes(prev => ({ ...prev, [name]: parseInt(e.target.value) }))}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: '600' }}>{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Usar radio buttons en lugar de input de texto */}
          <FormField label="¿Ha cambiado de carrera?">
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cambioCarreras"
                  value="Si"
                  checked={antecedentes.cambioCarreras === 'Si'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cambioCarreras"
                  value="No"
                  checked={antecedentes.cambioCarreras === 'No'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <span>No</span>
              </label>
            </div>
          </FormField>

          {/*Condición corregida */}
          {antecedentes.cambioCarreras === 'Si' && (
            <FormField label="Motivos del cambio">
              <textarea
                name="motivosCambio"
                value={antecedentes.motivosCambio}
                onChange={handleChange}
                className="textarea-academic"
                rows={3}
                placeholder="Describa los motivos del cambio de carrera..."
              />
            </FormField>
          )}

          <FormField label="Relato general sobre la vida universitaria">
            <textarea
              name="relatoUniversidad"
              value={antecedentes.relatoUniversidad}
              onChange={handleChange}
              className="textarea-academic"
              rows={5}
              placeholder="Describa su experiencia..."
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

        <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#475569', fontWeight: '600' }}>
            Indique la frecuencia de consumo para cada sustancia:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
            {['0: Nunca', '1: Muy poco', '2: Poco', '3: Ocasional', '4: Frecuente', '5: Muy frecuente'].map(txt => (
              <div key={txt} style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>{txt}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {['Alcohol', 'Tabaco', 'Drogas'].map((sustancia) => {
            const key = sustancia.toLowerCase();
            return (
              <div key={key}>
                <FormField label={`Consumo de ${key}`}>
                  <input
                    name={`consumo${sustancia}`}
                    value={antecedentes[`consumo${sustancia}` as keyof AntecedentesData] as string}
                    onChange={handleChange}
                    className="input-academic"
                    placeholder="Describa el tipo y detalles"
                  />
                </FormField>
                <div style={{ marginTop: '12px' }}>
                  <label className="field-label">Frecuencia de consumo de {key}</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {[0, 1, 2, 3, 4, 5].map(valor => (
                      <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`frecuencia${sustancia}`}
                          value={valor}
                          checked={antecedentes[`frecuencia${sustancia}` as keyof AntecedentesData] === valor}
                          onChange={(e) => setAntecedentes(prev => ({ ...prev, [`frecuencia${sustancia}`]: parseInt(e.target.value) }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: '600' }}>{valor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <FormField label="Relato si alguna vez fue acusado, detenido o arrestado">
            <textarea
              name="relatoAcusacionDetencion"
              value={antecedentes.relatoAcusacionDetencion}
              onChange={handleChange}
              className="textarea-academic"
              rows={4}
              placeholder="Describa cualquier situación legal..."
            />
          </FormField>
        </div>
      </section>
    </>
  );
};