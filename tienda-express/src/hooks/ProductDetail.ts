import { useState, useEffect, useCallback } from 'react';
import type { Producto } from '../types/tienda';
import { getProductos } from '../api/tiendaApi';
import { useDebounce } from './useDEbounce';

/**
 * Hook Nivel 3: Compone useDebounce y getProductos para gestionar la carga de datos
 * @param termino Término de búsqueda introducido por el usuario
 * @returns Objeto con { productos, cargando, error, refetch }
 */
export function useProducts(termino: string) {
  const terminoDiferido = useDebounce(termino, 400);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketRecarga, setTicketRecarga] = useState<number>(0);

  // Exponer función de reintento/refetch
  const refetch = useCallback(() => {
    setTicketRecarga(prev => prev + 1);
  }, []);

  useEffect(() => {
    let ignorar = false;
    setCargando(true);
    setError(null);

    getProductos(terminoDiferido)
      .then(datos => {
        if (!ignorar) {
          setProductos(datos);
          setCargando(false);
        }
      })
      .catch((err: Error) => {
        if (!ignorar) {
          setError(err.message || 'No se pudo conectar con el servidor');
          setCargando(false);
        }
      });

    return () => {
      ignorar = true;
    };
  }, [terminoDiferido, ticketRecarga]);

  return { productos, cargando, error, refetch };
}
