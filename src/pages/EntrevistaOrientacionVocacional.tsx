// src/pages/EntrevistaOrientacionVocacional.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormData, OrientacionVocacionalData, Psicologo } from '../types/types';
import { pacienteService } from '../services/pacienteService';
import { orientacionService } from '../services/orientacionService';
import { calcularEdad } from '../utils/calculos';
import { FormDatosPersonalesOV } from '../components/orientacion/FormDatosPersonalesOV';
import { FormEstudios } from '../components/orientacion/FormEstudios';
import { FormObjetivosProfesionales } from '../components/orientacion/FormObjetivosProfesionales';
import './RegistroPaciente.css';
import { pacienteExternoService } from '../services/pacienteExternoService';

const PASOS = [
    { numero: 1, label: 'Datos Personales' },
    { numero: 2, label: 'Estudios' },
    { numero: 3, label: 'Objetivos Profesionales' }
];

const EntrevistaOrientacionVocacional: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [paso, setPaso] = useState<1 | 2 | 3>(1);
    const [pacienteCargado, setPacienteCargado] = useState(false);

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

    const [orientacion, setOrientacion] = useState<OrientacionVocacionalData>({
        motivoConsulta: '',
        actividadesHobbies: '',
        cualidad1: '',
        cualidad2: '',
        cualidad3: '',
        defecto1: '',
        defecto2: '',
        defecto3: '',
        temasInteres: '',
        ocupacionMadre: '',
        ocupacionPadre: '',
        ocupacionOtros: '',
        mismaPrimaria: '',
        motivoCambioPrimaria: '',
        mismaSecundaria: '',
        motivoCambioSecundaria: '',
        materiaInteresante1: '',
        materiaInteresante2: '',
        materiaInteresante3: '',
        motivoMateriasInteresantes: '',
        materiaDesinteresante1: '',
        materiaDesinteresante2: '',
        materiaDesinteresante3: '',
        motivoMateriasDesinteresantes: '',
        satisfaccionesEscuela: '',
        relacionCompaneros: '',
        relacionProfesores: '',
        planDespuesPreparatoria: '',
        motivoPlanFuturo: '',
        carreraInteres1: '',
        carreraInteres2: '',
        carreraInteres3: '',
        carreraNoInteres1: '',
        carreraNoInteres2: '',
        carreraNoInteres3: '',
        factorEconomico: '',
        apoyoFamiliar: '',
        visionCincoAnos: '',
        tipoTrabajosDeseados: '',
        observacionesEntrevistador: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Cargar datos del paciente si viene de historial
    useEffect(() => {
        if (id) {
            cargarPaciente();
        }
    }, [id]);

    const cargarPaciente = async () => {
        try {
            // usar pacienteExternoService en lugar de pacienteService
            const data = await pacienteExternoService.obtenerPorId(Number(id));
            setFormData({
                primerNombre: data.paciente?.person?.primerNombre || '',
                segundoNombre: data.paciente?.person?.segundoNombre || '',
                apellidoPaterno: data.paciente?.person?.apellidoPaterno || '',
                apellidoMaterno: data.paciente?.person?.apellidoMaterno || '',
                celular: data.paciente?.person?.celular || '',
                fechaNacimiento: data.paciente?.fechaNacimiento || '',
                edad: data.paciente?.edad || '',
                genero: data.paciente?.genero || 1,
                domicilio: data.paciente?.domicilio || '',
                estadoCivil: data.paciente?.estadoCivil || 1,
                semestre: data.anio || 1,
                derivadoPor: data.escuela || '', 
                psicologoId: ''
            });
            setPacienteCargado(true);
        } catch (err) {
            console.error('Error cargando paciente:', err);
            setError('Error al cargar datos del paciente');
        }
    };

    const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const handleChangeOrientacion = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrientacion(prev => ({ ...prev, [name]: value }));
    };

    const validateStep1 = () => {
        if (!formData.primerNombre.trim()) {
            setError('El nombre es obligatorio');
            return false;
        }
        if (!formData.fechaNacimiento) {
            setError('La fecha de nacimiento es obligatoria');
            return false;
        }
        if (!orientacion.motivoConsulta.trim()) {
            setError('El motivo de consulta es obligatorio');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!orientacion.mismaPrimaria || !orientacion.mismaSecundaria) {
            setError('Completa la información sobre tus estudios');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!orientacion.planDespuesPreparatoria) {
            setError('Indica tus planes después de la preparatoria');
            return false;
        }
        return true;
    };

    const handleSubmitStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        if (!validateStep1()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setPaso(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmitStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        if (!validateStep2()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setPaso(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmitStep3 = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setMensaje('');
        setError('');
        setLoading(true);

        if (!validateStep3()) {
            setLoading(false);
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            await orientacionService.guardarEntrevista(Number(id), orientacion);
            setMensaje('¡Entrevista de orientación vocacional guardada exitosamente!');
            setTimeout(() => {
                navigate(`/pacientes/${id}/historial`);
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
            'Datos Personales y Motivación',
            'Trayectoria Educativa',
            'Objetivos y Proyección Profesional'
        ];
        return titulos[paso - 1];
    };

    const getSubtitulo = () => {
        const subtitulos = [
            'Información básica y razones de la consulta',
            'Experiencia académica previa',
            'Metas profesionales y visión de futuro'
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
                    <h1>Entrevista de Orientación Vocacional</h1>
                    <p>{getTitulo()}</p>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: '#64748b' }}>{getSubtitulo()}</p>
                </header>

                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {paso === 1 && (
                    <form onSubmit={handleSubmitStep1} className="form-content" noValidate>
                        <FormDatosPersonalesOV
                            formData={formData}
                            orientacion={orientacion}
                            handleChangeFormData={handleChangeFormData}
                            handleChangeOrientacion={handleChangeOrientacion}
                        />
                        <div className="actions-footer">
                            <button type="button" onClick={() => navigate(-1)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-submit">
                                Continuar
                            </button>
                        </div>
                    </form>
                )}

                {paso === 2 && (
                    <form onSubmit={handleSubmitStep2} className="form-content" noValidate>
                        <FormEstudios
                            orientacion={orientacion}
                            handleChange={handleChangeOrientacion}
                        />
                        <div className="actions-footer">
                            <button type="button" onClick={() => setPaso(1)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                                Volver
                            </button>
                            <button type="submit" className="btn-submit">
                                Continuar
                            </button>
                        </div>
                    </form>
                )}

                {paso === 3 && (
                    <form onSubmit={handleSubmitStep3} className="form-content" noValidate>
                        <FormObjetivosProfesionales
                            orientacion={orientacion}
                            handleChange={handleChangeOrientacion}
                        />
                        <div className="actions-footer">
                            <button type="button" onClick={() => setPaso(2)} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                                Volver
                            </button>
                            <button type="submit" disabled={loading || submitting} className="btn-submit">
                                {loading ? 'Guardando...' : '✓ Finalizar Entrevista'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EntrevistaOrientacionVocacional;