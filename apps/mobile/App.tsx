import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Temporary minimal App to isolate RNSScreen error
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Minimal App — debugging RNSScreen issue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 }
});

