// src/components/orientacion/FormDatosPersonalesOV.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { OrientacionVocacionalData, FormData } from '../../types/types';

interface Props {
    formData: FormData;
    orientacion: OrientacionVocacionalData;
    handleChangeFormData: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;

    handleChangeOrientacion: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormDatosPersonalesOV: React.FC<Props> = ({
    formData,
    orientacion,
    handleChangeFormData,
    handleChangeOrientacion
}) => {
    return (
        <>
            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">01</span>
                    <span className="section-text">Datos Personales</span>
                </div>

                <div className="grid-2-cols">
                    <FormField label="Nombre completo" required>
                        <input
                            type="text"
                            value={`${formData.primerNombre} ${formData.segundoNombre || ''} ${formData.apellidoPaterno} ${formData.apellidoMaterno || ''}`.trim()}
                            readOnly
                            className="input-academic"
                            style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                        />
                    </FormField>

                    <FormField label="Sexo" required>
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChangeFormData}
                            className="input-academic"
                        >
                            <option value={1}>Masculino</option>
                            <option value={2}>Femenino</option>
                            <option value={3}>Otro</option>
                        </select>
                    </FormField>

                    <FormField label="Fecha de nacimiento" required>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChangeFormData}
                            className="input-academic"
                        />
                    </FormField>

                    <FormField label="Edad" required>
                        <input
                            type="number"
                            name="edad"
                            value={formData.edad}
                            readOnly
                            className="input-academic"
                            style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                        />
                    </FormField>

                    <FormField label="Domicilio" required>
                        <input
                            type="text"
                            name="domicilio"
                            value={formData.domicilio}
                            onChange={handleChangeFormData}
                            className="input-academic"
                        />
                    </FormField>

                    <FormField label="Correo electrónico">
                        <input
                            type="email"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChangeFormData}
                            className="input-academic"
                            placeholder="correo@ejemplo.com"
                        />
                    </FormField>

                    <FormField label="Escuela">
                        <input
                            type="text"
                            className="input-academic"
                            defaultValue="Universidad Autónoma Juan Misael Saracho"
                            readOnly
                            style={{ backgroundColor: '#f1f5f9' }}
                        />
                    </FormField>

                    <FormField label="Año que cursa" required>
                        <input
                            type="number"
                            name="semestre"
                            value={formData.semestre}
                            onChange={handleChangeFormData}
                            className="input-academic"
                            min="1"
                            max="14"
                        />
                    </FormField>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.1</span>
                    <span className="section-text">Motivo de Consulta</span>
                </div>
                <FormField label="Describe el motivo por el cual solicitas orientación vocacional" required>
                    <textarea
                        name="motivoConsulta"
                        value={orientacion.motivoConsulta}
                        onChange={handleChangeOrientacion}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Ej. Tengo dudas sobre qué carrera estudiar..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.2</span>
                    <span className="section-text">Otras Actividades / Hobbies</span>
                </div>
                <FormField label="Describe tus actividades favoritas, pasatiempos e intereses">
                    <textarea
                        name="actividadesHobbies"
                        value={orientacion.actividadesHobbies}
                        onChange={handleChangeOrientacion}
                        className="textarea-academic"
                        rows={4}
                        placeholder="Ej. Leer, hacer deporte, tocar guitarra..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.3</span>
                    <span className="section-text">Cualidades y Defectos</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                        <h4 style={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>Cualidades</h4>
                        <FormField label="1. Primera cualidad">
                            <input
                                name="cualidad1"
                                value={orientacion.cualidad1}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Responsable"
                            />
                        </FormField>
                        <FormField label="2. Segunda cualidad">
                            <input
                                name="cualidad2"
                                value={orientacion.cualidad2}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Creativo"
                            />
                        </FormField>
                        <FormField label="3. Tercera cualidad">
                            <input
                                name="cualidad3"
                                value={orientacion.cualidad3}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Empático"
                            />
                        </FormField>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>Defectos</h4>
                        <FormField label="1. Primer defecto">
                            <input
                                name="defecto1"
                                value={orientacion.defecto1}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Impaciente"
                            />
                        </FormField>
                        <FormField label="2. Segundo defecto">
                            <input
                                name="defecto2"
                                value={orientacion.defecto2}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Tímido"
                            />
                        </FormField>
                        <FormField label="3. Tercer defecto">
                            <input
                                name="defecto3"
                                value={orientacion.defecto3}
                                onChange={handleChangeOrientacion}
                                className="input-academic"
                                placeholder="Ej. Distraído"
                            />
                        </FormField>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.4</span>
                    <span className="section-text">Temas de Interés</span>
                </div>
                <FormField label="¿Qué temas te gusta investigar o conocer más?">
                    <textarea
                        name="temasInteres"
                        value={orientacion.temasInteres}
                        onChange={handleChangeOrientacion}
                        className="textarea-academic"
                        rows={3}
                        placeholder="Ej. Tecnología, historia, ciencia..."
                    />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.5</span>
                    <span className="section-text">Ocupación de Personas Significativas</span>
                </div>
                <div className="grid-2-cols">
                    <FormField label="Ocupación de la madre">
                        <input
                            name="ocupacionMadre"
                            value={orientacion.ocupacionMadre}
                            onChange={handleChangeOrientacion}
                            className="input-academic"
                            placeholder="Ej. Profesora"
                        />
                    </FormField>
                    <FormField label="Ocupación del padre">
                        <input
                            name="ocupacionPadre"
                            value={orientacion.ocupacionPadre}
                            onChange={handleChangeOrientacion}
                            className="input-academic"
                            placeholder="Ej. Ingeniero"
                        />
                    </FormField>
                </div>
                <FormField label="Otras personas significativas y sus ocupaciones">
                    <textarea
                        name="ocupacionOtros"
                        value={orientacion.ocupacionOtros}
                        onChange={handleChangeOrientacion}
                        className="textarea-academic"
                        rows={2}
                        placeholder="Ej. Hermano mayor - Médico, Tío - Arquitecto..."
                    />
                </FormField>
            </section>
        </>
    );
};