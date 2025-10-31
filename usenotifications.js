import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';

// Configuração global para exibir notificações mesmo com app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {

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

  const scheduleNotification = async (habit) => {
    try {
      const [hour, minute] = habit.time.split(':').map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Lembrete de Hábito`,
          body: `Hora de ${habit.name}!`,
          sound: 'default',
        },
        trigger: { hour, minute, repeats: true },
      });

      return notificationId;
    } catch (error) {
      Alert.alert('Erro', 'Horário inválido. Use o formato HH:MM.');
      console.log(error);
    }
  };

  const cancelNotification = async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log('Erro ao cancelar notificação:', error);
    }
  };

  return { scheduleNotification, cancelNotification };
};
