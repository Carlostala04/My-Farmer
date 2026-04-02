export type PlanSuscripcion = 'Gratis' | 'Premium' | 'Empresarial';
export type CicloFacturacion = 'Mensual' | 'Anual';
export type EstadoSuscripcion = 'Activa' | 'Cancelada' | 'Expirada';

export interface ResponseUsuarioDto {
  Usuario_id: number;
  Nombre?: string;
  Apellido?: string;
  Correo: string;
  Foto?: string | null;
  Auth_Provider?: string | null;
  Premium: boolean;
  Expira?: string | null;
  Estado: boolean;
  Registro: string;
  Actualizado: string;
  supabaseId?: string | null;
}

export interface CreateSuscripcionDto {
  Usuario_id: number;
  Plan: PlanSuscripcion;
  Facturacion: CicloFacturacion;
  Inicio: string; // ISO date string
  Fin?: string | null;
  Estado: EstadoSuscripcion;
}

export interface UpdateSuscripcionDto {
  Plan?: PlanSuscripcion;
  Facturacion?: CicloFacturacion;
  Inicio?: string;
  Fin?: string | null;
  Estado?: EstadoSuscripcion;
}
