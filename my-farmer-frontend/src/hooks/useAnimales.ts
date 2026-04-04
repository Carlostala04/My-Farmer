/**
 * Hook useAnimales
 *
 * Abstrae toda la lógica de estado y comunicación con el backend para los animales.
 * Los componentes que lo usen no necesitan manejar tokens, fetch ni estados de carga:
 * solo consumen los datos y las funciones que este hook expone.
 *
 * Se creó para cumplir con el patrón de hooks del proyecto (ver CLAUDE.md) y para
 * que cualquier pantalla que necesite animales no repita la misma lógica de fetch.
 *
 * Retorna:
 *  - animales    → lista de animales del usuario autenticado
 *  - loading     → true mientras se realiza alguna operación asíncrona
 *  - error       → mensaje de error si una operación falló, null si todo está bien
 *  - refetch     → función para recargar la lista desde el servidor
 *  - crearAnimal → función para registrar un nuevo animal en el backend
 *  - eliminarAnimal → función para eliminar un animal por ID
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import {
  getAnimales,
  crearAnimal as crearAnimalService,
  eliminarAnimal as eliminarAnimalService,
} from "@/services/animalesService";
import { CreateAnimalDto, ResponseAnimalDto } from "@/ts/animalsProps";

export function useAnimales() {
  const { session } = useAuth();
  const [animales, setAnimales] = useState<ResponseAnimalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga los animales del usuario desde el backend. */
  const fetchAnimales = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAnimales(session.access_token);
      setAnimales(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar los animales");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  // Cargar automáticamente cuando el token esté disponible
  useEffect(() => {
    fetchAnimales();
  }, [fetchAnimales]);

  /**
   * Registra un nuevo animal en el backend y lo agrega al estado local.
   * @param data     Datos del DTO de creación
   * @param imagenUri URI local de la imagen seleccionada (opcional)
   * @returns true si se creó correctamente, false si hubo un error
   */
  const crearAnimal = useCallback(
    async (data: CreateAnimalDto, imagenUri?: string): Promise<boolean> => {
      if (!session?.access_token) return false;
      setLoading(true);
      setError(null);
      try {
        const nuevo = await crearAnimalService(
          data,
          session.access_token,
          imagenUri,
        );
        // Se agrega al inicio para que el nuevo animal aparezca primero en la lista
        setAnimales((prev) => [nuevo, ...prev]);
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al registrar el animal");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  /**
   * Elimina un animal por su ID y lo remueve del estado local.
   * @param id ID del animal a eliminar
   * @returns true si se eliminó correctamente, false si hubo un error
   */
  const eliminarAnimal = useCallback(
    async (id: number): Promise<boolean> => {
      if (!session?.access_token) return false;
      setError(null);
      try {
        await eliminarAnimalService(id, session.access_token);
        setAnimales((prev) => prev.filter((a) => a.Animal_id !== id));
        return true;
      } catch (e: any) {
        setError(e.message ?? "Error al eliminar el animal");
        return false;
      }
    },
    [session?.access_token],
  );

  return {
    animales,
    loading,
    error,
    refetch: fetchAnimales,
    crearAnimal,
    eliminarAnimal,
  };
}
