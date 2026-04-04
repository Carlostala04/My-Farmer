/**
 * Servicio de Cultivos (cultivosService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /cultivos del backend.
 * Cada función recibe el token Bearer de Supabase para autenticarse.
 *
 * Se creó para separar la comunicación con el servidor del estado de los componentes.
 * Los hooks (useCultivos) consumen este servicio.
 *
 * Rutas del backend usadas:
 *  - GET    /cultivos/activos        → cultivos activos del usuario
 *  - GET    /cultivos/historicos     → cultivos históricos del usuario
 *  - GET    /cultivos/:id            → obtener un cultivo específico
 *  - POST   /cultivos                → crear cultivo (multipart/form-data por FileInterceptor)
 *  - PATCH  /cultivos/:id            → actualizar cultivo
 *  - DELETE /cultivos/:id            → eliminar cultivo
 *
 * Nota: el backend NO tiene GET /cultivos (sin sufijo), solo /activos e /historicos.
 */

import { apiFetch } from "./api";
import {
  CreateCultivoDto,
  ResponseCultivoDto,
  UpdateCultivoDto,
} from "@/ts/cultivoProps";

/** Retorna los cultivos activos (en crecimiento) del usuario autenticado. */
export async function getCultivosActivos(
  token: string,
): Promise<ResponseCultivoDto[]> {
  return apiFetch<ResponseCultivoDto[]>("/cultivos/activos", { token });
}

/** Retorna los cultivos históricos (cosechados) del usuario autenticado. */
export async function getCultivosHistoricos(
  token: string,
): Promise<ResponseCultivoDto[]> {
  return apiFetch<ResponseCultivoDto[]>("/cultivos/historicos", { token });
}

/** Obtiene un cultivo específico por ID. */
export async function getCultivoById(
  id: number,
  token: string,
): Promise<ResponseCultivoDto> {
  return apiFetch<ResponseCultivoDto>(`/cultivos/${id}`, { token });
}

/**
 * Crea un nuevo cultivo.
 * Se usa FormData porque el backend tiene FileInterceptor('Foto') en este endpoint.
 * Si se proporciona `imagenUri`, se adjunta el archivo de imagen.
 */
export async function crearCultivo(
  data: CreateCultivoDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseCultivoDto> {
  const form = new FormData();
  form.append("Nombre", data.Nombre);
  form.append("Estado", data.Estado);

  if (data.Fecha_Siembra) form.append("Fecha_Siembra", data.Fecha_Siembra);
  if (data.Fecha_Cosecha_Estimada)
    form.append("Fecha_Cosecha_Estimada", data.Fecha_Cosecha_Estimada);
  if (data.Fecha_Cosecha) form.append("Fecha_Cosecha", data.Fecha_Cosecha);
  if (data.Rendimiento_Estimado != null)
    form.append("Rendimiento_Estimado", String(data.Rendimiento_Estimado));
  if (data.Rendimiento_Unidad)
    form.append("Rendimiento_Unidad", data.Rendimiento_Unidad);
  if (data.Notas) form.append("Notas", data.Notas);
  if (data.Parcela_id != null)
    form.append("Parcela_id", String(data.Parcela_id));
  if (data.Tipo_Cultivo_id != null)
    form.append("Tipo_Cultivo_id", String(data.Tipo_Cultivo_id));

  // Adjuntar imagen si el usuario seleccionó una
  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseCultivoDto>("/cultivos", {
    method: "POST",
    token,
    body: form,
    isFormData: true,
  });
}

/** Actualiza un cultivo por su ID. */
export async function actualizarCultivo(
  id: number,
  data: UpdateCultivoDto,
  token: string,
): Promise<ResponseCultivoDto> {
  return apiFetch<ResponseCultivoDto>(`/cultivos/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/** Elimina un cultivo por su ID. */
export async function eliminarCultivo(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/cultivos/${id}`, { method: "DELETE", token });
}
