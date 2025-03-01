import React from 'react';
import { DailySchedule, PrayerTime } from '../types';
import PrayerTimeCard from './PrayerTimeCard';

interface DailyScheduleCardProps {
  schedule: DailySchedule;
  currentTime: Date;
}

const DailyScheduleCard: React.FC<DailyScheduleCardProps> = ({ schedule, currentTime }) => {
  // Format the date
  const dateObj = new Date(schedule.date);
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine the next prayer time
  const getNextPrayerTime = (): { prayer: PrayerTime; timeRemaining: string } | null => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    for (const prayer of schedule.prayerTimes) {
      const [prayerHour, prayerMinute] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = prayerHour * 60 + prayerMinute;
      
      if (prayerTimeInMinutes > currentTimeInMinutes) {
        // Calculate time remaining
        const minutesRemaining = prayerTimeInMinutes - currentTimeInMinutes;
        const hoursRemaining = Math.floor(minutesRemaining / 60);
        const remainingMinutes = minutesRemaining % 60;
        
        let timeRemainingStr = '';
        if (hoursRemaining > 0) {
          timeRemainingStr += `${hoursRemaining} jam `;
        }
        timeRemainingStr += `${remainingMinutes} menit lagi`;
        
        return { prayer, timeRemaining: timeRemainingStr };
      }
    }
    
    return null;
  };
  
  const nextPrayer = getNextPrayerTime();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Ramadhan Hari ke-{schedule.day-1}
        </h2>
        <p className="text-gray-600">{formattedDate}</p>
      </div>
      
      <div className="space-y-3">
        {schedule.prayerTimes.map((prayer) => (
          <PrayerTimeCard 
            key={prayer.name}
            prayerTime={prayer}
            isNext={nextPrayer?.prayer.name === prayer.name}
            timeRemaining={nextPrayer?.prayer.name === prayer.name ? nextPrayer.timeRemaining : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyScheduleCard;