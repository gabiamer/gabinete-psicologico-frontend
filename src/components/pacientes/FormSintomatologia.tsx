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

function SintomaGroup({
  titulo,
  numero,
  sintomas,
  valores,
  categoria,
  handleChangeSintoma,
  readOnly,
}: {
  titulo: string;
  numero: string;
  sintomas: string[];
  valores: number[];
  categoria: 'estres' | 'ansiedad' | 'depresion';
  handleChangeSintoma?: Props['handleChangeSintoma'];
  readOnly: boolean;
}) {
  const total = calcularTotal(valores);
  const resultado = interpretarResultado(total, categoria);

  return (
    <section className="form-section">
      <div className="section-title">
        <span className="section-number">{numero}</span>
        <span className="section-text">{titulo}</span>
      </div>

      {readOnly ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {sintomas.map((sintoma, idx) => (
            <div key={`${categoria}-${idx}`} className="flex justify-between items-center p-2 bg-secondary rounded-md border border-border">
              <span className="text-sm">{sintoma}</span>
              <span className="font-bold text-primary">{valores[idx]}</span>
            </div>
          ))}
        </div>
      ) : (
        sintomas.map((sintoma, idx) => (
          <div key={`${categoria}-${idx}`} className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {idx + 1}. {sintoma}
            </label>
            <div className="flex gap-4 mt-2">
              {[1, 2, 3, 4].map(valor => (
                <label key={valor} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
                  <input
                    type="radio"
                    name={`${categoria}-${idx}`}
                    value={valor}
                    checked={valores[idx] === valor}
                    onChange={() => handleChangeSintoma?.(categoria, idx, valor)}
                    className="w-4 h-4 accent-[color:var(--accent)]"
                    disabled={readOnly}
                  />
                  <span>{valor}</span>
                </label>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">TOTAL:</span>
          <span className="font-bold text-2xl" style={{ color: resultado.color }}>{total}</span>
        </div>
        <div
          className="mt-2 p-3 rounded-md text-center font-semibold text-white text-sm"
          style={{ backgroundColor: resultado.color }}
        >
          {resultado.texto}
        </div>
      </div>
    </section>
  );
}

export const FormSintomatologia: React.FC<Props> = ({ sintomatologias, handleChangeSintoma, readOnly = false }) => {
  return (
    <>
      {!readOnly && (
        <div className="mb-8 p-5 bg-muted rounded-lg border border-border">
          <p className="text-muted-foreground leading-relaxed">
            Elija el grado en que ha experimentado cada síntoma durante las dos últimas semanas:
          </p>
          <div className="grid grid-cols-4 gap-3 mt-4 text-sm font-semibold text-center text-foreground">
            <div>1: Nunca</div>
            <div>2: A veces</div>
            <div>3: Frecuentemente</div>
            <div>4: Siempre</div>
          </div>
        </div>
      )}

      <SintomaGroup titulo="Síntomas de Estrés" numero="11" sintomas={SINTOMAS_ESTRES} valores={sintomatologias.estres} categoria="estres" handleChangeSintoma={handleChangeSintoma} readOnly={readOnly} />
      <SintomaGroup titulo="Síntomas de Ansiedad" numero="12" sintomas={SINTOMAS_ANSIEDAD} valores={sintomatologias.ansiedad} categoria="ansiedad" handleChangeSintoma={handleChangeSintoma} readOnly={readOnly} />
      <SintomaGroup titulo="Síntomas de Depresión" numero="13" sintomas={SINTOMAS_DEPRESION} valores={sintomatologias.depresion} categoria="depresion" handleChangeSintoma={handleChangeSintoma} readOnly={readOnly} />
    </>
  );
};
