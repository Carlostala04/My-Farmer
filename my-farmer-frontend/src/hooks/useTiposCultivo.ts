/**
 * Hook useTiposCultivo
 *
 * Obtiene los tipos de cultivo disponibles en el sistema desde el backend.
 * Se creó para poblar el dropdown de "Tipo de Cultivo" en el formulario de
 * registro de cultivos, ya que los tipos son datos del servidor (no estáticos).
 *
 * Retorna:
 *  - tipos    → lista de tipos de cultivo
 *  - loading  → true mientras se cargan los datos
 *  - error    → mensaje de error si algo falló, null si todo bien
 *  - refetch  → función para recargar los tipos
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getTiposCultivo } from "@/services/tiposCultivoService";
import { ResponseTipoCultivoDto } from "@/ts/cultivoProps";

export function useTiposCultivo() {
  const { session } = useAuth();
  const [tipos, setTipos] = useState<ResponseTipoCultivoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipos = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTiposCultivo(session.access_token);
      setTipos(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los tipos de cultivo");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchTipos();
  }, [fetchTipos]);

  return { tipos, loading, error, refetch: fetchTipos };
}
