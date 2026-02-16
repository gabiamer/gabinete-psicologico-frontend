// src/types/types.ts
export enum Genero {
  MASCULINO = 1,
  FEMENINO = 2,
  OTRO = 3
}

export enum EstadoCivil {
  SOLTERO = 1,
  CASADO = 2,
  DIVORCIADO = 3,
  VIUDO = 4,
  CONCUBINATO = 5
}

export interface Psicologo {
  id: number;
  person: {
    primerNombre: string;
    apellidoPaterno: string;
  };
  ocupacion: string;
}

export interface FormData {
  primerNombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  celular: string;
  fechaNacimiento: string;
  edad: number | '';
  genero: number;
  domicilio: string;
  estadoCivil: number;
  semestre: number;
  derivadoPor: string;
  psicologoId: number | '';
}

export interface AntecedentesData {
  // Situación actual
  ultimaVezBien: string;
  desarrolloSintomas: string;
  antecedentesFamiliares: string;

  // Funciones orgánicas
  sueno: string;
  apetito: string;
  sed: string;
  defecacion: string;

  
  // Historia familiar
  conQuienVive: string;
  personaReferencia: string;
  celularReferencia: string;
  
  // Padre
  nombrePadre: string;
  ocupacionPadre: string;
  enfermedadPadre: string;
  relacionPadre: string;
  
  // Madre
  nombreMadre: string;
  ocupacionMadre: string;
  enfermedadMadre: string;
  relacionMadre: string;
  
  // Hermanos
  numeroHermanos: number | '';
  relatoHermanos: string;

  // Universidad
  nivelSatisfaccion: number;
  rendimiento: number;
  estresUniversitario: number;
  interaccionSocial: number;
  cambioCarreras: string;
  motivosCambio: string;
  relatoUniversidad: string;
  
  // Hábitos
  consumoAlcohol: string;
  frecuenciaAlcohol: number;  // 1-5
  
  consumoTabaco: string;
  frecuenciaTabaco: number;   // 1-5
  
  consumoDrogas: string;
  frecuenciaDrogas: number;   // 1-5
  
  relatoAcusacionDetencion: string;

  acuerdosEstablecidos: string;
  proximaSesionFecha: string;
  proximaSesionHora: string;
  
}


export interface OrientacionVocacionalData {
  // Datos personales
  motivoConsulta: string;
  actividadesHobbies: string;
  cualidad1: string;
  cualidad2: string;
  cualidad3: string;
  defecto1: string;
  defecto2: string;
  defecto3: string;
  temasInteres: string;
  ocupacionMadre: string;
  ocupacionPadre: string;
  ocupacionOtros: string;

  // Estudios
  mismaPrimaria: string; // "Si" o "No"
  motivoCambioPrimaria: string;
  mismaSecundaria: string; // "Si" o "No"
  motivoCambioSecundaria: string;
  
  materiaInteresante1: string;
  materiaInteresante2: string;
  materiaInteresante3: string;
  motivoMateriasInteresantes: string;
  
  materiaDesinteresante1: string;
  materiaDesinteresante2: string;
  materiaDesinteresante3: string;
  motivoMateriasDesinteresantes: string;
  
  satisfaccionesEscuela: string;
  relacionCompaneros: string;
  relacionProfesores: string;

  // Objetivos profesionales
  planDespuesPreparatoria: string; // "estudiar", "trabajar", "estudiar_trabajar", "ninguno"
  motivoPlanFuturo: string;
  
  carreraInteres1: string;
  carreraInteres2: string;
  carreraInteres3: string;
  
  carreraNoInteres1: string;
  carreraNoInteres2: string;
  carreraNoInteres3: string;
  
  factorEconomico: string;
  apoyoFamiliar: string;
  visionCincoAnos: string;
  tipoTrabajosDeseados: string;
  
  observacionesEntrevistador: string;
}