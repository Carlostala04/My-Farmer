/**
 * Servicio de Parcelas (parcelasService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /parcelas del backend.
 * Las parcelas son usadas en los formularios de registro de animales y cultivos
 * para que el usuario seleccione en qué parcela se encuentra cada registro.
 *
 * Rutas del backend usadas:
 *  - GET    /parcelas       → listar parcelas del usuario autenticado
 *  - GET    /parcelas/:id   → obtener una parcela específica
 *  - POST   /parcelas       → crear parcela
 *  - PATCH  /parcelas/:id   → actualizar parcela
 *  - DELETE /parcelas/:id   → eliminar parcela
 */

import { apiFetch } from "./api";
import {
  CreateParcelaDto,
  ResponseParcelaDto,
  UpdateParcelaDto,
} from "@/ts/parcelaProps";

/** Retorna todas las parcelas del usuario autenticado. */
export async function getParcelas(
  token: string,
): Promise<ResponseParcelaDto[]> {
  return apiFetch<ResponseParcelaDto[]>("/parcelas", { token });
}

/** Obtiene una parcela específica por ID. */
export async function getParcelaById(
  id: number,
  token: string,
): Promise<ResponseParcelaDto> {
  return apiFetch<ResponseParcelaDto>(`/parcelas/${id}`, { token });
}

/** Crea una nueva parcela. */
export async function crearParcela(
  data: CreateParcelaDto,
  token: string,
): Promise<ResponseParcelaDto> {
  return apiFetch<ResponseParcelaDto>("/parcelas", {
    method: "POST",
    token,
    body: data,
  });
}

/** Actualiza una parcela por su ID. */
export async function actualizarParcela(
  id: number,
  data: UpdateParcelaDto,
  token: string,
): Promise<ResponseParcelaDto> {
  return apiFetch<ResponseParcelaDto>(`/parcelas/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/** Elimina una parcela por su ID. */
export async function eliminarParcela(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/parcelas/${id}`, { method: "DELETE", token });
}
