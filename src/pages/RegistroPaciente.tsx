//src/pages/RegistroPaciente.tsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Psicologo, FormData, AntecedentesData } from '../types/types';
import './RegistroPaciente.css';

const RegistroPaciente: React.FC = () => {
  const [paso, setPaso] = useState<1 | 2>(1);
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
    defecacion: ''
  });

  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [psicologoInput, setPsicologoInput] = useState('');
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPsicologos, setFetchingPsicologos] = useState(false);

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
    setLoading(true);

    try {
      
      await api.post(`/pacientes/universitario/${pacienteId}/historia-clinica`, antecedentes);
      setMensaje('¡Entrevista completada y registrada exitosamente!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setError('Error al guardar los antecedentes clínicos.');
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
      </div>

      <div className="card-academic">
        <header className="banner-header">
          <h1>{paso === 1 ? 'Registro de Paciente' : 'Entrevista Inicial'}</h1>
          <p>{paso === 1 ? 'Ficha de Identificación General' : 'Antecedentes y Motivo de Consulta'}</p>
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
                  <input type="number" name="edad" value={formData.edad} onChange={handleChangeStep1} className="input-academic" />
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
                        if(!e.target.value) setFormData(p => ({...p, psicologoId: ''}));
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
        ) : (
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
              <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Finalizando...' : 'Finalizar Entrevista'}</button>
            </div>
          </form>
        )}
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
