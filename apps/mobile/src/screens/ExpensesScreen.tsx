import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpensesScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Expenses</Text>
    <Text>Expense table and split UI</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 }
});

export default ExpensesScreen;
