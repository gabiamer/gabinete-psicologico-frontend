// src/pages/NuevaSesion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import { sesionService } from '../services/sesionService';
import { FormField } from '../components/shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import './RegistroPaciente.css';

const TIPOLOGIAS = ['Estrés', 'Baja autoestima', 'Ansiedad', 'Depresión', 'Problemas familiares', 'Problemas académicos'];

const GRAVEDAD_OPTIONS = [
  { valor: 'leve',     label: 'Leve',                    color: '#10b981' },
  { valor: 'moderado', label: 'Moderado',                 color: '#f59e0b' },
  { valor: 'grave',    label: 'Grave (Revisión Externa)', color: '#ef4444' },
];

/** Hora actual en zona horaria de Bolivia (UTC-4) en formato HH:mm:ss */
function horaBolivia(): string {
  return new Date().toLocaleTimeString('es-BO', {
    timeZone: 'America/La_Paz',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

const NuevaSesion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [numeroSesion, setNumeroSesion] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [gravedad, setGravedad] = useState<'leve' | 'moderado' | 'grave'>('leve');
  const [tipologias, setTipologias] = useState<string[]>([]);
  const [otraTipologia, setOtraTipologia] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const horaInicioRef = horaBolivia();

  useEffect(() => {
    cargarPaciente();
  }, [id]);

  const cargarPaciente = async () => {
    try {
      const data = await pacienteService.obtenerPorId(Number(id));
      setPaciente(data);
      const sesiones = await sesionService.obtenerPorPaciente(Number(id));
      setNumeroSesion(sesiones.length + 1);
    } catch (err) {
      console.error('Error cargando paciente:', err);
      setError('Error al cargar datos del paciente');
    }
  };

  const toggleTipologia = (tipologia: string) => {
    setTipologias(prev =>
      prev.includes(tipologia) ? prev.filter(t => t !== tipologia) : [...prev, tipologia]
    );
  };

  const agregarOtraTipologia = () => {
    if (otraTipologia.trim() && !tipologias.includes(otraTipologia.trim())) {
      setTipologias(prev => [...prev, otraTipologia.trim()]);
      setOtraTipologia('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const horaFin = horaBolivia();
    try {
      await sesionService.crear(Number(id), {
        fecha: `${fecha}T${hora}:00`,
        horaInicio: horaInicioRef,
        horaFin,
        historialClinico: { nroSesion: numeroSesion, historia: notas, gravedad, tipologias },
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(`/pacientes/${id}/historial`, { replace: true });
    } catch (err: any) {
      console.error('Error guardando sesión:', err);
      setError(err.response?.data?.message || 'Error al guardar la sesión');
      setLoading(false);
    }
  };

  if (!paciente) {
    return (
      <div className="registro-wrapper">
        <div className="card-academic">
          <p className="text-center p-10 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Nueva Sesión</h1>
          <p>
            {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.apellidoPaterno} — Sesión #{numeroSesion}
          </p>
        </header>

        {error && (
          <Alert variant="destructive" className="mx-10 mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="form-content">

          {/* DATOS DE LA SESIÓN */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">📝</span>
              <span className="section-text">Datos de la Sesión</span>
            </div>
            <div className="grid-2-cols">
              <FormField label="Fecha" required>
                <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </FormField>
              <FormField label="Hora (referencia)">
                <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
              </FormField>
            </div>
          </section>

          {/* HISTORIA CLÍNICA */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">📋</span>
              <span className="section-text">Historia Clínica</span>
            </div>
            <FormField label="Historia Clínica">
              <Textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={10}
                placeholder="Escriba aquí el contenido de la sesión..."
                className="resize-y"
              />
            </FormField>
          </section>

          {/* GRAVEDAD */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">⚠️</span>
              <span className="section-text">Gravedad</span>
            </div>
            <div className="flex gap-4 mt-4">
              {GRAVEDAD_OPTIONS.map(({ valor, label, color }) => (
                <label
                  key={valor}
                  className={cn(
                    'flex-1 p-4 rounded-lg border-2 text-center font-semibold cursor-pointer transition-all text-sm',
                    gravedad === valor ? 'border-current' : 'border-border bg-background hover:border-muted-foreground/40'
                  )}
                  style={gravedad === valor ? { borderColor: color, backgroundColor: `${color}20` } : {}}
                >
                  <input
                    type="radio"
                    name="gravedad"
                    value={valor}
                    checked={gravedad === valor}
                    onChange={(e) => setGravedad(e.target.value as 'leve' | 'moderado' | 'grave')}
                    className="sr-only"
                  />
                  <span style={{ color: gravedad === valor ? color : undefined }}>{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* TIPOLOGÍA */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">🏷️</span>
              <span className="section-text">Tipología</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {TIPOLOGIAS.map((tipo) => {
                const activo = tipologias.includes(tipo);
                return (
                  <label
                    key={tipo}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium text-sm cursor-pointer transition-all',
                      activo
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/40'
                    )}
                  >
                    <input type="checkbox" checked={activo} onChange={() => toggleTipologia(tipo)} className="sr-only" />
                    {tipo}
                  </label>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <Input
                value={otraTipologia}
                onChange={(e) => setOtraTipologia(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarOtraTipologia())}
                placeholder="Agregar otra tipología..."
                className="flex-1"
              />
              <Button type="button" onClick={agregarOtraTipologia} variant="secondary">
                + Agregar
              </Button>
            </div>

            {tipologias.filter(t => !TIPOLOGIAS.includes(t)).length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                  Tipologías personalizadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tipologias.filter(t => !TIPOLOGIAS.includes(t)).map((tipo) => (
                    <Badge key={tipo} variant="secondary" className="gap-2 pl-3 pr-2 py-1.5 text-sm">
                      {tipo}
                      <button
                        type="button"
                        onClick={() => setTipologias(prev => prev.filter(t => t !== tipo))}
                        className="text-destructive hover:text-destructive/80 font-bold text-base leading-none"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="actions-footer">
            <Button type="button" variant="secondary" onClick={() => navigate(`/pacientes/${id}/historial`)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : '✓ Guardar Sesión'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NuevaSesion;
