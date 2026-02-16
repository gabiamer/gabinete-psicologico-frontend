// src/pages/RegistroPaciente.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData, AntecedentesData, Psicologo } from '../types/types';
import { pacienteService } from '../services/pacienteService';
import { calcularEdad } from '../utils/calculos';
import { FormDatosPersonales } from '../components/pacientes/FormDatosPersonales';
import { FormAntecedentes } from '../components/pacientes/FormAntecedentes';
import { FormHistoriaFamiliar } from '../components/pacientes/FormHistoriaFamiliar';
import { FormSintomatologia } from '../components/pacientes/FormSintomatologia';
import { FormUniversidad } from '../components/pacientes/FormUniversidad';
import { FormAcuerdos } from '../components/pacientes/FormAcuerdos';
import './RegistroPaciente.css';

const PASOS = [
  { numero: 1, label: 'Ficha de Admisión' },
  { numero: 2, label: 'Antecedentes Clínicos' },
  { numero: 3, label: 'Historia Familiar' },
  { numero: 4, label: 'Sintomatologías' },
  { numero: 5, label: 'Universidad y Hábitos' },
  { numero: 6, label: 'Acuerdos y Cierre' }
];

const RegistroPaciente: React.FC = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    primerNombre: '',
    segundoNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    celular: '',
    fechaNacimiento: '',
    edad: '',
    genero: 1,
    domicilio: '',
    estadoCivil: 1,
    semestre: 1,
    derivadoPor: '',
    psicologoId: ''
  });

  const [antecedentes, setAntecedentes] = useState<AntecedentesData>({
    ultimaVezBien: '',
    desarrolloSintomas: '',
    antecedentesFamiliares: '',
    sueno: '',
    apetito: '',
    sed: '',
    defecacion: '',
    conQuienVive: '',
    personaReferencia: '',
    celularReferencia: '',
    nombrePadre: '',
    ocupacionPadre: '',
    enfermedadPadre: '',
    relacionPadre: '',
    nombreMadre: '',
    ocupacionMadre: '',
    enfermedadMadre: '',
    relacionMadre: '',
    numeroHermanos: '',
    relatoHermanos: '',
    nivelSatisfaccion: 0,
    rendimiento: 0,
    estresUniversitario: 0,
    interaccionSocial: 0,
    cambioCarreras: '',
    motivosCambio: '',
    relatoUniversidad: '',
    consumoAlcohol: '',
    frecuenciaAlcohol: 0,
    consumoTabaco: '',
    frecuenciaTabaco: 0,
    consumoDrogas: '',
    frecuenciaDrogas: 0,
    relatoAcusacionDetencion: '',
    acuerdosEstablecidos: '',
    proximaSesionFecha: '',
    proximaSesionHora: ''
  });

  const [sintomatologias, setSintomatologias] = useState({
    estres: Array(12).fill(1),
    ansiedad: Array(12).fill(1),
    depresion: Array(12).fill(1)
  });

  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [psicologoInput, setPsicologoInput] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [fetchingPsicologos, setFetchingPsicologos] = useState(false);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar psicólogos
  useEffect(() => {
    const cargarPsicologos = async () => {
      setFetchingPsicologos(true);
      try {
        const data = await pacienteService.obtenerPsicologos();
        setPsicologos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando psicólogos:', err);
        setError('No se pudieron cargar los profesionales');
      } finally {
        setFetchingPsicologos(false);
      }
    };
    cargarPsicologos();
  }, []);

  const handleChangeStep1 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fechaNacimiento') {
      const edad = calcularEdad(value);
      setFormData(prev => ({ ...prev, fechaNacimiento: value, edad }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: ['genero', 'estadoCivil', 'semestre', 'edad'].includes(name)
        ? value === '' ? '' : parseInt(value)
        : value
    }));
  };

  const handleChangeStep2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAntecedentes(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeSintoma = (categoria: 'estres' | 'ansiedad' | 'depresion', index: number, valor: number) => {
    setSintomatologias(prev => ({
      ...prev,
      [categoria]: prev[categoria].map((v, i) => i === index ? valor : v)
    }));
  };

  const seleccionarPsicologo = (psicologo: Psicologo) => {
    setPsicologoInput(`${psicologo.person.primerNombre} ${psicologo.person.apellidoPaterno}`);
    setFormData(prev => ({ ...prev, psicologoId: psicologo.id }));
    setShowSugerencias(false);
  };

  const validateStep1 = () => {
    if (!formData.primerNombre.trim()) {
      setError('El primer nombre es obligatorio');
      return false;
    }
    if (!formData.apellidoPaterno.trim() && !formData.apellidoMaterno.trim()) {
      setError('Debe ingresar al menos un apellido');
      return false;
    }
    if (!formData.fechaNacimiento) {
      setError('La fecha de nacimiento es obligatoria');
      return false;
    }
    if (!formData.psicologoId) {
      setError('Debe seleccionar un psicólogo');
      return false;
    }
    return true;
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!validateStep1()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const id = await pacienteService.crear(formData);
      setPacienteId(id);
      setMensaje('Ficha básica guardada');
      setTimeout(() => {
        setPaso(2);
        setMensaje('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!antecedentes.ultimaVezBien.trim()) {
      setError('El campo "¿Cuándo se sintió bien por última vez?" es obligatorio');
      return;
    }
    setPaso(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep5 = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep6 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setLoading(true);

    try {
      await pacienteService.guardarHistoriaClinica(pacienteId!, antecedentes, sintomatologias);
      setMensaje('¡Entrevista completada exitosamente!');
      setTimeout(() => {
        navigate(`/pacientes/${pacienteId}/historial`);
      }, 2000);
    } catch (err: any) {
      setError('Error al guardar la entrevista');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const getTitulo = () => {
    const titulos = [
      'Registro de Paciente',
      'Entrevista Inicial',
      'Historia Familiar',
      'Evaluación de Sintomatologías',
      'Socialización y Hábitos',
      'Acuerdos y Próxima Sesión'
    ];
    return titulos[paso - 1];
  };

  const getSubtitulo = () => {
    const subtitulos = [
      'Ficha de Identificación General',
      'Antecedentes y Motivo de Consulta',
      'Datos de la Familia',
      'Evaluación de Estrés, Ansiedad y Depresión',
      'Vida Universitaria y Aspectos de Salud',
      'Compromisos y Seguimiento'
    ];
    return subtitulos[paso - 1];
  };

  return (
    <div className="registro-wrapper">
      {/* STEPPER */}
      <div className="stepper-container">
        {PASOS.map((p) => (
          <div key={p.numero} className={`step-indicator ${paso === p.numero ? 'active' : ''}`}>
            <div className="step-circle">{p.numero}</div>
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      <div className="card-academic">
        <header className="banner-header">
          <h1>{getTitulo()}</h1>
          <p>{getSubtitulo()}</p>
        </header>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {paso === 1 && (
          <form onSubmit={handleSubmitStep1} className="form-content" noValidate>
            <FormDatosPersonales
              formData={formData}
              psicologos={psicologos}
              psicologoInput={psicologoInput}
              setPsicologoInput={setPsicologoInput}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              fetchingPsicologos={fetchingPsicologos}
              handleChange={handleChangeStep1}
              seleccionarPsicologo={seleccionarPsicologo}
            />
            <div className="actions-footer">
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Guardando...' : 'Guardar y Continuar'}
              </button>
            </div>
          </form>
        )}

        {paso === 2 && (
          <form onSubmit={handleSubmitStep2} className="form-content" noValidate>
            <FormAntecedentes antecedentes={antecedentes} handleChange={handleChangeStep2} />
            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(1)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                Volver
              </button>
              <button type="submit" className="btn-submit">Siguiente</button>
            </div>
          </form>
        )}

        {paso === 3 && (
          <form onSubmit={handleSubmitStep3} className="form-content" noValidate>
            <FormHistoriaFamiliar antecedentes={antecedentes} handleChange={handleChangeStep2} />
            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(2)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                Volver
              </button>
              <button type="submit" className="btn-submit">Continuar</button>
            </div>
          </form>
        )}

        {paso === 4 && (
          <form onSubmit={handleSubmitStep4} className="form-content" noValidate>
            <FormSintomatologia sintomatologias={sintomatologias} handleChangeSintoma={handleChangeSintoma} />
            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(3)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                Volver
              </button>
              <button type="submit" className="btn-submit">Continuar</button>
            </div>
          </form>
        )}

        {paso === 5 && (
          <form onSubmit={handleSubmitStep5} className="form-content" noValidate>
            <FormUniversidad
              formData={formData}
              antecedentes={antecedentes}
              setFormData={setFormData}
              setAntecedentes={setAntecedentes}
              handleChange={handleChangeStep2}
            />
            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(4)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                Volver
              </button>
              <button type="submit" className="btn-submit">Continuar</button>
            </div>
          </form>
        )}

        {paso === 6 && (
          <form onSubmit={handleSubmitStep6} className="form-content" noValidate>
            <FormAcuerdos
              formData={formData}
              antecedentes={antecedentes}
              sintomatologias={sintomatologias}
              handleChange={handleChangeStep2}
            />
            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(5)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                Volver
              </button>
              <button type="submit" disabled={loading || submitting} className="btn-submit">
                {loading ? 'Finalizando...' : '✓ Finalizar y Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroPaciente;