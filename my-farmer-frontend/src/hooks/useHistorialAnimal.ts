import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getHistorialAnimal } from "@/services/historialAnimalService";
import { ResponseHistorialAnimalDto } from "@/ts/historialAnimal";

export function useHistorialAnimal(animalId: number) {
  const { session } = useAuth();
  const [historial, setHistorial] = useState<ResponseHistorialAnimalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(async () => {
    if (!session?.access_token || !animalId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialAnimal(animalId, session.access_token);
      setHistorial(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, animalId]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  return { historial, loading, error, refetch: fetchHistorial };
}