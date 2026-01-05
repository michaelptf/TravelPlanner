import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

const TripInfoScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [lastResult, setLastResult] = useState<string | undefined>();
  const [detectedBase, setDetectedBase] = useState<string | undefined>();
  const [testUserId, setTestUserId] = useState<string>('11111111-1111-1111-1111-111111111111');

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUserIdValid = uuidRegex.test(testUserId);

  const getApiBase = () => {
    // Strategies to determine backend host reachable from the device
    // 1) Expo debugger host (when running in dev mode)
    const manifest: any = (Constants as any)?.manifest || (Constants as any)?.manifest2;
    const debuggerHost = manifest?.debuggerHost as string | undefined;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      return { base: `http://${host}:4000`, source: 'debuggerHost' };
    }

    // 2) expo devtools hostUri (sometimes available in Constants.expoConfig)
    const hostUri = (Constants as any)?.expoConfig?.hostUri as string | undefined;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      return { base: `http://${host}:4000`, source: 'expoConfig.hostUri' };
    }

    // 3) fallback to localhost (won't work from device but informative)
    return { base: 'http://localhost:4000', source: 'localhost_fallback' };
  };

  const testApi = async (userId?: string) => {
    setError(undefined);
    setLastResult(undefined);
    try {
      setLoading(true);
      const { base, source } = getApiBase();
      setDetectedBase(base + ` (from ${source})`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const uid = userId ?? testUserId;
      const res = await fetch(`${base}/api/trips?user_id=${encodeURIComponent(uid)}`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text();
        setError(`HTTP ${res.status}: ${text}`);
        return;
      }

      const json = await res.json();
      setLastResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header tripName="Tokyo Escape" onMorePress={() => Alert.alert('Menu', 'Coming soon')} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✈️ Flight</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Departure:</Text>
            <Text style={styles.value}>SFO • 9:00 AM</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Arrival:</Text>
            <Text style={styles.value}>NRT • 2:00 PM +1d</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏨 Hotel</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shinjuku Royal Hotel</Text>
          <Text style={styles.cardSubtext}>📍 Shinjuku, Tokyo</Text>
          <Text style={styles.cardSubtext}>Dates: Mar 1 - Mar 10</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Vibe</Text>
        <View style={styles.card}>
          <View style={styles.vibeRow}>
            <Text style={styles.vibeBadge}>🧘 Relaxing</Text>
            <Text style={styles.vibeBadge}>🎨 Cultural</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Test Backend API</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Test user id:</Text>
          <TextInput
            value={testUserId}
            onChangeText={(t) => {
              setTestUserId(t);
              setError(undefined);
            }}
            style={{
              ...styles.input,
              borderColor: !isUserIdValid ? colors.coral : colors.borderLight,
            }}
            placeholder="owner_id (uuid)"
          />
          {!isUserIdValid ? (
            <Text style={styles.errorText}>
              Invalid user id: must be a UUID (e.g., 11111111-1111-1111-1111-111111111111)
            </Text>
          ) : null}
          {loading ? (
            <ActivityIndicator color={colors.coral} />
          ) : (
            <Button
              title={isUserIdValid ? 'Test Backend API' : 'Enter valid UUID'}
              onPress={() => {
                if (!isUserIdValid) {
                  setError('Invalid user_id: must be a UUID.');
                  return;
                }
                testApi(testUserId);
              }}
              disabled={!isUserIdValid || loading}
              color={colors.coral}
            />
          )}

          {detectedBase ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Using base: {detectedBase}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          ) : null}

          {lastResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{lastResult}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: spacing.xl, backgroundColor: colors.lightBg },
  section: { marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  cardTitle: { ...typography.h2, marginBottom: spacing.sm },
  cardSubtext: { ...typography.caption, marginBottom: spacing.xs },
  label: { ...typography.body, fontWeight: '600', color: colors.mutedText },
  value: { ...typography.body, fontWeight: '600', color: colors.darkText },
  vibeRow: { flexDirection: 'row', gap: spacing.md },
  vibeBadge: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.warmCream, borderRadius: 20, fontSize: 14 },
  input: { borderWidth: 1, padding: spacing.md, marginVertical: spacing.md, borderRadius: 8, backgroundColor: colors.lightBg },
  errorText: { color: colors.coral, fontSize: 12, marginVertical: spacing.xs },
  errorBox: { backgroundColor: '#FFE5E5', padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  infoBox: { backgroundColor: colors.warmCream, padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  infoText: { ...typography.caption, color: colors.darkText },
  resultBox: { backgroundColor: colors.softShadow, padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  resultText: { ...typography.small, color: colors.darkText, fontFamily: 'monospace' },
});

export default TripInfoScreen;
