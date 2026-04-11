import { HistorialCultivoDto, ResponseHistorialCultivoDto } from "@/ts/historialCultivo";
import { apiFetch } from "./api";

export async function getHistorialCultivo(
  cultivoId: number,
  token: string,
  params?: HistorialCultivoDto,
): Promise<ResponseHistorialCultivoDto[]> {
  const query = new URLSearchParams();
  if (params?.limit != null) query.append("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<ResponseHistorialCultivoDto[]>(
    `/historial-cultivo/cultivo/${cultivoId}${qs ? `?${qs}` : ""}`,
    { token },
  );
}
