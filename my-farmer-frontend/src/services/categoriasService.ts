/**
 * Servicio de Categorías de Animal (categoriasService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /categorias-animal del backend.
 * Se usa principalmente en el formulario de registro de animales para poblar
 * el dropdown de categorías (vaca, toro, cerdo, gallina, etc.).
 *
 * Rutas del backend usadas:
 *  - GET /categorias-animal     → listar todas las categorías (requiere auth)
 *  - GET /categorias-animal/:id → obtener una categoría específica
 */

import { apiFetch } from "./api";
import { ResponseCategoriaAnimalDto } from "@/ts/animalsProps";

/** Retorna todas las categorías de animal disponibles en el sistema. */
export async function getCategorias(
  token: string,
): Promise<ResponseCategoriaAnimalDto[]> {
  return apiFetch<ResponseCategoriaAnimalDto[]>("/categorias-animal", {
    token,
  });
}

/** Obtiene una categoría específica por ID. */
export async function getCategoriaById(
  id: number,
  token: string,
): Promise<ResponseCategoriaAnimalDto> {
  return apiFetch<ResponseCategoriaAnimalDto>(`/categorias-animal/${id}`, {
    token,
  });
}
