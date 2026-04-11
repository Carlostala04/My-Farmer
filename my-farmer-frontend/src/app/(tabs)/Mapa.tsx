/**
 * Pantalla Principal: Mapa de Parcelas
 *
 * Esta pantalla integra Leaflet (vía WebView) con React Native para
 * gestionar polígonos sobre un mapa. Se conecta al backend usando
 * el token de Supabase para todas las operaciones CRUD.
 */

import * as ExpoLocation from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { supabase } from "@/supabase/supabaseClient";
import { useAuth } from "@/supabase/useAuth";
import Colors from "@/constants/colors";
import { router } from "expo-router";

// Variables de entorno para la API y el mapa
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.40.224.63:3000";
const MAPTILER_KEY =
  process.env.EXPO_PUBLIC_MAPTILER_KEY || "vd73viHGHc4ypSX2zv97";

export default function MapaParcelaScreen() {
  const { session } = useAuth(); // Sesión actual de Supabase
  const webviewRef = useRef<WebView>(null);
  const isMounted = useRef(true); // Referencia para evitar fugas de memoria

  // Estados locales para las parcelas y el formulario
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [polygonCoords, setPolygonCoords] = useState<number[][]>([]);
  const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(
    null,
  );
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [area, setArea] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  // Efecto inicial: Cargar datos y ubicación al tener sesión
  useEffect(() => {
    isMounted.current = true;
    if (session) {
      loadParcelas();
      getUserLocation();
    }
    return () => {
      isMounted.current = false;
    };
  }, [session]);

  // Obtener ubicación actual del dispositivo
  const getUserLocation = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await ExpoLocation.getCurrentPositionAsync({});
      if (isMounted.current) {
        setUserLocation([loc.coords.latitude, loc.coords.longitude]);
      }
    } catch (e) {
      console.log("Error getting location", e);
    }
  };

  // Pantalla de espera si la sesión aún no carga
  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando sesión o no autenticado...</Text>
      </View>
    );
  }

  // Utilidad para convertir el polígono del backend a un array usable
  const parsePoligono = (pol: any) => {
    if (!pol) return [];
    if (Array.isArray(pol)) return pol;
    try {
      return JSON.parse(pol);
    } catch {
      return [];
    }
  };

  // GET: Cargar parcelas desde el backend
  const loadParcelas = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/parcelas`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      const parsed = data.map((p: any) => ({
        id: p.Parcela_id,
        Nombre: p.Nombre,
        Descripcion: p.Descripcion,
        Latitud: p.Latitud,
        Longitud: p.Longitud,
        Poligono: parsePoligono(p.Poligono),
      }));
      if (isMounted.current) {
        setParcelas(parsed);
      }
    } catch (e) {
      if (isMounted.current) {
        Alert.alert("Error", "No se pudieron cargar parcelas");
      }
    }
  };

  // Cálculo de área aproximada en m²
  const calcularArea = (coords: number[][]) => {
    if (coords.length < 3) return 0;
    const R = 6378137;
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const [lat1, lon1] = coords[i];
      const [lat2, lon2] = coords[(i + 1) % coords.length];
      const phi1 = (lat1 * Math.PI) / 180;
      const phi2 = (lat2 * Math.PI) / 180;
      const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
      area += deltaLambda * (2 + Math.sin(phi1) + Math.sin(phi2));
    }
    area = (area * R * R) / 2;
    return Math.abs(area);
  };

  // POST: Crear nueva parcela con validación
  const createParcela = async () => {
    if (!session?.access_token)
      return Alert.alert("Error", "No has iniciado sesión");
    if (!nombre.trim()) return Alert.alert("Error", "El nombre es obligatorio");
    if (!descripcion.trim())
      return Alert.alert("Error", "La descripción es obligatoria");
    if (polygonCoords.length < 3)
      return Alert.alert(
        "Error",
        "Debes dibujar un polígono válido con al menos 3 puntos",
      );

    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas crear esta parcela?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Crear",
          onPress: async () => {
            const lats = polygonCoords.map((p) => p[0]);
            const lngs = polygonCoords.map((p) => p[1]);
            const body = {
              Nombre: nombre.trim(),
              Area: calcularArea(polygonCoords),
              Descripcion: descripcion.trim(),
              Latitud: lats.reduce((a, b) => a + b, 0) / lats.length,
              Longitud: lngs.reduce((a, b) => a + b, 0) / lngs.length,
              Poligono: polygonCoords.map(([lat, lng]) => ({ lat, lng })),
            };
            try {
              const res = await fetch(`${API_URL}/parcelas`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(body),
              });
              if (!res.ok) throw new Error("Error en el servidor");
              Alert.alert("Éxito", "Parcela creada correctamente");
              resetForm();
              loadParcelas();
            } catch (e) {
              Alert.alert(
                "Error",
                "No se pudo crear la parcela. Verifica la conexión con el servidor.",
              );
            }
          },
        },
      ],
    );
  };

  // PATCH: Editar parcela seleccionada
  const updateParcela = async () => {
    if (!session?.access_token)
      return Alert.alert("Error", "No has iniciado sesión");
    if (!selectedParcelaId)
      return Alert.alert("Error", "No hay parcela seleccionada");
    if (!nombre.trim()) return Alert.alert("Error", "El nombre es obligatorio");
    if (!descripcion.trim())
      return Alert.alert("Error", "La descripción es obligatoria");
    if (polygonCoords.length < 3)
      return Alert.alert("Error", "Polígono no válido");

    Alert.alert("Confirmar", "¿Deseas guardar los cambios en esta parcela?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Guardar",
        onPress: async () => {
          const lats = polygonCoords.map((p) => p[0]);
          const lngs = polygonCoords.map((p) => p[1]);
          const body = {
            Nombre: nombre.trim(),
            Area: calcularArea(polygonCoords),
            Descripcion: descripcion.trim(),
            Latitud: lats.reduce((a, b) => a + b, 0) / lats.length,
            Longitud: lngs.reduce((a, b) => a + b, 0) / lngs.length,
            Poligono: polygonCoords.map(([lat, lng]) => ({ lat, lng })),
          };
          try {
            const res = await fetch(
              `${API_URL}/parcelas/${selectedParcelaId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(body),
              },
            );
            if (!res.ok) throw new Error("Error en el servidor");
            Alert.alert("Éxito", "Parcela actualizada correctamente");
            resetForm();
            loadParcelas();
          } catch (e) {
            Alert.alert("Error", "No se pudo actualizar la parcela");
          }
        },
      },
    ]);
  };

  // DELETE: Eliminar parcela con advertencia destructiva
  const deleteParcela = async () => {
    if (!session?.access_token)
      return Alert.alert("Error", "No has iniciado sesión");
    if (!selectedParcelaId)
      return Alert.alert("Error", "Selecciona una parcela para eliminar");

    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás completamente seguro de que deseas eliminar la parcela "${nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_URL}/parcelas/${selectedParcelaId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${session.access_token}` },
                },
              );
              if (!res.ok) throw new Error("Error en el servidor");
              Alert.alert("Éxito", "Parcela eliminada correctamente");
              resetForm();
              loadParcelas();
            } catch (e) {
              Alert.alert("Error", "No se pudo eliminar la parcela");
            }
          },
        },
      ],
    );
  };

  // Limpiar el formulario y deseleccionar en el mapa
  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPolygonCoords([]);
    setSelectedParcelaId(null);
    setArea(0);
    webviewRef.current?.injectJavaScript(`
      drawnItems.eachLayer(l => l.setStyle({ color: 'green', weight: 2 }));
      selectedLayer = null;
    `);
  };


  // Recibir mensajes del WebView (cuando el usuario interactúa con el mapa)
  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setPolygonCoords(data.coords);
      setSelectedParcelaId(data.Parcela_id);
      setDescripcion(data.descripcion || "");
      setNombre(data.nombre || "");
      setArea(calcularArea(data.coords));
    } catch {}
  };

  // HTML + JS para el Mapa (Leaflet + Leaflet Draw)
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>
    <style>html, body, #map { height:100%; margin:0; }</style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // Pasamos las variables de React a JS
      const parcelas = ${JSON.stringify(parcelas)};
      const userLocation = ${JSON.stringify(userLocation)};

      const defaultView = [9.9281, -84.0907];
      const initialView = userLocation || defaultView;
      const initialZoom = userLocation ? 18 : 16;

      // Inicializar mapa
      const map = L.map('map').setView(initialView, initialZoom);
      L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}',{maxZoom:20}).addTo(map);

      // Mostrar marcador de ubicación actual
      if (userLocation) {
        L.marker(userLocation).addTo(map)
          .bindPopup('Tu ubicación actual')
          .openPopup();
      }

      // Grupo para los polígonos dibujados
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      let selectedLayer = null;
      const normalStyle={color:'green',weight:2};
      const selectedStyle={color:'red',weight:3};

      // Comunicar datos de vuelta a React Native
      function sendToReact(layer){
        const coords=layer.getLatLngs()[0].map(p=>[p.lat,p.lng]);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          Parcela_id: layer.parcelaId||null,
          coords,
          descripcion: layer.descripcion||"",
          nombre: layer.nombre||""
        }));
      }

      // Seleccionar un polígono en el mapa
      function selectLayer(layer){
        drawnItems.eachLayer(l=>l.setStyle(normalStyle));
        selectedLayer=layer;
        layer.setStyle(selectedStyle);
        map.fitBounds(layer.getBounds());
        sendToReact(layer);
      }

      // Deseleccionar al hacer click en el mapa vacío
      map.on('click',function(e){
        if(selectedLayer){
          selectedLayer.setStyle(normalStyle);
          selectedLayer=null;
          window.ReactNativeWebView.postMessage(JSON.stringify({Parcela_id:null,coords:[],descripcion:"",nombre:""}));
        }
      });

      // Renderizar parcelas existentes desde el backend
      parcelas.forEach(p=>{
        if(!p.Poligono||p.Poligono.length<3)return;
        const coords=p.Poligono.map(pt=>[pt.lat,pt.lng]);
        const polygon=L.polygon(coords,normalStyle);
        polygon.parcelaId=p.id;
        polygon.descripcion=p.Descripcion||"";
        polygon.nombre=p.Nombre||"";
        polygon.bindPopup("<b>"+p.Nombre+"</b><br>"+polygon.descripcion);
        polygon.on('click',(e)=>{e.originalEvent.stopPropagation(); selectLayer(polygon);});
        drawnItems.addLayer(polygon);
      });

      // Configurar controles de dibujo
      const drawControl=new L.Control.Draw({
        draw:{polygon:true,marker:false,polyline:false,rectangle:false,circle:false},
        edit:{featureGroup:drawnItems,edit:true,remove:true}
      });
      map.addControl(drawControl);

      // Eventos de dibujo
      map.on(L.Draw.Event.CREATED,e=>{
        const layer=e.layer;
        layer.parcelaId=null;
        layer.descripcion="";
        layer.nombre="";
        drawnItems.addLayer(layer);
        selectLayer(layer);
      });

      map.on(L.Draw.Event.EDITED,e=>e.layers.eachLayer(layer=>selectLayer(layer)));
      map.on(L.Draw.Event.DELETED,e=>{
        e.layers.eachLayer(layer=>{
          drawnItems.removeLayer(layer);
          window.ReactNativeWebView.postMessage(JSON.stringify({Parcela_id:layer.parcelaId||null,coords:[],descripcion:"",nombre:""}));
        });
        if(selectedLayer&&e.layers.hasLayer(selectedLayer)) selectedLayer=null;
      });
    </script>
  </body>
  </html>
  `;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, minHeight: 600 }}>
          {/* Componente de Mapa */}
          <WebView
            source={{ html }}
            onMessage={onMessage}
            javaScriptEnabled
            originWhitelist={["*"]}
            ref={webviewRef}
            style={{ flex: 1 }}
          />

          {/* Formulario de Parcela */}
          <View style={styles.form}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={styles.title}>Mis Parcelas</Text>
              <Pressable
                style={{ width: 70, height: 30 , backgroundColor:Colors.PRIMARY_GREEN, borderRadius:5}}
                onPress={()=>router.replace("/(tabs)/home")}
              >
                <Text style={styles.buttons_text}>Salir</Text>
              </Pressable>
            </View>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <Text style={{ marginBottom: 10, fontWeight: "700" }}>
              Área: {area.toFixed(2)} m²
            </Text>

            <View style={styles.buttons_conatiner}>
              <Pressable style={styles.buttons} onPress={createParcela}>
                <Text style={styles.buttons_text}>Crear</Text>
              </Pressable>
              <Pressable
                style={styles.buttons}
                onPress={updateParcela}
                disabled={!selectedParcelaId}
              >
                <Text style={styles.buttons_text}>Editar</Text>
              </Pressable>
              <Pressable
                style={styles.buttons}
                onPress={deleteParcela}
                disabled={!selectedParcelaId}
              >
                <Text style={styles.buttons_text}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { padding: 15, backgroundColor: "#fff", borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", color: Colors.PRIMARY_GREEN },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  buttons_conatiner: { flexDirection: "row", justifyContent: "space-between" },
  buttons: {
    backgroundColor: Colors.PRIMARY_GREEN,
    width: 100,
    height: 30,
    borderRadius: 5,
  },

  buttons_text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },
});
