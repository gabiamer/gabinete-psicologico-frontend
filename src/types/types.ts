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
