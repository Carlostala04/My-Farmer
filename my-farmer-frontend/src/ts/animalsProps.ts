export type SexoAnimal = 'Macho' | 'Hembra';

export interface CreateAnimalDto {
  Nombre: string;
  Sexo: SexoAnimal;
  Categoria_Animal_id: number;
  Raza?: string | null;
  Color?: string | null;
  Fecha_Nacimiento?: string | null; // ISO date string para formularios
  Peso?: number | null;
  Peso_Unidad?: string | null;
  Altura?: number | null;
  Estado_Label?: string | null;
  Notas?: string | null;
  Foto?: string | null;
  Parcela_id?: number | null;
}

export interface UpdateAnimalDto {
  Nombre?: string;
  Raza?: string | null;
  Sexo?: SexoAnimal;
  Color?: string | null;
  Fecha_Nacimiento?: string | null;
  Peso?: number | null;
  Peso_Unidad?: string | null;
  Altura?: number | null;
  Estado_Label?: string | null;
  Notas?: string | null;
  Estado?: boolean;
  Parcela_id?: number | null;
  Categoria_Animal_id?: number;
  Foto?: string | null;
}

export interface ResponseAnimalDto {
  Animal_id: number;
  Nombre: string;
  Raza: string | null;
  Sexo: string;
  Color: string | null;
  Fecha_Nacimiento: string | null;
  Peso: number | null;
  Peso_Unidad: string | null;
  Altura: number | null;
  Estado_Label: string | null;
  Notas: string | null;
  Estado: boolean;
  Foto: string | null;
  Registro: string;
  Actualizado: string;
  Categoria: string;
  Parcela: string | null;
}

export interface CreateCategoriaAnimalDto {
  Nombre: string;
  Descripcion?: string | null;
  Icono?: string | null;
}

export interface UpdateCategoriaAnimalDto {
  Nombre?: string;
  Descripcion?: string | null;
  Icono?: string | null;
}

export interface ResponseCategoriaAnimalDto {
  Categoria_Animal_id: number;
  Nombre: string;
  Descripcion: string | null;
  Icono: string | null;
  Registro: string;
}

export type TipoEvento = 'Vacuna' | 'Enfermedad' | 'Reproduccion' | 'Otro';

export interface CreateEventoAnimalDto {
  Animal_id: number;
  Titulo: string;
  Fecha: string; // ISO date string
  Tipo: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}

export interface UpdateEventoAnimalDto {
  Titulo?: string;
  Fecha?: string;
  Tipo?: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}

export interface ResponseHistorialAnimalDto {
  Historial_Animal_id: number;
  Animal_id: number;
  Campo_Mod: string;
  Valor_Ant: string;
  Valor_Nue: string;
  Fecha: string;
}
