//src/pages/RegistroPaciente.tsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Psicologo, FormData, AntecedentesData } from '../types/types';
import './RegistroPaciente.css';

const SINTOMAS_ESTRES = [
  "Me siento abrumado/a",
  "Tengo muchas cosas que hacer",
  "Me cuesta organizarme",
  "Me frustra no cumplir metas",
  "No paro de preocuparme",
  "Me siento cansado/a",
  "Me cuesta concentrarme",
  "Siento dolores físicos",
  "Me siento tenso/a",
  "Siento que pierdo control",
  "Me enloquece lo que tengo que hacer",
  "No puedo descansar"
];

const SINTOMAS_ANSIEDAD = [
  "Me preocupo demasiado",
  "Me pongo nervioso/a sin razón",
  "Pienso en lo peor",
  "Me cuesta calmarme",
  "Me siento intranquilo/a",
  "Me es difícil dejar de pensar",
  "Duermo mal",
  "Tengo palpitaciones",
  "Me da miedo lo desconocido",
  "Me cuesta socializar",
  "Siento peligro sin motivo",
  "Me siento fuera de lugar"
];

const SINTOMAS_DEPRESION = [
  "Me siento triste",
  "No disfruto las cosas",
  "Me siento sin energía",
  "No le encuentro sentido a nada",
  "Me siento solo/a",
  "He perdido el apetito",
  "Duermo mucho o poco",
  "No tengo ganas de hacer nada",
  "Me siento inútil",
  "No hablo de mis sentimientos",
  "Nada me importa",
  "Quiero rendirme"
];

const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const RegistroPaciente: React.FC = () => {
  const [paso, setPaso] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

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

    nivelSatisfaccion: 0, // 0 = no seleccionado, -2 = --, -1 = -, 1 = +, 2 = ++
    rendimiento: 0,
    estresUniversitario: 0,
    interaccionSocial: 0,
    cambioCarreras: '',
    motivosCambio: '',
    relatoUniversidad: '',
    consumoAlcohol: '',
    frecuenciaAlcohol: 1,

    consumoTabaco: '',
    frecuenciaTabaco: 1,

    consumoDrogas: '',
    frecuenciaDrogas: 1,

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
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPsicologos, setFetchingPsicologos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Carga de psicólogos desde el backend
  useEffect(() => {
    setFetchingPsicologos(true);
    api.get('/psicologos')
      .then(res => {
        // Tu controlador devuelve: { success: true, data: [...] }
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
          setPsicologos(data);
          console.log("Psicólogos cargados satisfactoriamente:", data.length);
        } else {
          console.error("El formato de respuesta no es un array en la propiedad 'data':", res.data);
        }
      })
      .catch(err => {
        console.error('Error cargando psicólogos:', err);
        setError('Error de conexión: No se pudieron cargar los profesionales del gabinete.');
      })
      .finally(() => setFetchingPsicologos(false));
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleChangeSintoma = (categoria: 'estres' | 'ansiedad' | 'depresion', index: number, valor: number) => {
    setSintomatologias(prev => ({
      ...prev,
      [categoria]: prev[categoria].map((v, i) => i === index ? valor : v)
    }));
  };

  const calcularTotal = (categoria: 'estres' | 'ansiedad' | 'depresion') => {
    return sintomatologias[categoria].reduce((sum, val) => sum + val, 0);
  };

  const interpretarResultado = (total: number, tipo: 'estres' | 'ansiedad' | 'depresion') => {
    if (tipo === 'estres') {
      if (total <= 10) return { texto: 'Sin estrés', color: '#10b981' };
      if (total <= 19) return { texto: 'Estrés ligero/menor', color: '#f59e0b' };
      if (total <= 25) return { texto: 'Estrés moderado', color: '#ef4444' };
      return { texto: 'Estrés severo', color: '#dc2626' };
    } else {
      if (total <= 7) return { texto: `Sin ${tipo}`, color: '#10b981' };
      if (total <= 13) return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ligera/menor`, color: '#f59e0b' };
      if (total <= 18) return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} moderada`, color: '#ef4444' };
      return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} muy severa`, color: '#dc2626' };
    }
  };


  // Lógica de filtrado mejorada
  const psicologosFiltrados = psicologos.filter(p => {
    if (!p.person) return false;
    const nombre = (p.person.primerNombre || '').toLowerCase();
    const apellido = (p.person.apellidoPaterno || '').toLowerCase();
    const busqueda = psicologoInput.toLowerCase();

    // Si no hay búsqueda, mostramos todos
    if (!busqueda) return true;

    return nombre.includes(busqueda) || apellido.includes(busqueda);
  });

  const handleChangeStep1 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fechaNacimiento') {
      const edadCalculada = calcularEdad(value);
      setFormData((prev) => ({
        ...prev,
        fechaNacimiento: value,
        edad: edadCalculada
      }));
      return;
    }

    setFormData((prev) => ({
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

  const seleccionarPsicologo = (psicologo: Psicologo) => {
    const nombreCompleto = `${psicologo.person.primerNombre} ${psicologo.person.apellidoPaterno}`;
    setPsicologoInput(nombreCompleto);
    setFormData((prev) => ({ ...prev, psicologoId: psicologo.id }));
    setShowSugerencias(false);
  };

  const validateStep1 = () => {
    if (!formData.primerNombre.trim()) { setError('El primer nombre es obligatorio.'); return false; }
    if (!formData.apellidoPaterno.trim() && !formData.apellidoMaterno.trim()) {
      setError('Debe ingresar al menos un apellido.');
      return false;
    }
    if (!formData.fechaNacimiento) { setError('La fecha de nacimiento es obligatoria.'); return false; }
    if (!formData.psicologoId) { setError('Debe seleccionar un psicólogo de la lista desplegable.'); return false; }
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
      const payload = {
        person: {
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre || null,
          apellidoPaterno: formData.apellidoPaterno || null,
          apellidoMaterno: formData.apellidoMaterno || null,
          celular: formData.celular
        },
        fechaNacimiento: formData.fechaNacimiento,
        edad: formData.edad || null,
        genero: formData.genero,
        domicilio: formData.domicilio,
        estadoCivil: formData.estadoCivil,
        semestre: formData.semestre,
        derivadoPor: formData.derivadoPor,
        psicologoId: formData.psicologoId,
        carreraId: 1
      };

      const response = await api.post('/pacientes/universitario', payload);

      if (response.data.success || response.status === 201) {
        // En tu controller el objeto está en response.data.data
        const id = response.data.data?.id || response.data.id;
        setPacienteId(id);
        setMensaje('Ficha básica guardada. Iniciando entrevista clínica...');
        setTimeout(() => {
          setPaso(2);
          setMensaje('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar los datos del paciente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!antecedentes.ultimaVezBien.trim()) {
      setError('El campo "¿Cuándo se sintió bien por última vez?" es obligatorio.');
      return;
    }

    setPaso(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    setPaso(4); // 👈 Cambiado: antes enviaba, ahora va al paso 4
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep4 = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    setPaso(5); // 👈 Cambiado: ahora va al paso 5
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep5 = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    setPaso(6); // 👈 Ir al paso 6
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStep6 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMensaje('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...antecedentes,
        sintomas: {
          estres: sintomatologias.estres,
          ansiedad: sintomatologias.ansiedad,
          depresion: sintomatologias.depresion
        },
        totalScoreEstres: calcularTotal('estres'),
        totalScoreAnsiedad: calcularTotal('ansiedad'),
        totalScoreDepresion: calcularTotal('depresion')
      };

      await api.post(`/pacientes/universitario/${pacienteId}/historia-clinica`, payload);
      setMensaje('¡Entrevista completada y registrada exitosamente!');
      setTimeout(() => {
        // Redirigir a la lista de pacientes o dashboard
        window.location.href = '/pacientes';
        // O si usas React Router: navigate('/pacientes');
      }, 2000);
    } catch (err: any) {
      setError('Error al guardar la entrevista completa.');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="stepper-container">
        <div className={`step-indicator ${paso === 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Ficha de Admisión</span>
        </div>
        <div className={`step-indicator ${paso === 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Antecedentes Clínicos</span>
        </div>
        <div className={`step-indicator ${paso === 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Historia Familiar</span>
        </div>
        <div className={`step-indicator ${paso === 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <span>Sintomatologías</span>
        </div>
        <div className={`step-indicator ${paso === 5 ? 'active' : ''}`}>
          <div className="step-circle">5</div>
          <span>Universidad y Hábitos</span>
        </div>
        <div className={`step-indicator ${paso === 6 ? 'active' : ''}`}>
          <div className="step-circle">6</div>
          <span>Acuerdos y Cierre</span>
        </div>
      </div>

      <div className="card-academic">
        <header className="banner-header">
          <h1>
            {paso === 1 ? 'Registro de Paciente' :
              paso === 2 ? 'Entrevista Inicial' :
                paso === 3 ? 'Historia Familiar' :
                  paso === 4 ? 'Evaluación de Sintomatologías' :
                    paso === 5 ? 'Socialización y Hábitos' :
                      'Acuerdos y Próxima Sesión'}
          </h1>
          <p>
            {paso === 1 ? 'Ficha de Identificación General' :
              paso === 2 ? 'Antecedentes y Motivo de Consulta' :
                paso === 3 ? 'Datos de la Familia' :
                  paso === 4 ? 'Evaluación de Estrés, Ansiedad y Depresión' :
                    paso === 5 ? 'Vida Universitaria y Aspectos de Salud' :
                      'Compromisos y Seguimiento'}
          </p>
        </header>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {paso === 1 ? (
          <form onSubmit={handleSubmitStep1} className="form-content" noValidate>
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">01</span>
                <span className="section-text">Identidad Personal</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="Primer Nombre" required>
                  <input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChangeStep1} className="input-academic" placeholder="Ej. Juan" />
                </FormField>
                <FormField label="Segundo Nombre">
                  <input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChangeStep1} className="input-academic" placeholder="(Opcional)" />
                </FormField>
                <FormField label="Apellido Paterno">
                  <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChangeStep1} className="input-academic" />
                </FormField>
                <FormField label="Apellido Materno">
                  <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChangeStep1} className="input-academic" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">02</span>
                <span className="section-text">Demografía y Contacto</span>
              </div>
              <div className="grid-fields">
                <FormField label="Fecha de Nacimiento" required>
                  <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChangeStep1} className="input-academic" />
                </FormField>
                <FormField label="Edad Actual" required>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    readOnly
                    className="input-academic"
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Se calcula automáticamente desde la fecha de nacimiento
                  </p>
                </FormField>
                <FormField label="Estado Civil" required>
                  <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChangeStep1} className="input-academic">
                    <option value={1}>Soltero/a</option>
                    <option value={2}>Casado/a</option>
                    <option value={3}>Divorciado/a</option>
                    <option value={4}>Viudo/a</option>
                    <option value={5}>Concubinato</option>
                  </select>
                </FormField>
                <FormField label="Teléfono Celular" required>
                  <input type="tel" name="celular" value={formData.celular} onChange={handleChangeStep1} className="input-academic" placeholder="70000000" />
                </FormField>
              </div>
              <div style={{ marginTop: '32px' }}>
                <FormField label="Domicilio Actual" required>
                  <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChangeStep1} className="input-academic" placeholder="Zona, Calle, Nº de vivienda" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">03</span>
                <span className="section-text">Datos Académicos</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="Semestre Cursante" required>
                  <input type="number" name="semestre" min="1" max="14" value={formData.semestre} onChange={handleChangeStep1} className="input-academic" />
                </FormField>
                <FormField label="Remitido por">
                  <input type="text" name="derivadoPor" value={formData.derivadoPor} onChange={handleChangeStep1} className="input-academic" placeholder="Ej. Dirección de Carrera" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">04</span>
                <span className="section-text">Asignación de Profesional</span>
              </div>
              <FormField label="Psicólogo Responsable" required>
                <div className="autocomplete-container" ref={autocompleteRef}>
                  <input
                    type="text"
                    value={psicologoInput}
                    onChange={(e) => {
                      setPsicologoInput(e.target.value);
                      setShowSugerencias(true);
                      if (!e.target.value) setFormData(p => ({ ...p, psicologoId: '' }));
                    }}
                    onFocus={() => setShowSugerencias(true)}
                    placeholder={fetchingPsicologos ? "Cargando profesionales..." : "Haga clic para ver la lista..."}
                    className="input-academic"
                    autoComplete="off"
                  />
                  {showSugerencias && (
                    <div className="suggestions-list">
                      {fetchingPsicologos ? (
                        <div className="suggestion-item text-slate-400 italic">Cargando profesionales...</div>
                      ) : psicologosFiltrados.length > 0 ? (
                        psicologosFiltrados.map(p => (
                          <div key={p.id} onClick={() => seleccionarPsicologo(p)} className="suggestion-item">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{p.person.primerNombre} {p.person.apellidoPaterno}</span>
                              <span className="text-xs text-blue-700 font-semibold uppercase">{p.ocupacion}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="suggestion-item text-slate-400 italic">
                          {psicologoInput ? "No se encontraron coincidencias" : "No hay psicólogos registrados"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormField>
            </section>

            <div className="actions-footer">
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Guardando...' : 'Guardar y Continuar'}
              </button>
            </div>
          </form>
        ) : paso === 2 ? (
          <form onSubmit={handleSubmitStep2} className="form-content" noValidate>
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">05</span>
                <span className="section-text">Situación Actual y Motivo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <FormField label="¿Cuándo se sintió bien por última vez?" required>
                  <textarea name="ultimaVezBien" value={antecedentes.ultimaVezBien} onChange={handleChangeStep2} className="textarea-academic" placeholder="..." />
                </FormField>
                <FormField label="Desarrollo de los síntomas" required>
                  <textarea name="desarrolloSintomas" value={antecedentes.desarrolloSintomas} onChange={handleChangeStep2} className="textarea-academic" placeholder="..." />
                </FormField>
                <FormField label="Antecedentes Familiares">
                  <textarea name="antecedentesFamiliares" value={antecedentes.antecedentesFamiliares} onChange={handleChangeStep2} className="textarea-academic" placeholder="..." />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">06</span>
                <span className="section-text">Funciones Orgánicas</span>
              </div>
              <div className="grid-fields">
                <FormField label="Sueño"><input name="sueno" value={antecedentes.sueno} onChange={handleChangeStep2} className="input-academic" /></FormField>
                <FormField label="Apetito"><input name="apetito" value={antecedentes.apetito} onChange={handleChangeStep2} className="input-academic" /></FormField>
                <FormField label="Sed"><input name="sed" value={antecedentes.sed} onChange={handleChangeStep2} className="input-academic" /></FormField>
                <FormField label="Defecación"><input name="defecacion" value={antecedentes.defecacion} onChange={handleChangeStep2} className="input-academic" /></FormField>
              </div>
            </section>

            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(1)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>Volver</button>
              <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Siguiente...' : 'Siguiente'}</button>
            </div>
          </form>

        ) : paso === 3 ? (

          <form onSubmit={handleSubmitStep3} className="form-content" noValidate>
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">07</span>
                <span className="section-text">Historia Familiar</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="¿Con quién vive?">
                  <input name="conQuienVive" value={antecedentes.conQuienVive} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Persona de referencia">
                  <input name="personaReferencia" value={antecedentes.personaReferencia} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Celular de referencia">
                  <input name="celularReferencia" value={antecedentes.celularReferencia} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">08</span>
                <span className="section-text">Datos del Padre</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="Nombre">
                  <input name="nombrePadre" value={antecedentes.nombrePadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Escolaridad u ocupación">
                  <input name="ocupacionPadre" value={antecedentes.ocupacionPadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="¿Padece alguna enfermedad?">
                  <input name="enfermedadPadre" value={antecedentes.enfermedadPadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Relación padre-paciente">
                  <input name="relacionPadre" value={antecedentes.relacionPadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">09</span>
                <span className="section-text">Datos de la Madre</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="Nombre">
                  <input name="nombreMadre" value={antecedentes.nombreMadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Escolaridad u ocupación">
                  <input name="ocupacionMadre" value={antecedentes.ocupacionMadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="¿Padece alguna enfermedad?">
                  <input name="enfermedadMadre" value={antecedentes.enfermedadMadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Relación madre-paciente">
                  <input name="relacionMadre" value={antecedentes.relacionMadre} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="section-number">10</span>
                <span className="section-text">Hermanos</span>
              </div>
              <div className="grid-2-cols">
                <FormField label="Número de hermanos">
                  <input type="number" name="numeroHermanos" min="0" value={antecedentes.numeroHermanos} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
                <FormField label="Relato de la relación con los hermanos">
                  <input name="relatoHermanos" value={antecedentes.relatoHermanos} onChange={handleChangeStep2} className="input-academic" />
                </FormField>
              </div>
            </section>

            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(2)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>Volver</button>
              <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Finalizando...' : 'Continuar'}</button>
            </div>
          </form>

        ) : paso === 4 ? (
          <form onSubmit={handleSubmitStep4} className="form-content" noValidate>
            <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#475569', lineHeight: '1.6' }}>
                Elija el grado en que ha experimentado cada síntoma durante las dos últimas semanas, seleccionando la opción que mejor describa la situación:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>1: Nunca</div>
                <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>2: A veces</div>
                <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>3: Frecuentemente</div>
                <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>4: Siempre</div>
              </div>
            </div>

            {/* SECCIÓN DE ESTRÉS */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">11</span>
                <span className="section-text">Síntomas de Estrés</span>
              </div>
              {SINTOMAS_ESTRES.map((sintoma, idx) => (
                <div key={`estres-${idx}`} style={{ marginBottom: '24px' }}>
                  <label className="field-label">{idx + 1}. {sintoma}</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {[1, 2, 3, 4].map(valor => (
                      <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`estres-${idx}`}
                          value={valor}
                          checked={sintomatologias.estres[idx] === valor}
                          onChange={() => handleChangeSintoma('estres', idx, valor)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{valor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
                  <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal('estres'), 'estres').color }}>
                    {calcularTotal('estres')}
                  </span>
                </div>
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal('estres'), 'estres').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
                  {interpretarResultado(calcularTotal('estres'), 'estres').texto}
                </div>
              </div>
            </section>

            {/* SECCIÓN DE ANSIEDAD */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">12</span>
                <span className="section-text">Síntomas de Ansiedad</span>
              </div>
              {SINTOMAS_ANSIEDAD.map((sintoma, idx) => (
                <div key={`ansiedad-${idx}`} style={{ marginBottom: '24px' }}>
                  <label className="field-label">{idx + 1}. {sintoma}</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {[1, 2, 3, 4].map(valor => (
                      <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`ansiedad-${idx}`}
                          value={valor}
                          checked={sintomatologias.ansiedad[idx] === valor}
                          onChange={() => handleChangeSintoma('ansiedad', idx, valor)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{valor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
                  <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal('ansiedad'), 'ansiedad').color }}>
                    {calcularTotal('ansiedad')}
                  </span>
                </div>
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal('ansiedad'), 'ansiedad').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
                  {interpretarResultado(calcularTotal('ansiedad'), 'ansiedad').texto}
                </div>
              </div>
            </section>

            {/* SECCIÓN DE DEPRESIÓN */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">13</span>
                <span className="section-text">Síntomas de Depresión</span>
              </div>
              {SINTOMAS_DEPRESION.map((sintoma, idx) => (
                <div key={`depresion-${idx}`} style={{ marginBottom: '24px' }}>
                  <label className="field-label">{idx + 1}. {sintoma}</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {[1, 2, 3, 4].map(valor => (
                      <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`depresion-${idx}`}
                          value={valor}
                          checked={sintomatologias.depresion[idx] === valor}
                          onChange={() => handleChangeSintoma('depresion', idx, valor)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{valor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '18px' }}>TOTAL:</span>
                  <span style={{ fontWeight: '700', fontSize: '24px', color: interpretarResultado(calcularTotal('depresion'), 'depresion').color }}>
                    {calcularTotal('depresion')}
                  </span>
                </div>
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: interpretarResultado(calcularTotal('depresion'), 'depresion').color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
                  {interpretarResultado(calcularTotal('depresion'), 'depresion').texto}
                </div>
              </div>
            </section>

            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(3)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>Volver</button>
              <button type="submit" disabled={loading || submitting} className="btn-submit">
                {loading ? 'Finalizando...' : 'Continuar'}
              </button>
            </div>
          </form>
        ) : paso === 5 ? (
          <form onSubmit={handleSubmitStep5} className="form-content" noValidate>
            {/* SECCIÓN VI: RELATO UNIVERSIDAD */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">14</span>
                <span className="section-text">Relato de Socialización y Conducta en la Universidad</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <FormField label="Semestre actual">
                  <input
                    type="number"
                    value={formData.semestre}
                    onChange={(e) => setFormData(prev => ({ ...prev, semestre: parseInt(e.target.value) || 1 }))}
                    className="input-academic"
                    min="1"
                    max="14"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Se puede actualizar si es necesario
                  </p>
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div>
                    <label className="field-label">Nivel de satisfacción</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[
                        { valor: -2, label: '--' },
                        { valor: -1, label: '-' },
                        { valor: 1, label: '+' },
                        { valor: 2, label: '++' }
                      ].map(({ valor, label }) => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="nivelSatisfaccion"
                            value={valor}
                            checked={antecedentes.nivelSatisfaccion === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, nivelSatisfaccion: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Rendimiento</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[
                        { valor: -2, label: '--' },
                        { valor: -1, label: '-' },
                        { valor: 1, label: '+' },
                        { valor: 2, label: '++' }
                      ].map(({ valor, label }) => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="rendimiento"
                            value={valor}
                            checked={antecedentes.rendimiento === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, rendimiento: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Estrés</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[
                        { valor: -2, label: '--' },
                        { valor: -1, label: '-' },
                        { valor: 1, label: '+' },
                        { valor: 2, label: '++' }
                      ].map(({ valor, label }) => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="estresUniversitario"
                            value={valor}
                            checked={antecedentes.estresUniversitario === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, estresUniversitario: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Interacción social</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[
                        { valor: -2, label: '--' },
                        { valor: -1, label: '-' },
                        { valor: 1, label: '+' },
                        { valor: 2, label: '++' }
                      ].map(({ valor, label }) => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="interaccionSocial"
                            value={valor}
                            checked={antecedentes.interaccionSocial === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, interaccionSocial: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField label="¿Ha cambiado de carrera?">
                  <input name="cambioCarreras" value={antecedentes.cambioCarreras} onChange={handleChangeStep2} className="input-academic" placeholder="Sí/No" />
                </FormField>

                {antecedentes.cambioCarreras && (
                  <FormField label="Motivos del cambio">
                    <textarea name="motivosCambio" value={antecedentes.motivosCambio} onChange={handleChangeStep2} className="textarea-academic" rows={3} />
                  </FormField>
                )}

                <FormField label="Relato general sobre la vida universitaria">
                  <textarea name="relatoUniversidad" value={antecedentes.relatoUniversidad} onChange={handleChangeStep2} className="textarea-academic" rows={5} placeholder="Describa su experiencia general en la universidad..." />
                </FormField>
              </div>
            </section>

            {/* SECCIÓN VII: HÁBITOS */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">15</span>
                <span className="section-text">Hábitos y Otros Aspectos</span>
              </div>

              <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontWeight: '600' }}>
                  Indique la frecuencia de consumo para cada sustancia:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>0: Nunca</div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>1: Muy poco frecuente</div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>2: Poco frecuente</div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>3: Ocasional</div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>4: Frecuente</div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>5: Muy frecuente</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* ALCOHOL */}
                <div>
                  <FormField label="Consumo de alcohol">
                    <input
                      name="consumoAlcohol"
                      value={antecedentes.consumoAlcohol}
                      onChange={handleChangeStep2}
                      className="input-academic"
                      placeholder="Describa el tipo y detalles del consumo"
                    />
                  </FormField>
                  <div style={{ marginTop: '12px' }}>
                    <label className="field-label">Frecuencia de consumo de alcohol</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[0, 1, 2, 3, 4, 5].map(valor => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="frecuenciaAlcohol"
                            value={valor}
                            checked={antecedentes.frecuenciaAlcohol === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, frecuenciaAlcohol: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{valor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TABACO */}
                <div>
                  <FormField label="Consumo de tabaco">
                    <input
                      name="consumoTabaco"
                      value={antecedentes.consumoTabaco}
                      onChange={handleChangeStep2}
                      className="input-academic"
                      placeholder="Describa el tipo y detalles del consumo"
                    />
                  </FormField>
                  <div style={{ marginTop: '12px' }}>
                    <label className="field-label">Frecuencia de consumo de tabaco</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[0, 1, 2, 3, 4, 5].map(valor => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="frecuenciaTabaco"
                            value={valor}
                            checked={antecedentes.frecuenciaTabaco === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, frecuenciaTabaco: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{valor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DROGAS */}
                <div>
                  <FormField label="Consumo de drogas">
                    <input
                      name="consumoDrogas"
                      value={antecedentes.consumoDrogas}
                      onChange={handleChangeStep2}
                      className="input-academic"
                      placeholder="Describa el tipo y detalles del consumo"
                    />
                  </FormField>
                  <div style={{ marginTop: '12px' }}>
                    <label className="field-label">Frecuencia de consumo de drogas</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {[0, 1, 2, 3, 4, 5].map(valor => (
                        <label key={valor} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="frecuenciaDrogas"
                            value={valor}
                            checked={antecedentes.frecuenciaDrogas === valor}
                            onChange={(e) => setAntecedentes(prev => ({ ...prev, frecuenciaDrogas: parseInt(e.target.value) }))}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600' }}>{valor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField label="Relato si alguna vez fue acusado, detenido o arrestado">
                  <textarea
                    name="relatoAcusacionDetencion"
                    value={antecedentes.relatoAcusacionDetencion}
                    onChange={handleChangeStep2}
                    className="textarea-academic"
                    rows={4}
                    placeholder="Describa cualquier situación legal..."
                  />
                </FormField>
              </div>
            </section>

            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(4)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>Volver</button>
              <button type="submit" disabled={loading || submitting} className="btn-submit">
                {loading ? 'Finalizando...' : 'Continuar'}
              </button>
            </div>
          </form>
        ) : paso === 6 ? (
          <form onSubmit={handleSubmitStep6} className="form-content" noValidate>
            {/* ACUERDOS */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">16</span>
                <span className="section-text">Acuerdos Establecidos</span>
              </div>

              <FormField label="Describa los acuerdos, compromisos y objetivos establecidos con el paciente">
                <textarea
                  name="acuerdosEstablecidos"
                  value={antecedentes.acuerdosEstablecidos}
                  onChange={handleChangeStep2}
                  className="textarea-academic"
                  rows={6}
                  placeholder="Ej. El paciente se compromete a asistir a terapia semanalmente, realizar ejercicios de respiración diarios, llevar un diario emocional..."
                />
              </FormField>
            </section>

            {/* PRÓXIMA SESIÓN */}
            <section className="form-section">
              <div className="section-title">
                <span className="section-number">17</span>
                <span className="section-text">Próxima Sesión</span>
              </div>

              <div className="grid-2-cols">
                <FormField label="Fecha de la próxima sesión">
                  <input
                    type="date"
                    name="proximaSesionFecha"
                    value={antecedentes.proximaSesionFecha}
                    onChange={handleChangeStep2}
                    className="input-academic"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormField>

                <FormField label="Hora de la próxima sesión">
                  <input
                    type="time"
                    name="proximaSesionHora"
                    value={antecedentes.proximaSesionHora}
                    onChange={handleChangeStep2}
                    className="input-academic"
                  />
                </FormField>
              </div>
            </section>

            {/* RESUMEN */}
            <section className="form-section" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
                   Resumen de la Entrevista
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Paciente:</span>
                  <span>{formData.primerNombre} {formData.apellidoPaterno}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Edad:</span>
                  <span>{formData.edad} años</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Semestre:</span>
                  <span>{formData.semestre}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Estrés:</span>
                  <span style={{ color: interpretarResultado(calcularTotal('estres'), 'estres').color, fontWeight: '600' }}>
                    {calcularTotal('estres')} - {interpretarResultado(calcularTotal('estres'), 'estres').texto}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Ansiedad:</span>
                  <span style={{ color: interpretarResultado(calcularTotal('ansiedad'), 'ansiedad').color, fontWeight: '600' }}>
                    {calcularTotal('ansiedad')} - {interpretarResultado(calcularTotal('ansiedad'), 'ansiedad').texto}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Puntuación Depresión:</span>
                  <span style={{ color: interpretarResultado(calcularTotal('depresion'), 'depresion').color, fontWeight: '600' }}>
                    {calcularTotal('depresion')} - {interpretarResultado(calcularTotal('depresion'), 'depresion').texto}
                  </span>
                </div>
              </div>
            </section>

            <div className="actions-footer">
              <button type="button" onClick={() => setPaso(5)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>Volver</button>
              <button type="submit" disabled={loading || submitting} className="btn-submit">
                {loading ? 'Finalizando y guardando...' : ' Finalizar y Guardar Entrevista'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

const FormField = ({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
  <div className="field-group">
    <label className="field-label">{label}{required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}</label>
    {children}
  </div>
);

export default RegistroPaciente;
