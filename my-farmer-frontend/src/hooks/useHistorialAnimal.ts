/**
 * Hook useHistorialAnimal
 *
 * Abstrae la lógica de estado y comunicación con el backend para el historial
 * de cambios de un animal específico. Los cambios se registran automáticamente
 * en el backend cada vez que se edita un animal.
 *
 * Recibe:
 *  - animalId → ID del animal cuyo historial se cargará.
 *               Si es null/undefined, no se realiza ninguna llamada.
 *  - limit    → (opcional) número máximo de registros a traer (default: todos, max 100)
 *
 * Retorna:
 *  - historial  → lista de cambios del animal ordenada por fecha DESC
 *  - loading    → true mientras se carga
 *  - error      → mensaje de error si falló, null si todo está bien
 *  - refetch    → función para recargar el historial desde el servidor
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getHistorialAnimal } from "@/services/historialAnimalService";
import { ResponseHistorialAnimalDto } from "@/ts/historialAnimal";

export function useHistorialAnimal(animalId?: number | null, limit?: number) {
  const { session } = useAuth();
  const [historial, setHistorial] = useState<ResponseHistorialAnimalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(async () => {
    if (!session?.access_token || animalId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialAnimal(animalId, session.access_token, limit);
      setHistorial(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el historial del animal");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, animalId, limit]);

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
