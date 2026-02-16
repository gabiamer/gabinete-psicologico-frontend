// src/pages/BuscarPaciente.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import './RegistroPaciente.css';

const BuscarPaciente: React.FC = () => {
  const navigate = useNavigate();
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const buscarPaciente = async () => {
    if (!terminoBusqueda.trim()) {
      setError('Ingrese un nombre, celular o carnet de identidad');
      return;
    }

    setBuscando(true);
    setError('');
    setMensaje('');

    try {
      const pacientes = await pacienteService.buscar(terminoBusqueda);
      setResultados(pacientes);

      if (pacientes.length === 0) {
        setMensaje('No se encontró ningún paciente. Puede proceder con el registro nuevo.');
      }
    } catch (err: any) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar paciente');
    } finally {
      setBuscando(false);
    }
  };

  const iniciarRegistroNuevo = () => {
    navigate('/registro-paciente');
  };

  const iniciarOrientacionVocacional = () => {
    navigate('/registro-paciente-externo');
  };

  const verHistorialPaciente = (pacienteId: number) => {
    navigate(`/pacientes/${pacienteId}/historial`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarPaciente();
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Búsqueda de Paciente</h1>
          <p>Verifique si el paciente ya está registrado antes de crear una nueva ficha</p>
        </header>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-content">
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">🔍</span>
              <span className="section-text">Buscar Paciente Existente</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Nombre, Celular o Carnet de Identidad</label>
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input-academic"
                  placeholder="Ej. Juan Pérez, 70123456, 1234567 LP"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={buscarPaciente}
                disabled={buscando}
                className="btn-submit"
                style={{ height: '48px', minWidth: '120px' }}
              >
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </section>

          {/* RESULTADOS DE BÚSQUEDA */}
          {resultados.length > 0 && (
            <section className="form-section" style={{ marginTop: '32px' }}>
              <div className="section-title">
                <span className="section-number">📋</span>
                <span className="section-text">Resultados Encontrados ({resultados.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {resultados.map((paciente) => (
                  <div
                    key={paciente.id}
                    style={{
                      padding: '16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#0f172a' }}>
                        {paciente.paciente?.person?.primerNombre || ''} {paciente.paciente?.person?.segundoNombre || ''}{' '}
                        {paciente.paciente?.person?.apellidoPaterno || ''} {paciente.paciente?.person?.apellidoMaterno || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                        Celular: {paciente.paciente?.person?.celular || 'N/A'} | Edad: {paciente.paciente?.edad || 'N/A'} años | Semestre: {paciente.semestre || 'N/A'}
                      </div>
                      {paciente.ultimaSesion && (
                        <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                          Última sesión: {new Date(paciente.ultimaSesion).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => verHistorialPaciente(paciente.id)}
                      className="btn-submit"
                      style={{ minWidth: '150px' }}
                    >
                      Ver Historial →
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="actions-footer" style={{ marginTop: '32px', justifyContent: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={iniciarRegistroNuevo}
              className="btn-submit"
              style={{ backgroundColor: '#10b981', minWidth: '250px' }}
            >
              + Registrar Paciente Universitario
            </button>
            
            {/* 👈 NUEVO BOTÓN */}
            <button
              type="button"
              onClick={iniciarOrientacionVocacional}
              className="btn-submit"
              style={{ backgroundColor: '#f59e0b', minWidth: '250px' }}
            >
              📋 Orientación Vocacional
            </button>
          </div>

          {/* 👈 NUEVA SECCIÓN INFORMATIVA */}
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#10b981', fontWeight: '600' }}>
                  🎓 Paciente Universitario
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                  Para estudiantes de la universidad que necesitan atención psicológica regular (entrevista inicial, sesiones, seguimiento).
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b', fontWeight: '600' }}>
                  📋 Orientación Vocacional
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                  Para personas externas que buscan orientación sobre qué carrera estudiar (entrevista única).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscarPaciente;