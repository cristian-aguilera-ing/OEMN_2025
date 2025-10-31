import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// (Necesitarás instalar swiper: npm install swiper)
// (También framer-motion: npm install framer-motion)

const slides = [
  {
    img: 'https://i.pinimg.com/736x/85/36/86/853686e7ee71156730ee64e987bd8920.jpg',
    title: 'Tu mochila, tu estilo',
    subtitle: 'Diseña con nosotros',
  },
  {
    img: 'https://i.pinimg.com/1200x/d2/ca/94/d2ca94de8c1e28498f33be4946f29207.jpg',
    title: 'Tu mochila, tu estilo',
    subtitle: 'Crea un diseño único que te represente',
  },
  {
    img: 'https://i.pinimg.com/736x/5f/5c/80/5f5c803add14bbd78085992ed1eb61a0.jpg',
    title: 'Tu mochila, tu estilo',
    subtitle: 'Lleva tu identidad en cada detalle',
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
              <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-white"
                >
                  <h3 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-light">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};