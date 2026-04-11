import { HistorialAnimalDto, ResponseHistorialAnimalDto } from "@/ts/historialAnimal";
import { apiFetch } from "./api";

export async function getHistorialAnimal(
  animalId: number,
  token: string,
  params?: HistorialAnimalDto,
): Promise<ResponseHistorialAnimalDto[]> {
  const query = new URLSearchParams();
  if (params?.limit != null) query.append("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<ResponseHistorialAnimalDto[]>(
    `/historial-animal/animal/${animalId}${qs ? `?${qs}` : ""}`,
    { token },
  );
}