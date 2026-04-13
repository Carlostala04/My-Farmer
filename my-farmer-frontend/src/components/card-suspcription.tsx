import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
type CardSuspriptionProps = {
  precio: number;
  descuento: boolean;
  porcentajeDescuento: number;
  esAnual?: boolean;
  onPress?: () => void;
  loading?: boolean;
};

const items = [
  "Acceso a asistente de inteligencia artificial",
  "Registros ilimitados de animales",
  "Registros ilimitados de cultivos",
  "Registro ilimitado de parcelas",
];

const CardSuspription = ({
  precio,
  descuento,
  porcentajeDescuento,
  esAnual = false,
  onPress,
  loading = false,
}: CardSuspriptionProps) => {
  return (
    <View style={styles.card_container}>
      <View style={styles.card}>
        <View style={styles.card_header}>
          <Text
            style={[
              styles.price,
              { textDecorationLine: descuento ? "line-through" : "none" },
            ]}
          >{`$${precio}`}</Text>
          <View style={styles.premium}>
            <View style={styles.dot}></View>
            <Text style={styles.title}>premium</Text>
          </View>

          <Text style={styles.time}>{esAnual ? "/año" : "/mes"}</Text>
          {esAnual && (
            <Text style={styles.timeSubtext}>{`$${Math.round(precio / 12)}/mes`}</Text>
          )}
        </View>

        {descuento && (
          <View style={styles.ribbonContainer}>
            <View style={styles.ribbon}>
              <Text
                style={styles.ribbonText}
              >{`${porcentajeDescuento}% OFF`}</Text>
            </View>
          </View>
        )}

        <View style={styles.body}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.feature,
                index < items.length - 1 && styles.featureBorder,
              ]}
            >
              <View style={styles.check}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.featureText}>{item}</Text>
            </View>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={onPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Paga premium ↗</Text>
            )}
          </Pressable>

          <Text style={styles.guarantee}>
            Cancela cuando quieras · Sin compromisos
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardSuspription;

const styles = StyleSheet.create({
  card_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "88%",
    minHeight: 460,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  card_header: {
    width: "100%",
    height: 180,
    backgroundColor: "#19c91f",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingRight: 12,
  },

  price: {
    fontSize: 50,
    fontWeight: "800",
    color: "#fff",
    textAlign: "left",
    marginBottom: 20,
    marginLeft: 15,
  },

  premium: {
    position: "absolute",
    backgroundColor: "#137a11",
    width: 115,
    height: 44,
    top: 5,
    left: 10,
    borderRadius: 50,
  },

  dot: {
    width: 7,
    height: 7,
    backgroundColor: "#4ade80",
    borderRadius: 10,
    top: 20,
    left: 12,
  },
  title: {
    color: "#c8f0d2",
    position: "absolute",
    top: 10,
    left: 25,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  time: {
    color: "#fff",
    position: "absolute",
    bottom: 40,
    left: 100,
    fontSize: 18,
    fontWeight: "700",
  },
  timeSubtext: {
    color: "#c8f0d2",
    position: "absolute",
    bottom: 22,
    left: 100,
    fontSize: 13,
    fontWeight: "500",
  },
  ribbonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    overflow: "hidden",
    zIndex: 10,
  },

  ribbon: {
    position: "absolute",
    top: 20,
    right: -35,
    width: 160,
    paddingVertical: 8,
    backgroundColor: "#f34040",
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  ribbonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  body: {
    padding: 30,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },

  featureBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0ef",
  },

  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#edf7f0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  checkMark: {
    color: "#14a10f",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },

  featureText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#14a10f",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    backgroundColor: "#14a10f",
    transform: [{ scale: 0.98 }],
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  guarantee: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
  },
});
