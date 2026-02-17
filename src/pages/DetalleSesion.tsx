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
import { FormData, AntecedentesData } from '../types/types';
import './RegistroPaciente.css';

const DetalleSesion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sesion, setSesion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      cargarSesion();
    }
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
          <button onClick={() => navigate(-1)} className="btn-submit">
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  // Parsear acuerdos
  let data: any = {};
  if (sesion.acuerdos) {
    if (typeof sesion.acuerdos === 'string') {
      try {
        data = JSON.parse(sesion.acuerdos);
      } catch (e) {
        console.error('Error parseando acuerdos:', e);
      }
    } else if (typeof sesion.acuerdos === 'object') {
      data = sesion.acuerdos;
    }
  }

  const paciente = sesion.pacienteUniversitario?.paciente;
  const person = paciente?.person;

  // Convertir data a los formatos que esperan los componentes
  const formData: FormData = {
    primerNombre: person?.primerNombre || '',
    segundoNombre: person?.segundoNombre || '',
    apellidoPaterno: person?.apellidoPaterno || '',
    apellidoMaterno: person?.apellidoMaterno || '',
    celular: person?.celular || '',
    fechaNacimiento: paciente?.fechaNacimiento || '',
    edad: paciente?.edad || '',
    genero: paciente?.genero || 1,
    domicilio: paciente?.domicilio || '',
    estadoCivil: paciente?.estadoCivil || 1,
    semestre: sesion.pacienteUniversitario?.semestre || 1,
    derivadoPor: sesion.pacienteUniversitario?.derivadoPor || '',
    psicologoId: sesion.psicologo?.id || ''
  };

  const antecedentes: AntecedentesData = {
    ultimaVezBien: data.ultimaVezBien || '',
    desarrolloSintomas: data.desarrolloSintomas || '',
    antecedentesFamiliares: data.antecedentesFamiliares || '',
    sueno: data.sueno || '',
    apetito: data.apetito || '',
    sed: data.sed || '',
    defecacion: data.defecacion || '',
    conQuienVive: data.conQuienVive || '',
    personaReferencia: data.personaReferencia || '',
    celularReferencia: data.celularReferencia || '',
    nombrePadre: data.nombrePadre || '',
    ocupacionPadre: data.ocupacionPadre || '',
    enfermedadPadre: data.enfermedadPadre || '',
    relacionPadre: data.relacionPadre || '',
    nombreMadre: data.nombreMadre || '',
    ocupacionMadre: data.ocupacionMadre || '',
    enfermedadMadre: data.enfermedadMadre || '',
    relacionMadre: data.relacionMadre || '',
    numeroHermanos: data.numeroHermanos || '',
    relatoHermanos: data.relatoHermanos || '',
    nivelSatisfaccion: data.nivelSatisfaccion || 0,
    rendimiento: data.rendimiento || 0,
    estresUniversitario: data.estresUniversitario || 0,
    interaccionSocial: data.interaccionSocial || 0,
    cambioCarreras: data.cambioCarreras || '',
    motivosCambio: data.motivosCambio || '',
    relatoUniversidad: data.relatoUniversidad || '',
    consumoAlcohol: data.consumoAlcohol || '',
    frecuenciaAlcohol: data.frecuenciaAlcohol || 0,
    consumoTabaco: data.consumoTabaco || '',
    frecuenciaTabaco: data.frecuenciaTabaco || 0,
    consumoDrogas: data.consumoDrogas || '',
    frecuenciaDrogas: data.frecuenciaDrogas || 0,
    relatoAcusacionDetencion: data.relatoAcusacionDetencion || '',
    gravedad: data.gravedad || 'leve',
    tipologias: data.tipologias || [],
    notasSesion: data.notasSesion || '',
    objetivosSesion: data.objetivosSesion || '',
    acuerdosEstablecidos: data.acuerdosEstablecidos || '',
    proximaSesionFecha: data.proximaSesionFecha || '',
    proximaSesionHora: data.proximaSesionHora || ''
  };

  const sintomatologias = {
    estres: data.sintomatologias?.estres || Array(12).fill(1),
    ansiedad: data.sintomatologias?.ansiedad || Array(12).fill(1),
    depresion: data.sintomatologias?.depresion || Array(12).fill(1)
  };

  const esEntrevistaInicial = data.ultimaVezBien || data.sintomatologias;
  const esSesionSeguimiento = data.notasSesion && !esEntrevistaInicial;

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Detalle de Sesión #{sesion.id}</h1>
          <p>
            {sesion.tipo} - {new Date(sesion.fecha).toLocaleDateString('es-ES', { 
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
                  value={sesion.psicologo ? 
                    `${sesion.psicologo.person.primerNombre} ${sesion.psicologo.person.apellidoPaterno}` 
                    : 'N/A'} 
                  className="form-input" 
                  readOnly 
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Paciente</label>
                <input 
                  type="text" 
                  value={`${person?.primerNombre} ${person?.apellidoPaterno} - ${paciente?.edad} años`} 
                  className="form-input" 
                  readOnly 
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Mostrar componentes según el tipo de sesión */}
          {esEntrevistaInicial && (
            <>
              <FormAntecedentes antecedentes={antecedentes} readOnly />
              <FormHistoriaFamiliar antecedentes={antecedentes} readOnly />
              <FormSintomatologia sintomatologias={sintomatologias} readOnly />
              <FormUniversidad 
                formData={formData}
                antecedentes={antecedentes}
                setFormData={() => {}}
                setAntecedentes={() => {}}
                handleChange={() => {}}
                readOnly
              />
              <FormEvaluacion 
                antecedentes={antecedentes}
                setAntecedentes={() => {}}
                readOnly
              />
            </>
          )}

          {esSesionSeguimiento && (
            <>
              {data.objetivosSesion && (
                <section className="form-section">
                  <div className="section-title">
                    <span className="section-number">🎯</span>
                    <span className="section-text">Objetivos</span>
                  </div>
                  <textarea value={data.objetivosSesion} className="form-input" rows={3} readOnly disabled />
                </section>
              )}
              {data.notasSesion && (
                <section className="form-section">
                  <div className="section-title">
                    <span className="section-number">📝</span>
                    <span className="section-text">Notas</span>
                  </div>
                  <textarea value={data.notasSesion} className="form-input" rows={6} readOnly disabled />
                </section>
              )}
            </>
          )}

          <FormAcuerdos 
            formData={formData}
            antecedentes={antecedentes}
            sintomatologias={sintomatologias}
            handleChange={() => {}}
            readOnly
          />

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