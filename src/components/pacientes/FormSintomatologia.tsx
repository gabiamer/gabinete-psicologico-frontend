// src/components/pacientes/FormSintomatologia.tsx
import React from 'react';
import { SINTOMAS_ESTRES, SINTOMAS_ANSIEDAD, SINTOMAS_DEPRESION } from '../../utils/sintomas';
import { calcularTotal, interpretarResultado } from '../../utils/calculos';

interface Props {
  sintomatologias: {
    estres: number[];
    ansiedad: number[];
    depresion: number[];
  };
  handleChangeSintoma?: (categoria: 'estres' | 'ansiedad' | 'depresion', index: number, valor: number) => void;
  readOnly?: boolean;
}

export const FormSintomatologia: React.FC<Props> = ({ sintomatologias, handleChangeSintoma, readOnly = false }) => {
  return (
    <>
      {!readOnly && (
        <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#475569', lineHeight: '1.6' }}>
            Elija el grado en que ha experimentado cada síntoma durante las dos últimas semanas:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
            <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>1: Nunca</div>
            <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>2: A veces</div>
            <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>3: Frecuentemente</div>
            <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>4: Siempre</div>
          </div>
        </div>
      )}

      {/* ESTRÉS */}
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">11</span>
          <span className="section-text">Síntomas de Estrés</span>
        </div>
        
        {readOnly ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {SINTOMAS_ESTRES.map((sintoma, idx) => (
              <div key={`estres-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ fontSize: '14px' }}>{sintoma}</span>
                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                  {sintomatologias.estres[idx]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          SINTOMAS_ESTRES.map((sintoma, idx) => (
            <div key={`estres-${idx}`} style={{ marginBottom: '24px' }}>
              <label className="field-label">{idx + 1}. {sintoma}</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[1, 2, 3, 4].map(valor => (
                  <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`estres-${idx}`}
                      value={valor}
                      checked={sintomatologias.estres[idx] === valor}
                      onChange={() => handleChangeSintoma?.('estres', idx, valor)}
                      style={{ cursor: 'pointer' }}
                      disabled={readOnly}
                    />
                    <span>{valor}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
            <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').color }}>
              {calcularTotal(sintomatologias.estres)}
            </span>
          </div>
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
            {interpretarResultado(calcularTotal(sintomatologias.estres), 'estres').texto}
          </div>
        </div>
      </section>

      {/* ANSIEDAD */}
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">12</span>
          <span className="section-text">Síntomas de Ansiedad</span>
        </div>
        
        {readOnly ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {SINTOMAS_ANSIEDAD.map((sintoma, idx) => (
              <div key={`ansiedad-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ fontSize: '14px' }}>{sintoma}</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {sintomatologias.ansiedad[idx]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          SINTOMAS_ANSIEDAD.map((sintoma, idx) => (
            <div key={`ansiedad-${idx}`} style={{ marginBottom: '24px' }}>
              <label className="field-label">{idx + 1}. {sintoma}</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[1, 2, 3, 4].map(valor => (
                  <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`ansiedad-${idx}`}
                      value={valor}
                      checked={sintomatologias.ansiedad[idx] === valor}
                      onChange={() => handleChangeSintoma?.('ansiedad', idx, valor)}
                      style={{ cursor: 'pointer' }}
                      disabled={readOnly}
                    />
                    <span>{valor}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
            <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').color }}>
              {calcularTotal(sintomatologias.ansiedad)}
            </span>
          </div>
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
            {interpretarResultado(calcularTotal(sintomatologias.ansiedad), 'ansiedad').texto}
          </div>
        </div>
      </section>

      {/* DEPRESIÓN */}
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">13</span>
          <span className="section-text">Síntomas de Depresión</span>
        </div>
        
        {readOnly ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {SINTOMAS_DEPRESION.map((sintoma, idx) => (
              <div key={`depresion-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ fontSize: '14px' }}>{sintoma}</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>
                  {sintomatologias.depresion[idx]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          SINTOMAS_DEPRESION.map((sintoma, idx) => (
            <div key={`depresion-${idx}`} style={{ marginBottom: '24px' }}>
              <label className="field-label">{idx + 1}. {sintoma}</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[1, 2, 3, 4].map(valor => (
                  <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`depresion-${idx}`}
                      value={valor}
                      checked={sintomatologias.depresion[idx] === valor}
                      onChange={() => handleChangeSintoma?.('depresion', idx, valor)}
                      style={{ cursor: 'pointer' }}
                      disabled={readOnly}
                    />
                    <span>{valor}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
            <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').color }}>
              {calcularTotal(sintomatologias.depresion)}
            </span>
          </div>
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
            {interpretarResultado(calcularTotal(sintomatologias.depresion), 'depresion').texto}
          </div>
        </div>
      </section>
    </>
  );
};