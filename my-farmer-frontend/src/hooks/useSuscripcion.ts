import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/supabase/useAuth';
import {
  getSuscripcionActiva,
  crearSuscripcion,
  cancelarSuscripcion as cancelarService,
} from '@/services/suscripcionService';
import {
  CicloFacturacion,
  PlanSuscripcion,
  ResponseSuscripcionDto,
} from '@/ts/suscripcion';

export function useSuscripcion() {
  const { session } = useAuth();
  const [suscripcionActiva, setSuscripcionActiva] =
    useState<ResponseSuscripcionDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiva = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSuscripcionActiva(session.access_token);
      setSuscripcionActiva(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar la suscripción');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchActiva();
  }, [fetchActiva]);

  /**
   * Simula el pago y activa la suscripción Premium.
   * @returns true si se activó correctamente, false si hubo error
   */
  const activarPremium = useCallback(
    async (facturacion: CicloFacturacion): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nueva = await crearSuscripcion(
          PlanSuscripcion.PREMIUM,
          facturacion,
          session.access_token,
        );
        setSuscripcionActiva(nueva);
        return true;
      } catch (e: any) {
        setError(e.message ?? 'Error al activar el plan Premium');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Cancela la suscripción activa.
   * @returns true si se canceló correctamente, false si hubo error
   */
  const cancelarSuscripcion = useCallback(async (): Promise<boolean> => {
    if (!session?.access_token || !suscripcionActiva) return false;
    setLoading(true);
    setError(null);
    try {
      await cancelarService(
        suscripcionActiva.Suscripcion_id,
        session.access_token,
      );
      setSuscripcionActiva(null);
      return true;
    } catch (e: any) {
      setError(e.message ?? 'Error al cancelar la suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, suscripcionActiva]);

  return {
    suscripcionActiva,
    loading,
    error,
    refetch: fetchActiva,
    activarPremium,
    cancelarSuscripcion,
  };
}
