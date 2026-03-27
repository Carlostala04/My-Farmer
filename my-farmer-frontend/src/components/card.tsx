import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import Colors from "@/constants/colors";
import { animalsProps } from "@/ts/animalsProps";

type CardProps = Pick<animalsProps, "nombre" | "imagen" | "estado" | "edad"> & {
  onPress?: () => void;
};

export default function Card({
  nombre,
  edad,
  estado,
  imagen,
  onPress,
}: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
    >
      <Image style={styles.image} source={{ uri: imagen }} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.subtitle}>{`${edad} años`}</Text>

        <View style={[styles.badge, { backgroundColor: status[estado.toUpperCase() as keyof typeof status] ?? Colors.PRIMARY_GREEN }]}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {estado}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
const status={
  SALUDABLE: Colors.PRIMARY_GREEN,
  ENTRENANDO: 'rgba(5, 23, 26, 0.87)',
  CRECIENDO:'rgba(27, 218, 129, 0.87)',
  PRODUCIENDO: 'rgba(9, 129, 150, 0.87)',
  ENFERMO:'rgba(32, 150, 9, 0.87)',
  MUERTO:'rgba(150, 9, 9, 0.87)'
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginTop: 20,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 16,
    backgroundColor: Colors.SKELETON_BACKGROUND,
  },

  content: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
