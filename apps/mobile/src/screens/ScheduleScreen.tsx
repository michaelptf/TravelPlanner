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
    <TouchableOpacity style={styles.item} onLongPress={() => removeItem(item.id)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemMeta}>{new Date(item.start).toLocaleString()}</Text>
        {item.location ? <Text style={styles.itemMeta}>{item.location}</Text> : null}
        {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={{ color: 'crimson' }}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>

      <View style={styles.form}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Add activity (e.g., 'City tour')"
          style={styles.input}
        />
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Location (optional)"
          style={styles.input}
        />
        <Button title="Add" onPress={addItem} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 12 }}
        ListEmptyComponent={<Text>No schedule items yet.</Text>}
      />

      <View style={{ marginTop: 12 }}>
        <Button
          title="Seed mock items"
          onPress={() => queryClient.setQueryData(['schedule', demoTripId], initialMock)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  form: { marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8, borderRadius: 6 },
  item: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontWeight: '600', marginBottom: 4 },
  itemMeta: { color: '#666', fontSize: 12 },
  itemNotes: { color: '#666', fontSize: 12, marginTop: 6 },
});

export default ScheduleScreen;
