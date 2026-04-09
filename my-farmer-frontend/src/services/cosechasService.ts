/**
 * Servicio de Cosechas (cosechasService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /cosechas del backend.
 * Cada función recibe el token Bearer de Supabase para autenticarse.
 *
 * Rutas del backend usadas:
 *  - GET    /cosechas/cultivo/:cultivoId  → cosechas de un cultivo
 *  - GET    /cosechas/:id                 → una cosecha específica
 *  - POST   /cosechas                     → crear cosecha
 *  - PATCH  /cosechas/:id                 → actualizar cosecha
 *  - DELETE /cosechas/:id                 → eliminar cosecha
 */

import { apiFetch } from "./api";
import {
  CreateCosechaDto,
  UpdateCosechaDto,
  ResponseCosechaDto,
} from "@/ts/cosechaProps";

/** Retorna las cosechas de un cultivo específico. */
export async function getCosechasByCultivo(
  cultivoId: number,
  token: string,
  limit?: number,
): Promise<ResponseCosechaDto[]> {
  const query = limit ? `?limit=${limit}` : "";
  return apiFetch<ResponseCosechaDto[]>(`/cosechas/cultivo/${cultivoId}${query}`, { token });
}

/** Obtiene una cosecha específica por ID. */
export async function getCosechaById(
  id: number,
  token: string,
): Promise<ResponseCosechaDto> {
  return apiFetch<ResponseCosechaDto>(`/cosechas/${id}`, { token });
}

/** Crea una nueva cosecha. */
export async function crearCosecha(
  data: CreateCosechaDto,
  token: string,
): Promise<ResponseCosechaDto> {
  return apiFetch<ResponseCosechaDto>("/cosechas", {
    method: "POST",
    token,
    body: data,
  });
}

/** Actualiza una cosecha por su ID. */
export async function actualizarCosecha(
  id: number,
  data: UpdateCosechaDto,
  token: string,
): Promise<ResponseCosechaDto> {
  return apiFetch<ResponseCosechaDto>(`/cosechas/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/** Elimina una cosecha por su ID. */
export async function eliminarCosecha(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/cosechas/${id}`, { method: "DELETE", token });
}
