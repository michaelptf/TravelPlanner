import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TripInfoScreen: React.FC = () => {
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 }
});

export default TripInfoScreen;
