/**
 * Hook useRecordatorios
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para los recordatorios.
 * Carga todos los recordatorios del usuario y expone funciones para crear y eliminar.
 *
 * Se creó para que la pantalla de recordatorios y los detalles de animal/cultivo
 * puedan consumir datos reales del backend sin manejar tokens ni fetch directamente.
 *
 * Retorna:
 *  - recordatorios        → todos los recordatorios del usuario
 *  - loading              → true mientras se realiza alguna operación
 *  - error                → mensaje de error si algo falló, null si todo bien
 *  - refetch              → recarga la lista completa desde el servidor
 *  - crearRecordatorio    → crea un nuevo recordatorio y lo agrega al estado
 *  - eliminarRecordatorio → elimina un recordatorio por ID
 *
 * Uso adicional: para filtrar recordatorios por entidad (ej: todos los de un animal),
 * el componente puede filtrar la lista por `Entidad_Tipo` y `Entidad_id`:
 *   const deEsteAnimal = recordatorios.filter(r => r.Entidad_Tipo === 'animal' && r.Entidad_id === animalId)
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getRecordatorios,
  crearRecordatorio as crearService,
  eliminarRecordatorio as eliminarService,
} from "@/services/recordatoriosService";
import {
  CreateRecordatorioDto,
  ResponseRecordatorioDto,
} from "@/ts/recordatorioProps";

export function useRecordatorios() {
  const { session } = useAuth();
  const [recordatorios, setRecordatorios] = useState<ResponseRecordatorioDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecordatorios = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRecordatorios(session.access_token);
      setRecordatorios(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los recordatorios");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchRecordatorios();
  }, [fetchRecordatorios]);

  /**
   * Crea un nuevo recordatorio en el backend y lo agrega al estado local.
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearRecordatorio = useCallback(
    async (data: CreateRecordatorioDto): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nuevo = await crearService(data, session.access_token);
        setRecordatorios((prev) => [nuevo, ...prev]);
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al crear el recordatorio");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina un recordatorio por ID y lo remueve del estado local.
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarRecordatorio = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarService(id, session.access_token);
        setRecordatorios((prev) =>
          prev.filter((r) => r.Recordatorio_id !== id),
        );
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar el recordatorio");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    recordatorios,
    loading,
    error,
    refetch: fetchRecordatorios,
    crearRecordatorio,
    eliminarRecordatorio,
  };
}
