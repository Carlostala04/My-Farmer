import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getHistorialCultivo } from "@/services/historialCultivoService";
import { ResponseHistorialCultivoDto } from "@/ts/historialCultivo";

export function useHistorialCultivo(cultivoId: number) {
  const { session } = useAuth();
  const [historial, setHistorial] = useState<ResponseHistorialCultivoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(async () => {
    if (!session?.access_token || !cultivoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialCultivo(cultivoId, session.access_token);
      setHistorial(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, cultivoId]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  return { historial, loading, error, refetch: fetchHistorial };
}
