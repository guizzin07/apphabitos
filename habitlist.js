import React from 'react';
import { FlatList, Text } from 'react-native';
import HabitItem from './HabitItem';
import { colors } from '../constants/colors';

export default function HabitList({ habits, onDelete }) {
  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HabitItem habit={item} onDelete={onDelete} />}
      ListEmptyComponent={<Text style={{ color: colors.emptyText, textAlign: 'center', marginTop: 40, fontStyle: 'italic' }}>Nenhum hábito adicionado ainda.</Text>}
    />
  );
}
