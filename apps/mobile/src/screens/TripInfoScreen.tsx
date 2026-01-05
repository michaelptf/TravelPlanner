import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator, TextInput } from 'react-native';
import Constants from 'expo-constants';

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
      <Text style={styles.title}>Trip Info</Text>
      <View style={styles.section}>
        <Text>Flight</Text>
      </View>
      <View style={styles.section}>
        <Text>Hotel</Text>
      </View>
      <View style={styles.section}>
        <Text>Members & MBTI</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ marginBottom: 8 }}>Test user id:</Text>
        <TextInput
          value={testUserId}
          onChangeText={(t) => {
            setTestUserId(t);
            setError(undefined);
          }}
          style={{
            borderWidth: 1,
            borderColor: !isUserIdValid ? 'crimson' : '#ddd',
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
          }}
          placeholder="owner_id (uuid)"
        />

        {!isUserIdValid ? (
          <Text style={{ color: 'crimson', marginBottom: 8 }}>
            Invalid user id: must be a UUID (e.g., 11111111-1111-1111-1111-111111111111)
          </Text>
        ) : null}

        {loading ? (
          <ActivityIndicator />
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
          />
        )}
      </View>

      {detectedBase ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: '#444' }}>Using base: {detectedBase}</Text>
        </View>
      ) : null}

      {error ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: 'crimson' }}>Error: {error}</Text>
        </View>
      ) : null}

      {lastResult ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontFamily: 'monospace' }}>{lastResult}</Text>
        </View>
      ) : null}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 }
});

export default TripInfoScreen;
