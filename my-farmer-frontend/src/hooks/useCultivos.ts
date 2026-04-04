/**
 * Hook useCultivos
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para los cultivos.
 * Carga tanto los cultivos activos como los históricos del usuario autenticado.
 *
 * Se creó para que las pantallas de cultivos y el home puedan consumir datos reales
 * sin manejar directamente tokens ni fetch.
 *
 * Retorna:
 *  - cultivos       → cultivos activos (en crecimiento) del usuario
 *  - historicos     → cultivos históricos (cosechados) del usuario
 *  - loading        → true mientras se realiza alguna operación asíncrona
 *  - error          → mensaje de error si algo falló, null si todo bien
 *  - refetch        → función para recargar los datos desde el servidor
 *  - crearCultivo   → función para registrar un nuevo cultivo
 *  - eliminarCultivo → función para eliminar un cultivo por ID
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getCultivosActivos,
  getCultivosHistoricos,
  crearCultivo as crearCultivoService,
  eliminarCultivo as eliminarCultivoService,
} from "@/services/cultivosService";
import { CreateCultivoDto, ResponseCultivoDto } from "@/ts/cultivoProps";

export function useCultivos() {
  const { session } = useAuth();
  const [cultivos, setCultivos] = useState<ResponseCultivoDto[]>([]);
  const [historicos, setHistoricos] = useState<ResponseCultivoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga los cultivos activos e históricos del usuario desde el backend. */
  const fetchCultivos = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      // Se cargan ambas listas en paralelo para mejorar el rendimiento
      const [activos, hist] = await Promise.all([
        getCultivosActivos(session.access_token),
        getCultivosHistoricos(session.access_token),
      ]);
      setCultivos(activos);
      setHistoricos(hist);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los cultivos");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  // Cargar automáticamente cuando el token esté disponible
  useEffect(() => {
    fetchCultivos();
  }, [fetchCultivos]);

  /**
   * Registra un nuevo cultivo en el backend y lo agrega al estado local.
   * @param data     Datos del DTO de creación
   * @param imagenUri URI local de la imagen seleccionada (opcional)
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearCultivo = useCallback(
    async (data: CreateCultivoDto, imagenUri?: string): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nuevo = await crearCultivoService(
          data,
          session.access_token,
          imagenUri,
        );
        // Si el nuevo cultivo está activo, se agrega a la lista de activos
        if (nuevo.Activo) {
          setCultivos((prev) => [nuevo, ...prev]);
        } else {
          setHistoricos((prev) => [nuevo, ...prev]);
        }
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al registrar el cultivo");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina un cultivo por su ID y lo remueve del estado local.
   * @param id ID del cultivo a eliminar
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarCultivo = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarCultivoService(id, session.access_token);
        setCultivos((prev) => prev.filter((c) => c.Cultivo_id !== id));
        setHistoricos((prev) => prev.filter((c) => c.Cultivo_id !== id));
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar el cultivo");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    cultivos,
    historicos,
    loading,
    error,
    refetch: fetchCultivos,
    crearCultivo,
    eliminarCultivo,
  };
}
