/**
 * Servicio de Eventos de Animales (eventoAnimalService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /eventos-animal del backend.
 * Cada función recibe el token Bearer de Supabase para autenticarse.
 *
 * Rutas del backend usadas:
 *  - GET    /eventos-animal/animal/:animalId   → listar eventos de un animal (con ?limit=)
 *  - GET    /eventos-animal/:id                → obtener un evento
 *  - POST   /eventos-animal                    → crear evento (multipart/form-data por FileInterceptor)
 *  - PATCH  /eventos-animal/:id               → actualizar evento (multipart/form-data por FileInterceptor)
 *  - DELETE /eventos-animal/:id               → eliminar evento (soft delete)
 */

import { apiFetch } from "./api";
import {
  CreateEventoAnimalDto,
  UpdateEventoAnimalDto,
  ResponseEventoAnimalDto,
} from "@/ts/eventoAnimal";

/** Retorna todos los eventos de un animal. Se puede limitar con `limit`. */
export async function getEventosByAnimal(
  animalId: number,
  token: string,
  limit?: number,
): Promise<ResponseEventoAnimalDto[]> {
  const qs = limit != null ? `?limit=${limit}` : "";
  return apiFetch<ResponseEventoAnimalDto[]>(
    `/eventos-animal/animal/${animalId}${qs}`,
    { token },
  );
}

/** Obtiene un evento por su ID. */
export async function getEventoById(
  id: number,
  token: string,
): Promise<ResponseEventoAnimalDto> {
  return apiFetch<ResponseEventoAnimalDto>(`/eventos-animal/${id}`, { token });
}

/**
 * Crea un nuevo evento para un animal.
 * Se usa FormData porque el backend tiene FileInterceptor('Foto') en este endpoint.
 * Si se proporciona `imagenUri`, se adjunta el archivo de imagen.
 */
export async function crearEvento(
  data: CreateEventoAnimalDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseEventoAnimalDto> {
  const form = new FormData();
  form.append("Animal_id", String(data.Animal_id));
  form.append("Titulo", data.Titulo);
  form.append("Fecha", data.Fecha);
  form.append("Tipo", data.Tipo);

  if (data.Descripcion) form.append("Descripcion", data.Descripcion);

  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseEventoAnimalDto>("/eventos-animal", {
    method: "POST",
    token,
    body: form,
    isFormData: true,
  });
}

/**
 * Actualiza un evento existente.
 * También usa FormData porque el backend tiene FileInterceptor('Foto') en el PATCH.
 * Si se proporciona `imagenUri`, reemplaza la foto actual.
 */
export async function actualizarEvento(
  id: number,
  data: UpdateEventoAnimalDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseEventoAnimalDto> {
  const form = new FormData();

  if (data.Titulo) form.append("Titulo", data.Titulo);
  if (data.Fecha) form.append("Fecha", data.Fecha);
  if (data.Tipo) form.append("Tipo", data.Tipo);
  if (data.Descripcion != null) form.append("Descripcion", data.Descripcion);

  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseEventoAnimalDto>(`/eventos-animal/${id}`, {
    method: "PATCH",
    token,
    body: form,
    isFormData: true,
  });
}

/** Elimina (soft delete) un evento por su ID. */
export async function eliminarEvento(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/eventos-animal/${id}`, { method: "DELETE", token });
}
