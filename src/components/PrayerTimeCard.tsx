import React from 'react';
import { PrayerTime } from '../types';

interface PrayerTimeCardProps {
  prayerTime: PrayerTime;
  isNext: boolean;
  timeRemaining?: string;
}

const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({ prayerTime, isNext, timeRemaining }) => {
  return (
    <div className={`rounded-lg p-4 shadow-md transition-all ${
      isNext 
        ? 'bg-gradient-to-r from-green-500 to-green-700 text-white transform scale-105' 
        : 'bg-white'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-lg font-bold ${isNext ? 'text-white' : 'text-gray-800'}`}>
            {prayerTime.name}
          </h3>
          {prayerTime.arabicName && (
            <p className={`text-sm ${isNext ? 'text-green-100' : 'text-gray-600'}`}>
              {prayerTime.arabicName}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isNext ? 'text-white' : 'text-gray-800'}`}>
            {prayerTime.time}
          </p>
          {isNext && timeRemaining && (
            <p className="text-sm text-green-100">
              {timeRemaining}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimeCard;