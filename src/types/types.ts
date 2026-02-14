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
  ultimaVezBien: string;
  desarrolloSintomas: string;
  antecedentesFamiliares: string;
  sueno: string;
  apetito: string;
  sed: string;
  defecacion: string;
}
