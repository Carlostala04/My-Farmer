/**
 * Hook useCategorias
 *
 * Obtiene las categorías de animal disponibles en el sistema desde el backend.
 * Se creó para poblar el dropdown de "Categoría animal" en el formulario de
 * registro de animales, ya que las categorías son datos del servidor (no estáticos).
 *
 * Retorna:
 *  - categorias  → lista de categorías de animal
 *  - loading     → true mientras se cargan los datos
 *  - error       → mensaje de error si algo falló, null si todo bien
 *  - refetch     → función para recargar las categorías
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getCategorias } from "@/services/categoriasService";
import { ResponseCategoriaAnimalDto } from "@/ts/animalsProps";

export function useCategorias() {
  const { session } = useAuth();
  const [categorias, setCategorias] = useState<ResponseCategoriaAnimalDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCategorias(session.access_token);
      setCategorias(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, loading, error, refetch: fetchCategorias };
}
