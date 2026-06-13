// src/components/pacientes/FormEvaluacion.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AntecedentesData } from '../../types/types';

const TIPOLOGIAS = ['Estrés', 'Baja autoestima', 'Ansiedad', 'Depresión', 'Problemas familiares', 'Problemas académicos'];

const GRAVEDAD_OPTIONS = [
  { valor: 'leve',     label: 'Leve',     color: '#10b981', descripcion: 'Síntomas manejables, intervención estándar' },
  { valor: 'moderado', label: 'Moderado', color: '#f59e0b', descripcion: 'Requiere atención regular y seguimiento' },
  { valor: 'grave',    label: 'Grave',    color: '#ef4444', descripcion: 'Requiere derivación o intervención especializada' },
];

interface Props {
  antecedentes: AntecedentesData;
  setAntecedentes: React.Dispatch<React.SetStateAction<AntecedentesData>>;
  readOnly?: boolean;
}

export const FormEvaluacion: React.FC<Props> = ({ antecedentes, setAntecedentes, readOnly = false }) => {
  const [otraTipologia, setOtraTipologia] = useState('');

  const toggleTipologia = (tipologia: string) => {
    if (readOnly) return;
    const actuales = antecedentes.tipologias || [];
    setAntecedentes(prev => ({
      ...prev,
      tipologias: actuales.includes(tipologia)
        ? actuales.filter(t => t !== tipologia)
        : [...actuales, tipologia]
    }));
  };

  const agregarOtra = () => {
    if (readOnly || !otraTipologia.trim()) return;
    if (!(antecedentes.tipologias || []).includes(otraTipologia.trim())) {
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
          <p className="mb-4 text-muted-foreground text-sm">
            Seleccione el nivel de gravedad del caso basándose en la evaluación realizada:
          </p>
        )}

        <div className="flex gap-4 mt-4">
          {GRAVEDAD_OPTIONS.map(({ valor, label, color, descripcion }) => (
            <label
              key={valor}
              className={cn(
                'flex-1 p-5 rounded-xl border-2 text-center transition-all',
                readOnly ? 'cursor-default opacity-75' : 'cursor-pointer',
                antecedentes.gravedad === valor
                  ? 'border-current'
                  : 'border-border bg-background hover:border-muted-foreground/40'
              )}
              style={antecedentes.gravedad === valor ? {
                borderColor: color,
                backgroundColor: `${color}15`,
              } : {}}
            >
              <input
                type="radio"
                name="gravedad"
                value={valor}
                checked={antecedentes.gravedad === valor}
                onChange={(e) => !readOnly && setAntecedentes(prev => ({ ...prev, gravedad: e.target.value as AntecedentesData['gravedad'] }))}
                className="sr-only"
                disabled={readOnly}
              />
              <div className="font-bold text-lg mb-2" style={{ color }}>{label}</div>
              <div className="text-xs text-muted-foreground">{descripcion}</div>
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
          <p className="mb-4 text-muted-foreground text-sm">
            Seleccione las problemáticas principales identificadas (puede seleccionar múltiples):
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-4">
          {TIPOLOGIAS.map((tipo) => {
            const activo = (antecedentes.tipologias || []).includes(tipo);
            return (
              <label
                key={tipo}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all',
                  readOnly ? 'cursor-default opacity-80' : 'cursor-pointer',
                  activo
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/40'
                )}
              >
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={() => toggleTipologia(tipo)}
                  className="sr-only"
                  disabled={readOnly}
                />
                {tipo}
              </label>
            );
          })}
        </div>

        {!readOnly && (
          <div className="mt-6 flex gap-3">
            <Input
              value={otraTipologia}
              onChange={(e) => setOtraTipologia(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarOtra())}
              placeholder="Agregar otra tipología..."
              className="flex-1"
            />
            <Button type="button" onClick={agregarOtra} variant="secondary">
              + Agregar
            </Button>
          </div>
        )}

        {(antecedentes.tipologias || []).filter(t => !TIPOLOGIAS.includes(t)).length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Tipologías personalizadas:
            </p>
            <div className="flex flex-wrap gap-2">
              {(antecedentes.tipologias || []).filter(t => !TIPOLOGIAS.includes(t)).map((tipo) => (
                <Badge key={tipo} variant="secondary" className="gap-2 pl-3 pr-2 py-1.5 text-sm">
                  {tipo}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => eliminarTipologia(tipo)}
                      className="text-destructive hover:text-destructive/80 font-bold text-base leading-none"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
