import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { ImageBackground } from "expo-image";
type CardSuspriptionProps = {
  precio: number;
  descuento: boolean;
  porcentajeDescuento: number;
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

        <View style={styles.card_body}>
          {items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item}
            </Text>
          ))}

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Obtener</Text>
          </Pressable>
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
    width: "70%",
    minHeight: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  card_header: {
    width: "100%",
    height: 110,
    backgroundColor:"#19c91f",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingRight: 12,
  },

  price: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    textAlign: "right",
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

  

  card_body: {
    padding: 20,
    gap: 12,
  },

  itemText: {
    fontSize: 15,
    color: "#222",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#19c91f",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
