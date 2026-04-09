/**
 * Hook useCrecimientos
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para los
 * registros de crecimiento de un cultivo específico.
 *
 * Retorna:
 *  - crecimientos      → lista de registros de crecimiento del cultivo
 *  - loading           → true mientras se realiza alguna operación asíncrona
 *  - error             → mensaje de error si algo falló, null si todo bien
 *  - refetch           → función para recargar los datos desde el servidor
 *  - crearCrecimiento  → función para registrar un nuevo crecimiento
 *  - eliminarCrecimiento → función para eliminar un registro por ID
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getCrecimientosByCultivo,
  crearCrecimiento as crearCrecimientoService,
  eliminarCrecimiento as eliminarCrecimientoService,
} from "@/services/crecimientosService";
import { CreateCrecimientoDto, ResponseCrecimientoDto } from "@/ts/cultivoProps";

export function useCrecimientos(cultivoId: number | null) {
  const { session } = useAuth();
  const [crecimientos, setCrecimientos] = useState<ResponseCrecimientoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga los registros de crecimiento del cultivo desde el backend. */
  const fetchCrecimientos = useCallback(async () => {
    if (!session?.access_token || !cultivoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCrecimientosByCultivo(cultivoId, session.access_token);
      setCrecimientos(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los registros de crecimiento");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, cultivoId]);

  useEffect(() => {
    fetchCrecimientos();
  }, [fetchCrecimientos]);

  /**
   * Registra un nuevo crecimiento en el backend y lo agrega al estado local.
   * @param data      Datos del DTO de creación
   * @param imagenUri URI local de la imagen (opcional)
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearCrecimiento = useCallback(
    async (data: CreateCrecimientoDto, imagenUri?: string): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nuevo = await crearCrecimientoService(data, session.access_token, imagenUri);
        setCrecimientos((prev) => [nuevo, ...prev]);
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al registrar el crecimiento");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina un registro de crecimiento por su ID y lo remueve del estado local.
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarCrecimiento = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarCrecimientoService(id, session.access_token);
        setCrecimientos((prev) => prev.filter((c) => c.Crecimiento_id !== id));
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar el registro de crecimiento");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    crecimientos,
    loading,
    error,
    refetch: fetchCrecimientos,
    crearCrecimiento,
    eliminarCrecimiento,
  };
}
