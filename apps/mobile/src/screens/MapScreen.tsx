import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Map</Text>
    <Text>Map and suggested routes</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 }
});

export default MapScreen;
