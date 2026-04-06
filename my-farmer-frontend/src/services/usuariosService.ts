/**
 * Servicio de Usuarios (usuariosService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /usuarios del backend y la subida de foto
 * de perfil a Supabase Storage.
 *
 * Rutas del backend usadas:
 *  - GET   /usuarios/me  → obtener el perfil del usuario autenticado
 *  - PATCH /usuarios     → actualizar datos del perfil (el ID se extrae del JWT)
 *
 * Subida de foto:
 *  La foto se sube directamente a Supabase Storage (bucket 'usuario') desde el frontend,
 *  se obtiene la URL pública y luego se envía esa URL al backend con PATCH /usuarios.
 */

import { apiFetch } from "./api";
import { ResponseUsuarioDto } from "@/ts/usuarioProps";
import { supabase } from "@/supabase/supabaseClient";

/** Obtiene el perfil del usuario actualmente autenticado. */
export async function getMiPerfil(token: string): Promise<ResponseUsuarioDto> {
  return apiFetch<ResponseUsuarioDto>("/usuarios/me", { token });
}

/**
 * Actualiza campos del perfil del usuario autenticado.
 * El backend identifica al usuario por el JWT, no por ID en la URL.
 */
export async function actualizarPerfil(
  data: Partial<{ Nombre: string; Apellido: string; Foto: string | null }>,
  token: string,
): Promise<ResponseUsuarioDto> {
  return apiFetch<ResponseUsuarioDto>(`/usuarios`, {
    method: "PATCH",
    token,
    body: data,
  });
}

/**
 * Sube una foto de perfil a Supabase Storage y retorna la URL pública.
 *
 * Usa la REST API de Supabase directamente con FormData + referencia de archivo nativa
 * de React Native, ya que fetch(localUri) y XHR→Blob no funcionan con URIs locales
 * (content:// en Android, file:// en iOS) cuando se pasan al cliente JS de Supabase.
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
  const ext = imagenUri.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `perfil_${usuarioId}_${Date.now()}.${ext}`;
  const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;

  const session = (await supabase.auth.getSession()).data.session;
  if (!session) throw new Error("No hay sesión activa.");

  // Patrón nativo de React Native para subir archivos: FormData con referencia directa
  // a la URI local. El motor de red nativo (no JS) lee y sube el archivo.
  const formData = new FormData();
  formData.append("", {
    uri: imagenUri,
    name: fileName,
    type: contentType,
  } as any);

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/usuario/${fileName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: supabaseKey!,
        "x-upsert": "true",
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error al subir la foto: ${msg}`);
  }

  const { data: urlData } = supabase.storage
    .from("usuario")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
