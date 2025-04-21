"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSlides } from "@/contexts/SliderContext";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { useOdoo } from "@/contexts/OdooContext";

const SLIDE_DURATION = 5000; // 5 seconds per slide

export const HeroSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Testing Mock Data
  const [mocData, setMocData] = useState([]);
  const [loadingMocData, setLoadingMocData] = useState(true);

  // console.log("Mock Data:", mocData);

  const fetchSliderData = useCallback(async () => {
    setLoadingMocData(true);
    try {
      const response = await fetch("https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaihCarousel");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMocData(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingMocData(false);
    }
  }, []);

  useEffect(() => {
    fetchSliderData();
  }, [fetchSliderData]);

  useEffect(() => {
    if (mocData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mocData.length);
      setProgress(0);
    }, SLIDE_DURATION);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, SLIDE_DURATION / 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [mocData.length]);

  if (loadingMocData) {
    return (
      <div className="relative px-4 md:px-36">
        <div className="relative aspect-[25/9] w-full">
          <Skeleton height="100%" className="rounded-none md:rounded-[20px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-6 px-4 ">
      <div className="relative aspect-[25/9] w-full overflow-hidden rounded-[10px] md:rounded-[20px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={
                mocData[currentSlide]?.avatar
                  ? `${mocData[currentSlide]?.avatar}`
                  : "/fallback-image.jpg"
              }
              alt={mocData[currentSlide]?.name}
              className="w-full h-full object-cover"
              fill
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <div className="flex items-center gap-4">
            {mocData?.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
