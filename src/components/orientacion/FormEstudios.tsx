// src/components/orientacion/FormEstudios.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { OrientacionVocacionalData } from '../../types/types';

interface Props {
    orientacion: OrientacionVocacionalData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const FormEstudios: React.FC<Props> = ({ orientacion, handleChange }) => {
    return (
        <>
            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.1</span>
                    <span className="section-text">Estudios - Primaria</span>
                </div>

                <FormField label="¿Siempre asististe a la misma escuela primaria?" required>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mismaPrimaria"
                                value="Si"
                                checked={orientacion.mismaPrimaria === 'Si'}
                                onChange={handleChange}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>Sí</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mismaPrimaria"
                                value="No"
                                checked={orientacion.mismaPrimaria === 'No'}
                                onChange={handleChange}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>No</span>
                        </label>
                    </div>
                </FormField>

                {orientacion.mismaPrimaria === 'No' && (
                    <FormField label="Si cambiaste, ¿por qué?">
                        <textarea
                            name="motivoCambioPrimaria"
                            value={orientacion.motivoCambioPrimaria}
                            onChange={handleChange}
                            className="textarea-academic"
                            rows={3}
                            placeholder="Explica el motivo del cambio..."
                        />
                    </FormField>
                )}
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.2</span>
                    <span className="section-text">Estudios - Secundaria</span>
                </div>

                <FormField label="¿Asististe a la misma escuela secundaria?" required>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mismaSecundaria"
                                value="Si"
                                checked={orientacion.mismaSecundaria === 'Si'}
                                onChange={handleChange}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>Sí</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="mismaSecundaria"
                                value="No"
                                checked={orientacion.mismaSecundaria === 'No'}
                                onChange={handleChange}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>No</span>
                        </label>
                    </div>
                </FormField>

                {orientacion.mismaSecundaria === 'No' && (
                    <FormField label="Si cambiaste, ¿por qué?">
                        <textarea
                            name="motivoCambioSecundaria"
                            value={orientacion.motivoCambioSecundaria}
                            onChange={handleChange}
                            className="textarea-academic"
                            rows={3}
                            placeholder="Explica el motivo del cambio..."
                        />
                    </FormField>
                )}
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.3</span>
                    <span className="section-text">Materias Interesantes</span>
                </div>

                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Indica las materias que te resultaron más interesantes (por orden de preferencia)
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Materia más interesante">
                        <input
                            name="materiaInteresante1"
                            value={orientacion.materiaInteresante1}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Matemáticas"
                        />
                    </FormField>
                    <FormField label="2° Materia interesante">
                        <input
                            name="materiaInteresante2"
                            value={orientacion.materiaInteresante2}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Física"
                        />
                    </FormField>
                    <FormField label="3° Materia interesante">
                        <input
                            name="materiaInteresante3"
                            value={orientacion.materiaInteresante3}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Historia"
                        />
                    </FormField>
                </div>

                <FormField label="¿Por qué te interesan estas materias?">
                    <textarea
                        name="motivoMateriasInteresantes"
                        value={orientacion.motivoMateriasInteresantes}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={3}
                        placeholder="Explica qué te atrae de estas materias..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.4</span>
                    <span className="section-text">Materias Menos Interesantes</span>
                </div>

                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Indica las materias que te resultaron menos interesantes (por orden de preferencia)
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Materia menos interesante">
                        <input
                            name="materiaDesinteresante1"
                            value={orientacion.materiaDesinteresante1}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Literatura"
                        />
                    </FormField>
                    <FormField label="2° Materia menos interesante">
                        <input
                            name="materiaDesinteresante2"
                            value={orientacion.materiaDesinteresante2}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Química"
                        />
                    </FormField>
                    <FormField label="3° Materia menos interesante">
                        <input
                            name="materiaDesinteresante3"
                            value={orientacion.materiaDesinteresante3}
                            onChange={handleChange}
                            className="input-academic"
                            placeholder="Ej. Biología"
                        />
                    </FormField>
                </div>

                <FormField label="¿Por qué no te interesan estas materias?">
                    <textarea
                        name="motivoMateriasDesinteresantes"
                        value={orientacion.motivoMateriasDesinteresantes}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={3}
                        placeholder="Explica por qué no te atraen..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.5</span>
                    <span className="section-text">Experiencias Escolares</span>
                </div>

                <FormField label="Mayores satisfacciones durante la escuela">
                    <textarea
                        name="satisfaccionesEscuela"
                        value={orientacion.satisfaccionesEscuela}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Ej. Ganar un concurso, hacer buenos amigos, aprobar una materia difícil..."
                    />
                </FormField>

                <FormField label="Relación con tus compañeros">
                    <textarea
                        name="relacionCompaneros"
                        value={orientacion.relacionCompaneros}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={3}
                        placeholder="Describe cómo es tu relación con tus compañeros..."
                    />
                </FormField>

                <FormField label="Relación con tus profesores">
                    <textarea
                        name="relacionProfesores"
                        value={orientacion.relacionProfesores}
                        onChange={handleChange}
                        className="textarea-academic"
                        rows={3}
                        placeholder="Describe cómo es tu relación con tus profesores..."
                    />
                </FormField>
            </section>
        </>
    );
};