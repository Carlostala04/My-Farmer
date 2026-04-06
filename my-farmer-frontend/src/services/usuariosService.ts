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

/** Obtiene el perfil del usuario actualmente autenticado. */
export async function getMiPerfil(token: string): Promise<ResponseUsuarioDto> {
  return apiFetch<ResponseUsuarioDto>("/usuarios/me", { token });
}

/**
 * Actualiza campos del perfil del usuario autenticado.
 * Si se pasa imagenUri, la adjunta como archivo (multipart/form-data) igual que animales.
 * El backend tiene FileInterceptor('Foto') y sube la imagen a Supabase Storage.
 */
export async function actualizarPerfil(
  data: Partial<{ Nombre: string; Apellido: string; Foto: string | null }>,
  token: string,
  imagenUri?: string,
): Promise<ResponseUsuarioDto> {
  if (imagenUri) {
    const form = new FormData();
    if (data.Nombre != null) form.append("Nombre", data.Nombre);
    if (data.Apellido != null) form.append("Apellido", data.Apellido);

    const fileName = imagenUri.split("/").pop() ?? "foto.jpg";
    const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("Foto", { uri: imagenUri, name: fileName, type: fileType } as any);

    return apiFetch<ResponseUsuarioDto>("/usuarios", {
      method: "PATCH",
      token,
      body: form,
      isFormData: true,
    });
  }

  return apiFetch<ResponseUsuarioDto>("/usuarios", {
    method: "PATCH",
    token,
    body: data,
  });
}
