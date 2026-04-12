/**
 * Servicio de Historial de Cultivos (historialCultivoService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /historial-cultivo del backend.
 * El historial registra automáticamente cada cambio realizado sobre un cultivo
 * (campo modificado, valor anterior y valor nuevo).
 *
 * Rutas del backend usadas:
 *  - GET /historial-cultivo/cultivo/:cultivoId?limit= → historial de un cultivo específico
 */

import { apiFetch } from "./api";
import { ResponseHistorialCultivoDto } from "@/ts/historialCultivo";

/**
 * Retorna el historial de cambios de un cultivo.
 * @param cultivoId ID del cultivo
 * @param token     Bearer token de Supabase
 * @param limit     Número máximo de registros a traer (default 20, max 100)
 */
export async function getHistorialCultivo(
  cultivoId: number,
  token: string,
  limit?: number,
): Promise<ResponseHistorialCultivoDto[]> {
  const qs = limit != null ? `?limit=${limit}` : "";
  return apiFetch<ResponseHistorialCultivoDto[]>(
    `/historial-cultivo/cultivo/${cultivoId}${qs}`,
    { token },
  );
}
