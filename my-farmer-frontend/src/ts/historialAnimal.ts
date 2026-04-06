export interface ResponseHistorialAnimalDto {
  Historial_Animal_id: number;
  Animal_id: number;
  Campo_Mod: string;
  Valor_Ant: string;
  Valor_Nue: string;
  Fecha: Date;
}

export interface HistorialAnimalDto {
  limit?: number;
}