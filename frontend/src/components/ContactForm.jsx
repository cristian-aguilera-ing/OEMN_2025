import React from 'react'; // <-- ¡AÑADE ESTA LÍNEA!
import { useState } from 'react';
import { motion } from 'framer-motion';

// NOTA: Este formulario no está conectado a nada.
// Tu backend `oemn_2025` no tiene un endpoint de "contacto".
// Tendrías que añadir un endpoint '/api/contact' en tu `backend/server.js`
// similar al que hicimos en el proyecto anterior para que esto funcione.

export const ContactForm = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    alert("Función de contacto no implementada en este backend. Mira la consola.");
    console.log("Datos del formulario:", formData);
    setStatus('idle');
    
    // --- CÓDIGO PARA CUANDO IMPLEMENTES EL ENDPOINT ---
    // try {
    //   const response = await fetch('http://localhost:3000/api/contact', { // Asume puerto 3000
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!response.ok) throw new Error('Error');
    //   setStatus('success');
    //   setFormData({ nombre: '', email: '', mensaje: '' });
    // } catch (error) {
    //   setStatus('error');
    // }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <input
          type="text" name="nombre" placeholder="Nombre"
          value={formData.nombre} onChange={handleChange} required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <input
          type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange} required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <textarea
          name="mensaje" placeholder="Mensaje"
          value={formData.mensaje} onChange={handleChange} required
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800"
      >
        {status === 'loading' ? 'Enviando...' : 'ENVIAR'}
      </button>
      {status === 'success' && <p className="text-green-600">¡Mensaje enviado!</p>}
      {status === 'error' && <p className="text-red-600">Hubo un error.</p>}
    </motion.form>
  );
};