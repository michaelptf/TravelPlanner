import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchedule, createSchedule, deleteSchedule } from '../services/api';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

type ScheduleItem = {
  id: string;
  title: string;
  start: string; // ISO date/time string
  location?: string;
  notes?: string;
};

const initialMock: ScheduleItem[] = [
  {
    id: 's1',
    title: 'Flight to Tokyo',
    start: new Date().toISOString(),
    location: 'SFO Airport',
    notes: 'Arrive 2h early',
  },
  {
    id: 's2',
    title: 'Check into hotel',
    start: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    location: 'Shinjuku',
    notes: 'Ask for late check-in',
  },
];

const demoTripId = 'mock-trip-1';


const ScheduleScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const queryClient = useQueryClient();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['schedule', demoTripId],
    queryFn: () => fetchSchedule(demoTripId),
    placeholderData: initialMock,
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => createSchedule(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule', demoTripId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule', demoTripId] }),
  });

  const addItem = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for the schedule item.');
      return;
    }
    try {
      await addMutation.mutateAsync({ trip_id: demoTripId, title: title.trim(), start: new Date().toISOString(), location: location.trim() || undefined });
      setTitle('');
      setLocation('');
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
    }
  };

  const removeItem = (id: string) => {
    Alert.alert('Delete item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const renderItem = ({ item }: { item: ScheduleItem }) => (
    <TouchableOpacity style={styles.card} onLongPress={() => removeItem(item.id)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardTime}>🕐 {new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        {item.location ? <Text style={styles.cardLocation}>📍 {item.location}</Text> : null}
        {item.notes ? <Text style={styles.cardNotes}>{item.notes}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header tripName="Tokyo Escape" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>📅 Schedule</Text>

        <View style={styles.formCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Activity name (e.g., 'City tour')"
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location (optional)"
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <Button title="+ Add Activity" onPress={addItem} color={colors.coral} />
        </View>

        <FlatList
          scrollEnabled={false}
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No activities yet. Add your first one!</Text>}
        />

        <Button
          title="🌱 Seed Mock Items"
          onPress={() => queryClient.setQueryData(['schedule', demoTripId], initialMock)}
          color={colors.accentGold}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBg },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  formCard: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: colors.borderLight, padding: spacing.md, marginBottom: spacing.md, borderRadius: 8, backgroundColor: colors.lightBg, color: colors.darkText },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'flex-start' },
  cardTitle: { ...typography.body, fontWeight: '600', marginBottom: spacing.xs, color: colors.darkText },
  cardTime: { ...typography.caption, marginBottom: spacing.xs, color: colors.mutedText },
  cardLocation: { ...typography.caption, color: colors.peach, marginBottom: spacing.xs },
  cardNotes: { ...typography.small, color: colors.mutedText, marginTop: spacing.xs },
  deleteButton: { marginLeft: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  deleteText: { color: colors.coral, fontSize: 18, fontWeight: '600' },
  emptyText: { ...typography.caption, textAlign: 'center', paddingVertical: spacing.lg, color: colors.mutedText },
});

export default ScheduleScreen;
