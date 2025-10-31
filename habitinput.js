import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function HabitInput({ onAdd }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = () => {
    onAdd({ name, time });
    setName('');
    setTime('');
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Nome do hábito..."
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Horário (ex: 08:00)"
        placeholderTextColor={colors.placeholder}
        value={time}
        onChangeText={setTime}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: colors.addButton,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});
