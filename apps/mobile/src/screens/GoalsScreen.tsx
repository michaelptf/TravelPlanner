import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalsScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Goals</Text>
    <Text>Saved restaurants and places</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 }
});

export default GoalsScreen;
