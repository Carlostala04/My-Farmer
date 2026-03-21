import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import ScreenHeader from "@/components/header";
import { useLocalSearchParams } from "expo-router";

const AnimalsDetails = () => {
  const { nombre, raza, color, edad, peso, imagen } = useLocalSearchParams<{
    nombre: string;
    raza: string;
    color: string;
    edad: string;
    peso: string;
    imagen: string;
  }>();
  const recordatorios = [
    { titulo: "Vacuna de refuerzo", fecha: "2024-09-01" },
    { titulo: "Chequeo de dentadura", fecha: "2024-10-10" },
  ];

  const notasImportantes = [
    "Sensible a cambios bruscos de dieta.",
    "Requiere chequeos mensuales de pezuñas.",
    "Producción de leche estable, buena salud general.",
  ];

  return (
    <>
    <ScreenHeader title="Detalles Animal"/>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.about_container}>
          <Image source={{ uri: imagen }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.animalName}>{nombre}</Text>
            <Text style={styles.animalRaza}>Raza {raza}</Text>
          </View>
        </View>

        <View style={styles.details_section}>
          <Text style={styles.sectionTitle}>Detalles Físicos</Text>
          <View style={styles.divider} />
          <View style={styles.animal_details}>
            <View style={styles.details}>
              <Text style={styles.label}>Peso:</Text>
              <Text style={styles.value}>{`${peso ?? "-"} kg`}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Tamaño:</Text>
              <Text style={styles.value}>1.5 m</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Color:</Text>
              <Text style={styles.value}>{color}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>{`${edad} años`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.extras}>
          <View style={styles.rediminders}>
            <Text style={styles.sectionTitle}>Notas y Recordatorios</Text>
            <View style={styles.divider} />

            <Text style={styles.subSectionTitle}>Notas Importantes</Text>
            {notasImportantes.map((nota, index) => (
              <View key={index} style={styles.noteRow}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{nota}</Text>
              </View>
            ))}
          </View>

          <View style={styles.notes}>
            <Text style={styles.subSectionTitle}>Próximos Recordatorios</Text>
            {recordatorios.map((rec, index) => (
              <View key={index} style={styles.reminderRow}>
                <Text style={styles.reminderIcon}>🔔</Text>
                <Text style={styles.reminderText}>
                  {rec.titulo}{" "}
                  <Text style={styles.reminderDate}>- {rec.fecha}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const cardStyle = {
  backgroundColor: Colors.CARD_DETAILS,
  borderRadius: 16,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },

  about_container: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  animalName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.TITLE,
    letterSpacing: -0.3,
  },
  animalRaza: {
    fontSize: 13,
    color: Colors.SUBTITLE,
  },

  details_section: {
    ...cardStyle,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.DIVIDER,
    marginBottom: 12,
  },
  animal_details: {
    gap: 6,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    color: Colors.LABEL,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.VALUE,
  },

  extras: {
    ...cardStyle,
    gap: 16,
  },
  rediminders: {
    gap: 0,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 8,
  },
  noteRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  noteBullet: {
    fontSize: 14,
    color: Colors.LABEL,
    lineHeight: 20,
  },
  noteText: {
    fontSize: 14,
    color: Colors.SUBTITLE,
    flex: 1,
    lineHeight: 20,
  },
  notes: {
    gap: 0,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reminderIcon: {
    fontSize: 16,
  },
  reminderText: {
    fontSize: 14,
    color: Colors.VALUE,
    flex: 1,
  },
  reminderDate: {
    fontSize: 13,
    color: Colors.SUBTITLE,
  },
});

export default AnimalsDetails;
