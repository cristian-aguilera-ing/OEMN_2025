import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // <-- ¡Importante para el botón!

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

const slides = [
  {
    img: 'https://i.pinimg.com/736x/85/36/86/853686e7ee71156730ee64e987bd8920.jpg',
    title: 'Diseña tu Estilo, Crea tu Identidad', // <-- Texto de tu Misión 
    subtitle: 'Tu lienzo. Tus reglas.',
  },
  {
    img: 'https://i.pinimg.com/1200x/d2/ca/94/d2ca94de8c1e28498f33be4946f29207.jpg',
    title: 'Hecho por Ti, Para Ti',
    subtitle: 'Calidad artesanal con tu toque único.',
  },
  {
    img: 'https://i.pinimg.com/736x/5f/5c/80/5f5c803add14bbd78085992ed1eb61a0.jpg',
    title: 'Producción Local, Estilo Global',
    subtitle: 'Lleva tu identidad en cada detalle.', // <-- Texto de tu Propósito 
  },
];

export const Hero = () => {
  return (
    <div className="relative h-screen w-full -mt-16">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.img}
                alt={slide.title}
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-white"
                >
                  <h3 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-light mb-8">
                    {slide.subtitle}
                  </p>
                  
                  {/* --- BOTÓN CTA AÑADIDO --- */}
                  <Link
                    to="/designer"
                    className="bg-sky-500 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-sky-600 transition-colors duration-300"
                  >
                    ¡Diseñar Ahora!
                  </Link>

                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};