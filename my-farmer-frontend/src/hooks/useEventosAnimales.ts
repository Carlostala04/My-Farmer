/**
 * Hook useEventosAnimales
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para los eventos
 * de un animal específico. Los componentes que lo usen no necesitan manejar tokens,
 * fetch ni estados de carga: solo consumen los datos y funciones que este hook expone.
 *
 * Recibe:
 *  - animalId → ID del animal cuyos eventos se cargarán. Cuando cambia, se re-fetcha.
 *               Si es undefined, no se realiza ninguna llamada al servidor.
 *  - limit    → (opcional) número máximo de eventos a traer del backend
 *
 * Retorna:
 *  - eventos          → lista de eventos del animal ordenada por fecha DESC (backend)
 *  - loading          → true mientras se realiza alguna operación asíncrona
 *  - error            → mensaje de error si una operación falló, null si todo está bien
 *  - refetch          → función para recargar la lista desde el servidor
 *  - crearEvento      → función para registrar un nuevo evento en el backend
 *  - actualizarEvento → función para editar un evento existente
 *  - eliminarEvento   → función para eliminar un evento por ID
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getEventosByAnimal,
  crearEvento as crearEventoService,
  actualizarEvento as actualizarEventoService,
  eliminarEvento as eliminarEventoService,
} from "@/services/eventoAnimalService";
import {
  CreateEventoAnimalDto,
  UpdateEventoAnimalDto,
  ResponseEventoAnimalDto,
} from "@/ts/eventoAnimal";

export function useEventosAnimales(animalId?: number, limit?: number) {
  const { session } = useAuth();
  const [eventos, setEventos] = useState<ResponseEventoAnimalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga los eventos del animal desde el backend. */
  const fetchEventos = useCallback(async () => {
    if (!session?.access_token || animalId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEventosByAnimal(
        animalId,
        session.access_token,
        limit,
      );
      setEventos(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los eventos del animal");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, animalId, limit]);

  // Cargar automáticamente cuando el token o el animalId estén disponibles
  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  /**
   * Registra un nuevo evento en el backend y lo agrega al estado local.
   * @param data      Datos del DTO de creación
   * @param imagenUri URI local de la imagen seleccionada (opcional)
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearEvento = useCallback(
    async (
      data: CreateEventoAnimalDto,
      imagenUri?: string,
    ): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nuevo = await crearEventoService(
          data,
          session.access_token,
          imagenUri,
        );
        // Se agrega al inicio para que el nuevo evento aparezca primero
        setEventos((prev) => [nuevo, ...prev]);
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al registrar el evento");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Actualiza un evento existente en el backend y refleja los cambios en el estado local.
   * @param id        ID del evento a actualizar
   * @param data      Campos a modificar
   * @param imagenUri URI local de la nueva imagen (opcional)
   * @returns true si se actualizó correctamente, false si hubo un error
   */
  const actualizarEvento = useCallback(
    async (
      id: number,
      data: UpdateEventoAnimalDto,
      imagenUri?: string,
    ): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const actualizado = await actualizarEventoService(
          id,
          data,
          session.access_token,
          imagenUri,
        );
        setEventos((prev) =>
          prev.map((e) => (e.Evento_id === id ? actualizado : e)),
        );
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al actualizar el evento");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina un evento por su ID y lo remueve del estado local.
   * @param id ID del evento a eliminar
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarEvento = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarEventoService(id, session.access_token);
        setEventos((prev) => prev.filter((e) => e.Evento_id !== id));
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar el evento");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    eventos,
    loading,
    error,
    refetch: fetchEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
  };
}
