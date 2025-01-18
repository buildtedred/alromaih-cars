"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSlides } from '@/contexts/SliderContext'; // Make sure this hook is correctly set up
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton'; // Import skeleton

const SLIDE_DURATION = 5000; // 5 seconds per slide

export const HeroSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const { slides, loading, error } = useSlides(); // Use the context hook

  // Log the slides data only once when it's available
  useEffect(() => {
    if (slides.length > 0) {
      // console.log("Slides data:", slides); // This will now log only once when the slides are fetched
    }
  }, [slides]);  // Run only when slides data changes

  useEffect(() => {
    // Prevent setting intervals if slides are empty
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);  // Reset progress on slide change
    }, SLIDE_DURATION);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, SLIDE_DURATION / 100);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [slides.length]);  // Only rerun effect if `slides` length changes

  if (loading) {
    return (
      <div className="relative mb-24">
        <div className="relative h-[70vh] overflow-hidden">
          <Skeleton height="100%" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const baseURL = 'https://xn--mgbml9eg4a.com'; // Update with the actual base URL for your images

  return (
    <div className="relative mb-24">
      {/* Banner Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
              <Image
                src={`${baseURL}${slides[currentSlide].image_url}`}  // Concatenate base URL with dynamic image URL
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
                width={1920}  // Set a width for Image component to avoid layout shifts
                height={1080}  // Set a height for Image component
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 text-center text-white">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  {/* {slides[currentSlide].title || <Skeleton width={200} />} */}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-gray-200"
                >
                  {slides[currentSlide].subtitle || <Skeleton width={300} />}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <div className="flex items-center gap-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);  // Reset progress when clicking a slide
                }}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'}`}
              />
            ))}
          </div>

          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
