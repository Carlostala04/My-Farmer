/**
 * Hook useNotifications
 *
 * Gestiona el registro de notificaciones push en la app:
 *  1. Solicita permisos al sistema operativo.
 *  2. Obtiene el Expo Push Token del dispositivo.
 *  3. Envía el token al backend (PATCH /usuarios/push-token) para que
 *     el cron job de recordatorios sepa a qué dispositivo enviar.
 *  4. Registra listeners para manejar notificaciones en foreground
 *     y cuando el usuario toca una notificación.
 *
 * Todos los errores de notificaciones se suprimen silenciosamente para
 * no mostrar mensajes de error al iniciar la aplicación (ej: emuladores,
 * dispositivos sin configuración de push token, permisos denegados).
 *
 * Uso: llamar con el access_token de Supabase. Si es null (usuario no
 * autenticado aún) el hook no hace nada hasta que el token esté disponible.
 */

import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { router } from "expo-router";
import { guardarPushToken } from "@/services/usuariosService";

// Configura cómo se muestran las notificaciones cuando la app está en primer plano.
// Envuelto en try/catch para suprimir errores en emuladores o configuraciones incompletas.
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch {
  // Silenciar error de configuración de notificaciones al inicio
}

async function registrarDispositivo(): Promise<string | null> {
  // Las notificaciones push solo funcionan en dispositivos físicos
  if (!Device.isDevice) return null;

  try {
    // Verificar / solicitar permisos
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: nuevoStatus } =
        await Notifications.requestPermissionsAsync();
      status = nuevoStatus;
    }
    if (status !== "granted") return null;

    // Verificar que el projectId esté configurado
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;

    // Obtener el Expo Push Token del dispositivo
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    return null;
  }
}

export function useNotifications(authToken: string | null) {
  const receivedListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Esperar a que el usuario esté autenticado
    if (!authToken) return;

    // Registrar el dispositivo y enviar el token al backend
    registrarDispositivo()
      .then(async (pushToken) => {
        if (!pushToken) return;
        await guardarPushToken(pushToken, authToken);
      })
      .catch(() => {
        // Suprimir errores de registro de notificaciones al inicio
      });

    try {
      // Listener: notificación recibida mientras la app está abierta (foreground)
      receivedListener.current = Notifications.addNotificationReceivedListener(
        () => {
          // Notificación recibida en foreground — no action needed
        },
      );

      // Listener: usuario tocó la notificación (foreground o background)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          try {
            const data = response.notification.request.content.data as Record<string, unknown>;
            if (data?.screen === "recordatorios") {
              router.push("/(tabs)/recordatorios" as any);
            }
          } catch {
            // Suprimir errores de navegación desde notificación
          }
        });
    } catch {
      // Suprimir errores al registrar listeners de notificaciones
    }

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [authToken]);
}
