// src/pages/NuevaSesion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import { sesionService } from '../services/sesionService';
import { FormField } from '../components/shared/FormField';
import './RegistroPaciente.css';

const TIPOLOGIAS = ['Estrés', 'Baja autoestima', 'Ansiedad', 'Depresión', 'Problemas familiares', 'Problemas académicos'];

const NuevaSesion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [numeroSesion, setNumeroSesion] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [gravedad, setGravedad] = useState<'leve' | 'moderado' | 'grave'>('leve');
  const [tipologias, setTipologias] = useState<string[]>([]);
  const [otraTipologia, setOtraTipologia] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPaciente();
  }, [id]);

  const cargarPaciente = async () => {
    try {
      const data = await pacienteService.obtenerPorId(Number(id));
      setPaciente(data);
      
      // Obtener número de sesión
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

    try {
      const sesionData = {
        fecha,
        numeroSesion,
        gravedad,
        tipologias,
        notas
      };

      await sesionService.crear(Number(id), sesionData);
      navigate(`/pacientes/${id}/historial`);
    } catch (err: any) {
      console.error('Error guardando sesión:', err);
      setError('Error al guardar la sesión');
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
      <div className="card-academic">
        <header className="banner-header">
          <h1>Nueva Sesión</h1>
          <p>
            {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.apellidoPaterno} - Sesión #{numeroSesion}
          </p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-content">
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

              <FormField label="Fecha" required>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="input-academic"
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormField>
            </div>
          </section>

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

          <section className="form-section">
            <div className="section-title">
              <span className="section-number">📋</span>
              <span className="section-text">Notas de la Sesión</span>
            </div>

            <FormField label="Observaciones y notas">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="textarea-academic"
                rows={8}
                placeholder="Describa lo ocurrido en la sesión, avances, retrocesos, temas tratados, etc."
              />
            </FormField>
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
              {loading ? 'Guardando...' : 'Guardar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaSesion;