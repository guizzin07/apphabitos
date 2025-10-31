import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import MainApp from './app';
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 26, color: colors.text, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
