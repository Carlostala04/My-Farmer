export enum PlanSuscripcion {
  GRATUITO = 'gratuito',
  PREMIUM = 'premium',
}

export enum CicloFacturacion {
  MENSUAL = 'mensual',
  ANUAL = 'anual',
}

export enum EstadoSuscripcion {
  ACTIVA = 'activa',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada',
}

export interface CreateSuscripcionDto {
  Usuario_id: number;
  Plan: PlanSuscripcion;
  Facturacion: CicloFacturacion;
  Inicio: Date;
  Fin?: Date | null;
  Estado: EstadoSuscripcion;
}

export interface ResponseSuscripcionDto {
  Suscripcion_id: number;
  Usuario_id: number;
  Plan: string;
  Facturacion: string;
  Inicio: Date;
  Fin: Date | null;
  Estado: string;
}

export interface UpdateSuscripcionDto {
  Plan?: PlanSuscripcion;
  Facturacion?: CicloFacturacion;
  Inicio?: Date;
  Fin?: Date | null;
  Estado?: EstadoSuscripcion;
}