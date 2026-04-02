export type EntidadTipo = 'Animal' | 'Cultivo' | 'Parcela';

export interface CreateRecordatorioDto {
  Entidad_Tipo: EntidadTipo;
  Entidad_id: number;
  Titulo: string;
  Descripcion?: string | null;
  Recordar: string; // ISO timestamp string (el backend usa timestamp)
}

export interface UpdateRecordatorioDto {
  Titulo?: string;
  Descripcion?: string | null;
  Recordar?: string;
  Cancelado?: boolean;
  Cancelado_En?: string | null;
}

export interface ResponseRecordatorioDto {
  Recordatorio_id: number;
  Usuario_id: number;
  Entidad_Tipo: string;
  Entidad_id: number;
  Titulo: string;
  Descripcion: string | null;
  Recordar: string; // timestamp
  Enviado: boolean;
  Cancelado: boolean;
  Cancelado_En: string | null;
  Registro: string;
}
