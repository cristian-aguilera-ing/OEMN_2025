// components/MagicButton.jsx

import React, { useRef, useEffect } from 'react';

import { Link } from 'react-router-dom';



export const MagicButton = ({ to, children }) => {

const buttonRef = useRef(null);



useEffect(() => {

const button = buttonRef.current;

if (!button) return;



// Esta función se activa cada vez que mueves el mouse SOBRE el botón

const onPointerMove = (e) => {

const rect = button.getBoundingClientRect();

// Calcula la posición del puntero (X, Y) como un porcentaje (0-100)

// relativo al botón en sí.

const x = ((e.clientX - rect.left) / rect.width) * 100;

const y = ((e.clientY - rect.top) / rect.height) * 100;



// Setea las variables CSS locales (--x, --y) en este botón específico

button.style.setProperty('--x', `${x.toFixed(2)}%`);

button.style.setProperty('--y', `${y.toFixed(2)}%`);

};



// Listener en el botón

button.addEventListener('pointermove', onPointerMove);



// Limpieza al desmontar el componente

return () => {

button.removeEventListener('pointermove', onPointerMove);

};

}, []); // Se ejecuta solo una vez



return (

// Usamos el 'ref' para que el JS sepa a qué elemento apuntar

<Link

ref={buttonRef}

to={to}

className="magic-button w-full block mt-4 py-3 rounded-lg font-semibold"

>

{/* El <span> es requerido por el CSS del efecto */}

<span>{children}</span>

</Link>

);

};