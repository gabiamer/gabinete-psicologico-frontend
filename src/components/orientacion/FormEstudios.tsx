// src/components/orientacion/FormEstudios.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OrientacionVocacionalData } from '../../types/types';

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
                    <div className="flex gap-6 mt-2">
                        {['Si', 'No'].map((val) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                <input
                                    type="radio"
                                    name="mismaPrimaria"
                                    value={val}
                                    checked={orientacion.mismaPrimaria === val}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[color:var(--accent)]"
                                />
                                <span>{val === 'Si' ? 'Sí' : 'No'}</span>
                            </label>
                        ))}
                    </div>
                </FormField>

                {orientacion.mismaPrimaria === 'No' && (
                    <FormField label="Si cambiaste, ¿por qué?">
                        <Textarea
                            name="motivoCambioPrimaria"
                            value={orientacion.motivoCambioPrimaria}
                            onChange={handleChange}
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
                    <div className="flex gap-6 mt-2">
                        {['Si', 'No'].map((val) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                <input
                                    type="radio"
                                    name="mismaSecundaria"
                                    value={val}
                                    checked={orientacion.mismaSecundaria === val}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[color:var(--accent)]"
                                />
                                <span>{val === 'Si' ? 'Sí' : 'No'}</span>
                            </label>
                        ))}
                    </div>
                </FormField>

                {orientacion.mismaSecundaria === 'No' && (
                    <FormField label="Si cambiaste, ¿por qué?">
                        <Textarea
                            name="motivoCambioSecundaria"
                            value={orientacion.motivoCambioSecundaria}
                            onChange={handleChange}
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

                <p className="mb-4 text-muted-foreground text-sm">
                    Indica las materias que te resultaron más interesantes (por orden de preferencia)
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Materia más interesante">
                        <Input name="materiaInteresante1" value={orientacion.materiaInteresante1} onChange={handleChange} placeholder="Ej. Matemáticas" />
                    </FormField>
                    <FormField label="2° Materia interesante">
                        <Input name="materiaInteresante2" value={orientacion.materiaInteresante2} onChange={handleChange} placeholder="Ej. Física" />
                    </FormField>
                    <FormField label="3° Materia interesante">
                        <Input name="materiaInteresante3" value={orientacion.materiaInteresante3} onChange={handleChange} placeholder="Ej. Historia" />
                    </FormField>
                </div>

                <FormField label="¿Por qué te interesan estas materias?">
                    <Textarea name="motivoMateriasInteresantes" value={orientacion.motivoMateriasInteresantes} onChange={handleChange} rows={3} placeholder="Explica qué te atrae de estas materias..." />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.4</span>
                    <span className="section-text">Materias Menos Interesantes</span>
                </div>

                <p className="mb-4 text-muted-foreground text-sm">
                    Indica las materias que te resultaron menos interesantes (por orden de preferencia)
                </p>

                <div className="grid-2-cols">
                    <FormField label="1° Materia menos interesante">
                        <Input name="materiaDesinteresante1" value={orientacion.materiaDesinteresante1} onChange={handleChange} placeholder="Ej. Literatura" />
                    </FormField>
                    <FormField label="2° Materia menos interesante">
                        <Input name="materiaDesinteresante2" value={orientacion.materiaDesinteresante2} onChange={handleChange} placeholder="Ej. Química" />
                    </FormField>
                    <FormField label="3° Materia menos interesante">
                        <Input name="materiaDesinteresante3" value={orientacion.materiaDesinteresante3} onChange={handleChange} placeholder="Ej. Biología" />
                    </FormField>
                </div>

                <FormField label="¿Por qué no te interesan estas materias?">
                    <Textarea name="motivoMateriasDesinteresantes" value={orientacion.motivoMateriasDesinteresantes} onChange={handleChange} rows={3} placeholder="Explica por qué no te atraen..." />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">2.5</span>
                    <span className="section-text">Experiencias Escolares</span>
                </div>

                <FormField label="Mayores satisfacciones durante la escuela">
                    <Textarea name="satisfaccionesEscuela" value={orientacion.satisfaccionesEscuela} onChange={handleChange} rows={4} placeholder="Ej. Ganar un concurso, hacer buenos amigos, aprobar una materia difícil..." />
                </FormField>

                <FormField label="Relación con tus compañeros">
                    <Textarea name="relacionCompaneros" value={orientacion.relacionCompaneros} onChange={handleChange} rows={3} placeholder="Describe cómo es tu relación con tus compañeros..." />
                </FormField>

                <FormField label="Relación con tus profesores">
                    <Textarea name="relacionProfesores" value={orientacion.relacionProfesores} onChange={handleChange} rows={3} placeholder="Describe cómo es tu relación con tus profesores..." />
                </FormField>
            </section>
        </>
    );
};
