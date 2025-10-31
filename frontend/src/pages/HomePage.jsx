import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { PersonalizaSection } from '../components/PersonalizaSection';
import { ContactSection } from '../components/ContactSection';
// import { MapImage } from '../components/MapImage'; // (No creamos este, puedes añadirlo si quieres)

export const HomePage = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <PersonalizaSection />
      <ContactSection />
      {/* <MapImage /> */}
    </>
  );
};