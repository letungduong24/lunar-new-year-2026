"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Correct Lunar New Year date: Feb 17, 2026
    const targetDate = new Date("2026-02-17T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (

    <div className="flex flex-col items-center p-6 min-w-[120px] bg-[#f2e8cf]/50 backdrop-blur-sm rounded-lg border-2 border-[#c6ac8f]/30 shadow-[5px_5px_0px_0px_rgba(188,71,73,0.1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(188,71,73,0.2)] hover:-translate-y-1">
      <span className="text-5xl md:text-7xl font-display font-bold text-[#bc4749] mb-1">
        {value.toString().padStart(2, '0')}
      </span>
      <div className="h-px w-10 bg-[#c6ac8f]/50 my-2" />
      <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#5e503f] font-sans font-semibold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <TimeUnit value={timeLeft.days} label="Ngày" />
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
}

