import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configuração global para exibir notificações mesmo com app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');
  const [habitTime, setHabitTime] = useState('');

  // Pedir permissão para notificações
  useEffect(() => {
    const getPermissions = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'Ative as notificações para usar este recurso.');
        }
      } else {
        Alert.alert('Atenção', 'Notificações só funcionam em dispositivos físicos.');
      }

      // Configuração do canal Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    getPermissions();
  }, []);

  // Função para agendar notificações
  const scheduleNotification = async (habit) => {
    try {
      const [hour, minute] = habit.time.split(':').map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Lembrete de Hábito `, // emoji no título
          body: `Hora de ${habit.name}!`,
          sound: 'default', // som padrão
        },
        trigger: { hour, minute, repeats: true },
      });

      return notificationId;
    } catch (error) {
      Alert.alert('Erro', 'Horário inválido. Use o formato HH:MM.');
      console.log(error);
    }
  };

  // Adicionar hábito + agendar notificação
  const addHabit = async () => {
    if (habitName.trim() === '' || habitTime.trim() === '') return;

    const newHabit = {
      id: Date.now().toString(),
      name: habitName,
      time: habitTime,
      notificationId: null,
    };

    const notificationId = await scheduleNotification(newHabit);
    newHabit.notificationId = notificationId;

    setHabits([...habits, newHabit]);
    setHabitName('');
    setHabitTime('');
  };

  // Deletar hábito + cancelar notificação
  const deleteHabit = async (id) => {
    const habitToDelete = habits.find((habit) => habit.id === id);
    if (habitToDelete && habitToDelete.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(habitToDelete.notificationId);
      } catch (error) {
        console.log('Erro ao cancelar notificação:', error);
      }
    }
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Controle de Hábitos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do hábito..."
        placeholderTextColor="#aaa"
        value={habitName}
        onChangeText={setHabitName}
      />

      <TextInput
        style={styles.input}
        placeholder="Horário (ex: 08:00)"
        placeholderTextColor="#aaa"
        value={habitTime}
        onChangeText={setHabitTime}
      />

      <TouchableOpacity style={styles.addButton} onPress={addHabit}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <View>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.habitTime}>{item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteHabit(item.id)}>
              <Text style={styles.deleteButton}>✖</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum hábito adicionado ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitTime: {
    color: '#aaa',
    fontSize: 14,
  },
  deleteButton: {
    color: '#ff5555',
    fontSize: 20,
    fontWeight: 'bold',
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
