/**
 * Hook useUsuario
 *
 * Carga el perfil del usuario autenticado desde el backend.
 * Se creó para que la pantalla de perfil y el home puedan mostrar datos reales
 * del usuario (nombre, correo, foto, etc.) en lugar de datos hardcodeados.
 *
 * Retorna:
 *  - usuario   → datos del perfil del usuario (ResponseUsuarioDto) o null si no cargó
 *  - loading   → true mientras se cargan los datos
 *  - error     → mensaje de error si algo falló, null si todo bien
 *  - refetch   → función para recargar el perfil
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/supabase/useAuth";
import { getMiPerfil } from "@/services/usuariosService";
import { ResponseUsuarioDto } from "@/ts/usuarioProps";

export function useUsuario() {
  const { session } = useAuth();
  const [usuario, setUsuario] = useState<ResponseUsuarioDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuario = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMiPerfil(session.access_token);
      setUsuario(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  return { usuario, loading, error, refetch: fetchUsuario };
}
