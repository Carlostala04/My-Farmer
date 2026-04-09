/**
 * Servicio de Crecimiento (crecimientosService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /crecimiento del backend.
 * Cada función recibe el token Bearer de Supabase para autenticarse.
 *
 * Rutas del backend usadas:
 *  - GET    /crecimiento/cultivo/:cultivoId  → registros de un cultivo
 *  - GET    /crecimiento/:id                 → un registro específico
 *  - POST   /crecimiento                     → crear registro (multipart/form-data)
 *  - PATCH  /crecimiento/:id                 → actualizar registro (multipart/form-data)
 *  - DELETE /crecimiento/:id                 → eliminar registro
 */

import { apiFetch } from "./api";
import {
  CreateCrecimientoDto,
  UpdateCrecimientoDto,
  ResponseCrecimientoDto,
} from "@/ts/cultivoProps";

/** Retorna los registros de crecimiento de un cultivo específico. */
export async function getCrecimientosByCultivo(
  cultivoId: number,
  token: string,
  limit?: number,
): Promise<ResponseCrecimientoDto[]> {
  const query = limit ? `?limit=${limit}` : "";
  return apiFetch<ResponseCrecimientoDto[]>(
    `/crecimiento/cultivo/${cultivoId}${query}`,
    { token },
  );
}

/** Obtiene un registro de crecimiento específico por ID. */
export async function getCrecimientoById(
  id: number,
  token: string,
): Promise<ResponseCrecimientoDto> {
  return apiFetch<ResponseCrecimientoDto>(`/crecimiento/${id}`, { token });
}

/**
 * Crea un nuevo registro de crecimiento.
 * Se usa FormData porque el backend tiene FileInterceptor('Foto') en este endpoint.
 */
export async function crearCrecimiento(
  data: CreateCrecimientoDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseCrecimientoDto> {
  const form = new FormData();
  form.append("Cultivo_id", String(data.Cultivo_id));
  if (data.Altura != null) form.append("Altura", String(data.Altura));
  if (data.Observaciones) form.append("Observaciones", data.Observaciones);

  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseCrecimientoDto>("/crecimiento", {
    method: "POST",
    token,
    body: form,
    isFormData: true,
  });
}

/**
 * Actualiza un registro de crecimiento por su ID.
 * Se usa FormData porque el backend tiene FileInterceptor('Foto') en este endpoint.
 */
export async function actualizarCrecimiento(
  id: number,
  data: UpdateCrecimientoDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseCrecimientoDto> {
  const form = new FormData();
  if (data.Altura != null) form.append("Altura", String(data.Altura));
  if (data.Observaciones) form.append("Observaciones", data.Observaciones);

  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseCrecimientoDto>(`/crecimiento/${id}`, {
    method: "PATCH",
    token,
    body: form,
    isFormData: true,
  });
}

/** Elimina un registro de crecimiento por su ID. */
export async function eliminarCrecimiento(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/crecimiento/${id}`, { method: "DELETE", token });
}
