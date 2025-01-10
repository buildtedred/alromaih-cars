"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


// const slides = [
//   {
//     id: 1,
//     image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000',
//     title: 'اختر سيارة أحلامك',
//     subtitle: 'أكثر من 500 سيارة جديدة ومستعملة بأفضل الأسعار'
//   },
//   {
//     id: 2,
//     image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800',
//     title: 'تمويل ميسر',
//     subtitle: 'خيارات تمويل متنوعة تناسب احتياجاتك'
//   },
//   {
//     id: 3,
//     image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800',
//     title: 'ضمان شامل',
//     subtitle: 'فحص شامل وضمان على جميع السيارات'
//   }
// ];

const SLIDE_DURATION = 5000; // 5 seconds per slide

export const HeroSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, SLIDE_DURATION);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, SLIDE_DURATION / 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);



  const slides =  [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000',
      title: t('slides.title1'), // Translation key for the title
      subtitle: t('slides.subtitle1') // Translation key for the subtitle
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800',
      title: t('slides.title2'),
      subtitle: t('slides.subtitle2')
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800',
      title: t('slides.title3'),
      subtitle: t('slides.subtitle3')
    }
  ];
  


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
            {/* Background Image */}
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 text-center text-white">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-gray-200"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <div className="flex items-center gap-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          {/* Progress Bar */}
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