/**
 * Mapa.ios.tsx — Implementación exclusiva para iOS
 *
 * Este archivo es seleccionado automáticamente por Metro/Expo en dispositivos iOS
 * en lugar de Mapa.tsx. Incluye:
 *  - Modo "espera de formulario": al dibujar un polígono nuevo se activa un banner,
 *    se resalta el campo Nombre y se hace scroll + foco automático.
 *  - Props específicas de WKWebView (iOS): bounces, dataDetectorTypes,
 *    allowsLinkPreview, keyboardDisplayRequiresUserAction, etc.
 *  - HTML con -webkit-overflow-scrolling y touch-action para WKWebView.
 *  - KeyboardAvoidingView con behavior "padding" y offset correcto para iOS.
 *  - injectJavaScript con `true;` al final (requerido por WKWebView).
 */

import * as ExpoLocation from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useAuth } from "@/supabase/useAuth";
import Colors from "@/constants/colors";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.40.224.63:3000";
const MAPTILER_KEY =
  process.env.EXPO_PUBLIC_MAPTILER_KEY || "vd73viHGHc4ypSX2zv97";

// En iOS usamos el 45% para dejar espacio visible al teclado
const MAP_HEIGHT = Math.round(Dimensions.get("window").height * 0.45);

export default function MapaParcelaScreen() {
  const { session } = useAuth();
  const webviewRef = useRef<WebView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const nombreInputRef = useRef<TextInput>(null);
  const isMounted = useRef(true);

  const [parcelas, setParcelas] = useState<any[]>([]);
  const [polygonCoords, setPolygonCoords] = useState<number[][]>([]);
  const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [area, setArea] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  // true cuando se acaba de dibujar un polígono nuevo y el usuario debe llenar el formulario
  const [pendingForm, setPendingForm] = useState<boolean>(false);

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

  if (!session) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando sesión o no autenticado...</Text>
      </SafeAreaView>
    );
  }

  const parsePoligono = (pol: any) => {
    if (!pol) return [];
    if (Array.isArray(pol)) return pol;
    try {
      return JSON.parse(pol);
    } catch {
      return [];
    }
  };

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
      if (isMounted.current) setParcelas(parsed);
    } catch (e) {
      if (isMounted.current)
        Alert.alert("Error", "No se pudieron cargar parcelas");
    }
  };

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

    Alert.alert("Confirmar", "¿Estás seguro de que deseas crear esta parcela?", [
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
    ]);
  };

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
            const res = await fetch(`${API_URL}/parcelas/${selectedParcelaId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify(body),
            });
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

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPolygonCoords([]);
    setSelectedParcelaId(null);
    setArea(0);
    setPendingForm(false);
    // `true;` al final es requerido por WKWebView (iOS) para evitar advertencia de retorno
    webviewRef.current?.injectJavaScript(`
      drawnItems.eachLayer(l => l.setStyle({ color: 'green', weight: 2 }));
      selectedLayer = null;
      true;
    `);
  };

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const coords = data.coords ?? [];
      setPolygonCoords(coords);
      setSelectedParcelaId(data.Parcela_id);
      setDescripcion(data.descripcion || "");
      setNombre(data.nombre || "");
      setArea(calcularArea(coords));

      // Polígono nuevo sin ID → activar modo espera de formulario
      if (coords.length >= 3 && !data.Parcela_id) {
        setPendingForm(true);
        // En iOS el WebView retiene el foco; el timeout da tiempo al sistema
        // para liberar el responder antes de hacer scroll y enfocar el TextInput
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          nombreInputRef.current?.focus();
        }, 350);
      } else {
        setPendingForm(false);
      }
    } catch {}
  };

  // baseUrl HTTPS permite que WKWebView cargue recursos externos de Leaflet (CDN)
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      /* -webkit-overflow-scrolling: touch mejora el scroll del mapa en WKWebView */
      #map { -webkit-overflow-scrolling: touch; }
      /* Evita el highlight azul en taps sobre controles de Leaflet en iOS */
      * { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const parcelas = ${JSON.stringify(parcelas)};
      const userLocation = ${JSON.stringify(userLocation)};

      const defaultView = [9.9281, -84.0907];
      const initialView = userLocation || defaultView;
      const initialZoom = userLocation ? 18 : 16;

      // tap: false es necesario para que los eventos de toque funcionen
      // correctamente en WKWebView (iOS Safari engine)
      const map = L.map('map', { tap: false }).setView(initialView, initialZoom);
      L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}', { maxZoom: 20 }).addTo(map);

      if (userLocation) {
        L.marker(userLocation).addTo(map)
          .bindPopup('Tu ubicación actual')
          .openPopup();
      }

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      let selectedLayer = null;
      const normalStyle = { color: 'green', weight: 2 };
      const selectedStyle = { color: 'red', weight: 3 };

      function sendToReact(layer) {
        const coords = layer.getLatLngs()[0].map(p => [p.lat, p.lng]);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          Parcela_id: layer.parcelaId || null,
          coords,
          descripcion: layer.descripcion || "",
          nombre: layer.nombre || ""
        }));
      }

      function selectLayer(layer) {
        drawnItems.eachLayer(l => l.setStyle(normalStyle));
        selectedLayer = layer;
        layer.setStyle(selectedStyle);
        map.fitBounds(layer.getBounds());
        sendToReact(layer);
      }

      map.on('click', function(e) {
        if (selectedLayer) {
          selectedLayer.setStyle(normalStyle);
          selectedLayer = null;
          window.ReactNativeWebView.postMessage(JSON.stringify({ Parcela_id: null, coords: [], descripcion: "", nombre: "" }));
        }
      });

      parcelas.forEach(p => {
        if (!p.Poligono || p.Poligono.length < 3) return;
        const coords = p.Poligono.map(pt => [pt.lat, pt.lng]);
        const polygon = L.polygon(coords, normalStyle);
        polygon.parcelaId = p.id;
        polygon.descripcion = p.Descripcion || "";
        polygon.nombre = p.Nombre || "";
        polygon.bindPopup("<b>" + p.Nombre + "</b><br>" + polygon.descripcion);
        polygon.on('click', (e) => { e.originalEvent.stopPropagation(); selectLayer(polygon); });
        drawnItems.addLayer(polygon);
      });

      const drawControl = new L.Control.Draw({
        draw: { polygon: true, marker: false, polyline: false, rectangle: false, circle: false },
        edit: { featureGroup: drawnItems, edit: true, remove: true }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, e => {
        const layer = e.layer;
        layer.parcelaId = null;
        layer.descripcion = "";
        layer.nombre = "";
        drawnItems.addLayer(layer);
        selectLayer(layer);
      });

      map.on(L.Draw.Event.EDITED, e => e.layers.eachLayer(layer => selectLayer(layer)));
      map.on(L.Draw.Event.DELETED, e => {
        e.layers.eachLayer(layer => {
          drawnItems.removeLayer(layer);
          window.ReactNativeWebView.postMessage(JSON.stringify({ Parcela_id: layer.parcelaId || null, coords: [], descripcion: "", nombre: "" }));
        });
        if (selectedLayer && e.layers.hasLayer(selectedLayer)) selectedLayer = null;
      });
    </script>
  </body>
  </html>
  `;

  return (
    // SafeAreaView maneja el notch y Dynamic Island en iOS
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/*
        behavior="padding" + keyboardVerticalOffset es la combinación correcta
        para iOS: sube el contenido el equivalente a la altura del teclado.
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {/*
          Props específicas de WKWebView (iOS):
          - bounces={false}: elimina el rebote elástico del WebView que confunde al usuario
          - dataDetectorTypes="none": evita que iOS detecte teléfonos/emails y abra apps externas
          - allowsLinkPreview={false}: deshabilita el "peek" de links en 3D Touch / Haptic Touch
          - allowsInlineMediaPlayback: necesario para reproducción de media sin pantalla completa
          - scalesPageToFit={false}: evita que WKWebView reescale el HTML
          - startInLoadingState: muestra un spinner mientras carga Leaflet desde CDN
          - baseUrl HTTPS: permite que WKWebView cargue recursos externos (Leaflet CDN)
        */}
        <WebView
          ref={webviewRef}
          source={{ html, baseUrl: "https://unpkg.com" }}
          style={{ height: MAP_HEIGHT }}
          onMessage={onMessage}
          javaScriptEnabled
          originWhitelist={["*"]}
          bounces={false}
          dataDetectorTypes="none"
          allowsLinkPreview={false}
          allowsInlineMediaPlayback
          scalesPageToFit={false}
          startInLoadingState
          scrollEnabled
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          // bounces={false} en el ScrollView evita conflicto con el WebView en iOS
          bounces={false}
        >
          <View style={styles.formHeader}>
            <Text style={styles.title}>Mis Parcelas</Text>
            <Pressable
              style={styles.exitBtn}
              onPress={() => router.replace("/(tabs)/home")}
            >
              <Text style={styles.btnText}>Salir</Text>
            </Pressable>
          </View>

          {/* Banner modo espera: aparece al dibujar un polígono nuevo */}
          {pendingForm && (
            <View style={styles.pendingBanner}>
              <Text style={styles.pendingBannerText}>
                Polígono dibujado. Completa el nombre y la descripción para crear la parcela.
              </Text>
            </View>
          )}

          <TextInput
            ref={nombreInputRef}
            placeholder="Nombre"
            style={[styles.input, pendingForm && styles.inputHighlight]}
            value={nombre}
            onChangeText={setNombre}
            autoCorrect={false}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            autoCorrect={false}
            returnKeyType="done"
          />
          <Text style={styles.areaLabel}>
            Área: {area.toFixed(2)} m²
          </Text>

          <View style={styles.btnRow}>
            <Pressable style={styles.btn} onPress={createParcela}>
              <Text style={styles.btnText}>Crear</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, !selectedParcelaId && styles.btnDisabled]}
              onPress={updateParcela}
              disabled={!selectedParcelaId}
            >
              <Text style={styles.btnText}>Editar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, !selectedParcelaId && styles.btnDisabled]}
              onPress={deleteParcela}
              disabled={!selectedParcelaId}
            >
              <Text style={styles.btnText}>Eliminar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { fontSize: 15, color: "#666" },
  formScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContent: {
    padding: 15,
    paddingBottom: 24,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY_GREEN,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  inputHighlight: {
    borderColor: Colors.PRIMARY_GREEN,
    borderWidth: 2,
  },
  areaLabel: {
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 14,
    color: "#333",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: Colors.PRIMARY_GREEN,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.4,
  },
  exitBtn: {
    backgroundColor: Colors.PRIMARY_GREEN,
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  pendingBanner: {
    backgroundColor: "#e8f5e9",
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY_GREEN,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  pendingBannerText: {
    color: "#2e7d32",
    fontSize: 13,
    fontWeight: "600",
  },
});
