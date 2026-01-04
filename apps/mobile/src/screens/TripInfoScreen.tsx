import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

const TripInfoScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const getApiBase = () => {
    // Use debuggerHost when running in Expo dev mode to reach the local backend from the device
    const debuggerHost = (Constants as any)?.manifest?.debuggerHost as string | undefined;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      return `http://${host}:4000`;
    }
    return 'http://localhost:4000';
  };

  const testApi = async () => {
    try {
      setLoading(true);
      const base = getApiBase();
      const res = await fetch(`${base}/api/trips?user_id=1`);
      const json = await res.json();
      Alert.alert('API Response', JSON.stringify(json, null, 2));
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
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
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Test Backend API" onPress={testApi} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 }
});

export default TripInfoScreen;
