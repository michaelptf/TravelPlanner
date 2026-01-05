import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, CheckBox } from 'react-native';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

type Goal = {
  id: string;
  name: string;
  category: 'activity' | 'restaurant';
  completed: boolean;
  instagramUrl?: string;
};

const GoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: 'Disneyland', category: 'activity', completed: false },
    { id: '2', name: 'Mt. Fuji', category: 'activity', completed: true },
    { id: '3', name: 'Ramen', category: 'restaurant', completed: false },
    { id: '4', name: 'Sushi', category: 'restaurant', completed: false },
    { id: '5', name: 'Yakitori', category: 'restaurant', completed: true },
  ]);

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const activities = goals.filter((g) => g.category === 'activity');
  const restaurants = goals.filter((g) => g.category === 'restaurant');

  const renderGoal = (goal: Goal) => (
    <TouchableOpacity
      key={goal.id}
      style={styles.goalItem}
      onPress={() => toggleGoal(goal.id)}
    >
      <View style={[styles.checkbox, goal.completed && styles.checkboxChecked]}>
        {goal.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.goalText, goal.completed && styles.goalCompleted]}>{goal.name}</Text>
        {goal.instagramUrl ? (
          <Text style={styles.instagramLink}>📸 {goal.instagramUrl}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const activitiesCompleted = activities.filter((a) => a.completed).length;
  const restaurantsCompleted = restaurants.filter((r) => r.completed).length;

  return (
    <View style={styles.screenContainer}>
      <Header tripName="Tokyo Escape" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>🎯 Goals</Text>

        <Text style={styles.subsectionTitle}>🏛️ Activities</Text>
        <View style={styles.card}>
          <Text style={styles.progress}>
            {activitiesCompleted} of {activities.length} completed
          </Text>
          {activities.map(renderGoal)}
        </View>

        <Text style={styles.subsectionTitle}>🍜 Restaurants</Text>
        <View style={styles.card}>
          <Text style={styles.progress}>
            {restaurantsCompleted} of {restaurants.length} completed
          </Text>
          {restaurants.map(renderGoal)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.lightBg },
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg + 80 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  subsectionTitle: { ...typography.body, fontWeight: '600', marginBottom: spacing.md, marginTop: spacing.lg, color: colors.darkText },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg },
  progress: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.md },
  goalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.peach, marginRight: spacing.md, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.coral, borderColor: colors.coral },
  checkmark: { color: colors.cardBg, fontSize: 16, fontWeight: '700' },
  goalText: { ...typography.body, color: colors.darkText, fontWeight: '500' },
  goalCompleted: { textDecorationLine: 'line-through', color: colors.mutedText },
  instagramLink: { ...typography.small, color: colors.peach, marginTop: spacing.xs },
});

export default GoalsScreen;
