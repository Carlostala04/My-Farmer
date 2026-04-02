export type EstadoCultivo = 'en_crecimiento'|'cosechado';

export interface CreateCultivoDto {
  Nombre: string;
  Estado: EstadoCultivo;
  Fecha_Siembra?: string | null; // ISO date string (YYYY-MM-DD)
  Fecha_Cosecha_Estimada?: string | null;
  Fecha_Cosecha?: string | null;
  Rendimiento_Estimado?: number | null;
  Rendimiento_Unidad?: string | null;
  Notas?: string | null;
  Foto?: string | null;
  Parcela_id?: number | null;
  Tipo_Cultivo_id?: number | null;
}

export interface UpdateCultivoDto {
  Nombre?: string;
  Estado?: EstadoCultivo;
  Fecha_Siembra?: string | null;
  Fecha_Cosecha_Estimada?: string | null;
  Fecha_Cosecha?: string | null;
  Rendimiento_Estimado?: number | null;
  Rendimiento_Unidad?: string | null;
  Notas?: string | null;
  Foto?: string | null;
  Activo?: boolean;
  Parcela_id?: number | null;
  Tipo_Cultivo_id?: number | null;
}

export interface ResponseCultivoDto {
  Cultivo_id: number;
  Nombre: string;
  Estado: string;
  Fecha_Siembra: string | null;
  Fecha_Cosecha_Estimada: string | null;
  Fecha_Cosecha: string | null;
  Rendimiento_Estimado: number | null;
  Rendimiento_Unidad: string | null;
  Notas: string | null;
  Foto: string | null;
  Activo: boolean;
  Registro: string;
  Actualizado: string;
  Tipo_Cultivo: string | null;
  Parcela: string | null;
}

export interface ResponseTipoCultivoDto {
  Tipo_Cultivo_id: number;
  Nombre: string;
  Descripcion: string | null;
  Icono: string | null;
  Registro: string;
}

export interface CreateCrecimientoDto {
  Cultivo_id: number;
  Altura?: number | null;
  Observaciones?: string | null;
  Foto?: string | null;
}

export interface UpdateCrecimientoDto {
  Altura?: number | null;
  Observaciones?: string | null;
  Foto?: string | null;
}

export interface ResponseCrecimientoDto {
  Crecimiento_id: number;
  Cultivo_id: number;
  Altura: number | null;
  Observaciones: string | null;
  Foto: string | null;
  Registro: string;
}

export interface CreateCosechaDto {
  Cultivo_id: number;
  Fecha: string; // ISO date string (YYYY-MM-DD)
  Cantidad: number;
  Unidad: string;
  Observaciones?: string | null;
}

export interface UpdateCosechaDto {
  Fecha?: string;
  Cantidad?: number;
  Unidad?: string;
  Observaciones?: string | null;
}

export interface ResponseCosechaDto {
  Cosecha_id: number;
  Cultivo_id: number;
  Fecha: string;
  Cantidad: number;
  Unidad: string;
  Observaciones: string | null;
  Registro: string;
}

export interface ResponseHistorialCultivoDto {
  Historial_Cultivo_id: number;
  Cultivo_id: number;
  Campo_Mod: string;
  Valor_Ant: string;
  Valor_Nue: string;
  Fecha: string;
}
