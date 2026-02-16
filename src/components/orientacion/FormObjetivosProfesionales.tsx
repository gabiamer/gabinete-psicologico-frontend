// src/components/orientacion/FormObjetivosProfesionales.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { OrientacionVocacionalData } from '../../types/types';

interface Props {
    orientacion: OrientacionVocacionalData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const FormObjetivosProfesionales: React.FC<Props> = ({ orientacion, handleChange }) => {
    return (
        <>
            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">3.1</span>
                    <span className="section-text">Planes al Terminar la Preparatoria</span>
                </div>

                <FormField label="Una vez que termines la preparatoria, piensas..." required>
                    <select
                        name="planDespuesPreparatoria"
                        value={orientacion.planDespuesPreparatoria}
                        onChange={handleChange}
                        className="input-academic"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="estudiar">Estudiar</option>
                        <option value="trabajar">Trabajar</option>
                        <option value="estudiar_trabajar">Estudiar y trabajar</option>
                        <option value="ninguno">No estudiar ni trabajar</option>
                    </select>
                </FormField>

                <FormField label="¿Por qué?">
                    <textarea
                        name="motivoPlanFuturo"
                        value={orientacion.motivoPlanFuturo}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Explica tus razones..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">3.2</span>
                    <span className="section-text">Carreras de Interés</span>
                </div>

                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Nombra tres carreras que te gustaría seguir (por orden de preferencia)
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Carrera de tu preferencia">
                        <input
                            name="carreraInteres1"
                            value={orientacion.carreraInteres1}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Ingeniería en Sistemas"
                        />
                    </FormField>
                    <FormField label="2° Carrera de tu preferencia">
                        <input
                            name="carreraInteres2"
                            value={orientacion.carreraInteres2}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Medicina"
                        />
                    </FormField>
                    <FormField label="3° Carrera de tu preferencia">
                        <input
                            name="carreraInteres3"
                            value={orientacion.carreraInteres3}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Arquitectura"
                        />
                    </FormField>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">3.3</span>
                    <span className="section-text">Carreras que NO te Interesan</span>
                </div>

                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Nombra tres áreas o carreras que NO te gustaría seguir
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Carrera que no te interesa">
                        <input
                            name="carreraNoInteres1"
                            value={orientacion.carreraNoInteres1}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Derecho"
                        />
                    </FormField>
                    <FormField label="2° Carrera que no te interesa">
                        <input
                            name="carreraNoInteres2"
                            value={orientacion.carreraNoInteres2}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Contabilidad"
                        />
                    </FormField>
                    <FormField label="3° Carrera que no te interesa">
                        <input
                            name="carreraNoInteres3"
                            value={orientacion.carreraNoInteres3}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Odontología"
                        />
                    </FormField>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">3.4</span>
                    <span className="section-text">Factores Externos</span>
                </div>

                <FormField label="¿El factor económico posibilita tus posibilidades para estudiar lo que deseas? ¿Por qué?">
                    <textarea
                        name="factorEconomico"
                        value={orientacion.factorEconomico}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Describe tu situación económica y cómo afecta tus planes..."
                    />
                </FormField>

                <FormField label="¿Cuentas con el apoyo de tu familia para la carrera que deseas estudiar?">
                    <textarea
                        name="apoyoFamiliar"
                        value={orientacion.apoyoFamiliar}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Describe el apoyo (o falta de apoyo) de tu familia..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">3.5</span>
                    <span className="section-text">Visión a Futuro</span>
                </div>

                <FormField label="¿Cómo te ves de aquí a 5 años?">
                    <textarea
                        name="visionCincoAnos"
                        value={orientacion.visionCincoAnos}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={5}
                        placeholder="Describe dónde te imaginas, qué estarás haciendo, qué habrás logrado..."
                    />
                </FormField>

                <FormField label="¿Qué tipo de trabajos te gustaría realizar?">
                    <textarea
                        name="tipoTrabajosDeseados"
                        value={orientacion.tipoTrabajosDeseados}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Describe el tipo de trabajo ideal para ti..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">  </span>
                    <span className="section-text">Observaciones del Entrevistador</span>
                </div>

                <FormField label="Notas y observaciones del psicólogo">
                    <textarea
                        name="observacionesEntrevistador"
                        value={orientacion.observacionesEntrevistador}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={6}
                        placeholder="Anote aquí sus observaciones sobre el entrevistado..."
                    />
                </FormField>
            </section>
        </>
    );
};