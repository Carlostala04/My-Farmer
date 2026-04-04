/**
 * Servicio de Tipos de Cultivo (tiposCultivoService.ts)
 *
 * Encapsula las llamadas HTTP al endpoint /tipos-cultivo del backend.
 * Se usa en el formulario de registro de cultivos para poblar el dropdown
 * de tipo de cultivo (maíz, trigo, lechuga, etc.).
 *
 * Rutas del backend usadas:
 *  - GET /tipos-cultivo     → listar todos los tipos de cultivo (requiere auth)
 *  - GET /tipos-cultivo/:id → obtener un tipo específico
 */

import { apiFetch } from "./api";
import { ResponseTipoCultivoDto } from "@/ts/cultivoProps";

/** Retorna todos los tipos de cultivo disponibles en el sistema. */
export async function getTiposCultivo(
  token: string,
): Promise<ResponseTipoCultivoDto[]> {
  return apiFetch<ResponseTipoCultivoDto[]>("/tipos-cultivo", { token });
}

/** Obtiene un tipo de cultivo específico por ID. */
export async function getTipoCultivoById(
  id: number,
  token: string,
): Promise<ResponseTipoCultivoDto> {
  return apiFetch<ResponseTipoCultivoDto>(`/tipos-cultivo/${id}`, { token });
}
