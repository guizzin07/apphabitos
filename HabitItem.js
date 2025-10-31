import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function HabitItem({ habit, onDelete }) {
  return (
    <View style={styles.habitItem}>
      <View>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.habitTime}>{habit.time}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(habit.id)}>
        <Text style={styles.deleteButton}>✖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitName: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  habitTime: { color: colors.placeholder, fontSize: 14 },
  deleteButton: { color: colors.deleteButton, fontSize: 20, fontWeight: 'bold' },
});
