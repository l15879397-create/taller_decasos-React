import { useState, useCallback } from 'react';

/**
 * Hook Nivel 1: Alterna un estado booleano
 * @param valorInicial booleano inicial (por defecto false)
 * @returns Tupla tipada [valor, alternar] as const
 */
export function useToggle(valorInicial: boolean = false) {
  const [valor, setValor] = useState<boolean>(valorInicial);

  const alternar = useCallback(() => {
    setValor(v => !v);
  }, []);

  return [valor, alternar] as const;
}
