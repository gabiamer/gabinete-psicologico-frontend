// src/components/orientacion/FormDatosPersonalesOV.tsx
import React from 'react';
import { FormField } from '../shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OrientacionVocacionalData, FormData } from '../../types/types';

interface Props {
    formData: FormData;
    orientacion: OrientacionVocacionalData;
    escuela?: string;
    handleChangeFormData: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    handleChangeOrientacion: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onEscuelaChange?: (value: string) => void;
}

export const FormDatosPersonalesOV: React.FC<Props> = ({
    formData,
    orientacion,
    escuela,
    handleChangeFormData,
    handleChangeOrientacion,
    onEscuelaChange,
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
                        <Input
                            type="text"
                            value={`${formData.primerNombre} ${formData.segundoNombre || ''} ${formData.apellidoPaterno} ${formData.apellidoMaterno || ''}`.trim()}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField label="Fecha de nacimiento" required>
                        <Input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChangeFormData} />
                    </FormField>

                    <FormField label="Edad" required>
                        <Input type="number" name="edad" value={formData.edad} readOnly disabled />
                    </FormField>

                    <FormField label="Domicilio" required>
                        <Input type="text" name="domicilio" value={formData.domicilio} onChange={handleChangeFormData} />
                    </FormField>

                    <FormField label="Correo electrónico">
                        <Input type="email" name="celular" value={formData.celular} onChange={handleChangeFormData} placeholder="correo@ejemplo.com" />
                    </FormField>

                    <FormField label="Escuela / Colegio">
                        {onEscuelaChange ? (
                            <Input type="text" value={escuela ?? ''} onChange={(e) => onEscuelaChange(e.target.value)} placeholder="Nombre de la escuela o colegio" />
                        ) : (
                            <Input type="text" value={escuela ?? ''} readOnly disabled />
                        )}
                    </FormField>

                    <FormField label="Año que cursa" required>
                        <Input type="number" name="semestre" value={formData.semestre} onChange={handleChangeFormData} min={1} max={14} />
                    </FormField>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.1</span>
                    <span className="section-text">Motivo de Consulta</span>
                </div>
                <FormField label="Describe el motivo por el cual solicitas orientación vocacional" required>
                    <Textarea name="motivoConsulta" value={orientacion.motivoConsulta} onChange={handleChangeOrientacion} rows={4} placeholder="Ej. Tengo dudas sobre qué carrera estudiar..." />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.2</span>
                    <span className="section-text">Otras Actividades / Hobbies</span>
                </div>
                <FormField label="Describe tus actividades favoritas, pasatiempos e intereses">
                    <Textarea name="actividadesHobbies" value={orientacion.actividadesHobbies} onChange={handleChangeOrientacion} rows={4} placeholder="Ej. Leer, hacer deporte, tocar guitarra..." />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.3</span>
                    <span className="section-text">Cualidades y Defectos</span>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-foreground">Cualidades</h4>
                        <FormField label="1. Primera cualidad">
                            <Input name="cualidad1" value={orientacion.cualidad1} onChange={handleChangeOrientacion} placeholder="Ej. Responsable" />
                        </FormField>
                        <FormField label="2. Segunda cualidad">
                            <Input name="cualidad2" value={orientacion.cualidad2} onChange={handleChangeOrientacion} placeholder="Ej. Creativo" />
                        </FormField>
                        <FormField label="3. Tercera cualidad">
                            <Input name="cualidad3" value={orientacion.cualidad3} onChange={handleChangeOrientacion} placeholder="Ej. Empático" />
                        </FormField>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-foreground">Defectos</h4>
                        <FormField label="1. Primer defecto">
                            <Input name="defecto1" value={orientacion.defecto1} onChange={handleChangeOrientacion} placeholder="Ej. Impaciente" />
                        </FormField>
                        <FormField label="2. Segundo defecto">
                            <Input name="defecto2" value={orientacion.defecto2} onChange={handleChangeOrientacion} placeholder="Ej. Tímido" />
                        </FormField>
                        <FormField label="3. Tercer defecto">
                            <Input name="defecto3" value={orientacion.defecto3} onChange={handleChangeOrientacion} placeholder="Ej. Distraído" />
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
                    <Textarea name="temasInteres" value={orientacion.temasInteres} onChange={handleChangeOrientacion} rows={3} placeholder="Ej. Tecnología, historia, ciencia..." />
                </FormField>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <span className="section-number">1.5</span>
                    <span className="section-text">Ocupación de Personas Significativas</span>
                </div>
                <div className="grid-2-cols">
                    <FormField label="Ocupación de la madre">
                        <Input name="ocupacionMadre" value={orientacion.ocupacionMadre} onChange={handleChangeOrientacion} placeholder="Ej. Profesora" />
                    </FormField>
                    <FormField label="Ocupación del padre">
                        <Input name="ocupacionPadre" value={orientacion.ocupacionPadre} onChange={handleChangeOrientacion} placeholder="Ej. Ingeniero" />
                    </FormField>
                </div>
                <FormField label="Otras personas significativas y sus ocupaciones">
                    <Textarea name="ocupacionOtros" value={orientacion.ocupacionOtros} onChange={handleChangeOrientacion} rows={2} placeholder="Ej. Hermano mayor - Médico, Tío - Arquitecto..." />
                </FormField>
            </section>
        </>
    );
};
