import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScheduleScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Schedule</Text>
    <Text>AI suggestions will appear here</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 }
});

export default ScheduleScreen;
