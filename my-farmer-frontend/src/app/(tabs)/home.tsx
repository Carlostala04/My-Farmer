/**
 * Pantalla de Inicio / Dashboard (home.tsx)
 *
 * Muestra un resumen del estado de la granja del usuario: animales recientes,
 * cultivos activos y próximos recordatorios.
 *
 * Cambios respecto a la versión anterior:
 *  - Se eliminaron todos los datos hardcodeados (usuario, animales, cultivos, recordatorios).
 *  - Se integraron los hooks `useUsuario`, `useAnimales` y `useCultivos` para mostrar
 *    datos reales del backend.
 *  - El nombre en el saludo ahora muestra el nombre real del usuario autenticado.
 *  - Los contadores de estadísticas usan las listas reales del backend.
 *  - Las secciones de "Animales Recientes" y "Cultivos Recientes" muestran los
 *    últimos 5 registros del backend.
 *  - Los recordatorios se muestran vacíos (pendiente: integrar hook de recordatorios).
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "@/components/navBar";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import LivestockIcon from "@/components/ui/livestock_icon";
import WheatIcon from "@/components/ui/wheat_icon";
import { useAnimales } from "@/hooks/useAnimales";
import { useCultivos } from "@/hooks/useCultivos";
import { useUsuario } from "@/hooks/useUsuario";

const statusColors: Record<string, string> = {
  SALUDABLE: Colors.PRIMARY_GREEN,
  ENTRENANDO: "rgba(5, 23, 26, 0.87)",
  CRECIENDO: "rgba(27, 218, 129, 0.87)",
  PRODUCIENDO: "rgba(9, 129, 150, 0.87)",
  ENFERMO: "rgba(32, 150, 9, 0.87)",
  MUERTO: "rgba(150, 9, 9, 0.87)",
  PRENADA: "rgba(180, 80, 200, 0.87)",
};

export default function Home() {
  const router = useRouter();
  const { t } = useTheme();
  const insets = useSafeAreaInsets();

  // Datos reales del backend
  const { usuario, loading: loadingUsuario } = useUsuario();
  const { animales, loading: loadingAnimales } = useAnimales();
  const { cultivos, loading: loadingCultivos } = useCultivos();

  // Se muestran solo los 5 más recientes en el carrusel del home
  const animalesRecientes = animales.slice(0, 5);
  const cultivosRecientes = cultivos.slice(0, 5);

  return (
    <>
      <NavBar />
      <ScrollView
        style={[styles.container, { backgroundColor: t.bg }]}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: 80 + insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bienvenida con nombre real del usuario */}
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: t.card, borderColor: t.border },
          ]}
        >
          <Text style={[styles.welcomeTitle, { color: t.title }]}>
            {loadingUsuario
              ? "¡Hola!"
              : `¡Hola, ${usuario?.Nombre ?? "Agricultor"}!`}
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: t.subtitle }]}>
            Hoy es un buen día para la siembra.
          </Text>
        </View>

        {/* Widgets de estadísticas con conteos reales */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: t.card, borderColor: t.border },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <LivestockIcon size={30} color={Colors.PRIMARY_GREEN} />
            </View>
            {loadingAnimales ? (
              <ActivityIndicator size="small" color={Colors.PRIMARY_GREEN} />
            ) : (
              <Text style={[styles.statValue, { color: t.title }]}>
                {animales.length}
              </Text>
            )}
            <Text style={[styles.statLabel, { color: t.subtitle }]}>
              Total Ganado
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: t.card, borderColor: t.border },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <WheatIcon size={30} color={Colors.PRIMARY_GREEN} />
            </View>
            {loadingCultivos ? (
              <ActivityIndicator size="small" color={Colors.PRIMARY_GREEN} />
            ) : (
              <Text style={[styles.statValue, { color: t.title }]}>
                {cultivos.length}
              </Text>
            )}
            <Text style={[styles.statLabel, { color: t.subtitle }]}>
              Cultivos Activos
            </Text>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>
          Accesos Rápidos
        </Text>
        <View
          style={[
            styles.quickAccessCard,
            { backgroundColor: t.card, borderColor: t.border },
          ]}
        >
          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => router.push("/(tabs)/animals" as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#E8F5E9" }]}>
              <LivestockIcon size={22} color={Colors.PRIMARY_GREEN} />
            </View>
            <Text style={[styles.quickLabel, { color: t.title }]}>
              Ver lista de animales
            </Text>
            <Text style={styles.quickArrow}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: t.border }]} />

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => router.push("/(tabs)/cultivos" as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#FFF8E1" }]}>
              <WheatIcon size={22} color="#CA8A04" />
            </View>
            <Text style={[styles.quickLabel, { color: t.title }]}>
              Ver lista de cultivos
            </Text>
            <Text style={styles.quickArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Animales Recientes (últimos 5 del backend) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.title }]}>
            Animales Recientes
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/animals" as any)}
          >
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {loadingAnimales ? (
          <ActivityIndicator
            size="small"
            color={Colors.PRIMARY_GREEN}
            style={{ marginBottom: 24 }}
          />
        ) : animalesRecientes.length === 0 ? (
          <Text style={[styles.emptyText, { color: t.subtitle }]}>
            No hay animales registrados.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
            style={styles.horizontalScroll}
          >
            {animalesRecientes.map((animal) => (
              <TouchableOpacity
                key={animal.Animal_id}
                style={[
                  styles.animalCard,
                  { backgroundColor: t.card, borderColor: t.border },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/animailsDetails" as any,
                    params: {
                      animal_id: animal.Animal_id,
                      nombre: animal.Nombre,
                      raza: animal.Raza ?? "",
                      color: animal.Color ?? "",
                      peso: animal.Peso ?? "",
                      foto: animal.Foto ?? "",
                      estado: animal.Estado_Label ?? "",
                    },
                  })
                }
              >
                <Image
                  source={{ uri: animal.Foto ?? undefined }}
                  style={styles.animalImage}
                />
                <View
                  style={[
                    styles.animalBadge,
                    {
                      backgroundColor:
                        statusColors[
                          (animal.Estado_Label ?? "").toUpperCase()
                        ] ?? Colors.PRIMARY_GREEN,
                    },
                  ]}
                >
                  <Text style={styles.animalBadgeText}>
                    {animal.Estado_Label ?? "—"}
                  </Text>
                </View>
                <View style={styles.animalInfo}>
                  <Text
                    style={[styles.animalName, { color: t.title }]}
                    numberOfLines={1}
                  >
                    {animal.Nombre} {animal.Raza ? `(${animal.Raza})` : ""}
                  </Text>
                  <Text style={[styles.animalAge, { color: t.subtitle }]}>
                    🐾 {animal.Categoria ?? "Animal"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Cultivos Recientes (últimos 5 del backend) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.title }]}>
            Cultivos Recientes
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cultivos" as any)}
          >
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {loadingCultivos ? (
          <ActivityIndicator
            size="small"
            color={Colors.PRIMARY_GREEN}
            style={{ marginBottom: 24 }}
          />
        ) : cultivosRecientes.length === 0 ? (
          <Text style={[styles.emptyText, { color: t.subtitle }]}>
            No hay cultivos activos registrados.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
            style={styles.horizontalScroll}
          >
            {cultivosRecientes.map((cultivo) => (
              <TouchableOpacity
                key={cultivo.Cultivo_id}
                style={styles.cultivoCardWrapper}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/cultivosDetails" as any,
                    params: {
                      cultivo_id: cultivo.Cultivo_id,
                      nombre: cultivo.Nombre,
                      fechaSiembra: cultivo.Fecha_Siembra ?? "",
                      ubicacion: cultivo.Parcela ?? "",
                      estado: String(cultivo.Activo),
                      imagen: cultivo.Foto ?? "",
                    },
                  })
                }
              >
                <ImageBackground
                  source={{ uri: cultivo.Foto ?? undefined }}
                  style={styles.cultivoCard}
                  imageStyle={styles.cultivoImageStyle}
                >
                  <View style={styles.cultivoOverlay} />
                  <View
                    style={[
                      styles.cultivoBadge,
                      {
                        backgroundColor: cultivo.Activo
                          ? "#2b972148"
                          : "#e60d0da1",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cultivoBadgeText,
                        { color: cultivo.Activo ? "#4ADE80" : "#fff" },
                      ]}
                    >
                      {cultivo.Activo ? "En Crecimiento" : "Cosechado"}
                    </Text>
                  </View>
                  <View style={styles.cultivoContent}>
                    <Text style={styles.cultivoName} numberOfLines={1}>
                      {cultivo.Nombre}
                    </Text>
                    <Text style={styles.cultivoDate}>
                      📅 {cultivo.Fecha_Siembra ?? "Sin fecha"}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Próximos Recordatorios — pendiente de integración con el backend */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>
          Próximos Recordatorios
        </Text>
        <Text style={[styles.emptyText, { color: t.subtitle }]}>
          No hay recordatorios próximos.
        </Text>

        <View style={{ height: 16 }} />
        <Pressable
          style={styles.button_map}
          onPress={() => router.replace("/(tabs)/Mapa")}
        >
          <Text style={styles.button_map_text}>Ir a mapa</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  scrollContent: { padding: 16 },

  welcomeCard: {
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 4,
  },
  welcomeSubtitle: { fontSize: 14, color: Colors.SUBTITLE },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 28, fontWeight: "700", color: Colors.TITLE },
  statLabel: { fontSize: 12, color: Colors.SUBTITLE, textAlign: "center" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 12,
  },
  verTodo: { fontSize: 14, color: Colors.PRIMARY_GREEN, fontWeight: "600" },
  emptyText: {
    fontSize: 13,
    color: Colors.SUBTITLE,
    marginBottom: 24,
    marginTop: -8,
  },

  quickAccessCard: {
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
    marginBottom: 24,
    overflow: "hidden",
  },
  quickAccessItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.TITLE,
    fontWeight: "500",
  },
  quickArrow: {
    fontSize: 24,
    color: Colors.PLACEHOLDER_GRAY,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.DIVIDER,
    marginHorizontal: 16,
  },

  horizontalScroll: { marginBottom: 24 },
  horizontalContent: { paddingRight: 4 },

  animalCard: {
    width: 150,
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.DIVIDER,
    overflow: "hidden",
  },
  animalImage: {
    width: "100%",
    height: 110,
    backgroundColor: Colors.SKELETON_BACKGROUND,
  },
  animalBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  animalBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  animalInfo: { padding: 10, gap: 3 },
  animalName: { fontSize: 13, fontWeight: "700", color: Colors.TITLE },
  animalAge: { fontSize: 11, color: Colors.SUBTITLE },

  cultivoCardWrapper: { width: 175, marginRight: 12 },
  cultivoCard: {
    width: 175,
    height: 120,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 14,
  },
  cultivoImageStyle: { borderRadius: 14 },
  cultivoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 14,
  },
  cultivoBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  cultivoBadgeText: { fontSize: 10, fontWeight: "600" },
  cultivoContent: { paddingHorizontal: 10, paddingBottom: 10, gap: 2 },
  cultivoName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cultivoDate: { color: "rgba(255,255,255,0.85)", fontSize: 11 },
  button_map: {
    backgroundColor: Colors.PRIMARY_GREEN,
    width: 100,
    height: 34,
    borderRadius: 5,
  },

  button_map_text: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
});
