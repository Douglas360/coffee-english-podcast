import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState(360); // 6 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-red-600 text-white py-3 px-4 flex items-center justify-center gap-2 animate-pulse">
      <AlertTriangle className="w-5 h-5" />
      <span className="font-semibold">
        URGENT: Special Offer Ending Soon! Only{' '}
        <span className="inline-flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>{' '}
        minutes left to secure your English learning journey for just $3.99!
      </span>
    </div>
  );
};