// src/pages/HistorialPaciente.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import { sesionService } from '../services/sesionService';
import './RegistroPaciente.css';

const HistorialPaciente: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [paciente, setPaciente] = useState<any>(null);
    const [sesiones, setSesiones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarDatos();
    }, [id, location.key]); // Agregar location.key para recargar cuando cambie la ruta

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [pacienteData, sesionesData] = await Promise.all([
                pacienteService.obtenerPorId(Number(id)),
                sesionService.obtenerPorPaciente(Number(id))
            ]);
            
            console.log('Sesiones cargadas:', sesionesData); // Debug
            
            setPaciente(pacienteData);
            setSesiones(Array.isArray(sesionesData) ? sesionesData : []);
        } catch (err: any) {
            console.error('Error cargando datos:', err);
            setError('Error al cargar el historial del paciente');
        } finally {
            setLoading(false);
        }
    };

    const irANuevaSesion = () => {
        navigate(`/pacientes/${id}/nueva-sesion`);
    };

    if (loading) {
        return (
            <div className="registro-wrapper">
                <div className="card-academic">
                    <p style={{ textAlign: 'center', padding: '40px' }}>Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !paciente) {
        return (
            <div className="registro-wrapper">
                <div className="card-academic">
                    <div className="alert alert-error">{error || 'Paciente no encontrado'}</div>
                    <button onClick={() => navigate('/buscar-paciente')} className="btn-submit">
                        Volver a búsqueda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="registro-wrapper">
            <div className="card-academic">
                <header className="banner-header">
                    <h1>Historial Clínico</h1>
                    <p>
                        {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.apellidoPaterno} - Semestre {paciente.semestre}
                    </p>
                </header>

                {/* DATOS DEL PACIENTE */}
                <section className="form-section" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px' }}>
                    <div className="section-title">
                        <span className="section-number">📋</span>
                        <span className="section-text">Información del Paciente</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Nombre completo:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px' }}>
                                {paciente.paciente?.person?.primerNombre} {paciente.paciente?.person?.segundoNombre}{' '}
                                {paciente.paciente?.person?.apellidoPaterno} {paciente.paciente?.person?.apellidoMaterno}
                            </p>
                        </div>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Edad:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px' }}>{paciente.paciente?.edad} años</p>
                        </div>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Celular:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px' }}>{paciente.paciente?.person?.celular}</p>
                        </div>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Semestre:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px' }}>{paciente.semestre}</p>
                        </div>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Psicólogo asignado:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px' }}>
                                {paciente.psicologo?.person?.primerNombre} {paciente.psicologo?.person?.apellidoPaterno}
                            </p>
                        </div>
                        <div>
                            <span style={{ fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Total de sesiones:</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                                {sesiones.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* LISTA DE SESIONES */}
                <section className="form-section" style={{ marginTop: '32px' }}>
                    <div className="section-title">
                        <span className="section-number">📅</span>
                        <span className="section-text">Sesiones Registradas</span>
                    </div>

                    {sesiones.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            <p>No hay sesiones registradas aún.</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>Haga clic en "Nueva Sesión" para comenzar.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            {/* Ordenar sesiones de más reciente a más antigua */}
                            {[...sesiones].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((sesion, index) => {
                                // Parsear acuerdos para obtener el número de sesión
                                let numeroSesion = sesiones.length - index;
                                if (sesion.acuerdos) {
                                    try {
                                        const acuerdosData = typeof sesion.acuerdos === 'string' 
                                            ? JSON.parse(sesion.acuerdos) 
                                            : sesion.acuerdos;
                                        if (acuerdosData.numeroSesion) {
                                            numeroSesion = acuerdosData.numeroSesion;
                                        }
                                    } catch (e) {
                                        console.error('Error parseando acuerdos:', e);
                                    }
                                }

                                return (
                                    <div
                                        key={sesion.id}
                                        style={{
                                            padding: '16px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '8px',
                                            backgroundColor: '#ffffff'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '16px', color: '#0f172a' }}>
                                                    Sesión #{numeroSesion}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                                                    Fecha: {new Date(sesion.fecha).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - Tipo: {sesion.tipo}
                                                </div>
                                            </div>
                                            <button
                                                className="btn-submit"
                                                style={{ minWidth: '100px', height: '36px' }}
                                                onClick={() => navigate(`/sesiones/${sesion.id}`)}
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* BOTÓN NUEVA SESIÓN */}
                <div className="actions-footer" style={{ marginTop: '32px' }}>
                    <button onClick={() => navigate('/buscar-paciente')} className="btn-submit" style={{ backgroundColor: '#64748b' }}>
                        ← Volver a búsqueda
                    </button>
                    <button onClick={irANuevaSesion} className="btn-submit" style={{ backgroundColor: '#10b981' }}>
                        + Nueva Sesión
                    </button>
                </div>

            </div>
        </div>
    );
};

export default HistorialPaciente;