"use client";

import Image from "next/image";
import Countdown from "./components/Countdown";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Loading from "./components/Loading";
import PillNavbar from "./components/Navbar";

export default function Home() {

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for countdown synchronization and initial assets
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Loading isReady={isReady} />
      <PillNavbar />

      <main className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Vintage Background Layers */}
        <div className="absolute inset-0 -z-30">
          <Image
            src="/bg.jpg"
            alt="Vintage Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 vintage-overlay -z-10" />

        {/* Decorative Backing Image (Horse) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-30 mix-blend-multiply">
            <Image
              src="/horse.jpg"
              alt="Horse Watermark"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Decorative Ornaments (Corners) */}
        <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 border-t-4 md:border-t-8 border-l-4 md:border-l-8 border-[#bc4749]/20 m-4 md:m-8 -z-5" />
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-[#bc4749]/20 m-4 md:m-8 -z-5" />

        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full h-full justify-center gap-4 py-4"
        >
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isReady ? 1 : 0, scale: isReady ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center justify-center gap-4 mb-1">
              <div className="h-px w-8 md:w-12 bg-[#c6ac8f]" />
              <h2 className="text-sm md:text-xl font-display tracking-[0.4em] text-[#9d8189] uppercase">
                Year of the Horse
              </h2>
              <div className="h-px w-8 md:w-12 bg-[#c6ac8f]" />
            </div>
            <h1 className="text-6xl md:text-9xl font-display text-[#bc4749] leading-none mb-2 glow-text uppercase drop-shadow-md">
              2026
            </h1>
            <p className="text-xl md:text-3xl font-serif text-[#bc4749] mb-2 tracking-wider">
              HAPPY NEW YEAR
            </p>
            <p className="text-base md:text-xl font-serif italic text-[#5e503f] opacity-80 max-w-2xl mx-auto px-4">
              "Mã Đáo Thành Công — Vạn Sự Như Ý"
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <div className="w-full relative z-30 scale-90 md:scale-100 origin-center">
            <p className="text-[10px] md:text-xs font-serif tracking-[0.3em] text-[#bc4749] uppercase font-bold mb-4 opacity-70">
              Đếm ngược đến Giao Thừa
            </p>
            <Countdown />
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ delay: 1.5 }}
            className="mt-4 text-[#5e503f] text-[10px] md:text-xs"
          >
            <p>Mùng 1 Tết Bính Ngọ: Thứ Ba, 17/02/2026</p>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}
