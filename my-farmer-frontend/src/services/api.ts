/**
 * Módulo central de API (api.ts)
 *
 * Proporciona la función `apiFetch` que centraliza todas las llamadas HTTP al backend.
 * Se creó para evitar duplicar la lógica de autenticación y manejo de errores en
 * cada pantalla. Cualquier servicio específico (animalesService, cultivosService, etc.)
 * debe importar esta función en lugar de usar fetch directamente.
 *
 * Comportamiento:
 * - Agrega automáticamente la URL base desde EXPO_PUBLIC_API_URL.
 * - Adjunta el token Bearer de Supabase en cada petición autenticada.
 * - Para peticiones sin archivo: usa Content-Type application/json.
 * - Para peticiones con archivo (FormData): omite Content-Type para que React Native
 *   lo establezca automáticamente con el boundary correcto.
 * - Lanza un `ApiError` cuando el servidor responde con un estado HTTP de error,
 *   incluyendo el mensaje que devuelve el backend.
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

/** Error tipado con el código HTTP y el mensaje del servidor. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** Token JWT de Supabase (session.access_token) */
  token: string;
  /** Cuerpo de la petición: objeto plano (JSON) o FormData (con archivo) */
  body?: object | FormData;
  /** Indica si el body es FormData. Si es true, no se establece Content-Type manualmente */
  isFormData?: boolean;
}

/**
 * Realiza una petición HTTP al backend autenticada con Bearer token.
 * @param endpoint  Ruta relativa, ej: '/animales' o '/cultivos/activos'
 * @param options   Método, token, cuerpo y tipo de contenido
 * @returns         Respuesta tipada o lanza ApiError si el servidor falla
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions,
): Promise<T> {
  const { method = "GET", token, body, isFormData = false } = options;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // Si no es FormData, se envía JSON. Si es FormData, React Native pone el boundary solo.
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  });

  // Si el servidor responde con error, se extrae el mensaje y se lanza ApiError
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : (errorData.message ?? "Error en el servidor");
    throw new ApiError(response.status, message);
  }

  // DELETE y similares pueden devolver 204 sin cuerpo
  if (response.status === 204) return undefined as T;

  return response.json();
}
