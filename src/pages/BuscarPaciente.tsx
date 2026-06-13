// src/pages/BuscarPaciente.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pacienteService } from '../services/pacienteService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import './RegistroPaciente.css';

const BuscarPaciente: React.FC = () => {
  const navigate = useNavigate();
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [fechaBusqueda, setFechaBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const buscarPaciente = async () => {
    if (!terminoBusqueda.trim() && !fechaBusqueda) {
      setError('Ingrese un nombre, celular o seleccione una fecha');
      return;
    }
    setBuscando(true);
    setError('');
    setMensaje('');
    try {
      const pacientes = await pacienteService.buscar(terminoBusqueda, fechaBusqueda);
      setResultados(pacientes);
      if (pacientes.length === 0) {
        setMensaje('No se encontró ningún paciente con los criterios especificados.');
      }
    } catch (err: any) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar paciente');
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setFechaBusqueda('');
    setResultados([]);
    setMensaje('');
    setError('');
  };

  const verPaciente = (paciente: any) => {
    if (paciente.tipo === 'universitario') {
      navigate(`/pacientes/${paciente.id}/historial`);
    } else {
      navigate(`/pacientes-externos/${paciente.id}/detalle-orientacion`);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="card-academic">
        <header className="banner-header">
          <h1>Búsqueda de Paciente</h1>
          <p>Verifique si el paciente ya está registrado antes de crear una nueva ficha</p>
        </header>

        {mensaje && (
          <Alert className="mx-10 mt-5">
            <AlertDescription>{mensaje}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mx-10 mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="form-content">
          <section className="form-section">
            <div className="section-title">
              <span className="section-number">🔍</span>
              <span className="section-text">Buscar Paciente Existente</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Nombre, Celular o Correo
                </label>
                <Input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
                  placeholder="Ej. Juan Pérez, 70123456, correo@ejemplo.com"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Filtrar por fecha de sesión
                </label>
                <Input
                  type="date"
                  value={fechaBusqueda}
                  onChange={(e) => setFechaBusqueda(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Busca pacientes que tuvieron sesiones en esta fecha
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                {(terminoBusqueda || fechaBusqueda) && (
                  <Button type="button" variant="secondary" onClick={limpiarBusqueda}>
                    Limpiar
                  </Button>
                )}
                <Button type="button" onClick={buscarPaciente} disabled={buscando}>
                  {buscando ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
          </section>

          {/* RESULTADOS */}
          {resultados.length > 0 && (
            <section className="form-section mt-8">
              <div className="section-title">
                <span className="section-number">📋</span>
                <span className="section-text">Resultados Encontrados ({resultados.length})</span>
              </div>

              <div className="flex flex-col gap-3">
                {resultados.map((paciente) => (
                  <div
                    key={`${paciente.tipo}-${paciente.id}`}
                    className="resultado-item resultado-header"
                  >
                    <div className="resultado-info">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-base text-foreground">
                          {paciente.paciente?.person?.primerNombre || ''}{' '}
                          {paciente.paciente?.person?.segundoNombre || ''}{' '}
                          {paciente.paciente?.person?.apellidoPaterno || ''}{' '}
                          {paciente.paciente?.person?.apellidoMaterno || ''}
                        </span>
                        <Badge
                          variant={paciente.tipo === 'universitario' ? 'default' : 'secondary'}
                          className={paciente.tipo === 'universitario'
                            ? 'bg-primary/15 text-primary border-primary/30'
                            : 'bg-accent/20 text-accent-foreground border-accent/40'
                          }
                        >
                          {paciente.tipo === 'universitario' ? '🎓 Universitario' : '📋 Orientación Vocacional'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {paciente.tipo === 'universitario' ? (
                          <>Celular: {paciente.paciente?.person?.celular || 'N/A'} | Edad: {paciente.paciente?.edad || 'N/A'} años | Semestre: {paciente.semestre || 'N/A'}</>
                        ) : (
                          <>Celular: {paciente.paciente?.person?.celular || 'N/A'} | Edad: {paciente.paciente?.edad || 'N/A'} años | Escuela: {paciente.escuela || 'N/A'} | Año: {paciente.anio || 'N/A'}</>
                        )}
                      </div>
                    </div>
                    <div className="resultado-acciones">
                      <Button type="button" onClick={() => verPaciente(paciente)}>
                        {paciente.tipo === 'universitario' ? 'Ver Historial →' : 'Ver Entrevista →'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BOTONES DE REGISTRO */}
          <div className="actions-footer mt-8">
            <Button
              type="button"
              onClick={() => navigate('/registro-paciente')}
              className="min-w-56 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              + Registrar Paciente Universitario
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/registro-paciente-externo')}
              className="min-w-56 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              📋 Orientación Vocacional
            </Button>
          </div>

          {/* SECCIÓN INFORMATIVA */}
          <div className="mt-6 p-5 bg-secondary rounded-lg border border-border">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <h4 className="text-sm font-semibold text-emerald-600 mb-2">
                  🎓 Paciente Universitario
                </h4>
                <p className="text-sm text-muted-foreground">
                  Para estudiantes de la universidad que necesitan atención psicológica regular (entrevista inicial, sesiones, seguimiento).
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                  📋 Orientación Vocacional
                </h4>
                <p className="text-sm text-muted-foreground">
                  Para personas externas que buscan orientación sobre qué carrera estudiar (entrevista única).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscarPaciente;
