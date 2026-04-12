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
 * Uso: llamar con el access_token de Supabase. Si es null (usuario no
 * autenticado aún) el hook no hace nada hasta que el token esté disponible.
 */

import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { router } from "expo-router";
import { guardarPushToken } from "@/services/usuariosService";

// Configura cómo se muestran las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registrarDispositivo(): Promise<string | null> {
  // Las notificaciones push solo funcionan en dispositivos físicos
  if (!Device.isDevice) return null;

  // Verificar / solicitar permisos
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: nuevoStatus } =
      await Notifications.requestPermissionsAsync();
    status = nuevoStatus;
  }
  if (status !== "granted") return null;

  // Obtener el Expo Push Token del dispositivo
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
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
      .catch((error) => {
        console.warn("Error al registrar notificaciones:", error);
      });

    // Listener: notificación recibida mientras la app está abierta (foreground)
    receivedListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const titulo = notification.request.content.title ?? "Sin título";
        console.log("Notificación recibida en foreground:", titulo);
      },
    );

    // Listener: usuario tocó la notificación (foreground o background)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<string, unknown>;
        if (data?.screen === "recordatorios") {
          router.push("/(tabs)/recordatorios" as any);
        }
      });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [authToken]);
}
