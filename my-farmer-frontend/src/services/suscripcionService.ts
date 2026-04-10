import { apiFetch } from './api';
import {
  CicloFacturacion,
  PlanSuscripcion,
  ResponseSuscripcionDto,
} from '@/ts/suscripcion';

export async function getSuscripcionActiva(
  token: string,
): Promise<ResponseSuscripcionDto | null> {
  return apiFetch<ResponseSuscripcionDto | null>('/suscripciones/activa', {
    token,
  });
}

export async function crearSuscripcion(
  plan: PlanSuscripcion,
  facturacion: CicloFacturacion,
  token: string,
): Promise<ResponseSuscripcionDto> {
  return apiFetch<ResponseSuscripcionDto>('/suscripciones', {
    method: 'POST',
    token,
    body: { Plan: plan, Facturacion: facturacion },
  });
}

export async function cancelarSuscripcion(
  id: number,
  token: string,
): Promise<void> {
  return apiFetch<void>(`/suscripciones/${id}/cancelar`, {
    method: 'PATCH',
    token,
  });
}
