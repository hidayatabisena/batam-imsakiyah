import React, { useState, useEffect } from 'react';
import { CloudMoon, Clock, MapPin, Calendar } from 'lucide-react';
import DigitalClock from './components/DigitalClock';
import DailyScheduleCard from './components/DailyScheduleCard';
import { DailySchedule, ImsakiyahResponse } from './types';
import { convertToDailySchedule, findCurrentSchedule } from './utils/dateUtils';

function App() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<DailySchedule | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useState<{ provinsi: string; kabkota: string }>({
    provinsi: 'Kepulauan Riau',
    kabkota: 'Kota Batam'
  });
  
  // Fetch imsakiyah data
  useEffect(() => {
    const fetchImsakiyahData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://equran.id/api/v2/imsakiyah', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provinsi: location.provinsi,
            kabkota: location.kabkota
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data: ImsakiyahResponse = await response.json();
        
        if (data.code !== 200 || !data.data || data.data.length === 0) {
          throw new Error('Invalid data received from API');
        }
        
        const imsakiyahData = data.data[0];
        // Ramadhan 2025 starts on March 1st (month 3)
        const convertedSchedules = convertToDailySchedule(
          imsakiyahData.imsakiyah, 
          imsakiyahData.masehi,
          3 // March
        );
        
        setSchedules(convertedSchedules);
        
        // Find current schedule
        const today = findCurrentSchedule(convertedSchedules, new Date());
        if (today) {
          setCurrentSchedule(today);
        } else if (convertedSchedules.length > 0) {
          // If current day not found, use the first day
          setCurrentSchedule(convertedSchedules[0]);
        }
        
      } catch (err) {
        console.error('Error fetching imsakiyah data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImsakiyahData();
  }, [location]);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Find the schedule for the current date
      if (schedules.length > 0) {
        const todaySchedule = findCurrentSchedule(schedules, now);
        if (todaySchedule) {
          setCurrentSchedule(todaySchedule);
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [schedules]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CloudMoon className="text-green-600 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Jadwal Imsakiyah Ramadhan 1446H / 2025M</h1>
          </div>
          
          <div className="flex items-center justify-center mb-2">
            <MapPin className="text-green-600 mr-2" size={20} />
            <p className="text-lg font-medium text-gray-700">{location.kabkota}, {location.provinsi}</p>
          </div>
          
          <div className="flex items-center justify-center mb-2">
            <Calendar className="text-green-600 mr-2" size={20} />
            <p className="text-md font-medium text-gray-700">1 Maret - 30 Maret 2025</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Clock className="text-gray-600" size={20} />
            <p className="text-gray-600">Waktu Sekarang:</p>
          </div>
          
          <div className="flex justify-center">
            <DigitalClock />
          </div>
        </header>
        
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {currentSchedule && (
                <DailyScheduleCard 
                  schedule={currentSchedule} 
                  currentTime={currentTime} 
                />
              )}
              
              <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Jadwal Imsakiyah Ramadhan 1446H</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-green-600 text-white">
                        <th className="py-2 px-3 text-left">Hari</th>
                        <th className="py-2 px-3 text-left">Tanggal</th>
                        <th className="py-2 px-3 text-left">Imsak</th>
                        <th className="py-2 px-3 text-left">Subuh</th>
                        <th className="py-2 px-3 text-left">Maghrib</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules
                        .filter(schedule => {
                          // Only include March dates (Ramadhan starts on March 1st)
                          const date = new Date(schedule.date);
                          return date.getMonth() === 2; // March is month 2 (0-indexed)
                        })
                        .map((schedule, index) => {
                          const date = new Date(schedule.date);
                          const formattedDate = date.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short'
                          });
                          
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3">{index + 1}</td>
                              <td className="py-2 px-3">{formattedDate}</td>
                              <td className="py-2 px-3 font-medium">{schedule.prayerTimes.find(p => p.name === 'Imsak')?.time}</td>
                              <td className="py-2 px-3">{schedule.prayerTimes.find(p => p.name === 'Subuh')?.time}</td>
                              <td className="py-2 px-3">{schedule.prayerTimes.find(p => p.name === 'Maghrib')?.time}</td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 Jadwal Imsakiyah Ramadhan</p>
          <p className="mt-1">Data diambil dari API equran.id</p>
          <p className="mt-1">Waktu shalat bersifat perkiraan. Silakan verifikasi dengan jadwal resmi setempat.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;