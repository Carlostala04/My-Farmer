import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import { cultivoProps } from "@/ts/cultivoProps";

type CardCultivosProps = Pick<
  cultivoProps,
  "nombre" | "estado" | "fechaSiembra" | "ubicacion" | "imagen"
> & {
  onPress?: () => void;
};

export default function CardCultivos({
  nombre,
  estado = true,
  fechaSiembra,
  ubicacion,
  imagen,
  onPress,
}: CardCultivosProps) {
  const estado_cultivo = estado ? "Activo" : "Inactivo";
  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={{ uri: imagen }}
        style={styles.card}
        imageStyle={styles.imageBackground}
      >
        {/* Overlay oscuro para legibilidad */}
        <View style={styles.overlay} />

        {/* Badge de estado (esquina superior derecha) */}
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: estado ? "#2b972148" : "#e60d0da1" },
          ]}
        >
          <Text
            style={[styles.estadoText, { color: estado ? "#4ADE80" : "#fff" }]}
          >
            {estado_cultivo}
          </Text>
        </View>

        {/* Contenido inferior */}
        <View style={styles.content}>
          <Text style={styles.nombre}>{nombre}</Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Fecha de Siembra: </Text>
            {fechaSiembra}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Ubicación: </Text>
            {ubicacion ?? "Parcela Sur"}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  imageBackground: {
    borderRadius: 14,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 14,
  },
  estadoBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    borderRadius: 5,
    position: "absolute",
    top: 50,
    right: 14,
  },
  estadoText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 2,
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoText: {
    color: "rgb(255, 255, 255)",
    fontSize: 13,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoLabel: {
    fontWeight: "600",
    color: "rgb(255, 255, 255)",
  },
});
