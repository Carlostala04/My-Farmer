import React, { useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import NavBar from "@/components/navBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/card";

export default function AnimalsScreen() {
  const [buscar, setBuscar] = useState("");

  const data = [
    {
      nombre: "lola",
      edad: 3,
      estado: "saludable",
      imagen:
        "https://a.storyblok.com/f/160385/4bf112f0cd/datos_curiosos.jpg/m/filters:quality(70)/",
    },

    {
      nombre: "juan",
      edad: 5,
      estado: "Entrenando",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQN7ZS1iWhsLxfW9-ZdiGiWERqKNvO7ApcYfhaGPT9faQLSw-3TdRiLkGp4aKol8PmTdj-y6N5hdiRSerhzCfJgVSFj_YYYtgUcnTQsA&s=10",
    },

    {
      nombre: "pepe",
      edad: 1,
      estado: "creciendo",
      imagen:
        "https://imagenes.elpais.com/resizer/v2/OPHSOSNE2O673X77I7JAPNANV4.jpg?auth=e31b607f28c9844d1f9552df6f643d319102aba87dc69ca60e3c4dffdab20344&width=1960&height=1470&smart=true",
    },

    {
      nombre: "RedBull",
      edad: 2,
      estado: "produciendo",
      imagen:
        "https://lasventastour.com/wp-content/uploads/2023/12/Toro-Bravo-Las-Ventas-Tour-2.webp",
    },

    {
      nombre: "turuleca",
      edad: 4,
      estado: "morida",
      imagen:
        "https://www.intagri.com/assets/images/articulos/categoria1/ganaderia/art102-razas-de-gallinas/gallina-raza.jpg",
    },
    {
      nombre: "raul",
      edad: 7,
      estado: "enfermo",
      imagen:
        "https://thumbs.dreamstime.com/b/retrato-de-perros-en-un-traje-negocios-132770085.jpg",
    },
  ];
  return (
    <>
      <NavBar />
      <View style={styles.content}>
        <TextInput
          value={buscar}
          placeholder="Buscar animales..."
          onChangeText={setBuscar}
        />
        <FlatList
          data={data}
          contentContainerStyle={{paddingBottom:40}}
          renderItem={({ item }) => (
            <Card
              nombre={item.nombre}
              edad={item.edad}
              estado={item.estado}
              imagen={item.imagen}
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
});
