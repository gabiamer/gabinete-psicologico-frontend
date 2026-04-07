// src/pages/DetalleSesion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sesionService } from '../services/sesionService';
import { FormAntecedentes } from '../components/pacientes/FormAntecedentes';
import { FormHistoriaFamiliar } from '../components/pacientes/FormHistoriaFamiliar';
import { FormSintomatologia } from '../components/pacientes/FormSintomatologia';
import { FormUniversidad } from '../components/pacientes/FormUniversidad';
import { FormEvaluacion } from '../components/pacientes/FormEvaluacion';
import { FormAcuerdos } from '../components/pacientes/FormAcuerdos';
import type { FormData, AntecedentesData } from '../types/types';
import './RegistroPaciente.css';

const DetalleSesion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sesion, setSesion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) cargarSesion();
  }, [id]);

  const cargarSesion = async () => {
    try {
      const data = await sesionService.obtenerPorId(Number(id));
      console.log('Sesión completa:', data);
      setSesion(data);
    } catch (err) {
      console.error('Error cargando sesión:', err);
      setError('Error al cargar la sesión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="registro-wrapper">
        <div className="card-academic">
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (error || !sesion) {
    return (
      <div className="registro-wrapper">
        <div className="card-academic">
          <div className="alert alert-error">{error || 'Sesión no encontrada'}</div>
          <button onClick={() => navigate(-1)} className="btn-submit">← Volver</button>
        </div>
      </div>
    );
  }

  // Datos de entrevista psicologica (primera sesion)
  const entrevista = sesion.entrevista;
  // Datos de historial clinico
  const historialClinico = sesion.historialClinico;

  // Parsear datos de la entrevista para los componentes
  let entrevistaData: any = {};
  if (entrevista) {
    // Parsear campos JSONB de la entrevista
    const parseJson = (val: any) => {
      if (!val) return {};
      if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
      return val;
    };
    const familia = parseJson(entrevista.historiaFamiliar);
    const universidad = parseJson(entrevista.relatoUniversidad);
    const habitos = parseJson(entrevista.habitos);
    const acuerdos = parseJson(entrevista.acuerdos);
    const sintomasData = parseJson(entrevista.sintomas);

    entrevistaData = {
      motivoConsulta: entrevista.antecedentes || '',
      conQuienVive: familia.conQuienVive || '',
      personaReferencia: familia.personaReferencia || '',
      celularReferencia: familia.celularReferencia || '',
      nombrePadre: familia.padre?.nombre || '',
      ocupacionPadre: familia.padre?.ocupacion || '',
      enfermedadPadre: familia.padre?.enfermedad || '',
      relacionPadre: familia.padre?.relacion || '',
      nombreMadre: familia.madre?.nombre || '',
      ocupacionMadre: familia.madre?.ocupacion || '',
      enfermedadMadre: familia.madre?.enfermedad || '',
      relacionMadre: familia.madre?.relacion || '',
      numeroHermanos: familia.hermanos?.numero || '',
      relatoHermanos: familia.hermanos?.relato || '',
      cambioCarreras: universidad.cambioCarreras || '',
      motivosCambio: universidad.motivosCambio || '',
      relatoUniversidad: universidad.relatoGeneral || '',
      consumoAlcohol: habitos.alcohol?.descripcion || '',
      frecuenciaAlcohol: habitos.alcohol?.frecuencia || 0,
      consumoTabaco: habitos.tabaco?.descripcion || '',
      frecuenciaTabaco: habitos.tabaco?.frecuencia || 0,
      consumoDrogas: habitos.drogas?.descripcion || '',
      frecuenciaDrogas: habitos.drogas?.frecuencia || 0,
      relatoAcusacionDetencion: habitos.relatoAcusacionDetencion || '',
      acuerdosEstablecidos: acuerdos.acuerdosEstablecidos || '',
      proximaSesionFecha: acuerdos.proximaSesionFecha || '',
      proximaSesionHora: acuerdos.proximaSesionHora || '',
      sintomatologias: sintomasData,
      totalScoreEstres: entrevista.totalScoreEstres,
      totalScoreAnsiedad: entrevista.totalScoreAnsiedad,
      totalScoreDepresion: entrevista.totalScoreDepresion,
    };
  }

  // Parsear historial clinico
  let historialData: any = {};
  if (historialClinico) {
    historialData = {
      nroSesion: historialClinico.nroSesion,
      historia: historialClinico.historia || '',
      gravedad: historialClinico.gravedad || '',
      tipologias: (() => {
        const t = historialClinico.tipologia;
        if (!t) return [];
        if (typeof t === 'string') { try { return JSON.parse(t); } catch { return []; } }
        return Array.isArray(t) ? t : [];
      })()
    };
  }

  const paciente = sesion.pacienteUniversitario?.paciente;
  const person = paciente?.person;

  const formData: FormData = {
    primerNombre: person?.primerNombre || '',
    segundoNombre: person?.segundoNombre || '',
    apellidoPaterno: person?.apellidoPaterno || '',
    apellidoMaterno: person?.apellidoMaterno || '',
    celular: person?.celular || '',
    fechaNacimiento: paciente?.fechaNacimiento || '',
    edad: paciente?.edad || '',
    domicilio: paciente?.domicilio || '',
    estadoCivil: paciente?.estadoCivil || 1,
    genero: paciente?.genero || 0, 
    semestre: sesion.pacienteUniversitario?.semestre || 1,
    derivadoPor: sesion.pacienteUniversitario?.derivadoPor || '',
    psicologoId: sesion.psicologo?.id || ''
  };

  const antecedentes: AntecedentesData = {
    motivoConsulta: entrevistaData.motivoConsulta || '',
    conQuienVive: entrevistaData.conQuienVive || '',
    personaReferencia: entrevistaData.personaReferencia || '',
    celularReferencia: entrevistaData.celularReferencia || '',
    nombrePadre: entrevistaData.nombrePadre || '',
    ocupacionPadre: entrevistaData.ocupacionPadre || '',
    enfermedadPadre: entrevistaData.enfermedadPadre || '',
    relacionPadre: entrevistaData.relacionPadre || '',
    nombreMadre: entrevistaData.nombreMadre || '',
    ocupacionMadre: entrevistaData.ocupacionMadre || '',
    enfermedadMadre: entrevistaData.enfermedadMadre || '',
    relacionMadre: entrevistaData.relacionMadre || '',
    numeroHermanos: entrevistaData.numeroHermanos || '',
    relatoHermanos: entrevistaData.relatoHermanos || '',
    cambioCarreras: entrevistaData.cambioCarreras || '',
    motivosCambio: entrevistaData.motivosCambio || '',
    relatoUniversidad: entrevistaData.relatoUniversidad || '',
    consumoAlcohol: entrevistaData.consumoAlcohol || '',
    frecuenciaAlcohol: entrevistaData.frecuenciaAlcohol || 0,
    consumoTabaco: entrevistaData.consumoTabaco || '',
    frecuenciaTabaco: entrevistaData.frecuenciaTabaco || 0,
    consumoDrogas: entrevistaData.consumoDrogas || '',
    frecuenciaDrogas: entrevistaData.frecuenciaDrogas || 0,
    relatoAcusacionDetencion: entrevistaData.relatoAcusacionDetencion || '',
    gravedad: historialData.gravedad || 'leve',
    tipologias: historialData.tipologias || [],
    acuerdosEstablecidos: entrevistaData.acuerdosEstablecidos || '',
    proximaSesionFecha: entrevistaData.proximaSesionFecha || '',
    proximaSesionHora: entrevistaData.proximaSesionHora || ''
  };

  const sintomatologias = {
    estres: entrevistaData.sintomatologias?.estres || Array(12).fill(1),
    ansiedad: entrevistaData.sintomatologias?.ansiedad || Array(12).fill(1),
    depresion: entrevistaData.sintomatologias?.depresion || Array(12).fill(1)
  };

  const esEntrevistaInicial = !!entrevista;
  const esSesionSeguimiento = !entrevista && !!historialClinico;
  const sinDatos = !esEntrevistaInicial && !esSesionSeguimiento;

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Detalle de Sesión #{historialData.nroSesion || sesion.id}</h1>
          <p>
            {new Date(sesion.fecha).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </header>

        <div className="form-content">

          {/* Información General */}
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">📋</span>
              <span className="section-text">Información General</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Psicólogo</label>
                <input
                  type="text"
                  value={sesion.psicologo
                    ? `${sesion.psicologo.person.primerNombre} ${sesion.psicologo.person.apellidoPaterno}`
                    : 'N/A'}
                  className="form-input"
                  readOnly disabled
                />
              </div>
              <div className="form-group">
                <label>Paciente</label>
                <input
                  type="text"
                  value={`${person?.primerNombre || ''} ${person?.apellidoPaterno || ''} - ${paciente?.edad || ''} años`}
                  className="form-input"
                  readOnly disabled
                />
              </div>
            </div>
          </section>

          {/* ENTREVISTA INICIAL */}
          {esEntrevistaInicial && (
            <>
              <FormAntecedentes antecedentes={antecedentes} readOnly />
              <FormHistoriaFamiliar antecedentes={antecedentes} readOnly />
              <FormSintomatologia sintomatologias={sintomatologias} readOnly />
              <FormUniversidad
                antecedentes={antecedentes}
                setAntecedentes={() => { }}
                handleChange={() => { }}
                readOnly
              />
              <FormAcuerdos
                formData={formData}
                antecedentes={antecedentes}
                sintomatologias={sintomatologias}
                handleChange={() => { }}
                readOnly
              />
              <FormEvaluacion
                antecedentes={antecedentes}
                setAntecedentes={() => { }}
                readOnly
              />
            </>
          )}

          {/* SESIÓN DE SEGUIMIENTO */}
          {esSesionSeguimiento && (
            <>
              {/* Gravedad */}
              {historialData.gravedad && (
                <section className="form-section">
                  <div className="section-title">
                    <span className="section-number">⚠️</span>
                    <span className="section-text">Gravedad</span>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={historialData.gravedad.charAt(0).toUpperCase() + historialData.gravedad.slice(1)}
                      className="form-input"
                      readOnly disabled
                      style={{
                        backgroundColor:
                          historialData.gravedad === 'leve' ? '#d1fae5' :
                            historialData.gravedad === 'moderado' ? '#fef3c7' : '#fee2e2',
                        fontWeight: '600'
                      }}
                    />
                  </div>
                </section>
              )}

              {/* Tipologías */}
              {historialData.tipologias && historialData.tipologias.length > 0 && (
                <section className="form-section">
                  <div className="section-title">
                    <span className="section-number">🏷️</span>
                    <span className="section-text">Tipología</span>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {historialData.tipologias.map((tip: string, idx: number) => (
                        <span key={idx} style={{
                          padding: '6px 12px',
                          backgroundColor: '#eff6ff',
                          border: '2px solid #3b82f6',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Historia Clínica */}
              {historialData.historia && (
                <section className="form-section">
                  <div className="section-title">
                    <span className="section-number">📋</span>
                    <span className="section-text">Historia Clínica</span>
                  </div>
                  <div className="form-group">
                    <textarea
                      value={historialData.historia}
                      className="form-input"
                      rows={10}
                      readOnly disabled
                    />
                  </div>
                </section>
              )}
            </>
          )}

          {/* Sin datos */}
          {sinDatos && (
            <section className="form-section">
              <div className="alert" style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#92400e' }}>
                  ℹ Esta sesión no contiene datos registrados.
                </p>
              </div>
            </section>
          )}

          <div className="actions-footer">
            <button onClick={() => navigate(-1)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
              ← Volver al Historial
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetalleSesion;