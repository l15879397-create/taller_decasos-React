import { useState, useEffect } from 'react';

/**
 * Hook Nivel 2: Difícil la actualización de un valor que cambia rápidamente
 * @param valor Valor genérico a debounciar
 * @param retardo Tiempo de espera en milisegundos (por defecto 400ms)
 * @returns El valor diferido
 */
export function useDebounce<T>(valor: T, retardo: number = 400): T {
  const [valorDiferido, setValorDiferido] = useState<T>(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDiferido(valor);
    }, retardo);

    return () => {
      clearTimeout(temporizador);
    };
  }, [valor, retardo]);

  return valorDiferido;
}