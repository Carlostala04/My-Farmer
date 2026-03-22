import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View,TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import CardCultivos from "@/components/card-cultivos";

import Colors from "@/constants/colors";

export default function CultivosScreen() {
  const [buscar, setBuscar] = useState("");

  const data = useMemo(
    () => [
      {
        id: 1,
        nombre: "lechuga",
        fechaSiembra: "2020-09-01",
        ubicacion: "parceral noroeste",
        estado: true,
        imagen:
          "https://cdn.wikifarmer.com/images/detailed/2019/07/Como-Cultivar-Lechuga-%E2%80%93-Guia-Completa-de-Cultivo-de-la-Lechuga-desde-la-Siembra-hasta-la-Cosecha.jpg",
      },

      {
        id: 2,
        nombre: "coliflor",
        fechaSiembra: "2023-08-20",
        ubicacion: "parcela suroeste",
        estado: true,
        imagen:
          "https://www.novagromexico.com/wp-content/uploads/2025/01/cultivo-de-coliflor.jpg",
      },

      {
        id: 3,
        nombre: "maiz",
        fechaSiembra: "2025-09-20",
        ubicacion: "parcela oeste",
        estado: false,
        imagen:
          "https://mayasl.com/wp-content/uploads/2020/08/cultivo-maiz_3.jpg",
      },
    ],
    [],
  );
  const filteredData = useMemo(() => {
    const query = buscar.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (cultivo) =>
        cultivo.nombre.toLowerCase().includes(query) ||
        cultivo.ubicacion.toLowerCase().includes(query),
    );
  }, [buscar, data]);
  return (
    <>
      <NavBar />
      <ScreenHeader
        title="Cultivos"
        actions={[
          {
            icon: <FilterIcon width={22} height={22} />,
            onPress: () => console.log("Cultvos"),
          },
        ]}
      />
      <View style={styles.content}>
        <TextInput
          placeholder="Buscar cultivo..."
          value={buscar}
          onChangeText={setBuscar}
          style={styles.input}
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <CardCultivos
              nombre={item.nombre}
              fechaSiembra={item.fechaSiembra}
              ubicacion={item.ubicacion}
              imagen={item.imagen}
              estado={item.estado}
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 8,
  },
  hint: { opacity: 0.8 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CARD_DETAILS,
    borderColor: Colors.INPUT_BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.TITLE,
  },
});
