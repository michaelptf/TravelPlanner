import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, createExpense, deleteExpense } from '../services/api';
import { colors, spacing, typography, shadows } from '../theme';
import Header from '../components/Header';

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

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['expenses', demoTripId],
    queryFn: () => fetchExpenses(demoTripId),
    placeholderData: initialMock,
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => createExpense(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses', demoTripId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses', demoTripId] }),
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
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.description}</Text>
          <Text style={styles.cardAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.cardSubtext}>Paid by {item.payer}</Text>
          <Text style={styles.cardSubtext}>Share: ${share.toFixed(2)} • {item.participants.join(', ')}</Text>
        </View>
        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const totalExpenses = items?.reduce((sum, item) => sum + item.amount, 0) || 0;

  return (
    <View style={styles.screenContainer}>
      <Header tripName="Tokyo Escape" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>💰 Expenses</Text>

        <View style={styles.formCard}>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Description (e.g., Taxi)"
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount"
            keyboardType="decimal-pad"
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <TextInput
            value={payer}
            onChangeText={setPayer}
            placeholder="Who paid?"
            style={styles.input}
            placeholderTextColor={colors.mutedText}
          />
          <Button title="+ Add Expense" onPress={addItem} color={colors.coral} />
        </View>

        <FlatList
          scrollEnabled={false}
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No expenses yet. Add your first one!</Text>}
        />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
        </View>

        <Button
          title="🌱 Seed Mock Expenses"
          onPress={() => queryClient.setQueryData(['expenses', demoTripId], initialMock)}
          color={colors.accentGold}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.lightBg },
  container: { flex: 1, backgroundColor: colors.lightBg },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg + 80 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  formCard: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg },
  input: { borderWidth: 1, borderColor: colors.borderLight, padding: spacing.md, marginBottom: spacing.md, borderRadius: 8, backgroundColor: colors.lightBg, color: colors.darkText },
  card: { ...shadows.soft, backgroundColor: colors.cardBg, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'flex-start' },
  cardTitle: { ...typography.body, fontWeight: '600', marginBottom: spacing.xs, color: colors.darkText },
  cardAmount: { ...typography.h2, fontWeight: '700', color: colors.coral, marginBottom: spacing.xs },
  cardSubtext: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.xs },
  deleteButton: { marginLeft: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  deleteText: { color: colors.coral, fontSize: 18, fontWeight: '600' },
  totalCard: { ...shadows.medium, backgroundColor: colors.warmCream, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg, alignItems: 'center' },
  totalLabel: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.xs },
  totalAmount: { fontSize: 32, fontWeight: '700', color: colors.coral },
  emptyText: { ...typography.caption, textAlign: 'center', paddingVertical: spacing.lg, color: colors.mutedText },
});

export default ExpensesScreen;
