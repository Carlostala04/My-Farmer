/**
 * Hook useCosechas
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para las cosechas
 * de un cultivo específico.
 *
 * Retorna:
 *  - cosechas       → lista de cosechas del cultivo
 *  - loading        → true mientras se realiza alguna operación asíncrona
 *  - error          → mensaje de error si algo falló, null si todo bien
 *  - refetch        → función para recargar los datos desde el servidor
 *  - crearCosecha   → función para registrar una nueva cosecha
 *  - eliminarCosecha → función para eliminar una cosecha por ID
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getCosechasByCultivo,
  crearCosecha as crearCosechaService,
  eliminarCosecha as eliminarCosechaService,
} from "@/services/cosechasService";
import { CreateCosechaDto, ResponseCosechaDto } from "@/ts/cosechaProps";

export function useCosechas(cultivoId: number | null) {
  const { session } = useAuth();
  const [cosechas, setCosechas] = useState<ResponseCosechaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga las cosechas del cultivo desde el backend. */
  const fetchCosechas = useCallback(async () => {
    if (!session?.access_token || !cultivoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCosechasByCultivo(cultivoId, session.access_token);
      setCosechas(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar las cosechas");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, cultivoId]);

  useEffect(() => {
    fetchCosechas();
  }, [fetchCosechas]);

  /**
   * Registra una nueva cosecha en el backend y la agrega al estado local.
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearCosecha = useCallback(
    async (data: CreateCosechaDto): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nueva = await crearCosechaService(data, session.access_token);
        setCosechas((prev) => [nueva, ...prev]);
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al registrar la cosecha");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina una cosecha por su ID y la remueve del estado local.
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarCosecha = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarCosechaService(id, session.access_token);
        setCosechas((prev) => prev.filter((c) => c.Cosecha_id !== id));
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar la cosecha");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    cosechas,
    loading,
    error,
    refetch: fetchCosechas,
    crearCosecha,
    eliminarCosecha,
  };
}
