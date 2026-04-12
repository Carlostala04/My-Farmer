/**
 * Hook useHistorialCultivo
 *
 * Abstrae la lógica de estado y comunicación con el backend para el historial
 * de cambios de un cultivo específico. Los cambios se registran automáticamente
 * en el backend cada vez que se edita un cultivo.
 *
 * Recibe:
 *  - cultivoId → ID del cultivo cuyo historial se cargará.
 *                Si es null/undefined, no se realiza ninguna llamada.
 *  - limit     → (opcional) número máximo de registros a traer (default: todos, max 100)
 *
 * Retorna:
 *  - historial  → lista de cambios del cultivo ordenada por fecha DESC
 *  - loading    → true mientras se carga
 *  - error      → mensaje de error si falló, null si todo está bien
 *  - refetch    → función para recargar el historial desde el servidor
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getHistorialCultivo } from "@/services/historialCultivoService";
import { ResponseHistorialCultivoDto } from "@/ts/historialCultivo";

export function useHistorialCultivo(cultivoId?: number | null, limit?: number) {
  const { session } = useAuth();
  const [historial, setHistorial] = useState<ResponseHistorialCultivoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(async () => {
    if (!session?.access_token || cultivoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialCultivo(cultivoId, session.access_token, limit);
      setHistorial(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el historial del cultivo");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, cultivoId, limit]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  return {
    historial,
    loading,
    error,
    refetch: fetchHistorial,
  };
}
