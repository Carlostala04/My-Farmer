import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import Colors from "@/constants/colors";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import NavBar from "@/components/navBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/card";
import { useRouter } from "expo-router";
import ScreenHeader from "@/components/header";
import EyeIcon from "@/components/ui/eye";
import FilterIcon from "@/components/ui/filterIcon";

export default function AnimalsScreen() {
  const [buscar, setBuscar] = useState("");
  const router = useRouter();

  const data = useMemo(
    () => [
      {
        nombre: "lola",
        edad: 3,
        estado: "saludable",
        raza: "Holstein",
        color: "Blanco y negro",
        peso: 480,
        imagen:
          "https://a.storyblok.com/f/160385/4bf112f0cd/datos_curiosos.jpg/m/filters:quality(70)/",
      },
      {
        nombre: "juan",
        edad: 5,
        estado: "Entrenando",
        raza: "Angus",
        color: "Negro",
        peso: 620,
        imagen:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQN7ZS1iWhsLxfW9-ZdiGiWERqKNvO7ApcYfhaGPT9faQLSw-3TdRiLkGp4aKol8PmTdj-y6N5hdiRSerhzCfJgVSFj_YYYtgUcnTQsA&s=10",
      },
      {
        nombre: "pepe",
        edad: 1,
        estado: "creciendo",
        raza: "Hereford",
        color: "Café",
        peso: 150,
        imagen:
          "https://imagenes.elpais.com/resizer/v2/OPHSOSNE2O673X77I7JAPNANV4.jpg?auth=e31b607f28c9844d1f9552df6f643d319102aba87dc69ca60e3c4dffdab20344&width=1960&height=1470&smart=true",
      },
      {
        nombre: "RedBull",
        edad: 2,
        estado: "produciendo",
        raza: "Brahman",
        color: "Gris",
        peso: 700,
        imagen:
          "https://lasventastour.com/wp-content/uploads/2023/12/Toro-Bravo-Las-Ventas-Tour-2.webp",
      },
      {
        nombre: "turuleca",
        edad: 4,
        estado: "morida",
        raza: "Leghorn",
        color: "Blanco",
        peso: 2,
        imagen:
          "https://www.intagri.com/assets/images/articulos/categoria1/ganaderia/art102-razas-de-gallinas/gallina-raza.jpg",
      },
      {
        nombre: "raul",
        edad: 7,
        estado: "enfermo",
        raza: "Mestizo",
        color: "Marrón",
        peso: 30,
        imagen:
          "https://thumbs.dreamstime.com/b/retrato-de-perros-en-un-traje-negocios-132770085.jpg",
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    const query = buscar.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (animal) =>
        animal.nombre.toLowerCase().includes(query) ||
        animal.raza.toLowerCase().includes(query) ||
        animal.estado.toLowerCase().includes(query),
    );
  }, [buscar, data]);

  return (
    <>
      <ScreenHeader
        title="Animales"
        actions={[
          {
            icon: <FilterIcon width={22} height={22} />,
            onPress: () => console.log("filtrar"),
          },
        ]}
      />
      <NavBar />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={buscar}
          placeholder="Buscar animales..."
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          onChangeText={setBuscar}
        />
        <FlatList
          data={filteredData}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <Card
              nombre={item.nombre}
              edad={item.edad}
              estado={item.estado}
              imagen={item.imagen}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/animailsDetails",
                  params: {
                    nombre: item.nombre,
                    edad: item.edad,
                    estado: item.estado,
                    raza: item.raza,
                    color: item.color,
                    peso: item.peso,
                    imagen: item.imagen,
                  },
                })
              }
            />
          )}
          ListEmptyComponent={<View></View>}
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
