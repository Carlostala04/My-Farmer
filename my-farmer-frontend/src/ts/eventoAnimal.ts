/** Tipos de evento registrables para un animal. Deben coincidir con el enum del backend. */
export type TipoEvento = 'vacuna' | 'revision' | 'tratamiento' | 'alimentacion' | 'otro';

export interface CreateEventoAnimalDto {
  Animal_id: number;
  Titulo: string;
  Fecha: string; // ISO date string (ej. "2026-04-10")
  Tipo: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}

export interface UpdateEventoAnimalDto {
  Titulo?: string;
  Fecha?: string; // ISO date string
  Tipo?: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}

export interface ResponseEventoAnimalDto {
  Evento_id: number;
  Animal_id: number;
  Titulo: string;
  Descripcion: string | null;
  Fecha: string; // El backend devuelve Date; se serializa como string en JSON
  Tipo: TipoEvento;
  Foto: string | null;
  Registro: string;
}
