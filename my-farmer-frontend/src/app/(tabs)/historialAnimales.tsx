import { useHistorialAnimal } from '@/hooks/useHistorialAnimal'
import { useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

export default function HistorialAnimales() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>()
  const { historial, loading, error } = useHistorialAnimal(Number(animalId))

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4CAF50" />
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
  if (!historial.length) return <View style={styles.center}><Text>No hay historial disponible.</Text></View>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial del Animal</Text>
      <FlatList
        data={historial}
        keyExtractor={(item) => String(item.Historial_Animal_id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.campo}>{item.Campo_Mod}</Text>
            <View style={styles.row}>
              <Text style={styles.antes}>Antes: {item.Valor_Ant}</Text>
              <Text style={styles.despues}>Después: {item.Valor_Nue}</Text>
            </View>
            <Text style={styles.fecha}>{new Date(item.Fecha).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  campo: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  antes: { color: '#e53935', fontSize: 13 },
  despues: { color: '#43a047', fontSize: 13 },
  fecha: { color: '#999', fontSize: 12, marginTop: 4 },
  error: { color: 'red' },
})