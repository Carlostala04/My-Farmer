import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, TextInput, View, Text} from "react-native";
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
        fecha_nacimiento: "2023-03-15",
        estado: "saludable",
        raza: "Holstein",
        color: "Blanco y negro",
        peso: 480,
        foto:
          "https://a.storyblok.com/f/160385/4bf112f0cd/datos_curiosos.jpg/m/filters:quality(70)/",
      },
      {
        nombre: "juan",
        fecha_nacimiento: "2021-07-20",
        estado: "Entrenando",
        raza: "Angus",
        color: "Negro",
        peso: 620,
        foto:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQN7ZS1iWhsLxfW9-ZdiGiWERqKNvO7ApcYfhaGPT9faQLSw-3TdRiLkGp4aKol8PmTdj-y6N5hdiRSerhzCfJgVSFj_YYYtgUcnTQsA&s=10",
      },
      {
        nombre: "pepe",
        fecha_nacimiento: "2025-01-10",
        estado: "creciendo",
        raza: "Hereford",
        color: "Café",
        peso: 150,
        foto:
          "https://imagenes.elpais.com/resizer/v2/OPHSOSNE2O673X77I7JAPNANV4.jpg?auth=e31b607f28c9844d1f9552df6f643d319102aba87dc69ca60e3c4dffdab20344&width=1960&height=1470&smart=true",
      },
      {
        nombre: "RedBull",
        fecha_nacimiento: "2024-05-08",
        estado: "produciendo",
        raza: "Brahman",
        color: "Gris",
        peso: 700,
        foto:
          "https://lasventastour.com/wp-content/uploads/2023/12/Toro-Bravo-Las-Ventas-Tour-2.webp",
      },
      {
        nombre: "turuleca",
        fecha_nacimiento: "2022-09-30",
        estado: "muerto",
        raza: "Leghorn",
        color: "Blanco",
        peso: 2,
        foto:
          "https://www.intagri.com/assets/images/articulos/categoria1/ganaderia/art102-razas-de-gallinas/gallina-raza.jpg",
      },
      {
        nombre: "raul",
        fecha_nacimiento: "2019-11-05",
        estado: "enfermo",
        raza: "Mestizo",
        color: "Marrón",
        peso: 30,
        foto:
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
            icon: <FilterIcon width={22} height={22} style={{position:'absolute', top:18, right:20}}/>,
            onPress: () => console.log("filtrar"),
          },
          {
              icon: <Text style={{ fontSize: 35, color: Colors.PRIMARY_GREEN, fontWeight: "600" }}>+</Text>,
      onPress: () => router.push("/(tabs)/registerAnimal"),
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
              Nombre={item.nombre}
              Fecha_Nacimiento={item.fecha_nacimiento}
              Estado_Label={item.estado}
              Foto={item.foto}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/animailsDetails",
                  params: {
                    nombre: item.nombre,
                    fecha_nacimiento: item.fecha_nacimiento?.toString(),
                    estado: item.estado,
                    raza: item.raza,
                    color: item.color,
                    peso: item.peso,
                    foto: item.foto,
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
