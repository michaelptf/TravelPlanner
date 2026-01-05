import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

const MapScreen: React.FC = () => {
  const [viewMode] = useState<'day' | 'trip'>('trip');

  return (
    <View style={styles.screenContainer}>
      <Header tripName="Tokyo Escape" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>🗺️ Map</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Interactive Map View</Text>
          <Text style={styles.comingSoon}>📍 Coming Soon</Text>
          <Text style={styles.cardSubtext}>
            View pins for hotel, activities, and restaurants on an interactive map.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>📌 Pinned Locations</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shinjuku Royal Hotel</Text>
          <Text style={styles.cardSubtext}>📍 Shinjuku, Tokyo</Text>
          <Text style={styles.badge}>Hotel</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Senso-ji Temple</Text>
          <Text style={styles.cardSubtext}>📍 Taito, Tokyo</Text>
          <Text style={styles.badge}>✨ AI Suggested</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tsukiji Outer Market</Text>
          <Text style={styles.cardSubtext}>📍 Chuo, Tokyo</Text>
          <Text style={styles.badge}>Food</Text>
        </View>

        <Text style={styles.sectionTitle}>🛤️ Route</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Suggested Route</Text>
          <Text style={styles.cardSubtext}>3 stops • 12 km • 2h 30m</Text>
          <Text style={styles.routeText}>Shinjuku → Senso-ji → Tsukiji</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.lightBg },
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg + 80 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg, marginTop: spacing.lg },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { ...typography.body, fontWeight: '600', marginBottom: spacing.xs, color: colors.darkText },
  cardSubtext: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.md },
  comingSoon: { fontSize: 14, color: colors.peach, fontWeight: '600', marginBottom: spacing.md },
  badge: { ...typography.small, backgroundColor: colors.warmCream, color: colors.darkText, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 12, alignSelf: 'flex-start' },
  routeText: { ...typography.body, fontWeight: '600', color: colors.coral, marginTop: spacing.sm },
});

export default MapScreen;