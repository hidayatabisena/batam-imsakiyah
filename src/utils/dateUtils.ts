import { DailySchedule, ImsakiyahDay } from '../types';

/**
 * Finds the schedule for the current date from the provided schedules
 */
export const findCurrentSchedule = (schedules: DailySchedule[], currentDate: Date) => {
  const dateString = currentDate.toISOString().split('T')[0];
  return schedules.find(schedule => schedule.date === dateString);
};

/**
 * Formats time remaining until the next prayer time
 */
export const formatTimeRemaining = (targetTime: string, currentTime: Date): string => {
  const [hours, minutes] = targetTime.split(':').map(Number);
  
  const targetDate = new Date(currentTime);
  targetDate.setHours(hours, minutes, 0, 0);
  
  // If target time is earlier than current time, it's for tomorrow
  if (targetDate < currentTime) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  
  const diffMs = targetDate.getTime() - currentTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours} jam ${diffMinutes} menit lagi`;
  }
  return `${diffMinutes} menit lagi`;
};

/**
 * Converts ImsakiyahDay array to DailySchedule array
 * Ramadhan 2025 starts on March 1st
 */
export const convertToDailySchedule = (imsakiyahDays: ImsakiyahDay[], year: string, month: number): DailySchedule[] => {
  // Create a copy of the array to avoid modifying the original
  // Filter to only include days from March (month 3)
  const marchDays = imsakiyahDays.filter(day => {
    // Only include days from March 1st onwards (Ramadhan starts on March 1st)
    const date = new Date(parseInt(year), month - 1, day.tanggal);
    return date.getMonth() === month - 1 && date.getDate() >= 1;
  });
  
  const sortedDays = marchDays.sort((a, b) => a.tanggal - b.tanggal);
  
  return sortedDays.map((day) => {
    const date = new Date(parseInt(year), month - 1, day.tanggal);
    const dateString = date.toISOString().split('T')[0];
    
    // Ramadhan day starts from 1
    const ramadhanDay = day.tanggal;
    
    return {
      date: dateString,
      day: ramadhanDay,
      prayerTimes: [
        { name: "Imsak", time: day.imsak, arabicName: "إمساك" },
        { name: "Subuh", time: day.subuh, arabicName: "صبح" },
        { name: "Dzuhur", time: day.dzuhur, arabicName: "ظهر" },
        { name: "Ashar", time: day.ashar, arabicName: "عصر" },
        { name: "Maghrib", time: day.maghrib, arabicName: "مغرب" },
        { name: "Isya", time: day.isya, arabicName: "عشاء" }
      ]
    };
  });
};

/**
 * Find the current day's imsakiyah schedule based on the current date
 */
export const findCurrentImsakiyahDay = (imsakiyahDays: ImsakiyahDay[], currentDate: Date): ImsakiyahDay | undefined => {
  const currentDay = currentDate.getDate();
  return imsakiyahDays.find(day => day.tanggal === currentDay);
};