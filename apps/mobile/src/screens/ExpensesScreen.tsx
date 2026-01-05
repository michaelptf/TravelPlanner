import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, createExpense, deleteExpense } from '../services/api';

type Expense = {
  id: string;
  description: string;
  amount: number;
  payer: string;
  participants: string[]; // who shares the expense
};

const members = ['Alice', 'Bob', 'Charlie'];

const initialMock: Expense[] = [
  { id: 'e1', trip_id: 'mock-trip-1', description: 'Dinner', amount: 120.5, payer: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] },
  { id: 'e2', trip_id: 'mock-trip-1', description: 'Taxi', amount: 35, payer: 'Bob', participants: ['Bob'] },
];

const demoTripId = 'mock-trip-1';

const ExpensesScreen: React.FC = () => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(members[0]);

  const queryClient = useQueryClient();

  const { data: items, isLoading, error } = useQuery(['expenses', demoTripId], () => fetchExpenses(demoTripId), {
    placeholderData: initialMock,
  });

  const addMutation = useMutation((payload: any) => createExpense(payload), {
    onSuccess: () => queryClient.invalidateQueries(['expenses', demoTripId]),
  });

  const deleteMutation = useMutation((id: string) => deleteExpense(id), {
    onSuccess: () => queryClient.invalidateQueries(['expenses', demoTripId]),
  });

  const addItem = async () => {
    const a = parseFloat(amount);
    if (!desc.trim() || Number.isNaN(a) || a <= 0) {
      Alert.alert('Invalid', 'Please enter description and a valid amount');
      return;
    }
    try {
      await addMutation.mutateAsync({ trip_id: demoTripId, description: desc.trim(), amount: a, payer, participants: [payer] });
      setDesc('');
      setAmount('');
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
    }
  };

  const removeItem = (id: string) => {
    Alert.alert('Delete expense', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Expense }) => {
    const share = item.amount / item.participants.length;
    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text style={styles.itemMeta}>${item.amount.toFixed(2)} • paid by {item.payer}</Text>
          <Text style={styles.itemMeta}>share: ${share.toFixed(2)} • {item.participants.join(', ')}</Text>
        </View>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Text style={{ color: 'crimson' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>

      <View style={styles.form}>
        <TextInput value={desc} onChangeText={setDesc} placeholder="Description" style={styles.input} />
        <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" keyboardType="decimal-pad" style={styles.input} />
        <TextInput value={payer} onChangeText={setPayer} placeholder="Payer" style={styles.input} />
        <Button title="Add Expense" onPress={addItem} />
      </View>

      <FlatList data={items} keyExtractor={(i) => i.id} renderItem={renderItem} ListEmptyComponent={<Text>No expenses yet.</Text>} />

      <View style={{ marginTop: 12 }}>
        <Button title="Seed mock expenses" onPress={() => setItems(initialMock)} />
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
});

export default ExpensesScreen;
