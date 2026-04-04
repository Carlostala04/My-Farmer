/**
 * Hook Personalizado useAuth
 * 
 * Este hook gestiona el estado de autenticación en toda la aplicación.
 * Permite acceder a la sesión actual (y al token JWT) de forma reactiva.
 */

import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { supabase } from './supabaseClient'

export function useAuth() {
  // Estado que guarda la sesión actual (contiene el usuario y el access_token)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Guardia para evitar actualizaciones de estado en componentes desmontados
    let isMounted = true

    // 1. Intentar recuperar la sesión guardada en AsyncStorage al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setSession(session)
    })

    // 2. Suscribirse a cambios en el estado de autenticación (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      if (isMounted) setSession(sessionData)
    })

    // 3. Manejar el refresco del token al minimizar/abrir la app
    // React Native pausa los temporizadores en segundo plano; esto fuerza el refresco al volver.
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
    })

    // Limpieza al desmontar el hook
    return () => {
      isMounted = false
      subscription.unsubscribe() // Cancela la escucha de cambios de sesión
      appStateSubscription.remove() // Elimina el listener del estado de la app
    }
  }, [])

  // Retornamos la sesión para que cualquier componente pueda usar session.access_token
  return { session }
}
