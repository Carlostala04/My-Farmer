import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import NavBar from "@/components/navBar";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import LivestockIcon from "@/components/ui/livestock_icon";
import WheatIcon from "@/components/ui/wheat_icon";

const usuario = {
  nombre: "Carlos",
  apellido: "López",
};

const animales = [
  {
    nombre: "Boby",
    raza: "Ternero",
    edad: 0.5,
    estado: "saludable",
    color: "Café",
    peso: 80,
    imagen:
      "https://a.storyblok.com/f/160385/4bf112f0cd/datos_curiosos.jpg/m/filters:quality(70)/",
  },
  {
    nombre: "Luna",
    raza: "Vaca",
    edad: 3,
    estado: "Prenada",
    color: "Marrón",
    peso: 480,
    imagen:
      "https://imagenes.elpais.com/resizer/v2/OPHSOSNE2O673X77I7JAPNANV4.jpg?auth=e31b607f28c9844d1f9552df6f643d319102aba87dc69ca60e3c4dffdab20344&width=1960&height=1470&smart=true",
  },
  {
    nombre: "RedBull",
    raza: "Brahman",
    edad: 2,
    estado: "produciendo",
    color: "Gris",
    peso: 700,
    imagen:
      "https://lasventastour.com/wp-content/uploads/2023/12/Toro-Bravo-Las-Ventas-Tour-2.webp",
  },
];

const cultivos = [
  {
    id: 1,
    nombre: "Maíz Híbrido",
    fechaSiembra: "15 Mar 2024",
    ubicacion: "Parcela Norte",
    estado: true,
    imagen: "https://mayasl.com/wp-content/uploads/2020/08/cultivo-maiz_3.jpg",
  },
  {
    id: 2,
    nombre: "Trigo Primavera",
    fechaSiembra: "02 Abr 2024",
    ubicacion: "Parcela Sur",
    estado: false,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Wheat_close-up.JPG/1200px-Wheat_close-up.JPG",
  },
  {
    id: 3,
    nombre: "Lechuga",
    fechaSiembra: "10 Abr 2024",
    ubicacion: "Invernadero",
    estado: true,
    imagen:
      "https://cdn.wikifarmer.com/images/detailed/2019/07/Como-Cultivar-Lechuga-%E2%80%93-Guia-Completa-de-Cultivo-de-la-Lechuga-desde-la-Siembra-hasta-la-Cosecha.jpg",
  },
];

const recordatorios = [
  {
    id: "1",
    titulo: "Vacunar al ganado contra la fiebre aftosa.",
    fecha: "15 de Mayo de 2024",
    categoria: "Animales",
  },
  {
    id: "2",
    titulo: "Revisar riego en parcela de maíz.",
    fecha: "16 de Mayo de 2024",
    categoria: "Cultivos",
  },
  {
    id: "3",
    titulo: "Aplicar fertilizante orgánico a la plantación de tomate.",
    fecha: "18 de Mayo de 2024",
    categoria: "Cultivos",
  },
];

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

  const totalAnimales = animales.length;
  const totalCultivos = cultivos.length;

  return (
    <>
      <NavBar />
      <ScrollView
        style={[styles.container, { backgroundColor: t.bg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bienvenida */}
        <View style={[styles.welcomeCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.welcomeTitle, { color: t.title }]}>¡Hola, {usuario.nombre}!</Text>
          <Text style={[styles.welcomeSubtitle, { color: t.subtitle }]}>
            Hoy es un buen día para la siembra.
          </Text>
        </View>

        {/* Widgets de estadísticas */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={styles.statIconWrapper}>
              <LivestockIcon size={30} color={Colors.PRIMARY_GREEN} />
            </View>
            <Text style={[styles.statValue, { color: t.title }]}>{totalAnimales}</Text>
            <Text style={[styles.statLabel, { color: t.subtitle }]}>Total Ganado</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={styles.statIconWrapper}>
              <WheatIcon size={30} color={Colors.PRIMARY_GREEN} />
            </View>
            <Text style={[styles.statValue, { color: t.title }]}>{totalCultivos}</Text>
            <Text style={[styles.statLabel, { color: t.subtitle }]}>Cultivos Activos</Text>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>Accesos Rápidos</Text>
        <View style={[styles.quickAccessCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => router.push("/(tabs)/animals" as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#E8F5E9" }]}>
              <LivestockIcon size={22} color={Colors.PRIMARY_GREEN} />
            </View>
            <Text style={[styles.quickLabel, { color: t.title }]}>Ver lista de animales</Text>
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
            <Text style={[styles.quickLabel, { color: t.title }]}>Ver lista de cultivos</Text>
            <Text style={styles.quickArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Animales Recientes */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.title }]}>Animales Recientes</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/animals" as any)}
          >
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
          style={styles.horizontalScroll}
        >
          {animales.map((animal, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.animalCard, { backgroundColor: t.card, borderColor: t.border }]}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/animailsDetails" as any,
                  params: {
                    nombre: animal.nombre,
                    edad: animal.edad,
                    estado: animal.estado,
                    raza: animal.raza,
                    color: animal.color,
                    peso: animal.peso,
                    imagen: animal.imagen,
                  },
                })
              }
            >
              <Image
                source={{ uri: animal.imagen }}
                style={styles.animalImage}
              />
              <View
                style={[
                  styles.animalBadge,
                  {
                    backgroundColor:
                      statusColors[animal.estado.toUpperCase()] ??
                      Colors.PRIMARY_GREEN,
                  },
                ]}
              >
                <Text style={styles.animalBadgeText}>{animal.estado}</Text>
              </View>
              <View style={styles.animalInfo}>
                <Text style={[styles.animalName, { color: t.title }]} numberOfLines={1}>
                  {animal.nombre} ({animal.raza})
                </Text>
                <Text style={[styles.animalAge, { color: t.subtitle }]}>
                  🐾{" "}
                  {animal.edad < 1
                    ? `${animal.edad * 12} meses`
                    : `${animal.edad} años`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cultivos Recientes */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.title }]}>Cultivos Recientes</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cultivos" as any)}
          >
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
          style={styles.horizontalScroll}
        >
          {cultivos.map((cultivo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cultivoCardWrapper}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/cultivosDetails" as any,
                  params: {
                    nombre: cultivo.nombre,
                    fechaSiembra: cultivo.fechaSiembra,
                    ubicacion: cultivo.ubicacion,
                    estado: String(cultivo.estado),
                    imagen: cultivo.imagen,
                  },
                })
              }
            >
              <ImageBackground
                source={{ uri: cultivo.imagen }}
                style={styles.cultivoCard}
                imageStyle={styles.cultivoImageStyle}
              >
                <View style={styles.cultivoOverlay} />
                <View
                  style={[
                    styles.cultivoBadge,
                    {
                      backgroundColor: cultivo.estado
                        ? "#2b972148"
                        : "#e60d0da1",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cultivoBadgeText,
                      { color: cultivo.estado ? "#4ADE80" : "#fff" },
                    ]}
                  >
                    {cultivo.estado ? "En Crecimiento" : "Recién Sembrado"}
                  </Text>
                </View>
                <View style={styles.cultivoContent}>
                  <Text style={styles.cultivoName} numberOfLines={1}>
                    {cultivo.nombre}
                  </Text>
                  <Text style={styles.cultivoDate}>
                    📅 {cultivo.fechaSiembra}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Próximos Recordatorios */}
        <Text style={[styles.sectionTitle, { color: t.title }]}>Próximos Recordatorios</Text>
        {recordatorios.map((rec) => (
          <View key={rec.id} style={[styles.reminderCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View
              style={[
                styles.reminderDot,
                {
                  backgroundColor:
                    rec.categoria === "Animales"
                      ? Colors.PRIMARY_GREEN
                      : "#3B82F6",
                },
              ]}
            />
            <View style={styles.reminderContent}>
              <Text style={[styles.reminderTitle, { color: t.title }]} numberOfLines={2}>
                {rec.titulo}
              </Text>
              <Text style={styles.reminderDate}>{rec.fecha}</Text>
            </View>
            <View
              style={[
                styles.reminderBadge,
                rec.categoria === "Animales"
                  ? styles.badgeAnimal
                  : styles.badgeCultivo,
              ]}
            >
              <Text
                style={[
                  styles.reminderBadgeText,
                  rec.categoria === "Animales"
                    ? styles.badgeTextAnimal
                    : styles.badgeTextCultivo,
                ]}
              >
                {rec.categoria}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 16 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Bienvenida
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

  // Stats
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

  // Section
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

  // Quick Access
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
  quickEmoji: { fontSize: 20 },
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

  // Horizontal scroll
  horizontalScroll: { marginBottom: 24 },
  horizontalContent: { paddingRight: 4 },

  // Animal card
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

  // Cultivo card
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

  // Reminders
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    gap: 12,
  },
  reminderDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  reminderContent: { flex: 1, gap: 3 },
  reminderTitle: { fontSize: 13, color: Colors.TITLE, fontWeight: "500" },
  reminderDate: { fontSize: 11, color: Colors.PLACEHOLDER_GRAY },
  reminderBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAnimal: { backgroundColor: "#F3F4F6" },
  badgeCultivo: { backgroundColor: "#DCFCE7" },
  reminderBadgeText: { fontSize: 11, fontWeight: "500" },
  badgeTextAnimal: { color: Colors.SUBTITLE },
  badgeTextCultivo: { color: Colors.PRIMARY_GREEN },
});
