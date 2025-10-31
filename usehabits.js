import { useState } from 'react';
import { useNotifications } from './useNotifications';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const { scheduleNotification, cancelNotification } = useNotifications();

  const addHabit = async (habit) => {
    if (!habit.name.trim() || !habit.time.trim()) return;

    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      time: habit.time,
      notificationId: null,
    };

    const notificationId = await scheduleNotification(newHabit);
    newHabit.notificationId = notificationId;

    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = async (id) => {
    const habitToDelete = habits.find((h) => h.id === id);
    if (habitToDelete?.notificationId) {
      await cancelNotification(habitToDelete.notificationId);
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return { habits, addHabit, deleteHabit };
};
