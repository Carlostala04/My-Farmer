import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import { ResponseCultivoDto } from "@/ts/cultivoProps";

type CardCultivosProps = Pick<
  ResponseCultivoDto,
  "Nombre" | "Activo" | "Fecha_Siembra" | "Parcela" | "Foto"
> & {
  onPress?: () => void;
};

export default function CardCultivos({
  Nombre,
  Activo = true,
  Fecha_Siembra,
  Parcela,
  Foto,
  onPress,
}: CardCultivosProps) {
  const estado_cultivo = Activo ? "Activo" : "Inactivo";
  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={{ uri: Foto ?? undefined }}
        style={styles.card}
        imageStyle={styles.imageBackground}
      >
        {/* Overlay oscuro para legibilidad */}
        <View style={styles.overlay} />

        {/* Badge de estado (esquina superior derecha) */}
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: Activo ? "#2b972148" : "#e60d0da1" },
          ]}
        >
          <Text
            style={[styles.estadoText, { color: Activo ? "#4ADE80" : "#fff" }]}
          >
            {estado_cultivo}
          </Text>
        </View>

        {/* Contenido inferior */}
        <View style={styles.content}>
          <Text style={styles.nombre}>{Nombre}</Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Fecha de Siembra: </Text>
            {Fecha_Siembra}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Ubicación: </Text>
            {Parcela ?? "Sin parcela"}
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
