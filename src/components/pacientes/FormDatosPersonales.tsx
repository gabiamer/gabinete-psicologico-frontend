// src/components/pacientes/FormDatosPersonales.tsx
import React, { useRef, useEffect } from 'react';
import { FormField } from '../shared/FormField';
import { FormData, Psicologo } from '../../types/types';

interface Props {
  formData: FormData;
  psicologos: Psicologo[];
  psicologoInput: string;
  setPsicologoInput: (value: string) => void;
  showSugerencias: boolean;
  setShowSugerencias: (value: boolean) => void;
  fetchingPsicologos: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  seleccionarPsicologo: (psicologo: Psicologo) => void;
}

export const FormDatosPersonales: React.FC<Props> = ({
  formData,
  psicologos,
  psicologoInput,
  setPsicologoInput,
  showSugerencias,
  setShowSugerencias,
  fetchingPsicologos,
  handleChange,
  seleccionarPsicologo
}) => {
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSugerencias]);

  const psicologosFiltrados = psicologos.filter(p => {
    if (!p.person) return false;
    const nombre = (p.person.primerNombre || '').toLowerCase();
    const apellido = (p.person.apellidoPaterno || '').toLowerCase();
    const busqueda = psicologoInput.toLowerCase();
    if (!busqueda) return true;
    return nombre.includes(busqueda) || apellido.includes(busqueda);
  });

  return (
    <>
      <section className="form-section">
        <div className="section-title">
          <span className="section-number">01</span>
          <span className="section-text">Identidad Personal</span>
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
        </div>
      </section>

      <section className="form-section">
        <div className="section-title">
          <span className="section-number">02</span>
          <span className="section-text">Demografía y Contacto</span>
        </div>
        <div className="grid-fields">
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
          <FormField label="Estado Civil" required>
            <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="input-academic">
              <option value={1}>Soltero/a</option>
              <option value={2}>Casado/a</option>
              <option value={3}>Divorciado/a</option>
              <option value={4}>Viudo/a</option>
              <option value={5}>Concubinato</option>
            </select>
          </FormField>
          <FormField label="Teléfono Celular" required>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="input-academic"
              placeholder="70000000"
            />
          </FormField>
        </div>
        <div style={{ marginTop: '32px' }}>
          <FormField label="Domicilio Actual" required>
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
          <span className="section-number">03</span>
          <span className="section-text">Datos Académicos</span>
        </div>
        <div className="grid-2-cols">
          <FormField label="Semestre Cursante" required>
            <input
              type="number"
              name="semestre"
              min="1"
              max="14"
              value={formData.semestre}
              onChange={handleChange}
              className="input-academic"
            />
          </FormField>
          <FormField label="Remitido por">
            <input
              type="text"
              name="derivadoPor"
              value={formData.derivadoPor}
              onChange={handleChange}
              className="input-academic"
              placeholder="Ej. Dirección de Carrera"
            />
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
              }}
              onFocus={() => setShowSugerencias(true)}
              placeholder={fetchingPsicologos ? "Cargando..." : "Seleccione un psicólogo"}
              className="input-academic"
              autoComplete="off"
            />
            {showSugerencias && (
              <div className="suggestions-list">
                {fetchingPsicologos ? (
                  <div className="suggestion-item">Cargando...</div>
                ) : psicologosFiltrados.length > 0 ? (
                  psicologosFiltrados.map(p => (
                    <div key={p.id} onClick={() => seleccionarPsicologo(p)} className="suggestion-item">
                      <div className="flex flex-col">
                        <span className="font-bold">{p.person.primerNombre} {p.person.apellidoPaterno}</span>
                        <span className="text-xs text-blue-700 uppercase">{p.ocupacion}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">
                    {psicologoInput ? "No encontrado" : "No hay psicólogos"}
                  </div>
                )}
              </div>
            )}
          </div>
        </FormField>
      </section>
    </>
  );
};