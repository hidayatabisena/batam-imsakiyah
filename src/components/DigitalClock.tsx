import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };
    
    // Update immediately
    updateClock();
    
    // Update every second
    const intervalId = setInterval(updateClock, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="text-4xl font-bold text-white bg-gradient-to-r from-green-600 to-green-800 p-4 rounded-lg shadow-lg">
      {time}
    </div>
  );
};

export default DigitalClock;