/**
 * Servicio de Animales (animalesService.ts)
 *
 * Encapsula todas las llamadas HTTP al endpoint /animales del backend.
 * Cada función recibe el token Bearer de Supabase para autenticarse.
 *
 * Se creó para separar la lógica de comunicación con el servidor del estado
 * de los componentes. Los hooks (useAnimales) consumen este servicio.
 *
 * Rutas del backend usadas:
 *  - GET    /animales               → listar animales del usuario
 *  - GET    /animales/buscar        → buscar con filtros
 *  - GET    /animales/:id           → obtener un animal
 *  - POST   /animales               → crear animal (multipart/form-data por FileInterceptor)
 *  - PATCH  /animales/:id           → actualizar animal (JSON, sin archivo)
 *  - DELETE /animales/:id           → eliminar animal
 */

import { apiFetch } from "./api";
import {
  CreateAnimalDto,
  ResponseAnimalDto,
  UpdateAnimalDto,
} from "@/ts/animalsProps";

/** Obtiene todos los animales del usuario autenticado. */
export async function getAnimales(token: string): Promise<ResponseAnimalDto[]> {
  return apiFetch<ResponseAnimalDto[]>("/animales", { token });
}

/** Obtiene un animal por su ID. */
export async function getAnimalById(
  id: number,
  token: string,
): Promise<ResponseAnimalDto> {
  return apiFetch<ResponseAnimalDto>(`/animales/${id}`, { token });
}

/**
 * Crea un nuevo animal.
 * Se usa FormData porque el backend tiene FileInterceptor('Foto') en este endpoint.
 * Los campos del DTO se envían como campos de formulario individuales.
 * Si se proporciona `imagenUri`, se adjunta el archivo de imagen.
 */
export async function crearAnimal(
  data: CreateAnimalDto,
  token: string,
  imagenUri?: string,
): Promise<ResponseAnimalDto> {
  const form = new FormData();
  form.append("Nombre", data.Nombre);
  form.append("Sexo", data.Sexo);
  form.append("Categoria_Animal_id", String(data.Categoria_Animal_id));

  if (data.Raza) form.append("Raza", data.Raza);
  if (data.Color) form.append("Color", data.Color);
  if (data.Fecha_Nacimiento)
    form.append("Fecha_Nacimiento", data.Fecha_Nacimiento);
  if (data.Peso != null) form.append("Peso", String(data.Peso));
  if (data.Peso_Unidad) form.append("Peso_Unidad", data.Peso_Unidad);
  if (data.Altura != null) form.append("Altura", String(data.Altura));
  if (data.Estado_Label) form.append("Estado_Label", data.Estado_Label);
  if (data.Notas) form.append("Notas", data.Notas);
  if (data.Parcela_id != null)
    form.append("Parcela_id", String(data.Parcela_id));

  // Adjuntar la imagen si el usuario seleccionó una
  if (imagenUri) {
    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    // React Native requiere esta estructura para archivos en FormData
    form.append("Foto", {
      uri: imagenUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  return apiFetch<ResponseAnimalDto>("/animales", {
    method: "POST",
    token,
    body: form,
    isFormData: true,
  });
}

/**
 * Actualiza un animal. Se envía como JSON ya que no se modifica la imagen aquí.
 */
export async function actualizarAnimal(
  id: number,
  data: UpdateAnimalDto,
  token: string,
): Promise<ResponseAnimalDto> {
  return apiFetch<ResponseAnimalDto>(`/animales/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/** Elimina un animal por su ID. */
export async function eliminarAnimal(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/animales/${id}`, { method: "DELETE", token });
}

/**
 * Busca animales con filtros opcionales.
 * El backend filtra automáticamente por el usuario del token.
 */
export async function buscarAnimales(
  token: string,
  params: {
    nombre?: string;
    color?: string;
    categoriaId?: number;
    limit?: number;
  },
): Promise<ResponseAnimalDto[]> {
  const query = new URLSearchParams();
  if (params.nombre) query.append("nombre", params.nombre);
  if (params.color) query.append("color", params.color);
  if (params.categoriaId != null)
    query.append("categoriaId", String(params.categoriaId));
  if (params.limit != null) query.append("limit", String(params.limit));

  const qs = query.toString();
  return apiFetch<ResponseAnimalDto[]>(
    `/animales/buscar${qs ? `?${qs}` : ""}`,
    { token },
  );
}
