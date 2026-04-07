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
    if (total <= 12) return { texto: 'Sin estrés', color: '#10b981' };
    if (total <= 21) return { texto: 'Estrés ligera/menor', color: '#f59e0b' };
    if (total <= 29) return { texto: 'Estrés moderada', color: '#ef4444' };
    return { texto: 'Estrés severa', color: '#dc2626' };
  } else if (tipo === 'ansiedad') {
    if (total <= 12) return { texto: 'Sin ansiedad', color: '#10b981' };
    if (total <= 21) return { texto: 'Ansiedad ligera/menor', color: '#f59e0b' };
    if (total <= 29) return { texto: 'Ansiedad moderada', color: '#ef4444' };
    return { texto: 'Ansiedad muy severa', color: '#dc2626' };
  } else {
    if (total <= 12) return { texto: 'Sin depresión', color: '#10b981' };
    if (total <= 21) return { texto: 'Depresión ligera/menor', color: '#f59e0b' };
    if (total <= 29) return { texto: 'Depresión moderada', color: '#ef4444' };
    return { texto: 'Depresión muy severa', color: '#dc2626' };
  }
};