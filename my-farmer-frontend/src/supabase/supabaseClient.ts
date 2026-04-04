/**
 * Configuración del Cliente de Supabase
 * 
 * Este archivo centraliza la conexión con el proyecto de Supabase.
 * Se utiliza AsyncStorage para que la sesión del usuario persista 
 * incluso después de cerrar la aplicación.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Inicialización del cliente con variables de entorno
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,          // Motor de almacenamiento para React Native
      autoRefreshToken: true,         // Permite que Supabase renueve el token JWT automáticamente
      persistSession: true,           // Mantiene al usuario logueado entre reinicios de la app
      detectSessionInUrl: false       // Deshabilitado ya que no usamos redirecciones web (OAuth)
    }
  }
)
