/**
 * Servicio de Usuarios (usuariosService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /usuarios del backend y la subida de foto
 * de perfil a Supabase Storage.
 *
 * Rutas del backend usadas:
 *  - GET   /usuarios/me        → obtener el perfil del usuario autenticado
 *  - PATCH /usuarios/:id       → actualizar datos del perfil (acepta JSON, no multipart)
 *
 * Subida de foto:
 *  El backend de /usuarios/:id NO tiene FileInterceptor, por lo que no acepta archivos.
 *  La foto se sube directamente a Supabase Storage (bucket 'usuario') desde el frontend,
 *  se obtiene la URL pública y luego se envía esa URL al backend con PATCH.
 */

import { apiFetch } from "./api";
import { ResponseUsuarioDto } from "@/ts/usuarioProps";
import { supabase } from "@/supabase/supabaseClient";

/** Obtiene el perfil del usuario actualmente autenticado. */
export async function getMiPerfil(token: string): Promise<ResponseUsuarioDto> {
  return apiFetch<ResponseUsuarioDto>("/usuarios/me", { token });
}

/** Actualiza campos del perfil del usuario. */
export async function actualizarPerfil(
  id: number,
  data: Partial<{ Nombre: string; Apellido: string; Foto: string | null }>,
  token: string,
): Promise<ResponseUsuarioDto> {
  return apiFetch<ResponseUsuarioDto>(`/usuarios/${id}`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/**
 * Sube una foto de perfil directamente a Supabase Storage (bucket 'usuario')
 * y retorna la URL pública del archivo subido.
 *
 * Se creó como función separada porque el endpoint PATCH /usuarios/:id solo acepta
 * JSON y no tiene FileInterceptor, por lo que la subida debe hacerse directamente
 * desde el frontend a Supabase.
 *
 * @param imagenUri  URI local de la imagen (resultado de ImagePicker)
 * @param usuarioId  ID del usuario, usado para nombrar el archivo de forma única
 * @returns          URL pública de la imagen en Supabase Storage
 * @throws           Error si la subida falla
 */
export async function subirFotoPerfil(
  imagenUri: string,
  usuarioId: number,
): Promise<string> {
  // Convertir la URI local a Blob para poder subirla a Supabase Storage
  const response = await fetch(imagenUri);
  const blob = await response.blob();

  const extension = imagenUri.split(".").pop() ?? "jpg";
  const fileName = `perfil_${usuarioId}_${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage
    .from("usuario")
    .upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true, // Reemplaza si ya existe un archivo con el mismo nombre
    });

  if (error) throw new Error(`Error al subir la foto: ${error.message}`);

  // Obtener URL pública del archivo recién subido
  const { data: urlData } = supabase.storage
    .from("usuario")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
