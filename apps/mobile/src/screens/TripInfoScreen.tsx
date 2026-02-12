import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

// --- Types ---
interface Hotel {
  id: string;
  name: string;
  location: string;
  dates: string;
}

const TripInfoScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [lastResult, setLastResult] = useState<string | undefined>();
  const [detectedBase, setDetectedBase] = useState<string | undefined>();
  const [testUserId, setTestUserId] = useState<string>('11111111-1111-1111-1111-111111111111');
  // --- State for Flight ---
  const [isEditingFlight, setIsEditingFlight] = useState(false);
  const [flight, setFlight] = useState({
    departure: 'SFO • 9:00 AM',
    arrival: 'NRT • 2:00 PM +1d'
  });

  // --- State for Hotels ---
  const [hotels, setHotels] = useState<Hotel[]>([
    { id: '1', name: 'Shinjuku Royal Hotel', location: 'Shinjuku, Tokyo', dates: 'Mar 1 - Mar 10' }
  ]);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

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

  // --- Helpers ---
  const addHotel = () => {
    const newHotel: Hotel = {
      id: Date.now().toString(),
      name: 'New Hotel',
      location: 'City, Country',
      dates: 'Dates'
    };
    setHotels([...hotels, newHotel]);
    setEditingHotelId(newHotel.id); // Open edit mode for the new hotel immediately
  };

  const updateHotel = (id: string, field: keyof Hotel, value: string) => {
    setHotels(hotels.map(h => h.id === id ? { ...h, [field]: value } : h));
  };
  // --- Persistence Logic ---

  const saveFlightToBackend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base}/api/trips/YOUR_TRIP_ID`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departure_info: flight.departure,
          arrival_info: flight.arrival,
        }),
      });
      if (!response.ok) throw new Error('Failed to save flight');
      setIsEditingFlight(false);
    } catch (err) {
      Alert.alert("Error", "Could not save flight info");
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = (id: string) => {
    Alert.alert("Delete Hotel", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          // Update local state first for snappy UI
          setHotels(hotels.filter(h => h.id !== id));
          // Call backend DELETE /api/hotels/${id} here
        } 
      }
    ]);
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header tripName="Tokyo Escape" onMorePress={() => Alert.alert('Menu', 'Coming soon')} />

      {/* --- Flight Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✈️ Flight</Text>
            <TouchableOpacity onPress={isEditingFlight ? saveFlightToBackend : () => setIsEditingFlight(true)}>
              <Text style={styles.editBtnText}>
                {loading ? '...' : (isEditingFlight ? 'Save' : 'Edit')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            {isEditingFlight ? (
              <>
                <TextInput style={styles.input} value={flight.departure} onChangeText={(t) => setFlight({...flight, departure: t})} placeholder="Departure" />
                <TextInput style={styles.input} value={flight.arrival} onChangeText={(t) => setFlight({...flight, arrival: t})} placeholder="Arrival" />
              </>
            ) : (
              <>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Departure:</Text>
                  <Text style={styles.value}>{flight.departure}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Arrival:</Text>
                  <Text style={styles.value}>{flight.arrival}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* --- Hotel Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏨 Hotels</Text>
          {hotels.map((hotel) => (
            <View key={hotel.id} style={styles.card}>
              {editingHotelId === hotel.id ? (
                <View>
                  <TextInput 
                    style={styles.input} 
                    value={hotel.name} 
                    onChangeText={(t) => updateHotel(hotel.id, 'name', t)} 
                  />
                  <View style={styles.buttonRow}>
                    <Button title="Save" onPress={() => setEditingHotelId(null)} />
                    <Button title="Delete" color={colors.coral} onPress={() => deleteHotel(hotel.id)} />
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingHotelId(hotel.id)}>
                  <Text style={styles.cardTitle}>{hotel.name}</Text>
                  <Text style={styles.cardSubtext}>📍 {hotel.location}</Text>
                  <Text style={styles.cardSubtext}>Dates: {hotel.dates}</Text>
                  <Text style={styles.tapToEdit}>Tap to edit</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addHotel}>
            <Text style={styles.addButtonText}>+ Add Another Hotel</Text>
          </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.lightBg },
  container: { paddingBottom: spacing.xl + 80, backgroundColor: colors.lightBg },
  section: { marginBottom: spacing.lg, marginHorizontal: spacing.lg },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md, marginHorizontal: spacing.xs },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  cardTitle: { ...typography.h2, marginBottom: spacing.sm },
  cardSubtext: { ...typography.caption, marginBottom: spacing.xs },
  label: { ...typography.body, fontWeight: '600', color: colors.mutedText },
  value: { ...typography.body, fontWeight: '600', color: colors.darkText },
  vibeRow: { flexDirection: 'row', gap: spacing.md },
  vibeBadge: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.warmCream, borderRadius: 20, fontSize: 14 },
  input: { 
    borderWidth: 1, 
    padding: spacing.md, 
    marginVertical: spacing.sm, 
    borderRadius: 8, 
    backgroundColor: colors.lightBg,
    borderColor: colors.borderLight   
  },
  errorText: { color: colors.coral, fontSize: 12, marginVertical: spacing.xs },
  errorBox: { backgroundColor: '#FFE5E5', padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  infoBox: { backgroundColor: colors.warmCream, padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  infoText: { ...(typography.caption as import('react-native').TextStyle), color: colors.darkText },
  resultBox: { backgroundColor: colors.softShadow, padding: spacing.md, borderRadius: 8, marginVertical: spacing.md },
  resultText: { ...(typography.small as import('react-native').TextStyle), color: colors.darkText, fontFamily: 'monospace' },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: spacing.md  
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: spacing.md 
  },
  editBtnText: { color: colors.coral, fontWeight: '600' },
  tapToEdit: { ...typography.caption, color: colors.mutedText, marginTop: spacing.xs, fontStyle: 'italic' },
  addButton: { 
    borderWidth: 1, 
    borderColor: colors.coral, 
    borderStyle: 'dashed', 
    borderRadius: 12, 
    padding: spacing.md, 
    alignItems: 'center' 
  },
  addButtonText: { color: colors.coral, fontWeight: '600' },
});

export default TripInfoScreen;
