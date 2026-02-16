// src/utils/calculos.ts

export const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

export const calcularTotal = (valores: number[]): number => {
  return valores.reduce((sum, val) => sum + val, 0);
};

export const interpretarResultado = (total: number, tipo: 'estres' | 'ansiedad' | 'depresion') => {
  if (tipo === 'estres') {
    if (total <= 10) return { texto: 'Sin estrés', color: '#10b981' };
    if (total <= 19) return { texto: 'Estrés ligero/menor', color: '#f59e0b' };
    if (total <= 25) return { texto: 'Estrés moderado', color: '#ef4444' };
    return { texto: 'Estrés severo', color: '#dc2626' };
  } else {
    if (total <= 7) return { texto: `Sin ${tipo}`, color: '#10b981' };
    if (total <= 13) return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ligera/menor`, color: '#f59e0b' };
    if (total <= 18) return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} moderada`, color: '#ef4444' };
    return { texto: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} muy severa`, color: '#dc2626' };
  }
};