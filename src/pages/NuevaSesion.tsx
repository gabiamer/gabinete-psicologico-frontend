// src/pages/NuevaSesion.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import { sesionService } from '../services/sesionService';
import { FormField } from '../components/shared/FormField';
import './RegistroPaciente.css';

const TIPOLOGIAS = ['Estrés', 'Baja autoestima', 'Ansiedad', 'Depresión', 'Problemas familiares', 'Problemas académicos'];

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

  // Temporizador
  const horaInicioRef = useRef<string>(horaBolivia());
  const inicioTimestamp = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState(0); // segundos

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - inicioTimestamp.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (seg: number) => {
    const h = Math.floor(seg / 3600).toString().padStart(2, '0');
    const m = Math.floor((seg % 3600) / 60).toString().padStart(2, '0');
    const s = (seg % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

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
      prev.includes(tipologia)
        ? prev.filter(t => t !== tipologia)
        : [...prev, tipologia]
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
      const sesionData = {
        fecha: `${fecha}T${hora}:00`,
        horaInicio: horaInicioRef.current,
        horaFin,
        historialClinico: {
          nroSesion: numeroSesion,
          historia: notas,
          gravedad: gravedad,
          tipologias: tipologias,
        },
      };

      await sesionService.crear(Number(id), sesionData);
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
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-wrapper">
      {/* Temporizador decorativo — fuera del card, encima del header */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '12px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          borderRadius: '999px',
          padding: '8px 20px',
          fontSize: '15px',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          Sesión en curso — {formatElapsed(elapsed)}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <div className="card-academic">
        <header className="banner-header">
          <h1>Nueva Sesión</h1>
          <p>
            {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.apellidoPaterno} — Sesión #{numeroSesion}
          </p>
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            Inicio: {horaInicioRef.current}
          </p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-content">

          {/* DATOS DE LA SESIÓN */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">📝</span>
              <span className="section-text">Datos de la Sesión</span>
            </div>

            <div className="grid-2-cols">
              <FormField label="Número de sesión" required>
                <input
                  type="number"
                  value={numeroSesion}
                  onChange={(e) => setNumeroSesion(parseInt(e.target.value))}
                  className="input-academic"
                  min="1"
                />
              </FormField>
            </div>

            <div className="grid-2-cols">
              <FormField label="Fecha" required>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="input-academic"
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormField>

              <FormField label="Hora (referencia)">
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="input-academic"
                />
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
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="textarea-academic"
                rows={10}
                placeholder="Escriba aquí el contenido de la sesión..."
              />
            </FormField>
          </section>

          {/* GRAVEDAD */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">⚠️</span>
              <span className="section-text">Gravedad</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              {[
                { valor: 'leve', label: 'Leve', color: '#10b981' },
                { valor: 'moderado', label: 'Moderado', color: '#f59e0b' },
                { valor: 'grave', label: 'Grave (Revisión Externa)', color: '#ef4444' }
              ].map(({ valor, label, color }) => (
                <label
                  key={valor}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: `3px solid ${gravedad === valor ? color : '#e2e8f0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '600',
                    backgroundColor: gravedad === valor ? `${color}20` : '#ffffff',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="gravedad"
                    value={valor}
                    checked={gravedad === valor}
                    onChange={(e) => setGravedad(e.target.value as any)}
                    style={{ marginRight: '8px' }}
                  />
                  {label}
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              {TIPOLOGIAS.map((tipo) => (
                <label
                  key={tipo}
                  style={{
                    padding: '12px 20px',
                    border: `2px solid ${tipologias.includes(tipo) ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '24px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    backgroundColor: tipologias.includes(tipo) ? '#eff6ff' : '#ffffff',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tipologias.includes(tipo)}
                    onChange={() => toggleTipologia(tipo)}
                    style={{ marginRight: '8px' }}
                  />
                  {tipo}
                </label>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={otraTipologia}
                onChange={(e) => setOtraTipologia(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarOtraTipologia())}
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

            {tipologias.filter(t => !TIPOLOGIAS.includes(t)).length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
                  Tipologías personalizadas:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tipologias.filter(t => !TIPOLOGIAS.includes(t)).map((tipo) => (
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
                      <button
                        type="button"
                        onClick={() => setTipologias(prev => prev.filter(t => t !== tipo))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="actions-footer">
            <button
              type="button"
              onClick={() => navigate(`/pacientes/${id}/historial`)}
              className="btn-submit"
              style={{ backgroundColor: '#64748b' }}
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Guardando...' : '✓ Guardar Sesión'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NuevaSesion;
