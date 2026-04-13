/**
 * Pantalla de Perfil (perfil.tsx)
 *
 * Cambios respecto a la versión anterior:
 *  - Se reemplazaron los datos hardcodeados (nombre, correo) por datos reales del backend
 *    usando el hook `useUsuario`, que llama a GET /usuarios/me.
 *  - Los contadores de "ANIMALES" y "CULTIVOS" ahora muestran los totales reales
 *    usando los hooks `useAnimales` y `useCultivos`.
 *  - Se agregó funcionalidad real al botón "Cerrar Sesión": llama a supabase.auth.signOut()
 *    y redirige al usuario a la pantalla de login.
 *  - Se muestra un skeleton/placeholder mientras los datos del perfil cargan.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import NavBar from "@/components/navBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useUsuario } from "@/hooks/useUsuario";
import { useAnimales } from "@/hooks/useAnimales";
import { useCultivos } from "@/hooks/useCultivos";
import { supabase } from "@/supabase/supabaseClient";
import { actualizarPerfil } from "@/services/usuariosService";
import { useSuscripcion } from "@/hooks/useSuscripcion";
import { PlanSuscripcion } from "@/ts/suscripcion";

const IconSettings = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const IconBell = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const IconGlobe = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Circle cx={12} cy={12} r={10} />
    <Line x1={2} y1={12} x2={22} y2={12} />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const IconMoon = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const IconShield = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const IconSync = ({ dark }: { dark: boolean }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={dark ? "#fff" : "#1A1A1A"}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <Path d="M23 4v6h-6" />
    <Path d="M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);

export default function PerfilScreen() {
  const { darkMode, toggleDarkMode, t } = useTheme();
  const [notificaciones, setNotificaciones] = useState(true);
  const [preferenciasOpen, setPreferenciasOpen] = useState(true);
  const [seguridadOpen, setSeguridadOpen] = useState(false);
  const [sincronizacionOpen, setSincronizacionOpen] = useState(false);
  const [foto, setFoto] = useState("");
  const router = useRouter();
  const d = darkMode;
  const bg = t.bg;
  const card = t.card;
  const title = t.title;
  const subtitle = t.subtitle;
  const border = t.border;

  // Datos reales del backend
  const {
    usuario,
    loading: loadingUsuario,
    refetch: refetchUsuario,
  } = useUsuario();
  const { animales } = useAnimales();
  const { cultivos } = useCultivos();
  const { suscripcionActiva } = useSuscripcion();

  const tienePremium = suscripcionActiva?.Plan === PlanSuscripcion.PREMIUM;

  // Estado local de carga de foto (para mostrar spinner mientras se sube)
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [fotoMenuVisible, setFotoMenuVisible] = useState(false);

  /**
   * Sube la imagen seleccionada a Supabase Storage y actualiza el perfil en el backend.
   * Flujo: ImagePicker → Supabase Storage (bucket 'usuario') → PATCH /usuarios
   */
  const procesarFoto = async (uri: string) => {
    setSubiendoFoto(true);
    try {
      const token =
        (await supabase.auth.getSession()).data.session?.access_token ?? "";
      await actualizarPerfil({}, token, uri);
      setFoto(uri);
      await refetchUsuario();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo actualizar la foto.");
    } finally {
      setSubiendoFoto(false);
    }
  };

  /** Elimina la foto de perfil en el backend y limpia el estado local. */
  const eliminarFoto = async () => {
    if (!usuario?.Usuario_id) return;
    setSubiendoFoto(true);
    try {
      const token =
        (await supabase.auth.getSession()).data.session?.access_token ?? "";
      await actualizarPerfil({ Foto: null }, token);
      setFoto("");
      await refetchUsuario();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo eliminar la foto.");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const cambiarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled) await procesarFoto(resultado.assets[0].uri);
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu cámara.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled) await procesarFoto(resultado.assets[0].uri);
  };

  const seleccionarFoto = () => {
    if (Platform.OS === "ios") {
      Alert.alert("Cambiar foto", "¿Cómo quieres cambiar tu foto?", [
        { text: "Cámara", onPress: tomarFoto },
        { text: "Galería", onPress: cambiarFoto },
        { text: "Eliminar foto", style: "destructive", onPress: eliminarFoto },
        { text: "Cancelar", style: "cancel" },
      ]);
    } else {
      setFotoMenuVisible(true);
    }
  };

  /** Cierra la sesión del usuario en Supabase y redirige al login. */
  const handleCerrarSesion = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/(tabs)/login" as any);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <NavBar />
      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        contentContainerStyle={styles.container}
      >
        {/* Avatar y nombre */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={seleccionarFoto}
            disabled={subiendoFoto}
          >
            {/* Muestra la foto local recién seleccionada, la del backend o el placeholder */}
            {foto || usuario?.Foto ? (
              <Image
                source={{ uri: foto || usuario?.Foto || undefined }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: d ? "#374151" : "#E5E7EB",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Svg
                  width={50}
                  height={50}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={d ? "#9CA3AF" : "#6B7280"}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                >
                  <Circle cx={12} cy={8} r={4} />
                  <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </Svg>
              </View>
            )}
            {/* Badge de edición o spinner de carga durante la subida */}
            <View style={styles.avatarBadge}>
              {subiendoFoto ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.avatarBadgeText}>✎</Text>
              )}
            </View>
          </TouchableOpacity>
          {loadingUsuario ? (
            <ActivityIndicator
              color={Colors.PRIMARY_GREEN}
              style={{ marginTop: 8 }}
            />
          ) : (
            <>
              <Text style={[styles.nombre, { color: title }]}>
                {usuario
                  ? `${usuario.Nombre ?? ""} ${usuario.Apellido ?? ""}`.trim()
                  : "—"}
              </Text>
              <Text style={[styles.infoText, { color: subtitle }]}>
                ✉ {usuario?.Correo ?? "—"}
              </Text>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: d ? "#1E3A5F" : "#22C55E" },
            ]}
          >
            <Text
              style={[styles.statNumber, { color: d ? "#93C5FD" : "#FFF" }]}
            >
              {animales.length}
            </Text>
            <Text style={[styles.statLabel, { color: d ? "#60A5FA" : "#FFF" }]}>
              ANIMALES
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: d ? "#1E3A5F" : "#22C55E" },
            ]}
          >
            <Text
              style={[styles.statNumber, { color: d ? "#93C5FD" : "#FFF" }]}
            >
              {cultivos.length}
            </Text>
            <Text style={[styles.statLabel, { color: d ? "#60A5FA" : "#FFF" }]}>
              CULTIVOS
            </Text>
          </View>
        </View>

        {/* Configuración */}
        <Text style={[styles.sectionTitle, { color: subtitle }]}>
          CONFIGURACIÓN
        </Text>

        {/* Preferencias */}
        <View
          style={[
            styles.accordion,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setPreferenciasOpen(!preferenciasOpen)}
          >
            <IconSettings dark={d} />
            <Text style={[styles.accordionTitle, { color: title }]}>
              Preferencias
            </Text>
            <Text style={[styles.accordionChevron, { color: subtitle }]}>
              {preferenciasOpen ? "∧" : "∨"}
            </Text>
          </TouchableOpacity>
          {preferenciasOpen && (
            <View style={styles.accordionContent}>
              <TouchableOpacity
                style={styles.premiumRow}
                onPress={() => router.push("/(tabs)/suscripcion" as any)}
              >
                <View style={styles.premiumIconWrap}>
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, { color: title }]}>
                    Suscripción Premium
                  </Text>
                  <Text style={[styles.premiumSubtitle, { color: subtitle }]}>
                    {tienePremium
                      ? "Plan activo y vigente"
                      : "Desbloquea todas las funciones"}
                  </Text>
                </View>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>
                    {tienePremium ? "Ver suscripción ›" : "Ver planes ›"}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: border }]} />
              <View style={styles.settingRow}>
                <IconBell dark={d} />
                <Text style={[styles.settingLabel, { color: title }]}>
                  Notificaciones
                </Text>
                <Switch
                  value={notificaciones}
                  onValueChange={setNotificaciones}
                  trackColor={{ false: "#D1D5DB", true: Colors.PRIMARY_GREEN }}
                  thumbColor="#fff"
                />
              </View>
              <View style={[styles.divider, { backgroundColor: border }]} />
              <TouchableOpacity style={styles.settingRow}>
                <IconGlobe dark={d} />
                <Text style={[styles.settingLabel, { color: title }]}>
                  Idioma
                </Text>
                <Text style={[styles.settingValue, { color: subtitle }]}>
                  Español (ES) ›
                </Text>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: border }]} />
              <View style={styles.settingRow}>
                <IconMoon dark={d} />
                <Text style={[styles.settingLabel, { color: title }]}>
                  Modo Oscuro
                </Text>
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: "#D1D5DB", true: Colors.PRIMARY_GREEN }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          )}
        </View>

        

        {/* Botones */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✎ Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleCerrarSesion}
        >
          <Text style={styles.logoutButtonText}>⎋ Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: subtitle }]}>
          Myfarmer v2.4.0 — 2026
        </Text>
      </ScrollView>

      {/* Action sheet para cambiar foto (Android) */}
      <Modal
        visible={fotoMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFotoMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFotoMenuVisible(false)}
        >
          <View style={[styles.modalSheet, { backgroundColor: card }]}>
            <Text style={[styles.modalTitle, { color: title }]}>
              Cambiar foto
            </Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFotoMenuVisible(false);
                tomarFoto();
              }}
            >
              <Text style={[styles.modalOptionText, { color: title }]}>
                Cámara
              </Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFotoMenuVisible(false);
                cambiarFoto();
              }}
            >
              <Text style={[styles.modalOptionText, { color: title }]}>
                Galería
              </Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFotoMenuVisible(false);
                eliminarFoto();
              }}
            >
              <Text style={[styles.modalOptionText, { color: "#EF4444" }]}>
                Eliminar foto
              </Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setFotoMenuVisible(false)}
            >
              <Text style={[styles.modalOptionText, { color: subtitle }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 140 },
  profileSection: { alignItems: "center", marginBottom: 24 },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarBadgeText: { color: "#fff", fontSize: 12 },
  nombre: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  infoText: { fontSize: 13, marginBottom: 2 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  statIcon: { fontSize: 22 },
  statNumber: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  accordion: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  accordionTitle: { flex: 1, fontSize: 15, fontWeight: "600" },
  accordionChevron: { fontSize: 14 },
  accordionContent: { paddingHorizontal: 16, paddingBottom: 8 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  settingLabel: { flex: 1, fontSize: 14 },
  settingValue: { fontSize: 14 },
  divider: { height: 0.5 },
  editButton: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutButton: {
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  logoutButtonText: { color: "#EF4444", fontSize: 16, fontWeight: "500" },
  version: { textAlign: "center", fontSize: 12, marginTop: 20 },
  premiumRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  premiumIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumSubtitle: { fontSize: 12, marginTop: 1 },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.PRIMARY_GREEN,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
  },
});
