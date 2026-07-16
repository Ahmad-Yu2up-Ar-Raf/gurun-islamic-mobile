import { useEffect, useState } from 'react';

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function useCurrentTime() {
  const [now, setNow] = useState<Date>(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setNow(new Date());
  }, 60000); // update per menit

  return () => clearInterval(interval);
}, []);
  const hour = pad(now.getHours());   // 0–23
  const minute = pad(now.getMinutes()); // 0–59

  return {
    hour,
    minute,
    formatted: `${hour}:${minute}`,
  };
}