import React from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { PersonalizaSection } from '../components/PersonalizaSection';
import { BenefitsSection } from '../components/BenefitsSection'; // <-- 1. IMPORTA LA NUEVA SECCIÓN
import { ContactSection } from '../components/ContactSection';
// import { MapImage } from '../components/MapImage'; // (No creamos este, puedes añadirlo si quieres)

export const HomePage = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <PersonalizaSection />
      <BenefitsSection /> {/* <-- 2. AÑÁDELA AQUÍ, ANTES DE CONTACTO */}
      <ContactSection />
      {/* <MapImage /> */}
    </>
  );
};