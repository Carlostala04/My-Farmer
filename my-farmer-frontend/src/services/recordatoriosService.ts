/**
 * Servicio de Recordatorios (recordatoriosService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /recordatorios del backend.
 * Un recordatorio pertenece a una entidad (animal o cultivo) y tiene una
 * fecha/hora en que debe notificarse al usuario.
 *
 * Rutas del backend usadas:
 *  - GET    /recordatorios       → listar todos los recordatorios del usuario
 *  - GET    /recordatorios/:id   → obtener un recordatorio específico
 *  - POST   /recordatorios       → crear recordatorio
 *  - PATCH  /recordatorios/:id   → actualizar recordatorio (título, descripción, cancelado...)
 *  - DELETE /recordatorios/:id   → eliminar recordatorio
 */

import { apiFetch } from "./api";
import {
  CreateRecordatorioDto,
  ResponseRecordatorioDto,
  UpdateRecordatorioDto,
} from "@/ts/recordatorioProps";

/** Retorna todos los recordatorios del usuario autenticado. */
export async function getRecordatorios(
  token: string,
): Promise<ResponseRecordatorioDto[]> {
  return apiFetch<ResponseRecordatorioDto[]>("/recordatorios", { token });
}

/** Obtiene un recordatorio específico por ID. */
export async function getRecordatorioById(
  id: number,
  token: string,
): Promise<ResponseRecordatorioDto> {
  return apiFetch<ResponseRecordatorioDto>(`/recordatorios/${id}`, { token });
}

/** Crea un nuevo recordatorio para una entidad (animal o cultivo). */
export async function crearRecordatorio(
  data: CreateRecordatorioDto,
  token: string,
): Promise<ResponseRecordatorioDto> {
  return apiFetch<ResponseRecordatorioDto>("/recordatorios", {
    method: "POST",
    token,
    body: data,
  });
}

/** Actualiza un recordatorio (puede cancelarlo o modificar su contenido). */
export async function actualizarRecordatorio(
  id: number,
  data: UpdateRecordatorioDto,
  token: string,
): Promise<ResponseRecordatorioDto> {
  return apiFetch<ResponseRecordatorioDto>(`/recordatorios/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/** Elimina un recordatorio por su ID. */
export async function eliminarRecordatorio(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/recordatorios/${id}`, { method: "DELETE", token });
}
