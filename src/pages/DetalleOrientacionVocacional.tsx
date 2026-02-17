// src/pages/DetalleOrientacionVocacional.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pacienteExternoService } from '../services/pacienteExternoService';
import { orientacionService } from '../services/orientacionService';
import './RegistroPaciente.css';

const DetalleOrientacionVocacional: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [orientacion, setOrientacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    try {
      const pacienteData = await pacienteExternoService.obtenerPorId(Number(id));
      setPaciente(pacienteData);

      const orientacionData = await orientacionService.obtenerEntrevista(Number(id));
      // Si devuelve array, tomar el primero (debería ser solo uno)
      const entrevista = Array.isArray(orientacionData) ? orientacionData[0] : orientacionData;
      setOrientacion(entrevista);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar la entrevista de orientación vocacional');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="registro-wrapper">
        <div className="card-academic">
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !orientacion) {
    return (
      <div className="registro-wrapper">
        <div className="card-academic">
          <div className="alert alert-error">{error || 'No se encontró entrevista de orientación vocacional para este paciente'}</div>
          <button onClick={() => navigate('/buscar-paciente')} className="btn-submit">
            Volver a búsqueda
          </button>
        </div>
      </div>
    );
  }

  // Parsear las respuestas
  let respuestas: any = {};
  try {
    respuestas = typeof orientacion.respuestas === 'string' 
      ? JSON.parse(orientacion.respuestas) 
      : orientacion.respuestas;
  } catch (e) {
    console.error('Error parseando respuestas:', e);
  }

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Entrevista de Orientación Vocacional</h1>
          <p>
            {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.apellidoPaterno} - {paciente.escuela}
          </p>
          <p style={{ fontSize: '14px', marginTop: '8px', color: '#64748b' }}>
            Realizada el {new Date(orientacion.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        <div className="form-content">
          {/* DATOS PERSONALES */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">01</span>
              <span className="section-text">Datos Personales</span>
            </div>

            <div className="grid-2-cols">
              <div>
                <label className="field-label">Nombre completo</label>
                <input
                  type="text"
                  value={`${paciente.paciente?.person?.primerNombre || ''} ${paciente.paciente?.person?.segundoNombre || ''} ${paciente.paciente?.person?.apellidoPaterno || ''} ${paciente.paciente?.person?.apellidoMaterno || ''}`.trim()}
                  className="input-academic"
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f1f5f9' }}
                />
              </div>
              <div>
                <label className="field-label">Edad</label>
                <input
                  type="text"
                  value={`${paciente.paciente?.edad || ''} años`}
                  className="input-academic"
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f1f5f9' }}
                />
              </div>
              <div>
                <label className="field-label">Escuela</label>
                <input
                  type="text"
                  value={paciente.escuela || ''}
                  className="input-academic"
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f1f5f9' }}
                />
              </div>
              <div>
                <label className="field-label">Año que cursa</label>
                <input
                  type="text"
                  value={paciente.anio || ''}
                  className="input-academic"
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f1f5f9' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="field-label">Motivo de consulta</label>
              <textarea
                value={respuestas.motivoConsulta || ''}
                className="textarea-academic"
                rows={4}
                readOnly
                disabled
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="field-label">Actividades y hobbies</label>
              <textarea
                value={respuestas.actividadesHobbies || ''}
                className="textarea-academic"
                rows={3}
                readOnly
                disabled
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
          </section>

          {/* CUALIDADES Y DEFECTOS */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">02</span>
              <span className="section-text">Cualidades y Defectos</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h4 style={{ marginBottom: '12px', color: '#0f172a' }}>Cualidades</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" value={respuestas.cualidad1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                  <input type="text" value={respuestas.cualidad2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                  <input type="text" value={respuestas.cualidad3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '12px', color: '#0f172a' }}>Defectos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" value={respuestas.defecto1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                  <input type="text" value={respuestas.defecto2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                  <input type="text" value={respuestas.defecto3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
            </div>
          </section>

          {/* OCUPACIONES FAMILIARES */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">03</span>
              <span className="section-text">Ocupación de Personas Significativas</span>
            </div>

            <div className="grid-2-cols">
              <div>
                <label className="field-label">Ocupación de la madre</label>
                <input type="text" value={respuestas.ocupacionMadre || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
              <div>
                <label className="field-label">Ocupación del padre</label>
                <input type="text" value={respuestas.ocupacionPadre || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label className="field-label">Otras personas significativas</label>
              <textarea value={respuestas.ocupacionOtros || ''} className="textarea-academic" rows={2} readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>
          </section>

          {/* ESTUDIOS */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">04</span>
              <span className="section-text">Trayectoria Educativa</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Materias de interés</label>
              <div className="grid-2-cols">
                <input type="text" value={respuestas.materiaInteresante1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.materiaInteresante2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.materiaInteresante3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Materias de desinterés</label>
              <div className="grid-2-cols">
                <input type="text" value={respuestas.materiaDesinteresante1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.materiaDesinteresante2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.materiaDesinteresante3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            </div>
          </section>

          {/* OBJETIVOS PROFESIONALES */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">05</span>
              <span className="section-text">Objetivos y Proyección Profesional</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Plan después de la preparatoria</label>
              <input type="text" value={respuestas.planDespuesPreparatoria || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Carreras de interés</label>
              <div className="grid-2-cols">
                <input type="text" value={respuestas.carreraInteres1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.carreraInteres2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.carreraInteres3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Carreras que NO le interesan</label>
              <div className="grid-2-cols">
                <input type="text" value={respuestas.carreraNoInteres1 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.carreraNoInteres2 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
                <input type="text" value={respuestas.carreraNoInteres3 || ''} className="input-academic" readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Visión a 5 años</label>
              <textarea value={respuestas.visionCincoAnos || ''} className="textarea-academic" rows={4} readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>
          </section>

          {/* OBSERVACIONES */}
          {orientacion.observaciones && (
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">📝</span>
                <span className="section-text">Observaciones del Entrevistador</span>
              </div>
              <textarea
                value={orientacion.observaciones}
                className="textarea-academic"
                rows={6}
                readOnly
                disabled
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </section>
          )}

          {/* BOTÓN VOLVER */}
          <div className="actions-footer">
            <button onClick={() => navigate('/buscar-paciente')} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
              ← Volver a búsqueda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleOrientacionVocacional;