import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import NavBar from '@/components/navBar';
import CardSuspription from '@/components/card-suspcription';
import { useTheme } from '@/contexts/ThemeContext';
import { useSuscripcion } from '@/hooks/useSuscripcion';
import { CicloFacturacion } from '@/ts/suscripcion';

const PRECIO_MENSUAL = 15;
const PRECIO_ANUAL_POR_MES = 10;
const PRECIO_ANUAL_TOTAL = PRECIO_ANUAL_POR_MES * 12; // $120
const DESCUENTO_ANUAL = 25;

export default function Suscripcion() {
  const { t } = useTheme();
  const { suscripcionActiva, loading, error, activarPremium, cancelarSuscripcion } =
    useSuscripcion();
  const [facturacion, setFacturacion] = useState<CicloFacturacion>(
    CicloFacturacion.MENSUAL,
  );

  const handleActivar = async () => {
    const ok = await activarPremium(facturacion);
    if (ok) {
      Alert.alert(
        'Pago simulado exitoso',
        'Tu plan Premium está activo. Disfruta de todas las funciones.',
      );
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar suscripción',
      '¿Seguro que quieres cancelar tu plan Premium?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            await cancelarSuscripcion();
          },
        },
      ],
    );
  };

  const formatFecha = (fecha: Date | string | null) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <NavBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.title }]}>Suscripción</Text>
          <Text style={[styles.subtitle, { color: t.subtitle }]}>
            {suscripcionActiva
              ? 'Tienes el plan Premium activo'
              : 'Desbloquea todas las funciones con el plan Premium'}
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && !suscripcionActiva ? (
          <ActivityIndicator size="large" color="#14a10f" style={styles.loader} />
        ) : suscripcionActiva ? (
          // ── Vista: suscripción activa ──────────────────────────────
          <View style={styles.activeCard}>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeBadgeText}>Activo</Text>
            </View>

            <Text style={styles.activePlan}>Plan Premium</Text>

            <View style={styles.activeRow}>
              <Text style={[styles.activeLabel, { color: t.subtitle }]}>
                Ciclo de facturación
              </Text>
              <Text style={styles.activeValue}>
                {suscripcionActiva.Facturacion === CicloFacturacion.ANUAL
                  ? 'Anual'
                  : 'Mensual'}
              </Text>
            </View>

            <View style={styles.activeRow}>
              <Text style={[styles.activeLabel, { color: t.subtitle }]}>
                Inicio
              </Text>
              <Text style={styles.activeValue}>
                {formatFecha(suscripcionActiva.Inicio)}
              </Text>
            </View>

            <View style={styles.activeRow}>
              <Text style={[styles.activeLabel, { color: t.subtitle }]}>
                Vencimiento
              </Text>
              <Text style={styles.activeValue}>
                {formatFecha(suscripcionActiva.Fin)}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleCancelar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancelar suscripción</Text>
              )}
            </Pressable>

            <Text style={styles.guarantee}>
              Cancela cuando quieras · Sin compromisos
            </Text>
          </View>
        ) : (
          // ── Vista: sin suscripción activa ──────────────────────────
          <>
            <View style={[styles.toggleContainer, { borderColor: t.subtitle + '30' }]}>
              <Pressable
                style={[
                  styles.toggleOption,
                  facturacion === CicloFacturacion.MENSUAL && styles.toggleSelected,
                ]}
                onPress={() => setFacturacion(CicloFacturacion.MENSUAL)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    facturacion === CicloFacturacion.MENSUAL &&
                      styles.toggleTextSelected,
                  ]}
                >
                  Mensual
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.toggleOption,
                  facturacion === CicloFacturacion.ANUAL && styles.toggleSelected,
                ]}
                onPress={() => setFacturacion(CicloFacturacion.ANUAL)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    facturacion === CicloFacturacion.ANUAL &&
                      styles.toggleTextSelected,
                  ]}
                >
                  Anual
                </Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>
                    {DESCUENTO_ANUAL}% OFF
                  </Text>
                </View>
              </Pressable>
            </View>

            <CardSuspription
              precio={
                facturacion === CicloFacturacion.ANUAL
                  ? PRECIO_ANUAL_TOTAL
                  : PRECIO_MENSUAL
              }
              esAnual={facturacion === CicloFacturacion.ANUAL}
              descuento={false}
              porcentajeDescuento={DESCUENTO_ANUAL}
              onPress={handleActivar}
              loading={loading}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  loader: {
    marginTop: 60,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },

  // ── Toggle mensual / anual ──────────────────────────────────────
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  toggleSelected: {
    backgroundColor: '#14a10f',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleTextSelected: {
    color: '#fff',
  },
  saveBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Vista suscripción activa ────────────────────────────────────
  activeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  activeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e',
  },
  activePlan: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  activeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0ef',
  },
  activeLabel: {
    fontSize: 14,
  },
  activeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  guarantee: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: '#9ca3af',
  },
});
