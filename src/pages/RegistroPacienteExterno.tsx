// src/pages/RegistroPacienteExterno.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../types/types';
import { calcularEdad } from '../utils/calculos';
import { FormField } from '../components/shared/FormField';
import './RegistroPaciente.css';

const RegistroPacienteExterno: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    primerNombre: '',
    segundoNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    celular: '',
    fechaNacimiento: '',
    edad: '',
    domicilio: '',
    estadoCivil: 1,
    genero: '',
    semestre: 1,
    derivadoPor: '',
    psicologoId: ''
  });

  const [escuela, setEscuela] = useState('');
  const [anio, setAnio] = useState(1);
  const [correo, setCorreo] = useState('');

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fechaNacimiento') {
      const edad = calcularEdad(value);
      setFormData(prev => ({ ...prev, fechaNacimiento: value, edad }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: ['estadoCivil', 'edad'].includes(name)
        ? value === '' ? '' : parseInt(value)
        : value
    }));
  };

  const validateForm = () => {
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
    if (!escuela.trim()) {
      setError('La escuela es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setMensaje('');
    setError('');

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/nueva-orientacion', { state: { formData, escuela, anio, correo } });
  };

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Registro - Orientación Vocacional</h1>
          <p>Datos del consultante externo</p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-content" noValidate>
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">01</span>
              <span className="section-text">Datos Personales</span>
            </div>

            <div className="grid-2-cols">
              <FormField label="Primer Nombre" required>
                <input
                  type="text"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  className="input-academic"
                  placeholder="Ej. Juan"
                />
              </FormField>

              <FormField label="Segundo Nombre">
                <input
                  type="text"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  className="input-academic"
                  placeholder="(Opcional)"
                />
              </FormField>

              <FormField label="Apellido Paterno">
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  className="input-academic"
                />
              </FormField>

              <FormField label="Apellido Materno">
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  className="input-academic"
                />
              </FormField>

              <FormField label="Fecha de Nacimiento" required>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="input-academic"
                />
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
                  Se calcula automáticamente
                </p>
              </FormField>

              <FormField label="Estado Civil">
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="input-academic">
                  <option value={1}>Soltero/a</option>
                  <option value={2}>Casado/a</option>
                  <option value={3}>Divorciado/a</option>
                  <option value={4}>Viudo/a</option>
                  <option value={5}>Concubinato</option>
                </select>
              </FormField>

              <FormField label="Teléfono Celular">
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="input-academic"
                  placeholder="70000000"
                />
              </FormField>

              <FormField label="Correo Electrónico">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="input-academic"
                  placeholder="correo@ejemplo.com"
                />
              </FormField>

              <FormField label="Domicilio Actual">
                <input
                  type="text"
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleChange}
                  className="input-academic"
                  placeholder="Zona, Calle, Nº de vivienda"
                />
              </FormField>
            </div>
          </section>

          <section className="form-section">
            <div className="section-title">
              <span className="section-number">02</span>
              <span className="section-text">Datos Académicos</span>
            </div>

            <div className="grid-2-cols">
              <FormField label="Escuela / Colegio" required>
                <input
                  type="text"
                  value={escuela}
                  onChange={(e) => setEscuela(e.target.value)}
                  className="input-academic"
                  placeholder="Ej. Colegio Nacional Bolívar"
                />
              </FormField>

              <FormField label="Año que cursa" required>
                <input
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(parseInt(e.target.value) || 1)}
                  className="input-academic"
                  min="1"
                  max="6"
                  placeholder="Ej. 6 (último año)"
                />
              </FormField>
            </div>
          </section>

          <div className="actions-footer">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-submit"
              style={{ backgroundColor: '#64748b' }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Continuar a Entrevista →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroPacienteExterno;