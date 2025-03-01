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
  // Filter days for the specified month (March is month 3)
  const monthDays = imsakiyahDays.filter(day => {
    // For March 2025, Ramadhan starts on the 1st
    return day.tanggal >= 1 && day.tanggal <= 31;
  });
  
  // Sort by date to ensure correct order
  const sortedDays = [...monthDays].sort((a, b) => a.tanggal - b.tanggal);
  
  return sortedDays.map((day) => {
    // Create a date string in YYYY-MM-DD format
    // Month is 0-indexed in JavaScript Date, so we use month-1
    const date = new Date(parseInt(year), month - 1, day.tanggal);
    const dateString = date.toISOString().split('T')[0];
    
    // Calculate Ramadhan day - for March 2025, day 1 of Ramadhan is March 1st
    // So the Ramadhan day is the same as the date in March
    const ramadhanDay = day.tanggal;
    
    return {
      date: dateString,
      day: ramadhanDay, // Ramadhan day (1-based, starting from March 1st)
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