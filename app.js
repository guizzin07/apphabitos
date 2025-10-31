import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabits } from './hooks/useHabits';
import HabitInput from './components/HabitInput';
import HabitList from './components/HabitList';
import { colors } from './constants/colors';

export default function App() {
  const { habits, addHabit, deleteHabit } = useHabits();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Controle de Hábitos</Text>
      <HabitInput onAdd={addHabit} />
      <HabitList habits={habits} onDelete={deleteHabit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 26, color: colors.text, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
