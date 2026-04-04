/**
 * Hook useParcelas
 *
 * Obtiene las parcelas del usuario autenticado desde el backend.
 * Se creó para ser usado en los formularios de registro de animales y cultivos,
 * donde el usuario necesita seleccionar una parcela de un dropdown.
 *
 * Retorna:
 *  - parcelas  → lista de parcelas del usuario
 *  - loading   → true mientras se cargan los datos
 *  - error     → mensaje de error si algo falló, null si todo bien
 *  - refetch   → función para recargar las parcelas
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getParcelas } from "@/services/parcelasService";
import { ResponseParcelaDto } from "@/ts/parcelaProps";

export function useParcelas() {
  const { session } = useAuth();
  const [parcelas, setParcelas] = useState<ResponseParcelaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParcelas = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getParcelas(session.access_token);
      setParcelas(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar las parcelas");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchParcelas();
  }, [fetchParcelas]);

  return { parcelas, loading, error, refetch: fetchParcelas };
}
