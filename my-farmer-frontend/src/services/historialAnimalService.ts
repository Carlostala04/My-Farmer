/**
 * Servicio de Historial de Animales (historialAnimalService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /historial-animal del backend.
 * El historial registra automáticamente cada cambio realizado sobre un animal
 * (campo modificado, valor anterior y valor nuevo).
 *
 * Rutas del backend usadas:
 *  - GET /historial-animal/animal/:animalId?limit= → historial de un animal específico
 */

import { apiFetch } from "./api";
import { ResponseHistorialAnimalDto } from "@/ts/historialAnimal";

/**
 * Retorna el historial de cambios de un animal.
 * @param animalId ID del animal
 * @param token    Bearer token de Supabase
 * @param limit    Número máximo de registros a traer (default 20, max 100)
 */
export async function getHistorialAnimal(
  animalId: number,
  token: string,
  limit?: number,
): Promise<ResponseHistorialAnimalDto[]> {
  const qs = limit != null ? `?limit=${limit}` : "";
  return apiFetch<ResponseHistorialAnimalDto[]>(
    `/historial-animal/animal/${animalId}${qs}`,
    { token },
  );
}
