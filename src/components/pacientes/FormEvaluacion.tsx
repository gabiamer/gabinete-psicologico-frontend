// src/components/pacientes/FormEvaluacion.tsx
import React, { useState } from 'react';
import { AntecedentesData } from '../../types/types';

const TIPOLOGIAS = ['Estrés', 'Baja autoestima', 'Ansiedad', 'Depresión', 'Problemas familiares', 'Problemas académicos'];

interface Props {
  antecedentes: AntecedentesData;
  setAntecedentes: React.Dispatch<React.SetStateAction<AntecedentesData>>;
  readOnly?: boolean;
}

export const FormEvaluacion: React.FC<Props> = ({ antecedentes, setAntecedentes, readOnly = false }) => {
  const [otraTipologia, setOtraTipologia] = useState('');

  const toggleTipologia = (tipologia: string) => {
    if (readOnly) return;
    const tipologiasActuales = antecedentes.tipologias || [];
    if (tipologiasActuales.includes(tipologia)) {
      setAntecedentes(prev => ({
        ...prev,
        tipologias: tipologiasActuales.filter(t => t !== tipologia)
      }));
    } else {
      setAntecedentes(prev => ({
        ...prev,
        tipologias: [...tipologiasActuales, tipologia]
      }));
    }
  };

  const agregarOtraTipologia = () => {
    if (readOnly) return;
    if (otraTipologia.trim() && !(antecedentes.tipologias || []).includes(otraTipologia.trim())) {
      setAntecedentes(prev => ({
        ...prev,
        tipologias: [...(prev.tipologias || []), otraTipologia.trim()]
      }));
      setOtraTipologia('');
    }
  };

  const eliminarTipologia = (tipologia: string) => {
    if (readOnly) return;
    setAntecedentes(prev => ({
      ...prev,
      tipologias: (prev.tipologias || []).filter(t => t !== tipologia)
    }));
  };

  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">⚠️</span>
          <span className="section-text">Evaluación de Gravedad</span>
        </div>

        {!readOnly && (
          <p style={{ marginBottom: '16px', color: '#64748b' }}>
            Seleccione el nivel de gravedad del caso basándose en la evaluación realizada:
          </p>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          {[
            { valor: 'leve', label: 'Leve', color: '#10b981', descripcion: 'Síntomas manejables, intervención estándar' },
            { valor: 'moderado', label: 'Moderado', color: '#f59e0b', descripcion: 'Requiere atención regular y seguimiento' },
            { valor: 'grave', label: 'Grave', color: '#ef4444', descripcion: 'Requiere derivación o intervención especializada' }
          ].map(({ valor, label, color, descripcion }) => (
            <label
              key={valor}
              style={{
                flex: 1,
                padding: '20px',
                border: `3px solid ${antecedentes.gravedad === valor ? color : '#e2e8f0'}`,
                borderRadius: '12px',
                cursor: readOnly ? 'default' : 'pointer',
                textAlign: 'center',
                backgroundColor: antecedentes.gravedad === valor ? `${color}15` : '#ffffff',
                transition: 'all 0.2s',
                opacity: readOnly ? 0.7 : 1
              }}
            >
              <input
                type="radio"
                name="gravedad"
                value={valor}
                checked={antecedentes.gravedad === valor}
                onChange={(e) => !readOnly && setAntecedentes(prev => ({ ...prev, gravedad: e.target.value as any }))}
                style={{ display: 'none' }}
                disabled={readOnly}
              />
              <div style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px', color }}>
                {label}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {descripcion}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">🏷️</span>
          <span className="section-text">Tipología del Caso</span>
        </div>

        {!readOnly && (
          <p style={{ marginBottom: '16px', color: '#64748b' }}>
            Seleccione las problemáticas principales identificadas (puede seleccionar múltiples):
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
          {TIPOLOGIAS.map((tipo) => (
            <label
              key={tipo}
              style={{
                padding: '12px 20px',
                border: `2px solid ${(antecedentes.tipologias || []).includes(tipo) ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '24px',
                cursor: readOnly ? 'default' : 'pointer',
                fontWeight: '500',
                backgroundColor: (antecedentes.tipologias || []).includes(tipo) ? '#eff6ff' : '#ffffff',
                transition: 'all 0.2s',
                opacity: readOnly ? 0.8 : 1
              }}
            >
              <input
                type="checkbox"
                checked={(antecedentes.tipologias || []).includes(tipo)}
                onChange={() => toggleTipologia(tipo)}
                style={{ marginRight: '8px' }}
                disabled={readOnly}
              />
              {tipo}
            </label>
          ))}
        </div>

        {!readOnly && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={otraTipologia}
              onChange={(e) => setOtraTipologia(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarOtraTipologia())}
              placeholder="Agregar otra tipología..."
              className="input-academic"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={agregarOtraTipologia}
              className="btn-submit"
              style={{ minWidth: '120px' }}
            >
              + Agregar
            </button>
          </div>
        )}

        {(antecedentes.tipologias || []).filter(t => !TIPOLOGIAS.includes(t)).length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              Tipologías personalizadas:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(antecedentes.tipologias || []).filter(t => !TIPOLOGIAS.includes(t)).map((tipo) => (
                <span
                  key={tipo}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '16px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {tipo}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => eliminarTipologia(tipo)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};